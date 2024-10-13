import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

// Stripe public key
const stripePromise = loadStripe("your-publishable-key");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error(error);
    } else {
      // Send paymentMethod.id to your server to create a payment intent
      console.log(paymentMethod);
      // You can customize this process to match your backend logic
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </Button>
    </form>
  );
};

export function PaymentElement() {
  return (
    <Elements stripe={stripePromise}>
      
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl font-bold">Complete your booking</h1>
        <p className="text-muted-foreground">
          Enter your payment details to finalize your car rental.
        </p>
        <CheckoutForm />
      </div>
    </Elements>
  );
}
