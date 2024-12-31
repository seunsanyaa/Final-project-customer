'use client'
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import { Card } from '@/components/ui/card';
import { Redirection } from "@/components/ui/redirection";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Printer } from 'lucide-react';
import { InstallmentManager } from '../payment/installment-manager';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Add this custom hook near the top of the file
const useCurrency = () => {
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    // Set initial currency from localStorage
    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setCurrency(parsedSettings.currency || 'USD');
    }

    // Handle currency changes
    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrency(customEvent.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  return currency;
};

export default function BookingDetails() {
  const { user } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [bookingDetailsState, setBookingDetailsState] = useState<{
    pickupLocation: string;
    dropoffLocation: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Get current booking using the getCurrentBooking function
  const bookingDetails = useQuery(api.analytics.getCurrentBooking, {
    customerId: user?.id ?? "skip"
  });

  const updateBooking = useMutation(api.bookings.updateBooking);
  const createPaymentSession = useMutation(api.payment.createPaymentSession);

  const printRef = useRef<HTMLDivElement>(null);
  
  // const handlePrint = useReactToPrint({
  //   documentTitle: "Booking Details",
  //   print: async () => {
  //     return printRef.current;
  //   },
  //   onBeforePrint: () => {
  //     if (!printRef.current) {
  //       throw new Error('Print content not found');
  //     }
  //     return Promise.resolve();
  //   }
  // });

  // Add currency state
  const currency = useCurrency();
  
  // Add formatPrice helper function
  const formatPrice = (amount: number) => {
    if (!amount) return '';
    if (currency === 'TRY') {
      return `₺${(amount * 34).toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current; // Reference to the booking details section
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 190; // Adjust width as needed
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('booking-details.pdf');
  };

  if (!user) {
    return <Redirection />;
  }

  if (!bookingDetails) {
    return (
      <div>
        <Navi/>
        <Separator />
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">No Active Booking</h1>
            <p className="mt-2">You don&apos;t have any active bookings at the moment.</p>
          </div>
        </div>
        <Separator />
        <Footer/>
      </div>
    );
  }

  const handleModifyClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!bookingDetails) return;

    await updateBooking({
      id: bookingDetails._id,
      pickupLocation,
      dropoffLocation,
      startDate: pickupDate,
      endDate: dropoffDate,
    });

    setBookingDetailsState({
      pickupLocation,
      dropoffLocation,
      startDate: pickupDate,
      endDate: dropoffDate,
    });

    setIsModalOpen(false);
  };

  const handlePaymentClick = async (isFullPayment: boolean) => {
    if (!bookingDetails || !user) return;
    
    try {
      const amountToPay = isFullPayment 
        ? bookingDetails.totalCost - bookingDetails.paidAmount
        : bookingDetails.installmentPlan?.amountPerInstallment || 0;

      // Create a new payment session
      const { sessionId } = await createPaymentSession({
        bookingId: bookingDetails._id,
        totalAmount: bookingDetails.totalCost,
        paidAmount: amountToPay,
        userId: user.id,
        status: 'pending',
        isSubscription: false
      });

      router.push(`/Newbooking/payment/${sessionId}?email=${encodeURIComponent(user.emailAddresses[0].emailAddress)}`);
    } catch (error) {
      console.error('Error creating payment session:', error);
    }
  };



  const calculateRewardPoints = () => {
    if (!bookingDetails) return 0;
    // Calculate 10% of total cost as reward points
    return Math.floor(bookingDetails.totalCost * 0.1);
  };

  return (
    <div>
      <Navi/>
      <Separator />
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            <div className="bg-background rounded-lg shadow-2xl overflow-hidden">
              <div className="px-6 py-5 bg-muted">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-2xl font-semibold">Booking Details</h1>
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-black shadow-2xl" 
                      onClick={handleDownloadPDF}
                    >
                      <Printer className="h-5 w-5" />
                    </Button>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{bookingDetails?.startDate}</span>
                      <span>-</span>
                      <span>{bookingDetails?.endDate}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {bookingDetails && bookingDetails.totalCost > bookingDetails.paidAmount && (
                      <InstallmentManager
                        onPayFull={() => handlePaymentClick(true)}
                        onPayInstallment={() => handlePaymentClick(false)}
                        remainingAmount={bookingDetails.totalCost - bookingDetails.paidAmount}
                        nextInstallmentAmount={
                          bookingDetails.installmentPlan?.amountPerInstallment
                        }
                      />
                    )}
                    <Button 
                      size="sm" 
                      className="w-full sm:w-auto px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-black shadow-2xl" 
                      onClick={handleModifyClick}
                    >
                      Modify Booking
                    </Button>
                  </div>
                </div>
              </div>
              <div ref={printRef}>
                <div className="px-6 py-5 grid gap-6 bg-card">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Booking Status
                      </div>
                      <div className="text-base font-semibold">{bookingDetails?.status}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {bookingDetails?.status === 'Current' ? 'Days Remaining' : 'Days Until Start'}
                      </div>
                      <div className="text-base font-semibold">{bookingDetails?.daysRemaining} days</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Original Booking Cost
                      </div>
                      <div className="text-base font-semibold">
                        {formatPrice(bookingDetails?.totalCost ?? 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Paid Amount
                      </div>
                      <div className="text-base font-semibold text-green-500">
                        {formatPrice(bookingDetails?.paidAmount ?? 0)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Remaining Cost
                      </div>
                      <div className="text-base font-semibold">
                        {formatPrice((bookingDetails?.totalCost ?? 0) - (bookingDetails?.paidAmount ?? 0))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                         Rewards Points
                      </div>
                      <div className="text-base font-semibold">
                        {calculateRewardPoints()} points
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Car Details
                      </div>
                      <div className="text-base font-semibold">
                        {bookingDetails?.carDetails ? 
                          `${bookingDetails.carDetails.maker} ${bookingDetails.carDetails.model} ${bookingDetails.carDetails.year} ${bookingDetails.carDetails.trim}` 
                          : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Pickup & Dropoff Location
                      </div>
                      <div className="text-base font-semibold">
                        {bookingDetails?.pickupLocation} <br/>- {bookingDetails?.dropoffLocation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      <Separator />
      <Footer/>
      {/* Dialog for modifying booking */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]" style={{ opacity: 1, backgroundColor: '#ffffff', zIndex: 50 }}>
          <DialogHeader>
            <DialogTitle>Modify Booking</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Pickup Date:</label>
                <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Dropoff Date:</label>
                <Input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Pickup Location:</label>
                <Input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Dropoff Location:</label>
                <Input type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Display updated booking details */}
      {bookingDetailsState && (
        <div>
          <h2>Updated Booking Details</h2>
          <p>Pickup Location: {bookingDetailsState.pickupLocation}</p>
          <p>Dropoff Location: {bookingDetailsState.dropoffLocation}</p>
          <p>Start Date: {bookingDetailsState.startDate}</p>
          <p>End Date: {bookingDetailsState.endDate}</p>
        </div>
      )}

  
    </div>
  );
}
