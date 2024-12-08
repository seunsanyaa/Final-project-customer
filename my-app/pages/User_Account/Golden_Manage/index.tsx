import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navi } from "@/components/general/head/navi";
import { Footer } from "@/components/general/head/footer";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function GoldenManage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const customerData = useQuery(api.customers.getCustomerByUserId, { 
    userId: user?.id ?? "" 
  });

  const initializePaymentSession = useMutation(api.payment.createPaymentSession);
  const cancelCustomerSubscription = useMutation(api.customers.cancelSubscription);

  const plans = {
    silver_elite: {
      name: 'Silver Elite',
      price: 199,
      tier: 1,
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
      tier: 2,
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
      tier: 3,
      features: [
        'Unlimited Premium rentals',
        '24/7 dedicated chauffeur',
        'Premium travel kit + extras',
        '50% reward points bonus'
      ]
    }
  };

  const handleUpgrade = async (newPlan: string) => {
    try {
      setIsLoading(true);

      if (!user) {
        router.push('/sign-in');
        return;
      }

      const selectedPlanDetails = plans[newPlan as keyof typeof plans];
      
      const result = await initializePaymentSession({
        paidAmount: 0,
        paymentType: 'stripe',
        userId: user.id,
        totalAmount: selectedPlanDetails.price,
        isSubscription: true,
        subscriptionPlan: newPlan
      });

      if (!result?.sessionId) {
        throw new Error('Failed to create payment session');
      }

      const response = await fetch('/api/subscription-creation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: newPlan,
          email: user.emailAddresses[0].emailAddress,
          sessionId: result.sessionId,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { clientSecret } = await response.json();
      router.push(`/Golden/subscribe/payment?plan=${newPlan}&sessionId=${result.sessionId}&clientSecret=${clientSecret}`);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);

      // Get the subscription ID from your subscriptions table
      const subscription = await fetch('/api/get-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      const { subscriptionId } = await subscription.json();

      // Cancel the subscription in Stripe
      const response = await fetch('/api/subscription-cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Update the customer status in your database
      await cancelCustomerSubscription({ userId: user?.id ?? "" });

      toast({
        title: "Subscription cancelled successfully",
        description: "Your subscription has been cancelled successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Cancellation failed:', error);
      toast({
        title: "Failed to cancel subscription",
        description: "An error occurred while cancelling your subscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!customerData) {
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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Manage Your Golden Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                <p className="text-muted-foreground">
                  {plans[customerData.subscriptionPlan as keyof typeof plans]?.name || 'No active plan'}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Plans</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(plans).map(([planId, plan]) => (
                    <Card key={planId} className={`relative ${
                      customerData.subscriptionPlan === planId ? 'border-2 border-primary' : ''
                    }`}>
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <p className="text-2xl font-bold">${plan.price}/month</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span>✓</span> {feature}
                            </li>
                          ))}
                        </ul>
                        {customerData.subscriptionPlan !== planId && 
                         plans[planId as keyof typeof plans].tier > (plans[customerData.subscriptionPlan as keyof typeof plans]?.tier || 0) && (
                          <Button
                            className="w-full"
                            onClick={() => handleUpgrade(planId)}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {customerData.subscriptionPlan && (
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
