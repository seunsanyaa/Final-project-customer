import Image from "next/image";
import { useRouter } from "next/router";
import ChangePasswordComponent from "./change-password";
import LoginComponent from "./login";
// import OnboardComponent from "./onboard";
import ResetComponent from "./password_reset";
import VerifyComponent from "./verify_code";

// AuthLayout component for handling different authentication views
export default function AuthLayout() {
  const router = useRouter();

  return (
    // Main container with full height and width, using flexbox
    <div className="flex h-screen w-full flex-row gap-10 p-4">
      {/* Left side - Image container */}
      <div className="w-full basis-1/2">
        <Image
          className="h-full w-full rounded-xl object-cover"
          alt="Authentication background"
          src="https://res.cloudinary.com/seunsanyaa/image/upload/v1727820662/unnamed_1_u3udcb.png"
          width={686}
          height={992}
        />
      </div>

      {/* Right side - Authentication components container */}
      <div className="no-scrollbar w-2/4 overflow-y-auto overflow-x-hidden">
        {/* Render different components based on the current route */}
        {router.pathname === "/onboarding" ? (
          <></>
          // TODO: Uncomment and implement OnboardComponent
          // <OnboardComponent />
        ) : router.pathname === "/reset-password" ? (
          <ResetComponent />
        ) : router.pathname === "/change-password" ? (
          <ChangePasswordComponent />
        ) : router.pathname === "/verify-account" ? (
          <VerifyComponent />
        ) : (
          // Default to LoginComponent if no other route matches
          <LoginComponent />
        )}
      </div>
    </div>
  );
}
