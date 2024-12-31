import { useState } from "react";
import { ResetForm } from "./form/reset";

export default function ResetComponent() {
  // State to track if the email has been sent and store the email address
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  // Handler function to update email and set emailSent to true
  const handleEmail = (email: string) => {
    setEmail(email);
    setEmailSent(true);
  };

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
        {/* ... (SVG content remains unchanged) ... */}
      </svg>

      {/* Conditional rendering based on emailSent state */}
      {emailSent ? (
        // Content to show after email is sent
        <>
          <h2 className="paragraph-color pt-8 text-2xl font-semibold">
            Password reset link sent
          </h2>
          <p className="paragraph-muted mt-2 pb-4 text-base font-normal">
            The link to reset your password has been sent to <b>{email}</b>. Please follow the instructions provided.
          </p>
        </>
      ) : (
        // Content to show before email is sent
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
