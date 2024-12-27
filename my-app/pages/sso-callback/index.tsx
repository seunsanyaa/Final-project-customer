import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SSOCallback() {
  const { user } = useUser();
  const staffMember = useQuery(api.staff.getStaffByEmail, { email: user?.emailAddresses[0]?.emailAddress ?? "" });
  const generateToken = useMutation(api.verify.generateStaffToken);

  // Default redirect
  let redirectUrl = "/vehicles";

  return <AuthenticateWithRedirectCallback 
    afterSignInUrl={redirectUrl}
    afterSignUpUrl={ "/redirection"}
         />;
}