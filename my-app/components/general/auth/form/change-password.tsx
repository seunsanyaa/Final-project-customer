"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
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

// Form schema with password matching validation
const ChangeFormSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ChangeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const resetPassword = useMutation(api.auth.resetPassword);

  // Form initialization
  const changeForm = useForm<z.infer<typeof ChangeFormSchema>>({
    resolver: zodResolver(ChangeFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const changedValues = changeForm.watch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  async function onSendChangePassword(data: z.infer<typeof ChangeFormSchema>) {
    setIsSubmitting(true);

    try {
      await resetPassword({
        newPassword: data.password,
        token: router.query.token as string,
      });
      
      toast({
        title: "Password changed successfully",
        description: "You can now log in with your new password.",
        variant: "success",
      });
      
      void router.push("/login");
    } catch (err) {
      toast({
        title: "Error changing password",
        description: err instanceof Error ? err.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Disable submit button if passwords don't match or are empty
  const isButtonDisabled = useMemo(() => {
    return (
      !changedValues.password ||
      !changedValues.confirmPassword ||
      changedValues.password !== changedValues.confirmPassword
    );
  }, [changedValues]);

  // Render password input field
  const renderPasswordField = (
    name: "password" | "confirmPassword",
    label: string,
    showPasswordState: boolean,
    setShowPasswordState: (value: boolean) => void
  ) => (
    <FormField
      control={changeForm.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="paragraph-color">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={`${name === "password" ? "Enter" : "Confirm"} your password`}
                {...field}
                type={showPasswordState ? "text" : "password"}
                className="w-full pr-10 outline-offset-0"
                style={{ outline: "none" }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPasswordState(!showPasswordState);
                }}
              >
                {showPasswordState ? (
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
  );

  return (
    <Form {...changeForm}>
      <form
        onSubmit={changeForm.handleSubmit(onSendChangePassword)}
        className="relative mt-4 w-full space-y-6 pt-2"
      >
        {renderPasswordField("password", "New Password", showPassword, setShowPassword)}
        {renderPasswordField("confirmPassword", "Confirm Password", showConfirmPassword, setShowConfirmPassword)}

        <Button
          type="submit"
          disabled={isButtonDisabled || isSubmitting}
          className="background-brand background-active w-full text-sm font-medium"
        >
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Changing password...
            </>
          ) : (
            "Change password"
          )}
        </Button>
      </form>
    </Form>
  );
}