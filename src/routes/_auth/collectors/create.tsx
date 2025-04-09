import {
  getApiUsersOptions,
  getApiUsersQueryKey,
  postApiCollectorsMutation,
} from "@/api-client/@tanstack/react-query.gen";
import CreateUserForm from "@/components/forms/create-user";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  idNumber: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  zipCode: z.string(),
  bankName: z.string(),
  bankAccountHolder: z.string(),
  bankAccountNumber: z.string(),
  trackerCode: z
    .string()
    .nullable()
    .optional(),
  userId: z.string().uuid(),
});

function Create() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [newUser, setNewUser] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(true);

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {},
  });

  const {
    data: collectorUsers,
    isLoading: isLoadingCollectorUsers,
    isError: isCollectorUsersError,
  } = useQuery({
    ...getApiUsersOptions({
      query: {
        usePaging: "false",
        role: "collector",
      },
    }),
  });

  const createCollector = useMutation({
    ...postApiCollectorsMutation(),
    onMutate: () => setIsDone(false),
    onError: (error) => {
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => {
      setIsDone(true);

      return navigate({ to: "/collectors" });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit((values) =>
              createCollector.mutate({
                body: values,
              })
            )}
            className="space-y-2"
          >
            <FormField
              control={createForm.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>

                  {!newUser && (
                    <Select
                      onValueChange={(value) =>
                        value !== "--"
                          ? field.onChange(value)
                          : field.onChange(null)
                      }
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a collector user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"--"}>None</SelectItem>
                        {collectorUsers?.map((user) => (
                          <SelectItem value={user.id}>{user.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {newUser && (
                    <CreateUserForm
                      role="collector"
                      onChanged={(userId) => {
                        queryClient.invalidateQueries({
                          queryKey: getApiUsersQueryKey({
                            query: {
                              role: "collector",
                            },
                          }),
                        });

                        field.onChange(userId);

                        setNewUser(false);
                      }}
                    />
                  )}

                  <div className="flex items-center w-full h-auto space-x-2">
                    <Switch checked={newUser} onCheckedChange={setNewUser} />
                    <Label>New User?</Label>
                  </div>
                  <FormDescription>This is the business user</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="First Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector first name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector last name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="ID Number" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector id number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Address" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="City" {...field} />
                  </FormControl>
                  <FormDescription>This is the collector city</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Province" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector province
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Zip Code" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector zip code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Bank Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collector bank name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="bankAccountHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Holder</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Bank Account Holder"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the collector bank account holder
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Bank Account Number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the collector bank account number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="trackerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracker Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tracker Code"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the collector tracker code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={!isDone}>
              {!isDone && <Loader2 className="size-4 animate-spin" />}
              Create Collector
            </Button>
          </form>
        </Form>

        <Link to="/collectors">
          <Button variant="outline" className="w-full">
            Back To Collectors
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/collectors/create")({
  component: Create,
});
