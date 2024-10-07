"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp";

// Define the schema for OTP form validation
const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

// Define the props for the OTPForm component
interface OTPFormProps {
  buttonText?: string;
}

export function OTPForm({ buttonText = "Continue" }: OTPFormProps) {
  const router = useRouter();
  const { signUp } = useSignUp();
  const { toast } = useToast();
  const { isLoaded, setActive } = useSignIn();

  // State for button disabled status and form submission
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form using react-hook-form and zod resolver
  const pinForm = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Watch for changes in the pin field
  const pinWatchedValues = pinForm.watch();

  // Handle OTP submission
  async function otpSubmit(data: z.infer<typeof OTPFormSchema>) {
    const code = data.pin;
    if (!isLoaded) return;
    setIsSubmitting(true);

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({ code });

      if (completeSignUp?.status !== "complete") {
        throw new Error("Wrong code");
      }

      await setActive({ session: completeSignUp.createdSessionId });
      await router.push("/onboarding");
    } catch (err) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: err instanceof Error ? err.message : 'Wrong code',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update button disabled state when pin changes
  useEffect(() => {
    setIsButtonDisabled(!pinWatchedValues.pin || pinWatchedValues.pin.length < 6);
  }, [pinWatchedValues.pin]);

  // Determine if the form should show the "or continue with" text
  const showContinueWithText = ["/login", "/create-account"].includes(router.pathname);

  return (
    <Form {...pinForm}>
      <form
        onSubmit={pinForm.handleSubmit(otpSubmit)}
        className={`relative mt-4 w-full space-y-6 ${showContinueWithText ? 'border-t' : ''} pt-2`}
      >
        {showContinueWithText && (
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: "-1rem" }}>
            <p className="paragraph-muted bg-white p-5 py-1 text-sm font-normal">
              or continue with
            </p>
          </div>
        )}

        <FormField
          control={pinForm.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isButtonDisabled}
          className="background-brand background-active w-full text-sm font-medium relative z-50"
        >
          {isSubmitting ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </Form>
  );
}
