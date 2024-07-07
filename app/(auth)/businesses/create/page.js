"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RoleGuard from "@/components/guards/role";
import SearchSelect from "@/components/searchSelect";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAuthenticationStore from "@/lib/state/authentication";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/state/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const businessUserSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const businessSchema = z.object({
  business_name: z.string().min(1, "Business name can not be empty."),
  business_type: z.string().min(1, "Business type can not be empty."),
  business_description: z
    .string()
    .min(1, "Business description can not be empty.")
    .max(255, "Business description must be less than 255 characters."),
  phone_number: z.string().min(1, "Business phone number can not be empty."),
  address: z.string().min(1, "Business address can not be empty."),
  city: z.string().min(1, "Business city can not be empty."),
  state: z.string().min(1, "Business state can not be empty."),
  zip_code: z.string().min(1, "Business zip code can not be empty."),
});

export default function CreateBusinessPage() {
  const router = useRouter();
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      if (user) {
        const usersResponse = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (usersResponse.ok) {
          const { users } = await usersResponse.json();

          setUsers(users);
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user]);

  const businessUserForm = useForm({
    resolver: zodResolver(businessUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const businessForm = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      business_name: "",
      business_type: "",
      business_description: "",
      phone_number: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  const onUserSubmit = async (values) => {
    const userResponse = await fetch("/api/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, role: "Business" }),
    });

    if (userResponse.ok) {
      const {
        user: { id },
      } = await userResponse.json();

      setUserId(id);

      toast.success("Success", {
        description: "You have successfully created a user.",
        duration: 2000,
      });
    } else {
      const errorText = await userResponse.text();

      try {
        const { error, reason } = JSON.parse(errorText);

        toast.error(error, {
          description: reason,
          duration: 2000,
        });
      } catch {
        toast.error("Error", {
          description: "An unknown error occurred.",
          duration: 2000,
        });
      }
    }
  };

  const onProfileSubmit = async (values) => {
    if (!userId) {
      return toast.error("Error", {
        description: "Please create and link a user account first.",
        duration: 2000,
      });
    }

    const businessResponse = await fetch("/api/business/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, user_id: userId }),
    });

    if (businessResponse.ok) {
      toast.success("Success", {
        description: "You have successfully created a business.",
        duration: 2000,
        onAutoClose: () => {
          router.replace("/businesses");
        },
      });
    } else {
      const errorText = await businessResponse.text();

      try {
        const { error, reason } = JSON.parse(errorText);

        toast.error(error, {
          description: reason,
          duration: 2000,
        });
      } catch {
        toast.error("Error", {
          description: "An unknown error occurred.",
          duration: 2000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full shadow-none max-w-96">
        <CardHeader>
          <CardTitle className="text-center">Create Business</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create a business.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                value="account"
                className="w-full data-[state=active]:shadow-none"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="w-full data-[state=active]:shadow-none"
              >
                Profile
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Form {...businessUserForm}>
                <form
                  onSubmit={businessUserForm.handleSubmit(onUserSubmit)}
                  className="space-y-8"
                >
                  <RoleGuard requiredRoles={["System Admin", "Staff"]}>
                    <div className="flex flex-col space-y-8">
                      <div className="flex flex-col space-y-3">
                        <Label>Existing User</Label>
                        <SearchSelect
                          list={users}
                          valueKey="id"
                          labelKey="email"
                          onValueChange={(value) => setUserId(value)}
                        />
                        <Label className="text-sm text-muted-foreground">
                          Select an existing user to create a business.
                        </Label>
                      </div>

                      <Label className="text-center text-muted-foreground">
                        Or
                      </Label>
                    </div>
                  </RoleGuard>

                  <FormField
                    control={businessUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="user@domain.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Their 3rEco account email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessUserForm.control}
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
                          Their 3rEco account password.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="profile">
              <Form {...businessForm}>
                <form
                  onSubmit={businessForm.handleSubmit(onProfileSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={businessForm.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="3rEco" {...field} />
                        </FormControl>
                        <FormDescription>The businesses name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="business_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
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
                            <SelectItem value="Recycler">Recycler</SelectItem>
                            <SelectItem value="Waste Collector">
                              Waste Collector
                            </SelectItem>
                            <SelectItem value="Buy Back Centre">
                              Buy Back Centre
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The businesses type of business.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="business_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Recycling business"
                            {...field}
                          ></Textarea>
                        </FormControl>
                        <FormDescription>
                          The businesses description.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormDescription>
                          The businesses phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 Main St" {...field} />
                        </FormControl>
                        <FormDescription>
                          The businesses address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormDescription>The businesses city.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Province" {...field} />
                        </FormControl>
                        <FormDescription>
                          The businesses province.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={businessForm.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormDescription>
                          The businesses zip code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Create Profile
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <Link href="/businesses">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
