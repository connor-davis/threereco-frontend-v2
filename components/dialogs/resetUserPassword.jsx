"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UnlockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Input } from "../ui/input";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

const passwordResetSchema = z.object({
  code: z.string().min(6).max(6),
  password: z.string().min(8),
});

export default function ResetUserPasswordModal({ userId }) {
  const [open, setOpen] = useState(false);

  const passwordResetForm = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const verifyAndReset = async (values) => {
    const resetResponse = await fetch("/api/authentication/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      credentials: "include",
      body: JSON.stringify({ ...values, userId }),
    });

    if (resetResponse.ok) {
      passwordResetForm.reset();
      setOpen(false);

      return toast.success("Success", {
        description: "You have successfully reset the users password",
        duration: 2000,
      });
    } else {
      const errorText = await resetResponse.text();

      try {
        const { error, reason } = JSON.parse(errorText);

        return toast.error(error, {
          description: reason,
          duration: 2000,
        });
      } catch {
        return toast.error("An error occurred", {
          description: "Please try again later.",
          duration: 2000,
        });
      }
    }
  };

  return (
    <Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <UnlockIcon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Password Reset</DialogTitle>
            <DialogDescription>
              Please enter the users new password below and verify with your MFA
              code.
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordResetForm}>
            <form
              onSubmit={passwordResetForm.handleSubmit(verifyAndReset)}
              className="space-y-8"
            >
              <FormField
                control={passwordResetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="SuperSecurePassword"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The users new 3rEco password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordResetForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MFA Code</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription>Your 3rEco MFA Code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <TooltipContent side="bottom">Reset Password</TooltipContent>
    </Tooltip>
  );
}
