import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import ChangePasswordComponent from "./change-password";
import LoginComponent from "./login";
import ResetComponent from "./password_reset";
import VerifyComponent from "./verify_code";
import OnboardComponent from "./onboard";

export default function AuthLayout() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  
  // Handle redirect after successful login
  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load

    if (router.pathname === "/login" && userId) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin'); // Clear the stored path
        router.push(redirectPath);
      }
    }
  }, [router, isLoaded, userId]);

  return (
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
          <OnboardComponent />
        ) : router.pathname === "/reset-password" ? (
          <ResetComponent />
        ) : router.pathname === "/change-password" ? (
          <ChangePasswordComponent />
        ) : router.pathname === "/verify-account" ? (
          <VerifyComponent />
        ) : (
          <LoginComponent />
        )}
      </div>
    </div>
  );
}
