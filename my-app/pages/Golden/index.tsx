'use client';

import { Golden_Landing } from "@/components/general/golden/golden_landing";
import { Goldhome } from "@/components/general/golden/goldhome";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function GoldenPage() {
  const { user } = useUser();
  const isGoldenMember = useQuery(api.customers.isGoldenMember, { 
    userId: user?.id ?? '' 
  });

  // Show loading state while checking membership status
  if (isGoldenMember === undefined) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>
    );
  }

  // Render appropriate component based on membership status
  return isGoldenMember ? <Goldhome /> : <Golden_Landing />;
}
