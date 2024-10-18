'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline"; // You can also use your own SVG icon
import { useEffect, useState } from "react";
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter } from "next/router";
import { Id } from "../../../../convex/_generated/dataModel";

export default function PaymentSuccess() {
  const router = useRouter();
  const createPayment = useMutation(api.payment.createPayment);
  const updateBookingWithTotalPaid = useMutation(api.bookings.updateBookingWithTotalPaid);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const addPayment = async () => {
      if (!router.isReady || paymentProcessed) return;

      const { bookingId, amount, paymentDate, paymentType, paymentIntentId } = router.query;

      if (!bookingId || !amount || !paymentDate || !paymentType || !paymentIntentId) {
        console.error("Missing payment details");
        return;
      }

      try {
        // Create payment (receipt number will be generated server-side)
        const { paymentId, receiptNumber } = await createPayment({
          bookingId: bookingId as Id<"bookings">,
          amount: parseFloat(amount as string),
          paymentDate: paymentDate as string,
          paymentType: paymentType as string,
          paymentIntentId: paymentIntentId as string,
        });

        // Update booking with total paid amount
        await updateBookingWithTotalPaid({
          id: bookingId as Id<"bookings">,
        });

        console.log(`Payment added with ID ${paymentId} and receipt number ${receiptNumber}`);
        setPaymentProcessed(true);
      } catch (error) {
        console.error("Error adding payment or updating booking:", error);
      }
    };

    void addPayment();
  }, [router.isReady, router.query, createPayment, updateBookingWithTotalPaid, paymentProcessed]);

  useEffect(() => {
    const { bookingId } = router.query;
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      if (bookingId) {
        router.push(`/bookings/currentbooking?bookingId=${bookingId}`);
      } else {
        router.push('/bookings/currentbooking');
      }
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

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
        <div className="mt-8">
          <Link href="/bookings/currentbooking">
            <Button className="w-auto">View Booking Details</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
