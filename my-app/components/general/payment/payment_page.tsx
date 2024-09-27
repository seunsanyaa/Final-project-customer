import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
export function Payment_Page() {

  return (
    <>
      <Navi/>
      <Separator />
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Complete your booking</h1>
              <p className="text-muted-foreground">
                Enter your payment details to finalize your car rental.
              </p>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-muted"
                    >
                      <CreditCardIcon className="w-8 h-8" />
                      <span>Credit Card</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-muted"
                    >
                      <WalletIcon className="w-8 h-8" />
                      <span>PayPal</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Credit Card</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Expiry Date</Label>
                      <Input id="card-expiry" placeholder="MM/YY" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input id="card-name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input id="card-cvc" placeholder="123" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center gap-2">
                <LockIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Your payment is secured with 256-bit encryption.
                </span>
              </div>
              <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="checkbox" />
              <label htmlFor="terms" className="text-sm">
                I agree to the <a href="/terms" className="text-primary">terms and conditions</a>.
              </label>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Booking Summary</h2>
              <p className="text-muted-foreground">
                Review your booking details before completing your payment.
              </p>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Car Details</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <CarIcon className="w-12 h-12 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Toyota Camry 2023</h3>
                    <p className="text-muted-foreground">4 Days Rental</p>
                    <p className="text-muted-foreground">Pick-Up: 10:00 AM</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>$200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Price:</span>
                    <span className="font-bold">$250.00</span>
                  </div>
                </CardContent>
              </Card>
              <Link href='/bookings/currentbooking'><Button className="w-full">Complete Booking</Button></Link>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Footer/>
    </>
  );
}

// SVG Icons as React Components
const CreditCardIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-credit-card"
    {...props}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const WalletIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-credit-card"
    {...props}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const LockIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CarIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    {...props}
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);
