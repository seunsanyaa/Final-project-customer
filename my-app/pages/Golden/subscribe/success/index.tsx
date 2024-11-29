import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export default function SubscriptionSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sessionId = searchParams?.get('session_id') as Id<"paymentSessions">;
  const planId = searchParams?.get('plan');
  const updatePaymentSession = useMutation(api.payment.updatePaymentSessionStatus);
  const upgradeCustomer = useMutation(api.customers.upgradeCustomer);

  useEffect(() => {
    const processSubscription = async () => {
      if (!user || !sessionId || !planId) return;

      try {
        // Update payment session status
        await updatePaymentSession({
          sessionId,
          status: 'completed'
        });

        // Upgrade the customer to golden member with the selected plan
        await upgradeCustomer({
          userId: user.id,
          subscriptionPlan: planId,
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/Golden');
        }, 2000);
      } catch (error) {
        console.error('Error processing subscription:', error);
        setError('Failed to process subscription');
      } finally {
        setIsProcessing(false);
      }
    };

    if (user && sessionId && planId) {
      processSubscription();
    }
  }, [user, sessionId, planId, updatePaymentSession, upgradeCustomer, router]);

  if (error) {
    return (
      <>
        <Navi />
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="text-red-600 text-xl">
            {error}
          </div>
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
          {isProcessing ? "Processing Subscription" : "Welcome to Elite Membership!"}
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          {isProcessing 
            ? "Please wait while we activate your membership..."
            : "Your elite membership has been activated. Redirecting to dashboard..."
          }
        </p>
      </div>
      <Footer />
    </>
  );
}
