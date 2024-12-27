import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
 
// const publicPages: Array<string> = [];
 
export const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const getRedirectUrl = () => {
    return  '/redirection';
  };

  const signInWithGoogle = () =>
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: getRedirectUrl(),
    });

  const signInWithMicrosoft = () =>
    signIn.authenticateWithRedirect({
      strategy: "oauth_microsoft",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: getRedirectUrl(),
    });

  const signInWithApple = () =>
    signIn.authenticateWithRedirect({
      strategy: "oauth_apple",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: getRedirectUrl(),
    });
   
  return (
    <div className="flex flex-row gap-3 py-8">
      <Button variant={"outline"} className="flex-1 rounded-lg" onClick={signInWithGoogle}>
        <svg
          className="mr-2 h-5 w-5"
          enable-background="new 0 0 128 128"
          id="Social_Icons"
          version="1.1"
          viewBox="0 0 128 128"
          xmlSpace="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g id="_x31__stroke">
            <g id="Google">
              <rect
                clip-rule="evenodd"
                fill="none"
                fill-rule="evenodd"
                height="128"
                width="128"
              />
              <path
                clip-rule="evenodd"
                d="M27.585,64c0-4.157,0.69-8.143,1.923-11.881L7.938,35.648    C3.734,44.183,1.366,53.801,1.366,64c0,10.191,2.366,19.802,6.563,28.332l21.558-16.503C28.266,72.108,27.585,68.137,27.585,64"
                fill="#FBBC05"
                fill-rule="evenodd"
              />
              <path
                clip-rule="evenodd"
                d="M65.457,26.182c9.031,0,17.188,3.2,23.597,8.436L107.698,16    C96.337,6.109,81.771,0,65.457,0C40.129,0,18.361,14.484,7.938,35.648l21.569,16.471C34.477,37.033,48.644,26.182,65.457,26.182"
                fill="#EA4335"
                fill-rule="evenodd"
              />
              <path
                clip-rule="evenodd"
                d="M65.457,101.818c-16.812,0-30.979-10.851-35.949-25.937    L7.938,92.349C18.361,113.516,40.129,128,65.457,128c15.632,0,30.557-5.551,41.758-15.951L86.741,96.221    C80.964,99.86,73.689,101.818,65.457,101.818"
                fill="#34A853"
                fill-rule="evenodd"
              />
              <path
                clip-rule="evenodd"
                d="M126.634,64c0-3.782-0.583-7.855-1.457-11.636H65.457v24.727    h34.376c-1.719,8.431-6.397,14.912-13.092,19.13l20.474,15.828C118.981,101.129,126.634,84.861,126.634,64"
                fill="#4285F4"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>
        Google
      </Button>

      <Button variant={"outline"} className="flex-1 rounded-lg" onClick={signInWithMicrosoft}>
        <svg className="mr-2 h-5 w-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
          <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
          <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
          <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
        </svg>
        Microsoft
      </Button>

      <Button variant={"outline"} className="flex-1 rounded-lg" onClick={signInWithApple}>
        <svg className="mr-2 h-5 w-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M702.04 960.93c-54.46 53.77-115.67 39.27-172.31 12.03-59.87-28.79-115.07-28.79-177.72 0-75.71 35.12-116.58 23.76-159.49-18.98-187.93-185.1-211.12-530.03 31.32-699.21 102.72-71.86 179.98-40.76 248.23-3.45 44.46 24.25 84.37 26.64 134.58 0 69.64-36.51 139.28-59.42 225.04 6.9-79.16 49.01-133.62 122.53-121.7 227.18 14.42 125.76 93.57 205.82 198.93 228.68-29.39 84.82-80.51 151.67-206.88 246.85z" fill="#000"/>
          <path d="M704.9 301.64C728.1 137.54 909.91 92.2 920.93 88.21c-5.45 34.79-28.19 111.95-92.98 171.37-64.79 62.4-152.51 71.86-187.63 73.35-5.45-4.41-15.92-16.44-35.42-31.34z" fill="#000"/>
        </svg>
        Apple
      </Button>
    </div>
  );
};