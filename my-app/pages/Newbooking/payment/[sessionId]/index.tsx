'use client'
import { Payment_Page } from "@/components/general/payment/payment_page";
import { useConvexAuth } from "convex/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (isAuthenticated === false) { // Ensure isAuthenticated is explicitly false
      router.replace('/login'); // Client-side redirection
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === false) {
    return null; // Or a loading spinner/message
  }

  return <Payment_Page />;
}