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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import RoleGuard from "@/components/guards/role";
import SearchSelect from "@/components/searchSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthenticationStore from "@/lib/state/authentication";
import useUserStore from "@/lib/state/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const collectorUserSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const collectorSchema = z.object({
  firstName: z.string().min(1, "Collector first name can not be empty."),
  lastName: z.string().min(1, "Collector last name can not be empty."),
  idNumber: z
    .string()
    .min(13, "Collector Id Number needs to be 13 characters long.")
    .max(13, "Collector Id Number needs to be 13 characters long."),
  phoneNumber: z
    .string()
    .min(10, "Collector phone number needs to be at least 10 characters long.")
    .max(12, "Collector phone number needs to be at most 12 characters long."),
  address: z.string().min(1, "Collector address can not be empty."),
  city: z.string().min(1, "Collector city can not be empty."),
  province: z.string().min(1, "Collector state can not be empty."),
  zipCode: z.string().min(1, "Collector zip code can not be empty."),
  bankName: z.string().min(1, "Collector bank name can not be empty."),
  bankAccountHolder: z
    .string()
    .min(1, "Collector bank account holder can not be empty."),
  bankAccountNumber: z
    .string()
    .min(1, "Collector bank account number can not be empty."),
});

export default function CreateCollectorPage() {
  const router = useRouter();
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);

  const [openTab, setOpenTab] = useState("account");

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      if (user) {
        const usersResponse = await fetch("/api/users?role=Collector", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (usersResponse.ok) {
          const users = await usersResponse.json();

          setUsers(users);
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user]);

  const collectorUserForm = useForm({
    resolver: zodResolver(collectorUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const collectorForm = useForm({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      phoneNumber: "",
      address: "",
      city: "",
      province: "",
      zipCode: "",
      bankName: "",
      bankAccountHolder: "",
      bankAccountNumber: "",
    },
  });

  const onUserSubmit = async (values) => {
    const userResponse = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, role: "Collector" }),
    });

    if (userResponse.ok) {
      const { id } = await userResponse.json();

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

    const collectorResponse = await fetch("/api/collectors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, userId: userId }),
    });

    if (collectorResponse.ok) {
      toast.success("Success", {
        description: "You have successfully created a collector.",
        duration: 2000,
        onAutoClose: () => {
          router.replace("/collectors");
        },
      });
    } else {
      const errorText = await collectorResponse.text();

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
          <CardTitle className="text-center">Create Collector</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create a collector.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Tabs
            defaultValue={openTab}
            value={openTab}
            onValueChange={setOpenTab}
            className="w-full"
          >
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
              <Form {...collectorUserForm}>
                <form
                  onSubmit={collectorUserForm.handleSubmit(onUserSubmit)}
                  className="space-y-8"
                >
                  {!collectorUserForm.getValues().email && (
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
                  )}

                  <FormField
                    control={collectorUserForm.control}
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
                    control={collectorUserForm.control}
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
              <Form {...collectorForm}>
                <form
                  onSubmit={collectorForm.handleSubmit(onProfileSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={collectorForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors first name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors last name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890123" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors ID number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormDescription>The collectors city.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Province" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors province.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors zip code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors bank name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="bankAccountHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Holder</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors bank account holder.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={collectorForm.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          The collectors bank account number.
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

          <Link href="/collectors">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
