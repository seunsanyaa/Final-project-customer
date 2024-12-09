import { useRouter } from "next/router";
import { InputForm } from "./form/auth";
import { SignInOAuthButtons } from "./social_buttons";
export default function LoginComponent() {
  const router = useRouter();

  const renderContent = (pathname: string) => {
    switch (pathname) {
      case "/login":
        return (
          <>
            <h2 className="paragraph-color pt-8 text-2xl font-semibold">
              Welcome back
            </h2>
            <p className="paragraph-muted text-base font-normal">
              Enter your details to sign in{" "}
            </p>
          </>
        );

      case "/create-account":
        return (
          <>
            <h2 className="paragraph-color pt-8 text-2xl font-semibold">
              Create an account
            </h2>
            <p className="paragraph-muted text-base font-normal">
              Register your account to get started
            </p>
          </>
        );

      case "/reset-password":
        return (
          <>
            <h2 className="paragraph-color pt-8 text-2xl font-semibold">
              Reset Password
            </h2>
            <p className="paragraph-muted pb-4 text-base font-normal">
              Enter your user account&apos;s verified email address and we will
              send you a password reset link.
            </p>
          </>
        );
      case "/verify-account":
        return (
          <>
            <h2 className="paragraph-color pt-8 text-2xl font-semibold">
              Verify your email address
            </h2>
            <p className="paragraph-muted pb-4 text-base font-normal">
              We&apos;ve sent a code to {router.query.email}.
            </p>
          </>
        );
      default:
        return (
          <>
            <h2 className="paragraph-color pt-8 text-2xl font-semibold">
              Password reset link sent
            </h2>
            <p className="paragraph-muted text-base font-normal ">
              The link to reset your password has been sent to your verified
              email address. Please follow the instructions provided.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex basis-1/2 flex-col px-32 pt-24">
     CAR RENTAL

      {renderContent(router.pathname)}

      {router.pathname === "/login" || router.pathname === "/create-account" ? (
        <>
          <SignInOAuthButtons />

          <InputForm />
        </>
      ) : (
        <InputForm
          passwordField={false}
          buttonText={
            router.pathname === "/verify-account"
              ? "Continue"
              : "Reset password"
          }
          showOption={false}
        />
      )}
    </div>
  );
}



