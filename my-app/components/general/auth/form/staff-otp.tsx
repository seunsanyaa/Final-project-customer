"use client";

import { useSignUp } from "@clerk/nextjs";
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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp";

const OTPFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function StaffOTPForm() {
  const router = useRouter();
  const { signUp, setActive } = useSignUp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { email, firstName, lastName } = router.query;

  const updateStaffUserId = useMutation(api.staff.updateStaffUserId);
  const createStaffUser = useMutation(api.users.createStaffUser);

  const pinForm = useForm<z.infer<typeof OTPFormSchema>>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const pinWatchedValues = pinForm.watch();

  useEffect(() => {
    setIsButtonDisabled(
      !pinWatchedValues.pin || pinWatchedValues.pin.length < 6
    );
  }, [pinWatchedValues]);

  async function otpSubmit(data: z.infer<typeof OTPFormSchema>) {
    const code = data.pin;
    if (!signUp || !email || typeof email !== 'string' || 
        !firstName || typeof firstName !== 'string' || 
        !lastName || typeof lastName !== 'string') {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp?.status !== "complete") {
        toast({
          title: "Error",
          description: 'Invalid verification code',
          variant: "destructive",
        });
        return;
      }

      if (completeSignUp?.status === "complete") {
        // First create staff user in Convex with firstName and lastName
        await createStaffUser({
          userId: completeSignUp.createdUserId || '',
          email,
          firstName,
          lastName
        });

        // Then update staff table with the userId
        await updateStaffUserId({
          email,
          userId: completeSignUp.createdUserId || ''
        });

        // Finally set the active session
        await setActive({ session: completeSignUp.createdSessionId });

        // Redirect to dashboard after successful verification
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: 'Invalid verification code',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>
    </Form>
  );
} 