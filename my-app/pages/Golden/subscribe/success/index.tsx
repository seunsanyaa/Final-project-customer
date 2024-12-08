'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline";

export default function SubscriptionSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams?.get('session_id') as Id<"paymentSessions">;
  const planId = searchParams?.get('plan');
  const paymentIntentId = searchParams?.get('payment_intent');

  const updatePaymentSession = useMutation(api.payment.updatePaymentSessionStatus);
  const createSubscription = useMutation(api.customers.createSubscription);
  const createPayment = useMutation(api.payment.createPayment);
  const upgradeCustomer = useMutation(api.customers.upgradeCustomer);

  useEffect(() => {
    const processSubscription = async () => {
      if (!user || !sessionId || !planId) return;

      try {
        if (!paymentIntentId) {
          throw new Error('Payment intent ID is missing');
        }

        // 1. Update payment session status
        await updatePaymentSession({
          sessionId,
          status: 'completed'
        });

        // Get plan amount
        const planPrices = {
          silver_elite: 199,
          gold_elite: 399,
          platinum_elite: 799
        };
        const amount = planPrices[planId as keyof typeof planPrices];

        // 2. Get Stripe subscription ID
        const stripeResponse = await fetch('/api/get-stripe-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId
          }),
        });

        if (!stripeResponse.ok) {
          const error = await stripeResponse.json();
          throw new Error(error.error || 'Failed to get Stripe subscription');
        }

        const { stripeSubscriptionId } = await stripeResponse.json();
        
        // 3. Create subscription record
        const { subscriptionId } = await createSubscription({
          userId: user.id,
          plan: planId,
          amount,
          paymentSessionId: sessionId,
          stripeSubscriptionId: stripeSubscriptionId
        });

        await createPayment({
          amount,
          paymentDate: new Date().toISOString(),
          paymentType: 'stripe',
          paymentIntentId: paymentIntentId || undefined,
          isSubscription: true
        });

        // 4. Update subscription metadata
        const metadataResponse = await fetch('/api/update-subscription-metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscriptionId: stripeSubscriptionId,
            userId: user.id,
            planId
          }),
        });

        if (!metadataResponse.ok) {
          throw new Error('Failed to update subscription metadata');
        }

        // 5. Upgrade customer status
        await upgradeCustomer({
          userId: user.id,
          subscriptionPlan: planId,
        });

        // 6. Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/Golden');
        }, 2000);

      } catch (error) {
        console.error('Error processing subscription:', error);
        setError(error instanceof Error ? error.message : "Failed to process subscription");
      } finally {
        setIsProcessing(false);
      }
    };

    if (sessionId && planId && user && isProcessing) {
      processSubscription();
    }
  }, [
    sessionId, 
    planId, 
    user, 
    isProcessing, 
    createPayment,
    createSubscription,
    paymentIntentId,
    router,
    updatePaymentSession,
    upgradeCustomer
  ]);

  if (error) {
    return (
      <>
        <Navi />
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="text-red-600 text-xl">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navi />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-600" />
        <h1 className="text-3xl font-bold mt-6">
          {isProcessing ? "Processing Subscription" : "Subscription Activated"}
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          {isProcessing 
            ? "Please wait while we activate your subscription..."
            : "Your subscription has been activated successfully. Redirecting..."
          }
        </p>
      </div>
      <Footer />
    </>
  );
}
