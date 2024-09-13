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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthenticationStore from "@/lib/state/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const collectorUserSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
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

export default function EditBusinessPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  const [userId, setUserId] = useState(null);

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["collectors", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const collectorResponse = await fetch("/api/collectors?id=" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (collectorResponse.status !== 200) {
          return reject("Failed to fetch collector");
        }

        const data = await collectorResponse.json();

        resolve(data);
      });
    },
  });

  const collectorUserForm = useForm({
    resolver: zodResolver(collectorUserSchema),
    defaultValues: {
      email: "",
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

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (data) {
        collectorForm.reset(data);

        setUserId(data.userId);
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [data]);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      if (userId) {
        const userResponse = await fetch("/api/users?id=" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.status === 200) {
          const user = await userResponse.json();

          collectorUserForm.reset({ email: user.email });
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [userId]);

  const onUserSubmit = async (values) => {
    const userResponse = await fetch("/api/users?id=" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (userResponse.ok) {
      toast.success("Success", {
        description: "You have successfully edited a user.",
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
    const collectorResponse = await fetch("/api/collectors?id=" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (collectorResponse.ok) {
      toast.success("Success", {
        description: "You have successfully edited a collector.",
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
          <CardTitle className="text-center">Edit Collector</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to edit the collector.
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
              <Form {...collectorUserForm}>
                <form
                  onSubmit={collectorUserForm.handleSubmit(onUserSubmit)}
                  className="space-y-8"
                >
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

                  <Button type="submit" className="w-full">
                    Update Account
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
                    Update Profile
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
