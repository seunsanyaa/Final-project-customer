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

  const updatePaymentSession = useMutation(api.payment.updatePaymentSessionStatus);
  const createSubscription = useMutation(api.payment.createSubscription);
  const upgradeCustomer = useMutation(api.customers.upgradeCustomer);

  useEffect(() => {
    const processSubscription = async () => {
      if (!user || !sessionId || !planId) return;

      try {
        // 1. Update payment session status
        await updatePaymentSession({
          sessionId,
          status: 'completed'
        });

        // 2. Create subscription record
        const { subscriptionId } = await createSubscription({
          userId: user.id,
          plan: planId,
          amount: 0, // You'll need to pass the actual amount
          paymentSessionId: sessionId,
        });

        // 3. Upgrade customer status
        await upgradeCustomer({
          userId: user.id,
          subscriptionPlan: planId,
        });

        // 4. Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Error processing subscription:', error);
        setError("Failed to process subscription");
      } finally {
        setIsProcessing(false);
      }
    };

    if (sessionId && planId && user && isProcessing) {
      processSubscription();
    }
  }, [sessionId, planId, user, isProcessing]);

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
