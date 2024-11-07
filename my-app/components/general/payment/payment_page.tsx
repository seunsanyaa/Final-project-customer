'use client'
import { useEffect, useRef, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
import { useRouter } from 'next/router';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '../../../convex/_generated/dataModel';

export function Payment_Page() {
  const params = useParams();
  const sessionId = params.sessionId as Id<"paymentSessions">;
  const router = useRouter();

  // Fetch payment session details
  const paymentSession = useQuery(api.payment.getPaymentSession, {
    sessionId
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = paymentSession?.totalAmount || 0;
  const paidAmount = paymentSession?.paidAmount || 0;
  const paymentType = paymentSession?.paymentType;

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  useEffect(() => {
    if (paidAmount > 0) {
      setIsLoading(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: Math.round(paidAmount * 100),
          sessionId, // Pass the session ID to your API
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((error) => {
          console.error("Error fetching client secret:", error);
          setError("Failed to initialize payment");
        })
        .finally(() => setIsLoading(false));
    }
  }, [paidAmount, sessionId]);

  const appearance: Appearance = {
    theme: 'stripe',
  };

  const options: StripeElementsOptions = {
    appearance,
    clientSecret: clientSecret || undefined,
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl text-red-600 mb-4">Payment Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm 
            agreedToTerms={agreedToTerms} 
            setAgreedToTerms={setAgreedToTerms} 
            total={paidAmount}
            sessionId={sessionId}
          />
        </Elements>
      ) : (
        <div className="flex items-center justify-center h-screen">
          {isLoading ? "Initializing payment..." : "Loading..."}
        </div>
      )}
    </>
  );
}

function PaymentForm({ 
  agreedToTerms, 
  setAgreedToTerms, 
  total,
  sessionId
}: { 
  agreedToTerms: boolean, 
  setAgreedToTerms: (agreed: boolean) => void, 
  total: number,
  sessionId: Id<"paymentSessions">
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/currentbooking/success?session_id=${sessionId}`,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Something went wrong with your payment.");
        setIsProcessing(false);
      }
    } catch (e) {
      console.error('Payment error:', e);
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navi />
      <Separator />
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form Section */}
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
                  <PaymentElement />
                </CardContent>
              </Card>
              <div className="flex items-center gap-2">
                <LockIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Your payment is secured with 256-bit encryption.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the <a href="/terms" className="text-primary">terms and conditions</a>.
                </label>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
          </div>

          {/* Booking Summary Section */}
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
                    <span>${total ? (total-total*0.2).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>${total ? ((total-total*0.2)*0.2).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Price:</span>
                    <span className="font-bold">${total ? (total).toFixed(2) : '0.00'}</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-center">
                <div className="w-full flex justify-center ${!agreedToTerms ? 'pointer-events-none' : ''}">
                <Button
                  className={`w-auto border-2 ${
                    agreedToTerms ? 'hover:bg-muted' : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={agreedToTerms ? handleSubmit : undefined}
                  disabled={!agreedToTerms || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Booking"}
                </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Footer />
    </>
  );
}

// SVG Icons as React Components

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
