import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SSOCallback() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const staffMember = useQuery(api.staff.getStaffByEmail, { email: user?.emailAddresses[0]?.emailAddress ?? "" });

  useEffect(() => {
    if (isLoaded) {
      // Check if user signed up via social
      const isSocialSignup = user?.externalAccounts?.length > 0;

      if (isSocialSignup) {
        // Redirect to onboarding for password setup
        router.push('/onboarding');
      } else {
        // Redirect based on staff or regular user
        router.push(staffMember?.email ? "/staff" : "/");
      }
    }
  }, [isLoaded, user, staffMember, router]);

  return <AuthenticateWithRedirectCallback 
            afterSignInUrl={staffMember?.email ? "/staff" : "/"} 
            afterSignUpUrl="/onboarding" 
         />;
}