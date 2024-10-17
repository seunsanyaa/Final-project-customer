'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline"; // You can also use your own SVG icon
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getLatestPayment } from "@/convex/payment";
const API_BASE_URL = 'https://third-elk-244.convex.cloud/api';

export default function PaymentSuccess() {
  const router = useRouter();

  // Function to generate receipt number
  const generateReceiptNumber = async (sequentialNumber: number) => {
    const latestPayment = await getLatestPayment();
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(today.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}${month}${year}-${sequentialNumber}`;
  };

  useEffect(() => {
    const addPayment = async () => {
      const bookingId = "your_booking_id"; // Fetch this from the previous page or context
      const amount = 0; // Get this from Stripe
      const paymentDate = new Date().toISOString(); // Use current date in ISO format
      const paymentType = "your_payment_type"; // Get this from Stripe

      // Assuming you have a way to track the sequential number, e.g., from a state or context
      const sequentialNumber = 1; // Replace with actual logic to get the next sequential number

      const receiptNumber = generateReceiptNumber(sequentialNumber);

      await axios.post(`${API_BASE_URL}/mutation`, {
        path: "payment:createPayment",
        args: {
          receiptNumber,
          bookingId,
          amount,
          paymentDate,
          paymentType,
        }
      });

      void router.push('/bookings/currentbooking');
    };

    void addPayment();
  }, []);

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
