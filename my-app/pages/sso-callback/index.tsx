import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SSOCallback() {
  const { user,  } = useUser();
  const staffMember = useQuery(api.staff.getStaffByEmail, { email: user?.emailAddresses[0]?.emailAddress ?? "" });


  // WE DONT NEED THIS BECAUSE WE ARE USING CLERK
  // useEffect(() => {
  //   if (isLoaded) {
  //     // Check if user signed up via social
  //     const isSocialSignup = user?.externalAccounts?.length > 0;

  //     if (isSocialSignup) {
  //       // Redirect to onboarding for password setup
  //       router.push('/onboarding');
  //     } else {
  //       // Redirect based on staff or regular user
  //       router.push(staffMember?.email ? "/staff" : "/");
  //     }
  //   }
  // }, [isLoaded, user, staffMember, router]);

  return <AuthenticateWithRedirectCallback 
            afterSignInUrl={staffMember?.email ? "https://car-rental-fullstack.vercel.app" : "/"} 
            afterSignUpUrl="/onboarding" 
         />;
}