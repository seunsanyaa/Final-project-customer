'use client';

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function GoldenSubscribe() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPaymentSession = useMutation(api.payment.createPaymentSession);

  const plans = [
    {
      id: 'silver_elite',
      name: 'Silver Elite',
      price: 199,
      features: [
        '2 Premium rentals per month',
        'Basic chauffeur service',
        'Standard travel kit',
        '10% reward points bonus'
      ]
    },
    {
      id: 'gold_elite',
      name: 'Gold Elite',
      price: 399,
      features: [
        '4 Premium rentals per month',
        'Priority chauffeur service',
        'Luxury travel kit',
        '25% reward points bonus'
      ]
    },
    {
      id: 'platinum_elite',
      name: 'Platinum Elite',
      price: 799,
      features: [
        'Unlimited Premium rentals',
        '24/7 dedicated chauffeur',
        'Premium travel kit + extras',
        '50% reward points bonus'
      ]
    }
  ];

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, isLoaded, router]);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    setSelectedPlan(planId);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const selectedPlanDetails = plans.find(p => p.id === planId);
      if (!selectedPlanDetails) {
        throw new Error('Invalid plan selected');
      }

      const paymentSession = await createPaymentSession({
        paidAmount: selectedPlanDetails.price,
        paymentType: 'subscription',
        userId: user.id,
        subscriptionPlan: planId,
        isSubscription: true,
      });

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'subscription',
          planId,
          amount: selectedPlanDetails.price,
          email: user.emailAddresses[0].emailAddress,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      router.push(`/Golden/subscribe/success?session_id=${paymentSession._id}&plan=${planId}&client_secret=${data.clientSecret}`);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <Separator />
      <main className="flex-1 container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choose Your Elite Membership</h1>
          <p className="text-muted-foreground">Select the plan that best suits your luxury lifestyle</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 ${
              selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
            }`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-3xl font-bold">${plan.price}<span className="text-sm">/month</span></p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const CheckIcon = (props: any) => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
