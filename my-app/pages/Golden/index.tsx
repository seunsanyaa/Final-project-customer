'use client';

import { GoldenLanding } from "@/components/general/golden/golden_landing";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoldenPage() {
  const router = useRouter();
  const { user } = useUser();
  const isGoldenMember = useQuery(api.customers.isGoldenMember, { 
    userId: user?.id ?? '' 
  });

  useEffect(() => {
    if (isGoldenMember) {
      router.push("/Golden/GoldenHome");
    }
  }, [isGoldenMember, router]);

  // Show loading state while checking membership status
  if (isGoldenMember === undefined) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>
    );
  }

  // Only render landing page since golden members are redirected
  return <GoldenLanding />;
}
