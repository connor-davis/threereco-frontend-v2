import {
  getApiUsersOptions,
  getApiUsersQueryKey,
  postApiBusinessesMutation,
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSchema = z.object({
  name: z.string(),
  type: z.enum(["Recycler", "Waste Collector", "Buy Back Centre"]),
  description: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  zipCode: z.string(),
  userId: z.string().uuid(),
});

function Create() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [newUser, setNewUser] = useState<boolean>(false);

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {},
  });

  const {
    data: businessUsers,
    isLoading: isLoadingBusinessUsers,
    isError: isBusinessUsersError,
  } = useQuery({
    ...getApiUsersOptions({
      query: {
        role: "business",
      },
    }),
  });

  const createBusiness = useMutation({
    ...postApiBusinessesMutation(),
    onError: (error) => {
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => {
      return navigate({ to: "/businesses" });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit((values) =>
              createBusiness.mutate({
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
                          <SelectValue placeholder="Select a business user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"--"}>None</SelectItem>
                        {businessUsers?.map((user) => (
                          <SelectItem value={user.id}>{user.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {newUser && (
                    <CreateUserForm
                      role="business"
                      onChanged={(userId) => {
                        queryClient.invalidateQueries({
                          queryKey: getApiUsersQueryKey({
                            query: {
                              role: "business",
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>This is the business name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Recycler", "Waste Collector", "Buy Back Centre"].map(
                        (type) => (
                          <SelectItem value={type}>{type}</SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>This is their role.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the business description
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
                    This is the business phone number
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
                    This is the business address
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
                  <FormDescription>This is the business city</FormDescription>
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
                    This is the business province
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
                    This is the business zip code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Business
            </Button>
          </form>
        </Form>

        <Link to="/businesses">
          <Button variant="outline" className="w-full">
            Back To Businesses
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/businesses/create")({
  component: Create,
});
