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

const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type OTPFormProps = {
  buttonText?: string;
  onVerify?: (code: string) => Promise<void>;
  mode?: 'signup' | 'reset';
};

export function OTPForm({
  buttonText = "Continue",
  onVerify,
  mode = 'signup'
}: OTPFormProps) {
  const router = useRouter();
  const { signUp } = useSignUp();
  const { toast } = useToast();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoaded, setActive } = useSignIn();

  const pinForm = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const pinWatchedValues = pinForm.watch();

  async function otpSubmit(data: z.infer<typeof OTPFormSchema>) {
    const code = data.pin;
    if (!isLoaded) return;
    setIsSubmitting(true);
    
    try {
      if (mode === 'signup') {
        const completeSignUp = await signUp?.attemptEmailAddressVerification({
          code,
        });
        
        if (completeSignUp?.status !== "complete") {
          toast({
            title: "Uh oh! Something went wrong.",
            description: 'Wrong code',
            variant: "destructive",
          });
        }

        if (completeSignUp?.status === "complete") {
          await setActive({ session: completeSignUp?.createdSessionId });
          await router.push("/onboarding");
        }
      } else if (mode === 'reset' && onVerify) {
        await onVerify(code);
      }
    } catch (err) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: 'Wrong code',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    setIsButtonDisabled(!pinWatchedValues.pin || pinWatchedValues.pin.length < 6);
  }, [pinWatchedValues]);

  return (
    <Form {...pinForm}>
      <form
        onSubmit={pinForm.handleSubmit(otpSubmit)}
        className="relative mt-4 w-full space-y-6 border-t pt-2"
        style={{ borderTop: "none" }}
      >
        <FormField
          control={pinForm.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
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
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : buttonText}
        </Button>
      </form>
    </Form>
  );
}
