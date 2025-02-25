import { putApiAuthenticationPasswordResetMutation } from "@/api-client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetSchema = z.object({
  code: z
    .string()
    .min(6, "Please make sure you provide a valid 6-digit MFA code.")
    .max(6, "Please make sure you provide a valid 6-digit MFA code."),
  password: z
    .string()
    .min(8, "Please enter a password with at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(?:.*[\W_]){2,}).{8,}$/g,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and two special characters."
    ),
  userId: z.string().uuid(),
});

export default function PasswordResetDialog({
  userId = undefined,
}: {
  userId: string | undefined;
}) {
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      userId,
    },
  });

  const resetPassword = useMutation({
    ...putApiAuthenticationPasswordResetMutation(),
    onError: (error) =>
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      }),
    onSuccess: () =>
      toast.success("Success", {
        description: "The password has been reset.",
        duration: 2000,
      }),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Reset Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Password Reset</DialogTitle>
        <DialogDescription>
          Please enter the required information below to reset the user's
          password.
        </DialogDescription>

        <div className="flex flex-col w-full h-auto space-y-8">
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit((values) =>
                resetPassword.mutate({
                  body: values,
                })
              )}
            >
              <FormField
                control={resetForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MFA Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="bg-background" />
                          <InputOTPSlot index={1} className="bg-background" />
                          <InputOTPSlot index={2} className="bg-background" />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} className="bg-background" />
                          <InputOTPSlot index={4} className="bg-background" />
                          <InputOTPSlot index={5} className="bg-background" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>Your MFA Code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The new password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
