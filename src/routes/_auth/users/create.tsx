import { postApiUsers } from "@/api-client";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  role: z
    .enum(["system_admin", "admin", "staff", "business", "collector"])
    .default("collector"),
});

function Create() {
  const navigate = useNavigate();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "staff",
    },
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    const { error } = await postApiUsers({
      body: values,
    });

    if (error)
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    else navigate({ to: "/users" });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(onSubmit)}
            className="space-y-2"
          >
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

            <FormField
              control={createForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue
                          className="capitalize"
                          placeholder="Select a user role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "system_admin",
                        "admin",
                        "staff",
                        "business",
                        "collector",
                      ].map((role) => (
                        <SelectItem value={role} className="capitalize">
                          {role.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>This is their role.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create User
            </Button>
          </form>
        </Form>

        <Link to="/users">
          <Button variant="outline" className="w-full">
            Back To Users
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/users/create")({
  component: Create,
});
