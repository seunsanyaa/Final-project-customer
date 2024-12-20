'use client'
import { useEffect, useRef, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '../../../convex/_generated/dataModel';
import Link from 'next/link';
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const useCurrency = () => {
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    // Only listen for currency changes, not language
    const settings = localStorage.getItem('userSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      if (parsedSettings.currency) {
        setCurrency(parsedSettings.currency);
      }
    }

    const handleCurrencyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrency(customEvent.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  return currency;
};

// Add this type definition
type SavedPaymentMethod = {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export function Payment_Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as Id<"paymentSessions">;
  const email = searchParams.get('email');

  // Fetch payment session details
  const paymentSession = useQuery(api.payment.getPaymentSession, {
    sessionId
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

  const paidAmount = paymentSession?.paidAmount || 0;

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  // Add currency state
  const currency = useCurrency();
  
  // Add formatPrice helper function
  const formatPrice = (amount: number) => {
    if (!amount) return '';
    if (currency === 'TRY') {
      return `₺${(amount * 34).toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };
  const userId = useAuth().userId;
  useEffect(() => {
    
    if (paidAmount > 0 && email) {
      setIsLoading(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: paidAmount,
          sessionId,
          email,
          userId,
          currency, // Add currency to the request
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
  }, [paidAmount, sessionId, email, currency, userId]); // Add currency to dependencies

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`/api/payment-methods?userId=${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setSavedPaymentMethods(data.paymentMethods);
          // If there's a default payment method, select it
          if (data.defaultPaymentMethod) {
            setSelectedPaymentMethod(data.defaultPaymentMethod);
          }
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    if (email) {
      fetchPaymentMethods();
    }
  }, [email, userId]);

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
            currency={currency}
            savedPaymentMethods={savedPaymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            isLoadingPaymentMethods={isLoadingPaymentMethods}
            clientSecret={clientSecret}
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
  sessionId,
  currency,
  savedPaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isLoadingPaymentMethods,
  clientSecret,
}: { 
  agreedToTerms: boolean, 
  setAgreedToTerms: (agreed: boolean) => void, 
  total: number,
  sessionId: Id<"paymentSessions">,
  currency: string,
  savedPaymentMethods: SavedPaymentMethod[];
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (id: string | null) => void;
  isLoadingPaymentMethods: boolean;
  clientSecret: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paymentSession = useQuery(api.payment.getPaymentSession, { sessionId });
  const booking = useQuery(api.bookings.getBooking, { 
    id: paymentSession?.bookingId as Id<"bookings">
  });
  const car = useQuery(api.car.getCar, { 
    registrationNumber: booking?.carId as string
  });

  const rentalDuration = booking ? 
    Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Add formatPrice helper function
  const formatPrice = (amount: number) => {
    if (!amount) return '';
    if (currency === 'TRY') {
      return `₺${(amount * 34).toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const handleSubmit = async () => {
    if (!stripe) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let result;
      
      if (selectedPaymentMethod) {
        // Use saved payment method without elements
        result = await stripe.confirmPayment({
          clientSecret: clientSecret!,
          confirmParams: {
            payment_method: selectedPaymentMethod,
            return_url: `${window.location.origin}/bookings/currentbooking/success?session_id=${sessionId}`,
          },
        });
      } else {
        // Use new payment method with elements
        if (!elements) return;
        result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/bookings/currentbooking/success?session_id=${sessionId}`,
          },
        });
      }

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
                  {isLoadingPaymentMethods ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedPaymentMethods.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Saved Payment Methods</h3>
                          {savedPaymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className={`p-4 border rounded-lg cursor-pointer ${
                                selectedPaymentMethod === method.id ? 'border-primary' : 'border-gray-200'
                              }`}
                              onClick={() => setSelectedPaymentMethod(method.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium capitalize">
                                    {method.card.brand} •••• {method.card.last4}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Expires {method.card.exp_month}/{method.card.exp_year}
                                  </p>
                                </div>
                                <input
                                  type="radio"
                                  checked={selectedPaymentMethod === method.id}
                                  onChange={() => setSelectedPaymentMethod(method.id)}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center">
                            <Separator className="flex-1" />
                            <span className="px-3 text-sm text-muted-foreground">Or</span>
                            <Separator className="flex-1" />
                          </div>
                        </div>
                      )}
                      <div>
                        {selectedPaymentMethod ? (
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium mb-4">Selected Payment Method</h3>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedPaymentMethod(null)}
                              className="w-full"
                            >
                              Change Payment Method
                            </Button>
                            <div className="hidden">
                              <PaymentElement />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-sm font-medium mb-4">
                              {savedPaymentMethods.length > 0 ? 'Use a new payment method' : 'Enter payment details'}
                            </h3>
                            <PaymentElement onChange={() => setSelectedPaymentMethod(null)} />
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
                  I agree to the <Link href="/terms" className="text-primary">terms and conditions</Link>.
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
                    <h3 className="text-lg font-semibold">
                      {car && typeof car !== 'string' ? `${car.maker} ${car.model} ${car.year}` : 'Loading...'}
                    </h3>
                    <p className="text-muted-foreground">
                      {rentalDuration} {rentalDuration === 1 ? 'Day' : 'Days'} Rental
                    </p>
                    <p className="text-muted-foreground">
                      Pick-Up: {booking ? new Date(booking.startDate).toLocaleString() : 'Loading...'}
                    </p>
                    <p className="text-muted-foreground">
                      Drop-Off: {booking ? new Date(booking.endDate).toLocaleString() : 'Loading...'}
                    </p>
                    <p className="text-muted-foreground">
                      Location: {booking?.pickupLocation}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p>Total Price</p>
                    <p className="font-semibold">{formatPrice(total)}</p>
                  </div>
                  <div className="flex items-center justify-between text-green-600">
                    <p>Taxes & Fees</p>
                    <p className="font-semibold">Free</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Final Total</p>
                    <p className="text-lg font-semibold">{formatPrice(total)}</p>
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
