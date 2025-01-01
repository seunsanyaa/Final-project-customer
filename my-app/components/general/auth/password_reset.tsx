import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useToast } from "@/hooks/use-toast";
import { OTPForm } from "./form/otp";

const EmailSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

const PasswordSchema = z.object({
  password: z.string()
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
    }),
});

export default function PasswordResetComponent() {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded, signIn, setActive } = useSignIn();

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Send the password reset code to the user's email
  async function create(data: z.infer<typeof EmailSchema>) {
    if (!isLoaded) return;
    
    setIsSubmitting(true);
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      
      setEmail(data.email);
      setSuccessfulCreation(true);
      passwordForm.reset();
      
      toast({
        title: "Code sent!",
        description: "Check your email for the password reset code",
        variant: "default",
      });
    } catch (err: any) {
      console.error("error", err?.errors?.[0]?.longMessage);
      toast({
        title: "Error",
        description: err?.errors?.[0]?.longMessage || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle verification code submission
  const handleVerification = async (code: string) => {
    const password = passwordForm.getValues().password;
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result?.status === "needs_second_factor") {
        setSecondFactor(true);
        toast({
          title: "2FA Required",
          description: "Two-factor authentication is required for this account",
          variant: "default",
        });
      } else if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        router.push("/");
        toast({
          title: "Success!",
          description: "Your password has been reset successfully",
          variant: "default",
        });
      }
    } catch (err: any) {
      console.error("error", err?.errors?.[0]?.longMessage);
      toast({
        title: "Error",
        description: err?.errors?.[0]?.longMessage || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex basis-1/2 flex-col px-32 pt-24">
      <h2 className="paragraph-color pt-8 text-2xl font-semibold">
        Reset Password
      </h2>
      <p className="paragraph-muted pb-4 text-base font-normal">
        {!successfulCreation
          ? "Enter your email address and we'll send you a code to reset your password."
          : `Enter the code sent to ${email} and your new password.`}
      </p>

      {!successfulCreation ? (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(create)} className="space-y-6">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <Form {...passwordForm}>
            <form className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your new password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <OTPForm
            mode="reset"
            onVerify={handleVerification}
            buttonText="Reset Password"
          />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setSuccessfulCreation(false);
              setEmail("");
              emailForm.reset();
              passwordForm.reset();
            }}
          >
            Back to Email Entry
          </Button>
        </div>
      )}

      {secondFactor && (
        <p className="mt-4 text-center text-sm text-red-500">
          2FA is required for this account. Please use the regular login flow.
        </p>
      )}
    </div>
  );
}
