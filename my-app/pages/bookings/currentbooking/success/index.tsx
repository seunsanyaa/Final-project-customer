import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline"; // You can also use your own SVG icon

export default function PaymentSuccess() {
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
