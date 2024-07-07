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

import RoleGuard from "@/components/guards/role";
import SearchSelect from "@/components/searchSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthenticationStore from "@/lib/state/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const staffSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function EditStaffPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const userResponse = await fetch("/api/users/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.status !== 200) {
          return reject("Failed to fetch staff");
        }

        const data = await userResponse.json();

        resolve(data.user);
      });
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (data) {
        staffForm.reset(data);
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [data]);

  const staffForm = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onStaffSubmit = async (values) => {
    const userResponse = await fetch("/api/users/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (userResponse.ok) {
      toast.success("Success", {
        description: "You have successfully edited a staff.",
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

              <Button type="submit" className="w-full">
                Update Staff
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
