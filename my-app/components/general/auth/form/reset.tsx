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

const ResetFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type ResetFormProps = {
  func: (email: string) => void;
};

export function ResetForm({ func }: ResetFormProps) {
  const { toast } = useToast();
  
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
      func(data.email);
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "Failed to send reset password email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    setIsButtonDisabled(!resetWatchedValues.email);
  }, [resetWatchedValues]);

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
                Sending...
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
