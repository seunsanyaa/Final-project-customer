'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline"; // You can also use your own SVG icon
import { useEffect } from "react";
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter } from "next/router";
import { Id } from "../../../../convex/_generated/dataModel";

export default function PaymentSuccess() {
  const router = useRouter();
  const createPayment = useMutation(api.payment.createPayment);
  const updateBookingWithTotalPaid = useMutation(api.bookings.updateBookingWithTotalPaid);

  useEffect(() => {
    const addPayment = async () => {
      if (!router.isReady) return;

      const { bookingId, amount, paymentDate, paymentType, paymentIntentId } = router.query;

      if (!bookingId || !amount || !paymentDate || !paymentType || !paymentIntentId) {
        console.error("Missing payment details");
        return;
      }

      try {
        // Create payment (receipt number will be generated server-side)
        const { paymentId, receiptNumber } = await createPayment({
          bookingId: bookingId as string,
          amount: parseFloat(amount as string),
          paymentDate: paymentDate as string,
          paymentType: paymentType as string,
        });

        // Update booking with total paid amount
        await updateBookingWithTotalPaid({
          id: bookingId as Id<"bookings">,
        });

        console.log(`Payment added with ID ${paymentId} and receipt number ${receiptNumber}`);
      } catch (error) {
        console.error("Error adding payment or updating booking:", error);
      }
    };

    void addPayment();
  }, [router.isReady, router.query, createPayment, updateBookingWithTotalPaid]);

  return (
    <>
      <Navi />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-600" />
        <h1 className="text-3xl font-bold mt-6">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Thank you for your payment. Your booking has been confirmed.
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
