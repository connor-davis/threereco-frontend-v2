"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ViewUserPage({ params: { id } }) {
  const router = useRouter();

  // Access the client
  const queryClient = useQueryClient();

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

  const disableMFA = async (id) => {
    const response = await fetch("/api/authentication/mfa/disable?id=" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully disabled the user's MFA.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("users");
          router.replace("/users");
        },
      });
    } else {
      const errorText = await response.text();

      try {
        const { error, reason } = JSON.parse(errorText);

        toast.error(error, {
          description: reason,
          duration: 2000,
        });
      } catch {
        toast.error("An error occurred", {
          description: "Please try again later.",
          duration: 2000,
        });
      }
    }
  };

  const deleteUser = async (id) => {
    const response = await fetch("/api/users?id=" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the user.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("users");
          router.replace("/users");
        },
      });
    } else {
      const errorText = await response.text();

      try {
        const { error, reason } = JSON.parse(errorText);

        toast.error(error, {
          description: reason,
          duration: 2000,
        });
      } catch {
        toast.error("An error occurred", {
          description: "Please try again later.",
          duration: 2000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full shadow-none max-w-96">
        <CardHeader>
          <CardTitle className="text-center">User Details</CardTitle>
          <CardDescription className="text-center">
            View the details of the user below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Email:</Label>
                <Label className="break-all">{data?.email}</Label>
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Role:</Label>
                <Label className="break-all">{data?.role}</Label>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link href={`/users/edit/${id}`}>
                <Button className="w-full">Edit User</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Disable MFA
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to disable this user's MFA? This
                      will require them to re-enable their MFA.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => disableMFA(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Delete User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this user? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteUser(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={`/users`}>
                <Button className="w-full" variant="outline">
                  Back to Users
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
