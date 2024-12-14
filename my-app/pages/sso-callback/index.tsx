import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SSOCallback() {
  const { user } = useUser();
  const staffMember = useQuery(api.staff.getStaffByEmail, { email: user?.emailAddresses[0]?.emailAddress ?? "" });
  const generateToken = useMutation(api.verify.generateStaffToken);

  // Default redirect
  let redirectUrl = "/";

  // Handle staff token generation
  if (staffMember?.email) {
    generateToken({ email: staffMember.email })
      .then(result => {
        if (result.success) {
          redirectUrl = `https://car-rental-fullstack.vercel.app?token=${result.token}`;
        }
      });
  }

  return <AuthenticateWithRedirectCallback 
            afterSignInUrl={redirectUrl} 
            afterSignUpUrl="/onboarding" 
         />;
}