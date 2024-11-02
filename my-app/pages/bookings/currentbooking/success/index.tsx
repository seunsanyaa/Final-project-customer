'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter, useSearchParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createPayment = useMutation(api.payment.createPayment);
  const updateBooking = useMutation(api.bookings.updateBooking);
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Get payment intent details from URL
  const paymentIntent = searchParams?.get('payment_intent');
  const redirectStatus = searchParams?.get('redirect_status');
  const bookingId = searchParams?.get('bookingId');

  const getBooking = useQuery(api.bookings.getBooking, 
    bookingId ? { id: bookingId as Id<"bookings"> } : "skip"
  );

  useEffect(() => {
    const processPayment = async () => {
      if (!bookingId || !paymentIntent || redirectStatus !== 'succeeded' || !getBooking || paymentProcessed) {
        return;
      }

      try {
        setIsLoading(true);
        
        // Create payment record
        const { paymentId, receiptNumber } = await createPayment({
          bookingId: bookingId as Id<"bookings">,
          amount: getBooking.totalCost - getBooking.paidAmount,
          paymentDate: new Date().toISOString(),
          paymentType: 'stripe',
          paymentIntentId: paymentIntent,
        });

        // Calculate new status
        const newPaidAmount = (getBooking.paidAmount || 0) + (getBooking.totalCost - getBooking.paidAmount);
        let newStatus = getBooking.status;

        if (getBooking.status === 'pending') {
          newStatus = 'inprogress';
        } else if (newPaidAmount >= getBooking.totalCost) {
          newStatus = 'completed';
        }

        // Update booking
        await updateBooking({
          id: bookingId as Id<"bookings">,
          status: newStatus,
          paidAmount: newPaidAmount
        });

        setPaymentProcessed(true);
      } catch (error) {
        console.error("Error processing payment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    processPayment();
  }, [bookingId, paymentIntent, redirectStatus, getBooking, createPayment, updateBooking, paymentProcessed]);

  // Countdown and redirect
  useEffect(() => {
    if (!isLoading && paymentProcessed) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      const redirectTimer = setTimeout(() => {
        if (bookingId) {
          router.push(`/bookings/currentbooking?bookingId=${bookingId}`);
        } else {
          router.push('/bookings/currentbooking');
        }
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [isLoading, paymentProcessed, bookingId, router]);

  return (
    <>
      <Navi />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-600" />
        <h1 className="text-3xl font-bold mt-6">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Thank you for your payment. Your booking has been confirmed.
        </p>
        <p className="text-md mt-4">
          Redirecting to booking details in {countdown} seconds...
        </p>
      </div>
      <Footer />
    </>
  );
}
