import {
  getApiBusinessesByIdOptions,
  getApiUsersOptions,
  getApiUsersQueryKey,
  putApiBusinessesByIdMutation,
} from "@/api-client/@tanstack/react-query.gen";
import CreateUserForm from "@/components/forms/create-user";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editSchema = z.object({
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

function Edit() {
  const params = useParams({ from: "/_auth/businesses/edit/$id" });
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [newUser, setNewUser] = useState<boolean>(false);

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

  const {
    data: business,
    isLoading: isLoadingBusiness,
    isError: isBusinessError,
  } = useQuery({
    ...getApiBusinessesByIdOptions({
      path: {
        id: params.id,
      },
    }),
  });

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
  });

  const editBusiness = useMutation({
    ...putApiBusinessesByIdMutation(),
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

  useEffect(() => {
    const disposeable = setTimeout(() => editForm.reset(business), 0);

    return () => clearTimeout(disposeable);
  }, [business]);

  if (isLoadingBusiness)
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
            onSubmit={editForm.handleSubmit((values) =>
              editBusiness.mutate({
                body: values,
                path: {
                  id: params.id,
                },
              })
            )}
            className="space-y-2"
          >
            <FormField
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              control={editForm.control}
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
              Edit Business
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
export const Route = createFileRoute("/_auth/businesses/edit/$id")({
  component: Edit,
});
