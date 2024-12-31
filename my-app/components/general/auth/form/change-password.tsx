"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

// const ChangeFormSchema = z.object({
//   password: passwordValidation,
//   confirmPassword: passwordValidation,
// });

const ChangeFormSchema = z.object({
  password: passwordValidation,
  confirmPassword: passwordValidation,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function ChangeForm({ }) {
  const {toast} = useToast()
  const router = useRouter();
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

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetPassword = useMutation(api.users.changePassword);
  async function onSendChangePassword(data: z.infer<typeof ChangeFormSchema>) {
    setIsSubmitting(true);

    try {
      if (data.password !== data.confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
  

      resetPassword({
        userId: router.query.userId as string,
        newPassword: data.password,
      })
        .then(() => {
         void router.push("/Login");
        })
        .catch(() => {
          toast({
            title: "Something happened",
            description: "Try again later !",
            variant: "destructive",
          });
        });
      
        setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Something happened",
        description: "Try again later !",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    setIsButtonDisabled(
      !changedValues.password ||
      !changedValues.confirmPassword ||
      changedValues.password !== changedValues.confirmPassword
    );
  }, [changedValues]);



  return (
    <>
      <Form {...changeForm}>
        <form
          onSubmit={changeForm.handleSubmit(onSendChangePassword)}
          className="relative mt-4 w-full space-y-6  border-t pt-2"
          style={{ borderTop: "none" }}
        >
          <>
            <FormField
              control={changeForm.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="paragraph-color">
                      New Password{" "}
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
                </>
              )}
            />

            <FormField
              control={changeForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="paragraph-color">
                      Confirm Password
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm your password"
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full pr-10 outline-offset-0"
                          style={{ outline: "none" }}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
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
              "Change password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
