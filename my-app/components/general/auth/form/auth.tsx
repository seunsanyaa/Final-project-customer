"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";

import { useToast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "../../../ui/input";

// Password validation schema
const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters." })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  });

// Form schema for authentication
const AuthFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: passwordValidation, // Use the password validation schema
});

// Custom error interface for type checking
interface CustomError {
  errors: { message: string }[];
}

// Main InputForm component
export function InputForm({
  passwordField = true,
  buttonText = "Continue",
  showOption = true,
}) {
  const router = useRouter();
  const {toast }= useToast()
  const { isLoaded: signupLoaded, signUp } = useSignUp();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [verifying, setVerifying] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();

  const authForm = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authWatchedValues = authForm.watch();

  // Function to sign up with email
  const signUpWithEmail = async ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => {
    if (!signupLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });
      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      void router.push(`/verify-account?email=${emailAddress}`);
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const errorMessage =
          err?.errors[0]?.message ?? "An unknown error occurred";
        toast({
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.error("An unexpected error occurred:", err);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Contact us as soon as possible!",
          variant: "destructive",
        });
      }
    }
  };

  // Function to sign in with email
  const signInWithEmail = async ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn?.create({
        identifier: emailAddress,
        password,
      });
      if (result?.status === "complete") {
        await setActive?.({
          session: result?.createdSessionId ?? "defaultSessionId",
        });

        // await router.push("/");
      } else {
        return;
      }
    } catch (err: unknown) {
      if (isCustomError(err)) {
        const errorMessage =
          err?.errors[0]?.message ?? "An unknown error occurred";
        toast({
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
          variant: "destructive",
          dir: "top",
        });
      } else {
        // Handle other types of errors (optional)
        console.error("An unexpected error occurred:", err);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Contact us as soon as possible!",
          variant: "destructive",
        });
      }
    }
  };

  // Form submission handler
  async function onSubmit(data: z.infer<typeof AuthFormSchema>) {
    setIsSubmitting(true);
    try {
      if (router.pathname === "/login") {
        await signInWithEmail({
          emailAddress: data.email,
          password: data.password,
        });
      } else {
        await signUpWithEmail({
          emailAddress: data.email,
          password: data.password,
        });
      }
    } catch (err) {
      console.error("Error during form submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Type guard for custom error
  function isCustomError(err: unknown): err is CustomError {
    if (
      typeof err === "object" &&
      err !== null &&
      "errors" in err &&
      Array.isArray((err as CustomError).errors) &&
      (err as CustomError).errors.length > 0
    ) {
      const firstError = (err as CustomError).errors[0];
      return (
        typeof firstError === "object" &&
        firstError !== null &&
        "message" in firstError
      );
    }
    return false;
  }

  // Effect to disable button based on form values
  useEffect(() => {
    setIsButtonDisabled(
      !authWatchedValues.email || (passwordField && !authWatchedValues.password)
    );
  }, [authWatchedValues, passwordField]);

  return (
    <Form {...authForm}>
      <form
        onSubmit={authForm.handleSubmit(onSubmit)}
        className="relative mt-4 w-full space-y-6 pt-2"
        style={
          router.pathname === "/login" || router.pathname === "/create-account"
            ? {}
            : { borderTop: "none" }
        }
      >
        {/* Conditional rendering for "or continue with" text */}
        {(router.pathname === "/login" || router.pathname === "/create-account") && (
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: "-1rem" }}>
            <p className="paragraph-muted bg-white p-5 py-1 text-sm font-normal">
              or continue with
            </p>
          </div>
        )}

        {/* Email input field */}
        <FormField
          control={authForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-color">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email address"
                  {...field}
                  className="w-full"
                  style={{ outline: "none" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password input field */}
        {passwordField && (
          <FormField
            control={authForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-color">
                  <div className="flex items-center justify-between">
                    <span>Password</span>
                    {router.pathname === "/login" && (
                      <Link href="/reset-password">
                        <p className="paragraph-color text-right text-sm font-normal underline">
                          Forgot password?
                        </p>
                      </Link>
                    )}
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="w-full pr-10 outline-offset-0"
                      style={{ outline: "none" }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isButtonDisabled}
          className="background-brand background-active relative z-50 w-full text-sm font-medium"
        >
          {isSubmitting ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            buttonText
          )}
        </Button>

        {/* Conditional rendering for login/signup options */}
        {showOption && (
          <p className="text-center text-sm font-normal">
            {router.pathname === "/login" ? (
              <>
                Don't have an account?
                <Link href="/create-account">
                  <span className="text-brand text-sm font-medium"> Create an account </span>
                </Link>
              </>
            ) : (
              <>
                Already have an account?
                <Link href="/login">
                  <span className="text-brand text-sm font-medium"> Sign in </span>
                </Link>
              </>
            )}
          </p>
        )}
      </form>
    </Form>
  );
}