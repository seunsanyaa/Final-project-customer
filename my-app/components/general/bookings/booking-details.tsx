'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Navi } from '../head/navi';
import { Footer } from '../head/footer';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function BookingDetails() {
  const router = useRouter();
  const { bookingId } = router.query;

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
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const bookingDetails = useQuery(
    api.bookings.getBookingDetails,
    typeof bookingId === 'string' ? { bookingId: bookingId as Id<"bookings"> } : "skip"
  );

  const updateBooking = useMutation(api.bookings.updateBooking);

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
      // Handle error (show toast/alert)
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

  if (!bookingId || typeof bookingId !== 'string') {
    return <div>Invalid booking ID</div>;
  }

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navi/>
      <Separator />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-muted">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Booking Details</h1>
                <div className="flex gap-2">
                  {bookingDetails.totalCost > bookingDetails.paidAmount && (
                    <Button variant="outline" size="sm" className='hover:bg-muted' onClick={() => handlePaymentClick(true)}>
                      Pay Next Installment
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className='hover:bg-muted' onClick={handleModifyClick}>
                    Modify Booking
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-6 py-5 grid gap-6">
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
                  <div className="text-base font-semibold">${bookingDetails.totalCost}.00</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Paid Amount
                  </div>
                  <div className="text-base font-semibold text-green-500">
                    ${bookingDetails.paidAmount}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Remaining Cost
                  </div>
                  <div className="text-base font-semibold">${bookingDetails.totalCost - bookingDetails.paidAmount}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Earned
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.rewardsPointsEarned} points</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Car Details
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.carDetails } {bookingDetails.trim} </div>
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
                    Rewards Points Used
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.rewardsPointsUsed} points</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Rewards Points Credited
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.rewardsPointsCredited}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Booking Status
                  </div>
                  <div className="text-base font-semibold text-yellow-500">{bookingDetails.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Cancellation Policy
                  </div>
                  <div className="text-base font-semibold">{bookingDetails.cancellationPolicy}</div>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Modify Rewards Points
                </div>
                <div className="text-base">
                  You can modify the number of rewards points used for this
                  booking. Changing the points used may affect the final price
                  and the number of points earned.
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={bookingDetails.rewardsPointsEarned}
                    defaultValue={bookingDetails.rewardsPointsUsed}
                  />
                  <Button variant="outline" className='hover:bg-muted'>Update</Button>
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
