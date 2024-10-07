import { useRouter } from "next/router";
import { OTPForm } from "./form/otp";

export default function VerifyComponent() {
  // Initialize the Next.js router
  const router = useRouter();

  // Extract the email from the query parameters
  const email = router.query.email as string;

  return (
    <div className="flex basis-1/2 flex-col px-20 pt-24">
      {/* Logo SVG */}
      <svg
        width="52"
        height="51"
        viewBox="0 0 52 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG content remains unchanged */}
        {/* ... */}
      </svg>

      {/* Verification instructions */}
      <h2 className="paragraph-color pt-8 text-2xl font-semibold">
        Verify your email address
      </h2>
      <p className="paragraph-muted pb-4 text-base font-normal">
        We've sent a code to {email || "your email address"}.
      </p>
      
      {/* OTP Form component */}
      <OTPForm />
    </div>
  );
}
