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

export const GoldenSubscribe = () => {
  const { user } = useUser();
  const router = useRouter();
  const initializePaymentSession = useMutation(api.payment.createPaymentSession);

  const plans = {
    silver_elite: {
      name: 'Silver Elite',
      price: 199,
      priceId: process.env.NEXT_PUBLIC_STRIPE_SILVER_ELITE_PRICE_ID,
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
      priceId: process.env.NEXT_PUBLIC_STRIPE_GOLD_ELITE_PRICE_ID,
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
      priceId: process.env.NEXT_PUBLIC_STRIPE_PLATINUM_ELITE_PRICE_ID,
      features: [
        'Unlimited Premium rentals',
        '24/7 dedicated chauffeur',
        'Premium travel kit + extras',
        '50% reward points bonus'
      ]
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Create payment session
      const { _id: sessionId } = await initializePaymentSession({
        paidAmount: 0,
        paymentType: 'stripe',
        userId: user.id,
        totalAmount: plans[planId as keyof typeof plans].price,
        isSubscription: true,
        subscriptionPlan: planId
      });

      // Create Stripe subscription
      const response = await fetch('/api/subscription-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          email: user.emailAddresses[0].emailAddress,
          sessionId
        }),
      });

      const { clientSecret } = await response.json();

      // Redirect to payment page with all necessary parameters
      router.push(`/Golden/subscribe/payment?plan=${planId}&sessionId=${sessionId}&clientSecret=${clientSecret}`);
    } catch (error) {
      console.error('Subscription initialization failed:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      {Object.entries(plans).map(([id, plan]) => (
        <div key={id} className="border rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
          <p className="text-xl mb-4">${plan.price}/month</p>
          <ul className="mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="mb-2">• {feature}</li>
            ))}
          </ul>
          <Button 
            className="w-full"
            onClick={() => handleSubscribe(id)}
          >
            Subscribe Now
          </Button>
        </div>
      ))}
    </div>
  );
};

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
