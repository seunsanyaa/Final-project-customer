import { ChangeForm } from "./form/change-password";

export default function ChangePasswordComponent() {
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
        {/* SVG content... */}
      </svg>

      {/* Header */}
      <h2 className="paragraph-color pt-8 text-2xl font-semibold">
        Set new password
      </h2>

      {/* Subheader */}
      <p className="paragraph-muted mt-2 pb-4 text-base font-normal">
        Enter your new password
      </p>

      {/* Change Password Form */}
      <ChangeForm />
    </div>
  );
}
