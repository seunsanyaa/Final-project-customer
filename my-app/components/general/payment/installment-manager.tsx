import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { Id } from '../../../convex/_generated/dataModel';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface InstallmentManagerProps {
  bookingId: Id<"bookings">;
  remainingAmount: number;
  nextInstallmentDate: string;
  nextInstallmentAmount: number;
  currency: string;
  email: string;
}

const PaymentForm = ({ amount, bookingId, onClose }: { amount: number; bookingId: Id<"bookings">; onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/currentbooking/success?bookingId=${bookingId}`,
        },
      });

      if (result.error) {
        console.error('Payment error:', result.error);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-background">
      <PaymentElement />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing..." : `Pay ${formatPrice(amount, 'USD')}`}
        </Button>
      </div>
    </form>
  );
};

export function InstallmentManager({ 
  bookingId, 
  remainingAmount, 
  nextInstallmentDate,
  nextInstallmentAmount,
  currency,
  email
}: InstallmentManagerProps) {
  const [action, setAction] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handlePaymentClick = async () => {
    const amount = action === 'next' ? nextInstallmentAmount : remainingAmount;
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          bookingId,
          email,
          paymentType: action === 'next' ? 'installment' : 'full',
          installmentPlan: action === 'next' ? { /* Add relevant installment plan details */ } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 bg-background">
        <Select value={action} onValueChange={setAction} >
          <SelectTrigger>
            <SelectValue placeholder="Payment options" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="next">
              Pay next installment ({formatPrice(nextInstallmentAmount, currency)})
            </SelectItem>
            <SelectItem value="remaining">
              Pay remaining amount ({formatPrice(remainingAmount, currency)})
            </SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handlePaymentClick} 
          disabled={!action}
        >
          Pay Now
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {clientSecret && (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <PaymentForm 
                amount={action === 'next' ? nextInstallmentAmount : remainingAmount}
                bookingId={bookingId}
                onClose={() => setIsModalOpen(false)}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const formatPrice = (amount: number, currency: string) => {
  if (currency === 'TRY') {
    return `₺${(amount * 34).toFixed(2)}`;
  }
  return `$${amount.toFixed(2)}`;
}; 