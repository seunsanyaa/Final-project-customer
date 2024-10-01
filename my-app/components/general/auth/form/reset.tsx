"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { Input } from "../../../ui/input";


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

const ResetFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type ResetFormProps = {
  func: (email: string) => void;
};

export function ResetForm({ func }: ResetFormProps) {
  const {toast} = useToast()
  const resetForm = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetWatchedValues = resetForm.watch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSendResetEmail(data: z.infer<typeof ResetFormSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        func(data.email);
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "This email is not in our database",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.log("Error:", JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    setIsButtonDisabled(!resetWatchedValues.email);
  }, [, resetWatchedValues]);

  return (
    <>
      <Form {...resetForm}>
        <form
          onSubmit={resetForm.handleSubmit(onSendResetEmail)}
          className="relative mt-4 w-full space-y-6  border-t pt-2"
          style={{ borderTop: "none" }}
        >
          <>
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <>
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
                </>
              )}
            />
          </>

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className="background-brand background-active w-full text-sm font-medium"
          >
            {isSubmitting ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />

              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
