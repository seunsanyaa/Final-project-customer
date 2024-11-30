import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SSOCallBack() {
  const { user, isLoaded } = useUser();
	const getStaffMember = useQuery(api.staff.getStaffMember, 
		isLoaded && user?.primaryEmailAddress?.emailAddress ? {
			email: user.primaryEmailAddress.emailAddress,
		} : 'skip'
	);


	return (
		<AuthenticateWithRedirectCallback
			signUpFallbackRedirectUrl={
				getStaffMember?.email ? '/admin' : '/vehicles'
			}
      signInFallbackRedirectUrl={
        
        getStaffMember?.email ? '/admin' : '/vehicles'
        
      }
		/>
	);
}