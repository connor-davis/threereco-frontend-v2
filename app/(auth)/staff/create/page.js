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

const staffSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function CreateStaffPage() {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  const staffForm = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onStaffSubmit = async (values) => {
    const userResponse = await fetch("/api/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, role: "Staff" }),
    });

    if (userResponse.ok) {
      toast.success("Success", {
        description: "You have successfully created a staff.",
        duration: 2000,
        onAutoClose: () => {
          router.replace("/staff");
        },
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full shadow-none max-w-96">
        <CardHeader>
          <CardTitle className="text-center">Create Staff</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create a staff.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Form {...staffForm}>
            <form
              onSubmit={staffForm.handleSubmit(onStaffSubmit)}
              className="space-y-8"
            >
              <FormField
                control={staffForm.control}
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
                control={staffForm.control}
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
                Create Staff
              </Button>
            </form>
          </Form>

          <Link href="/staff">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
