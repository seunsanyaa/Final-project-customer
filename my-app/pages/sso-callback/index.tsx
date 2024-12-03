import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SSOCallback() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const staffMember = useQuery(api.staff.getStaffByEmail, { email: user?.emailAddresses[0]?.emailAddress ?? "" });

  return (
    <AuthenticateWithRedirectCallback 
      afterSignInUrl={staffMember?.email ? "/staff" : "/"}
      afterSignUpUrl="/onboarding"
    />
  );
}