import { Footer } from "@/components/general/head/footer";
import { Navi } from "@/components/general/head/navi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams?.get('plan');
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

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
    // ... other plans
  };

  const selectedPlan = planId ? plans[planId as keyof typeof plans] : null;

  useEffect(() => {
    // Fetch the client secret from your payment session
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/get-payment-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: router?.query?.sessionId,
          }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (router?.query?.sessionId) {
      fetchClientSecret();
    }
  }, [router?.query?.sessionId]);

  if (isLoading || !selectedPlan) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>
    );
  }

  return (
    <>
      <Navi />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your {selectedPlan.name} Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Plan Benefits:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <p className="text-xl font-bold">
                      Total: ${selectedPlan.price}/month
                    </p>
                  </div>
                  <PaymentElement />
                  <Button 
                    className="w-full mt-6"
                    onClick={() => {
                      if (!stripe || !elements) return;
                      stripe.confirmPayment({
                        elements,
                        confirmParams: {
                          return_url: `${window.location.origin}/Golden/success`,
                        },
                      });
                    }}
                  >
                    Confirm Subscription
                  </Button>
                </CardContent>
              </Card>
            </Elements>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
