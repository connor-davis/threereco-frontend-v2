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
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/authentication/login")({
  component: Login,
  validateSearch: z.object({ to: z.string() }),
});

const loginSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g,
      "Please make sure you have entered a valid email address."
    ),
  password: z
    .string()
    .min(8, "Please enter a password with at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(?:.*[\W_]){2,}).{8,}$/g,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and two special characters."
    ),
});

function Login() {
  const { to } = useSearch({
    from: "/authentication/login",
  });
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    headers.set("Access-Control-Allow-Credentials", "true");

    const loginResponse = await fetch("/api/authentication/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers,
    });

    const loginStatus = loginResponse.status;

    if (loginStatus === 200) {
      toast.success("Success", {
        description: "You have successfully authenticated.",
        duration: 2000,
      });

      return navigate({ to });
    } else {
      try {
        const responseText = await loginResponse.text();
        const responseJSON = JSON.parse(responseText);

        return toast.error(loginResponse.statusText, {
          description: responseJSON.message,
          duration: 2000,
        });
      } catch (error) {
        const responseText = await loginResponse.text();

        return toast.error("Unknown Error", {
          description: responseText,
          duration: 2000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col w-full p-5 space-y-5 lg:max-w-lg">
        <div className="flex flex-col items-center justify-center w-full space-y-3">
          <Label className="text-2xl text-primary">Login</Label>
          <Label className="text-muted-foreground">
            Please enter your login details below.
          </Label>
        </div>

        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="flex flex-col w-full h-auto space-y-3"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>This is your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription>This is your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Continue</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
