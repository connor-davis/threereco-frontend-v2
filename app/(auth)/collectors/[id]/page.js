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

export default function ViewCollectorPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

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
          return reject("Failed to fetch business");
        }

        const data = await collectorResponse.json();

        resolve(data);
      });
    },
  });

  const deleteCollector = async (id) => {
    const response = await fetch("/api/collectors?id=" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the collector.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("collectors");
          router.replace("/collectors");
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
          <CardTitle className="text-center">Collector Details</CardTitle>
          <CardDescription className="text-center">
            View the details of the collector below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Name:</Label>
                <Label className="break-all">
                  {[data?.firstName, data?.lastName].join(" ")}
                </Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Id Number:</Label>
                <Label className="break-all">{data?.idNumber}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Phone Number:</Label>
                <Label className="break-all">{data?.phoneNumber}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Address:</Label>
                <Label className="break-normal">
                  {[
                    `${data?.address}`,
                    `${data?.city}`,
                    `${data?.province}`,
                    `${data?.zipCode}`,
                  ].join(", ")}
                </Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Bank Name:</Label>
                <Label className="break-all">{data?.bankName}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Account Holder:</Label>
                <Label className="break-all">{data?.bankAccountHolder}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Account Number:</Label>
                <Label className="break-all">{data?.bankAccountNumber}</Label>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link href={`/collectors/edit/${id}`}>
                <Button className="w-full">Edit Collector</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Delete Collector
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this collector? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCollector(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={`/collectors`}>
                <Button className="w-full" variant="outline">
                  Back to Collectors
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
