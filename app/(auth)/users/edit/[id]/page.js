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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Roles from "@/lib/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  role: z.enum(Roles),
});

export default function EditUserPage({ params: { id } }) {
  const router = useRouter();

  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["users", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const userResponse = await fetch("/api/users?id=" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (userResponse.status !== 200) {
          return reject("Failed to fetch user");
        }

        const data = await userResponse.json();

        resolve(data);
      });
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (data) {
        userForm.reset(data);
      }
    }, 0);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [data]);

  const onUserSubmit = async (values) => {
    const userResponse = await fetch("/api/users?id=" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (userResponse.ok) {
      toast.success("Success", {
        description: "You have successfully edited a user.",
        duration: 2000,
        onAutoClose: () => {
          router.replace("/users");
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
          <CardTitle className="text-center">Edit User</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create a user.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(onUserSubmit)}
              className="space-y-8"
            >
              <FormField
                control={userForm.control}
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
                control={userForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Roles.map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Their 3rEco role.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update User
              </Button>
            </form>
          </Form>

          <Link href="/users">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
