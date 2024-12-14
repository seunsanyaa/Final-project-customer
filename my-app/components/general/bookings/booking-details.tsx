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
// import { useReactToPrint, PrintContextConsumer } from 'react-to-print';
// import { PrinterIcon } from '@heroicons/react/24/outline';

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

  // Get current booking using the new function
  const bookingDetails = useQuery(api.analytics.getCurrentBooking, {
    customerId: user?.id ?? "skip"
  });

  const updateBooking = useMutation(api.bookings.updateBooking);

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

  const handlePaymentClick = async (fullAmount: boolean) => {
    if (!bookingDetails) return;
    
    const amountToPay = fullAmount 
      ? bookingDetails.totalCost - bookingDetails.paidAmount
      : Math.ceil((bookingDetails.totalCost - bookingDetails.paidAmount) / 2);
    
    setPaymentAmount(amountToPay);
    
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amountToPay * 100) }), // Convert to cents
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements || !bookingDetails) return;

      setIsProcessing(true);

      try {
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/bookings/currentbooking/success?bookingId=${bookingDetails._id}`,
          },
        });

        if (result.error) {
          throw result.error;
        }
      } catch (error) {
        console.error('Payment confirmation error:', error);
        // Handle error (show toast/alert)
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-background">
        <PaymentElement className="bg-background" />
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing} 
          className="w-full"
        >
          {isProcessing ? "Processing..." : `Pay $${paymentAmount.toFixed(2)}`}
        </Button>
      </form>
    );
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
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            <div className="bg-background rounded-lg shadow-2xl overflow-hidden">
              <div className="px-6 py-5 bg-muted">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold">Booking Details</h1>
                  <div className="flex gap-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint()}
                      className="flex items-center gap-2"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Print
                    </Button> */}
                    {bookingDetails.totalCost > bookingDetails.paidAmount && (
                      <Button variant="outline" size="sm" className='hover:bg-muted' onClick={() => handlePaymentClick(true)}>
                        Pay Next Installment
                      </Button>
                    )}
                    <Button  size="sm" className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-black shadow-2xl" onClick={handleModifyClick}>
                      Modify Booking
                    </Button>
                  </div>
                </div>
              </div>
              <div ref={printRef}>
                <div className="px-6 py-5 grid gap-6 bg-card">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Booking ID
                      </div>
                      <div className="text-base font-semibold">{bookingDetails._id}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Rental Dates
                      </div>
                      <div className="text-base font-semibold">
                        {bookingDetails.startDate} - {bookingDetails.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Original Booking Cost
                      </div>
                      <div className="text-base font-semibold">
                        {formatPrice(bookingDetails.totalCost)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Paid Amount
                      </div>
                      <div className="text-base font-semibold text-green-500">
                        {formatPrice(bookingDetails.paidAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Remaining Cost
                      </div>
                      <div className="text-base font-semibold">
                        {formatPrice(bookingDetails.totalCost - bookingDetails.paidAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Potential Rewards Points
                      </div>
                      <div className="text-base font-semibold">
                        {calculateRewardPoints()} points
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Car Details
                      </div>
                      <div className="text-base font-semibold">{bookingDetails.carDetails?.maker} {bookingDetails.carDetails?.model} {bookingDetails.carDetails?.year} {bookingDetails.carDetails?.trim} </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Pickup & Dropoff Location
                      </div>
                      <div className="text-base font-semibold">{bookingDetails.pickupLocation} - {bookingDetails.dropoffLocation}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Booking Status
                      </div>
                      <div className="text-base font-semibold text-yellow-500">{bookingDetails.status}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Days Remaining
                      </div>
                      <div className="text-base font-semibold">{bookingDetails.daysRemaining} days remaining</div>
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
        <DialogContent className="sm:max-w-[425px]" style={{ opacity: 1, backgroundColor: '#ffffff', zIndex: 50 }}>
          <div className="flex flex-col gap-6">
            <div>
              <label>Pickup Date:</label>
              <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
            </div>
            <div>
              <label>Dropoff Date:</label>
              <Input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} />
            </div>
            <div>
              <label>Pickup Location:</label>
              <Input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
            </div>
            <div>
              <label>Dropoff Location:</label>
              <Input type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleConfirm}>Confirm</Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
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
      {/* Dialog for payment */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <PaymentForm  />
            </Elements>
          ) : (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
