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
    // TODO: Implement actual password reset email sending logic here
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

      {/* Main content */}
      <div className="mt-8">
        <h2 className="paragraph-color text-2xl font-semibold">
          {emailSent ? "Password reset link sent" : "Reset Password"}
        </h2>
        <p className="paragraph-muted mt-2 text-base font-normal">
          {emailSent ? (
            <>
              The link to reset your password has been sent to <b>{email}</b>. Please follow the instructions provided.
            </>
          ) : (
            "Enter your user account's verified email address and we will send you a password reset link."
          )}
        </p>
        {/* Render ResetForm only if email hasn't been sent */}
        {!emailSent && <ResetForm func={handleEmail} />}
      </div>
    </div>
  );
}
