import { useState } from "react";
import { ResetForm } from "./form/reset";
import { OTPForm } from "./form/otp";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function ResetComponent() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const { signIn } = useSignIn();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmail = async (email: string) => {
    try {
      if (!signIn) return;
      
      // Clear any existing sign-in attempts
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setEmail(email);
      setEmailSent(true);
    } catch (err: any) {
      console.error("Error sending reset email:", err);
      toast({
        title: "Error",
        description: err?.errors?.[0]?.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerification = async (code: string) => {
    try {
      if (!signIn) {
        toast({
          title: "Error",
          description: "Please request a new verification code.",
          variant: "destructive",
        });
        setEmailSent(false);
        return;
      }

      // Create a new sign-in attempt for verification
      const signInAttempt = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      // Attempt verification with the code
      const verification = await signInAttempt.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      if (verification.status === "complete") {
        router.push("/change-password");
      } else {
        toast({
          title: "Error",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error verifying code:", err);
      const errorCode = err?.errors?.[0]?.code;
      
      if (errorCode === "form_code_incorrect") {
        toast({
          title: "Error",
          description: "Incorrect verification code. Please try again.",
          variant: "destructive",
        });
      } else if (errorCode === "form_code_expired") {
        toast({
          title: "Error",
          description: "Verification code has expired. Please request a new one.",
          variant: "destructive",
        });
        setEmailSent(false);
      } else {
        toast({
          title: "Error",
          description: err?.errors?.[0]?.message || "Failed to verify code. Please try again.",
          variant: "destructive",
        });
        setEmailSent(false);
      }
    }
  };

  const requestNewCode = async () => {
    try {
      if (!signIn || !email) return;
      
      // Request a new code with a fresh sign-in attempt
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      toast({
        title: "Success",
        description: "A new verification code has been sent to your email.",
      });
    } catch (err: any) {
      console.error("Error requesting new code:", err);
      toast({
        title: "Error",
        description: "Failed to send new code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex basis-1/2 flex-col px-20 pt-24">
      <svg
        width="52"
        height="51"
        viewBox="0 0 52 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ... (SVG content remains unchanged) ... */}
      </svg>

      {emailSent ? (
        <>
          <h2 className="paragraph-color pt-8 text-2xl font-semibold">
            Enter verification code
          </h2>
          <p className="paragraph-muted mt-2 pb-4 text-base font-normal">
            We sent a verification code to <b>{email}</b>. Please enter it below to reset your password.
          </p>
          <OTPForm 
            onVerify={handleVerification}
            mode="reset"
            buttonText="Verify Code"
          />
          <button
            onClick={requestNewCode}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Request new code
          </button>
        </>
      ) : (
        <>
          <h2 className="paragraph-color pt-8 text-2xl font-semibold">
            Reset Password
          </h2>
          <p className="paragraph-muted pb-4 text-base font-normal">
            Enter your user account&apos;s verified email address and we will send you a password reset link.
          </p>
          <ResetForm func={handleEmail} />
        </>
      )}
    </div>
  );
}
