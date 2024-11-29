'use client'
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  // Get the session ID from URL params
  const sessionId = searchParams?.get('session_id') as Id<"paymentSessions">;

  // Mutations
  const createPayment = useMutation(api.payment.createPayment);
  const updateBooking = useMutation(api.bookings.updateBooking);
  const updatePaymentSession = useMutation(api.payment.updatePaymentSessionStatus);
  const awardBookingRewardPoints = useMutation(api.bookings.awardBookingRewardPoints);

  // Get payment session details
  const paymentSession = useQuery(api.payment.getPaymentSession, 
    sessionId ? { sessionId } : "skip"
  );

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !paymentSession) {
        setError("Invalid payment session");
        return;
      }

      try {
        // 1. Create payment record
        const { paymentId } = await createPayment({
          bookingId: paymentSession.bookingId,
          amount: paymentSession.paidAmount,
          paymentDate: new Date().toISOString(),
          paymentType: paymentSession.paymentType,
          paymentIntentId: searchParams?.get('payment_intent') || undefined,
        });

        // 2. Update booking with new paid amount
        await updateBooking({
          id: paymentSession.bookingId,
          paidAmount: paymentSession.paidAmount,
          status: 'confirmed'
        });

        // 3. Update payment session status
        await updatePaymentSession({
          sessionId,
          status: 'completed',
        });

        // 4. Award reward points only after payment session is marked as completed
        if (paymentSession.status === 'completed') {
          await awardBookingRewardPoints({
            bookingId: paymentSession.bookingId,
            customerId: paymentSession.userId
          });
        }

        // 5. Redirect to booking details
        setTimeout(() => {
          router.push(`/bookings`);
        }, 2000);

      } catch (error) {
        console.error('Error processing payment:', error);
        setError("Failed to process payment");
      } finally {
        setIsProcessing(false);
      }
    };

    if (sessionId && paymentSession && isProcessing) {
      processPayment();
    }
  }, [sessionId, paymentSession, createPayment, updateBooking, updatePaymentSession, awardBookingRewardPoints, router, searchParams, isProcessing]);

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
