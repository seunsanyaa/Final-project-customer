import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";


export default function SSOCallback() {
  const { user } = useUser();


  // Default redirect
  let redirectUrl = "/vehicles";

  return <AuthenticateWithRedirectCallback 
    afterSignInUrl={redirectUrl}
    afterSignUpUrl={ "/redirection"}
         />;
}