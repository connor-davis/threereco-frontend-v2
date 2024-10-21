import { postApiUsersMutation } from "@/api-client/@tanstack/react-query.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const createSchema = z.object({
  email: z
    .string()
    .max(
      100,
      "Please make sure you enter an email that is less than 100 characters long."
    )
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g,
      "Please ensure that you have entered a valid email."
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one digit.",
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
});

export default function CreateUserForm({
  role = "collector",
  onChanged,
}: {
  role: "system_admin" | "admin" | "staff" | "business" | "collector";
  onChanged: (userId: string) => void;
}) {
  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const createUser = useMutation({
    ...postApiUsersMutation(),
    onError: (error) => {
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: (data) => onChanged(data.id),
  });

  return (
    <Form {...createForm}>
      <form className="space-y-2">
        <FormField
          control={createForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>This is their email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={createForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>This is their password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          className="w-full"
          onClick={() =>
            createUser.mutate({
              body: { ...createForm.getValues(), role },
            })
          }
        >
          Create User
        </Button>
      </form>
    </Form>
  );
}
