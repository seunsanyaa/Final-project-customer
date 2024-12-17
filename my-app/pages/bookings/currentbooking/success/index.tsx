'use client'
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  // Get the session ID from URL params
  const sessionId = searchParams?.get('session_id') as Id<"paymentSessions">;
  const paymentSession = useQuery(api.payment.getPaymentSession, 
    sessionId ? { sessionId } : "skip"
  );
  console.log('Payment Session Data:', paymentSession);
  console.log('Booking ID from Payment Session:', paymentSession?.bookingId);

  // Mutations
  const createPayment = useMutation(api.payment.createPayment);
  const updateBooking = useMutation(api.bookings.updateBooking);
  const updatePaymentSession = useMutation(api.payment.updatePaymentSessionStatus);
  const awardBookingRewardPoints = useMutation(api.bookings.awardBookingRewardPoints);
  const createNotification = useMutation(api.notifications.createNotification);
  const getBooking = useQuery(api.bookings.getBooking, 
    paymentSession?.bookingId ? { id: paymentSession.bookingId as Id<"bookings"> } : "skip"
  );
  console.log('Booking Data:', getBooking);
 
  // Get payment session details
  

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessed.current) return;
      
      if (!sessionId || !paymentSession) {
        setError("Invalid payment session");
        return;
      }

      if (!paymentSession.bookingId) {
        setError("No booking found for this payment session");
        return;
      }

      // Add check for getBooking loading state
      if (getBooking === undefined) {
        // Query is still loading
        return;
      }

      if (paymentSession.status === 'completed') {
        console.log('Payment session already completed');
        setIsProcessing(false);
        return;
      }

      try {
        hasProcessed.current = true;
        
        // Check if booking exists after loading is complete
        if (getBooking === null) {
          console.error('Booking data is null:', {
            paymentSessionId: sessionId,
            bookingId: paymentSession.bookingId,
            paymentSession: paymentSession
          });
          throw new Error(`Booking not found for ID: ${paymentSession.bookingId}`);
        }
        
        console.log('Payment Session:', paymentSession);
        console.log('Booking:', getBooking);

        // 1. Create payment record
        const paymentIntent = searchParams?.get('payment_intent');
        let paymentType = 'card'; // default to card

        // If we have a payment intent, we can get the actual payment method type from Stripe
        if (paymentIntent) {
          try {
            const response = await fetch(`/api/get-payment-method?payment_intent=${paymentIntent}`);
            const data = await response.json();
            paymentType = data.paymentMethodType; // This will be 'card', 'paypal', etc.
          } catch (error) {
            console.error('Error fetching payment method type:', error);
          }
        }

        // Add logging to debug payment creation
        console.log('About to create payment with data:', {
          bookingId: paymentSession.bookingId,
          amount: paymentSession.paidAmount,
          paymentType,
          paymentIntent,
          isBookingIdValid: typeof paymentSession.bookingId === 'string' && paymentSession.bookingId.length > 0
        });

        const { paymentId, receiptNumber } = await createPayment({
          bookingId: paymentSession.bookingId as Id<"bookings">,
          amount: paymentSession.paidAmount,
          paymentDate: new Date().toISOString(),
          paymentType,
          paymentIntentId: paymentIntent || undefined,
        });

        console.log('Payment created:', {
          paymentId,
          receiptNumber,
          bookingId: paymentSession.bookingId
        });

        // 2. Update booking with new paid amount
        if (!paymentSession.bookingId) {
          throw new Error('No booking ID found in payment session');
        }

        // Define proper type for updateData
        type BookingUpdateData = {
          paidAmount: number;
          status: string;
          installmentPlan?: {
            frequency: string;
            totalInstallments: number;
            amountPerInstallment: number;
            remainingInstallments: number;
            nextInstallmentDate: string;
          } | undefined;
        };

        let updateData: BookingUpdateData = {
          paidAmount: (getBooking.paidAmount || 0) + paymentSession.paidAmount,  // Add new amount to existing
          status: 'confirmed'
        };

        // Add logging to see the amounts
        console.log('Payment amounts:', {
          existingPaid: getBooking.paidAmount,
          newPayment: paymentSession.paidAmount,
          total: (getBooking.paidAmount || 0) + paymentSession.paidAmount
        });

        // Handle installment plan updates
        if (getBooking.installmentPlan) {
          const remainingInstallments = getBooking.installmentPlan.remainingInstallments - 1;
          
          if (remainingInstallments <= 0) {
            updateData.installmentPlan = undefined;
          } else {
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + (getBooking.installmentPlan.frequency === 'weekly' ? 7 : 1));
            
            updateData.installmentPlan = {
              ...getBooking.installmentPlan,
              remainingInstallments,
              nextInstallmentDate: nextDate.toISOString()
            };
          }
        }

        // Add logging to debug the update
        console.log('Updating booking with data:', {
          id: paymentSession.bookingId,
          ...updateData
        });

        // Update booking with explicit typing
        await updateBooking({
          id: paymentSession.bookingId as Id<"bookings">,
          ...updateData
        });

        console.log('Booking updated successfully');

        // 3. Update payment session status
        await updatePaymentSession({
          sessionId,
          status: 'completed',
        });

        // 4. Create notification for successful payment
        await createNotification({
          userId: paymentSession.userId,
          bookingId: paymentSession.bookingId as Id<"bookings">,
          message: `Payment successful for booking #${paymentSession.bookingId}`,
          type: "payment_success"
        });

        // 5. Award reward points only after payment session is marked as completed
        if (paymentSession.status === 'completed') {
          await awardBookingRewardPoints({
            bookingId: paymentSession.bookingId as Id<"bookings">,
            customerId: paymentSession.userId
          });
        }

        // 6. Redirect to booking details
        setTimeout(() => {
          router.push(`/bookings`);
        }, 2000);

      } catch (error) {
        console.error('Error processing payment:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
        setError("Failed to process payment");
        }
        hasProcessed.current = false;
      } finally {
        setIsProcessing(false);
      }
    };

    if (sessionId && paymentSession && isProcessing) {
      processPayment();
    }
  }, [sessionId, paymentSession, createPayment, updateBooking, updatePaymentSession, awardBookingRewardPoints, router, searchParams, isProcessing, createNotification, getBooking]);

  // Update the loading state display
  if (getBooking === undefined) {
    return (
      <>
        <Navi />
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h1 className="text-3xl font-bold mt-6">Loading Payment Details...</h1>
          <p className="text-lg text-muted-foreground mt-4">
            Please wait while we load your booking information...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navi />
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="text-red-600 text-xl">
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navi />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-600" />
        <h1 className="text-3xl font-bold mt-6">
          {isProcessing ? "Processing Payment" : "Payment Successful"}
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          {isProcessing 
            ? "Please wait while we process your payment..."
            : "Your payment has been processed successfully. Redirecting..."
          }
        </p>
      </div>
      <Footer />
    </>
  );
}
