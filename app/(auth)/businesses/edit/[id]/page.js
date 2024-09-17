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
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const businessUserSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const businessSchema = z.object({
  name: z.string().min(1, "Business name can not be empty."),
  type: z.string().min(1, "Business type can not be empty."),
  description: z
    .string()
    .min(1, "Business description can not be empty.")
    .max(255, "Business description must be less than 255 characters."),
  phoneNumber: z.string().min(1, "Business phone number can not be empty."),
  address: z.string().min(1, "Business address can not be empty."),
  city: z.string().min(1, "Business city can not be empty."),
  province: z.string().min(1, "Business state can not be empty."),
  zipCode: z.string().min(1, "Business zip code can not be empty."),
});

export default function EditBusinessPage({ params: { id } }) {
  const router = useRouter();

  const [userId, setUserId] = useState(null);

  // Access the client
  const queryClient = useQueryClient();

  const [openTab, setOpenTab] = useState("account");

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["businesses", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessesResponse = await fetch("/api/businesses?id=" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (businessesResponse.status !== 200) {
          return reject("Failed to fetch business");
        }

        const data = await businessesResponse.json();

        resolve(data);
      });
    },
  });

  const businessUserForm = useForm({
    resolver: zodResolver(businessUserSchema),
    defaultValues: {
      email: "",
    },
  });

  const businessForm = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      phoneNumber: "",
      address: "",
      city: "",
      province: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (data) {
        businessForm.reset(data);

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
          },
        });

        if (userResponse.status === 200) {
          const user = await userResponse.json();

          businessUserForm.reset({ email: user.email });
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [userId]);

  const onUserSubmit = async (values) => {
    const userResponse = await fetch("/api/users?id=" + userId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const businessResponse = await fetch("/api/businesses?id=" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (businessResponse.ok) {
      toast.success("Success", {
        description: "You have successfully edited a business.",
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
          <CardTitle className="text-center">Edit Business</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to edit the business.
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
              <Form {...businessUserForm}>
                <form
                  onSubmit={businessUserForm.handleSubmit(onUserSubmit)}
                  className="space-y-8"
                >
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

                  <Button type="submit" className="w-full">
                    Update Account
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
                    name="name"
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
                    name="type"
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
                    name="description"
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
                    name="phoneNumber"
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
                    name="province"
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
                    name="zipCode"
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
                    Update Profile
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
