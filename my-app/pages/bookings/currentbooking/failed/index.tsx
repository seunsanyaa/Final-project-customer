import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { ExclamationCircleIcon } from "@heroicons/react/outline"; // You can also use your own SVG icon

export default function PaymentFailed() {
  return (
    <>
      <Navi />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <ExclamationCircleIcon className="w-16 h-16 text-red-600" />
        <h1 className="text-3xl font-bold mt-6">Payment Failed</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Unfortunately, your payment could not be processed.
        </p>
        <p className="text-lg text-muted-foreground">
          Please try again or contact customer support if the issue persists.
        </p>
        <div className="mt-8">
          <Link href="/payment">
            <Button className="w-auto">Try Again</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
