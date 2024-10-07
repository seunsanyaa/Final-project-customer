import { useRouter } from "next/router";
import { InputForm } from "./form/auth";
import { SignInOAuthButtons } from "./social_buttons";

// Define the content for each route
const routeContent = {
  "/login": {
    title: "Welcome back",
    description: "Enter your details to sign in",
  },
  "/create-account": {
    title: "Create an account",
    description: "Register your account to get started",
  },
  "/reset-password": {
    title: "Reset Password",
    description: "Enter your user account's verified email address and we will send you a password reset link.",
  },
  "/verify-account": {
    title: "Verify your email address",
    description: "We've sent a code to your email.",
  },
  default: {
    title: "Password reset link sent",
    description: "The link to reset your password has been sent to your verified email address. Please follow the instructions provided.",
  },
};

export default function LoginComponent() {
  const router = useRouter();

  // Render the content based on the current route
  const renderContent = (pathname: string) => {
    const content = routeContent[pathname as keyof typeof routeContent] || routeContent.default;
    
    return (
      <>
        <h2 className="paragraph-color pt-8 text-2xl font-semibold">
          {content.title}
        </h2>
        <p className="paragraph-muted text-base font-normal pb-4">
          {pathname === "/verify-account"
            ? `We've sent a code to ${router.query.email}.`
            : content.description}
        </p>
      </>
    );
  };

  // Determine if the current route is for login or create account
  const isLoginOrCreateAccount = ["/login", "/create-account"].includes(router.pathname);

  return (
    <div className="flex basis-1/2 flex-col px-32 pt-24">
      <h1 className="text-3xl font-bold">CAR RENTAL</h1>

      {renderContent(router.pathname)}

      {isLoginOrCreateAccount ? (
        <>
          <SignInOAuthButtons />
          <InputForm />
        </>
      ) : (
        <InputForm
          passwordField={false}
          buttonText={router.pathname === "/verify-account" ? "Continue" : "Reset password"}
          showOption={false}
        />
      )}
    </div>
  );
}



