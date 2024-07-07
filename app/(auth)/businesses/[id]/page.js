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
    CardTitle
} from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import useAuthenticationStore from "@/lib/state/authentication";
import { useRouter } from "next/navigation";

export default function ViewBusinessPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessesResponse = await fetch("/api/business/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (businessesResponse.status !== 200) {
          return reject("Failed to fetch business");
        }

        const data = await businessesResponse.json();

        resolve(data.business);
      });
    },
  });

  const deleteBusiness = async (id) => {
    const response = await fetch("/api/business/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the business.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("businesses");
          router.replace("/businesses");
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
          <CardTitle className="text-center">Business Details</CardTitle>
          <CardDescription className="text-center">
            View the details of the business below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Name:</Label>
                <Label className="break-all">{data?.business_name}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Type:</Label>
                <Label className="break-all">{data?.business_type}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Description:</Label>
                <Label className="break-all">
                  {data?.business_description}
                </Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Phone Number:</Label>
                <Label className="break-all">{data?.phone_number}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Address:</Label>
                <Label className="break-normal">
                  {[
                    `${data?.address}`,
                    `${data?.city}`,
                    `${data?.state}`,
                    `${data?.zip_code}`,
                  ].join(", ")}
                </Label>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link href={`/businesses/edit/${id}`}>
                <Button className="w-full">Edit Business</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Delete Business
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this business? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteBusiness(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={`/businesses`}>
                <Button className="w-full" variant="outline">
                  Back to Businesses
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
