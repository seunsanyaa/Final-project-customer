import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { loadStripe } from '@stripe/stripe-js';
import { Id } from '../../../convex/_generated/dataModel';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface InstallmentManagerProps {
  bookingId: Id<"bookings">;
  remainingAmount: number;
  nextInstallmentDate: string;
  nextInstallmentAmount: number;
  currency: string;
}

export function InstallmentManager({ 
  bookingId, 
  remainingAmount, 
  nextInstallmentDate,
  nextInstallmentAmount,
  currency
}: InstallmentManagerProps) {
  const [action, setAction] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: action === 'next' ? nextInstallmentAmount : remainingAmount,
          bookingId,
          paymentType: action === 'next' ? 'installment' : 'full',
        }),
      });

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.confirmPayment({
          elements: undefined,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/bookings/success`,
          },
        });

        if (error) {
          console.error('Payment error:', error);
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={action} onValueChange={setAction}>
        <SelectTrigger>
          <SelectValue placeholder="Payment options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">
            Pay next installment ({formatPrice(nextInstallmentAmount, currency)})
          </SelectItem>
          <SelectItem value="remaining">
            Pay remaining amount ({formatPrice(remainingAmount, currency)})
          </SelectItem>
        </SelectContent>
      </Select>
      <Button 
        onClick={handlePayment} 
        disabled={!action || isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}

const formatPrice = (amount: number, currency: string) => {
  if (currency === 'TRY') {
    return `₺${(amount * 34).toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}; 