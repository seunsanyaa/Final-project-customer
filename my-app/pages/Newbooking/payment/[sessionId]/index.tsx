'use client'
import { Payment_Page } from "@/components/general/payment/payment_page";
import { useConvexAuth } from "convex/react";
import { redirect } from 'next/navigation';
export default function PaymentPage() {
  const { isAuthenticated } = useConvexAuth();
 


  if (!isAuthenticated) {
    redirect('/'); 
  }

  return <Payment_Page />;
}