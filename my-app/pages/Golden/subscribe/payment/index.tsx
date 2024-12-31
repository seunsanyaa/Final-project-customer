import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type SavedPaymentMethod = {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

const CheckoutForm = ({ 
  planDetails, 
  sessionId, 
  planId,
  clientSecret  // Add this prop
}: { 
  planDetails: any, 
  sessionId: Id<"paymentSessions">,
  planId: string,
  clientSecret: string  // Add type
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updatePaymentSession = useMutation(api.payment.updatePaymentSessionStatus);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);
  const userId = useAuth().userId;

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`/api/payment-methods?userId=${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setSavedPaymentMethods(data.paymentMethods);
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

    if (userId) {
      fetchPaymentMethods();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) return;

    setIsProcessing(true);
    setError(null);

    try {
      await updatePaymentSession({
        sessionId,
        status: 'processing'
      });

      let result;
      
      if (selectedPaymentMethod) {
        result = await stripe.confirmPayment({
          clientSecret, // Use the passed clientSecret
          confirmParams: {
            payment_method: selectedPaymentMethod,
            return_url: `${window.location.origin}/Golden/subscribe/success?session_id=${sessionId}&plan=${planId}`,
          },
        });
      } else {
        if (!elements) return;
        result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/Golden/subscribe/success?session_id=${sessionId}&plan=${planId}`,
          },
        });
      }

      if (result.error) {
        await updatePaymentSession({
          sessionId,
          status: 'failed'
        });
        setError(result.error.message || 'Payment failed');
      }
    } catch (e) {
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your {planDetails.name} Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Plan Benefits:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {planDetails.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <p className="text-xl font-bold">
            Total: ${planDetails.price}/month
          </p>
        </div>

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

        {error && (
          <div className="mt-2 text-red-500">
            {error}
          </div>
        )}
        
        <Button 
          className="w-full mt-6"
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm Subscription'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function SubscriptionPayment() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Get URL parameters safely
  const planId = searchParams ? searchParams.get('plan') : null;
  const rawSessionId = searchParams ? searchParams.get('sessionId') : null;
  const clientSecretFromUrl = searchParams ? searchParams.get('clientSecret') : null;

  // Only cast to Id if we have a sessionId
  const sessionId = rawSessionId as Id<"paymentSessions"> | null;

  // Move the hook outside of the condition and pass null as sessionId if it's not available
  const paymentSession = useQuery(api.payment.getPaymentSession, { 
    sessionId: sessionId as Id<"paymentSessions">
  });

  // Define plans
  const plans = {
    silver_elite: {
      name: 'Silver Elite',
      price: 199,
      features: [
        '2 Premium rentals per month',
        'Basic chauffeur service',
        'Standard travel kit',
        '10% reward points bonus'
      ]
    },
    gold_elite: {
      name: 'Gold Elite',
      price: 399,
      features: [
        '4 Premium rentals per month',
        'Priority chauffeur service',
        'Luxury travel kit',
        '25% reward points bonus'
      ]
    },
    platinum_elite: {
      name: 'Platinum Elite',
      price: 799,
      features: [
        'Unlimited Premium rentals',
        '24/7 dedicated chauffeur',
        'Premium travel kit + extras',
        '50% reward points bonus'
      ]
    }
  };

  // Get selected plan details
  const selectedPlan = planId ? plans[planId as keyof typeof plans] : null;

  useEffect(() => {
    // Set client secret from URL parameter
    if (clientSecretFromUrl) {
      setClientSecret(clientSecretFromUrl);
      setIsLoading(false);
    }
  }, [clientSecretFromUrl]);

  // Show error if missing required parameters
  if (!planId || !sessionId || !clientSecretFromUrl || !selectedPlan) {
    return (
      <>
        <Navi />
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="text-red-500">Missing required payment information</div>
        </div>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Navi />
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
        <Footer />
      </>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <>
      <Navi />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Elements stripe={stripePromise} options={options as StripeElementsOptions}>
            <CheckoutForm 
              planDetails={selectedPlan} 
              sessionId={sessionId}
              planId={planId}
              clientSecret={clientSecret!}  // Add this line
            />
          </Elements>
        </div>
      </main>
      <Footer />
    </>
  );
}
