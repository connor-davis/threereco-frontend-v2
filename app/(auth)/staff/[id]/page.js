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
import useAuthenticationStore from "@/lib/state/authentication";
import { useRouter } from "next/navigation";

export default function ViewStaffPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  // Access the client
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

  const deleteStaff = async (id) => {
    const response = await fetch("/api/users/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the staff.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("staff");
          router.replace("/staff");
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
          <CardTitle className="text-center">Staff Details</CardTitle>
          <CardDescription className="text-center">
            View the details of the staff below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Email:</Label>
                <Label className="break-all">{data?.email}</Label>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link href={`/staff/edit/${id}`}>
                <Button className="w-full">Edit Staff</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Delete Staff
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this staff? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteStaff(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={`/staff`}>
                <Button className="w-full" variant="outline">
                  Back to Staff
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
