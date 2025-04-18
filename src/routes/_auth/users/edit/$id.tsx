import { putApiUsersById } from "@/api-client";
import { getApiUsersByIdOptions } from "@/api-client/@tanstack/react-query.gen";
import RoleGuard from "@/components/guards/role";
import Spinner from "@/components/spinners/spinner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editSchema = z.object({
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
  role: z
    .enum(["system_admin", "admin", "staff", "business", "collector"])
    .default("collector"),
  mfaEnabled: z.boolean(),
});

function Edit() {
  const params = useParams({ from: "/_auth/users/edit/$id" });
  const navigate = useNavigate();

  const [isDone, setIsDone] = useState<boolean>(true);

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useQuery({
    ...getApiUsersByIdOptions({
      path: {
        id: params.id,
      },
    }),
  });

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    const disposeable = setTimeout(() => {
      editForm.reset(user);
    }, 0);

    return () => clearTimeout(disposeable);
  }, [user]);

  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    setIsDone(false);

    const { error } = await putApiUsersById({
      body: values,
      path: {
        id: params.id,
      },
    });

    setIsDone(true);

    if (error)
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    else navigate({ to: "/users" });
  };

  if (isLoadingUser)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner className="size-4" />
          <Label>Loading user.</Label>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={editForm.control}
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

            <RoleGuard requiredRoles={["system_admin", "admin"]}>
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
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
            </RoleGuard>

            <RoleGuard requiredRoles={["system_admin", "admin"]}>
              <FormField
                control={editForm.control}
                name="mfaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable MFA</FormLabel>
                      <FormDescription>
                        Set whether this user has MFA enabled.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </RoleGuard>

            <Button type="submit" className="w-full" disabled={!isDone}>
              {!isDone && <Loader2 className="size-4 animate-spin" />}
              Edit User
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
export const Route = createFileRoute("/_auth/users/edit/$id")({
  component: Edit,
});
