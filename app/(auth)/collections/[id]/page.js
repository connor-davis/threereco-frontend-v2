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

import BusinessHoverCard from "@/components/hovercards/business/business";
import { Button } from "@/components/ui/button";
import CollectorHoverCard from "@/components/hovercards/collector/collector";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LoadingSpinner from "@/components/loadingSpinner";
import ProductHoverCard from "@/components/hovercards/product/product";
import RoleGuard from "@/components/guards/role";
import { toast } from "sonner";
import useAuthenticationStore from "@/lib/state/authentication";
import { useRouter } from "next/navigation";

export default function ViewCollectionPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["collections", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const collectionResponse = await fetch("/api/collection/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (collectionResponse.status !== 200) {
          return reject("Failed to fetch collection");
        }

        const data = await collectionResponse.json();

        resolve(data.collection);
      });
    },
  });

  const deleteCollection = async (id) => {
    const response = await fetch("/api/collection/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the collection.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("collections");
          router.replace("/collections");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-full shadow-none max-w-96">
        <CardHeader>
          <CardTitle className="text-center">Collection Details</CardTitle>
          <CardDescription className="text-center">
            View the details of the collection below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <RoleGuard requiredRoles={["System Admin", "Staff"]}>
                <div className="flex flex-col space-y-2">
                  <Label>Business</Label>
                  {data?.business_id && (
                    <BusinessHoverCard business_id={data?.business_id} />
                  )}
                </div>
              </RoleGuard>

              <div className="flex flex-col space-y-2">
                <Label>Collector</Label>
                {data?.collector_id && (
                  <CollectorHoverCard collector_id={data?.collector_id} />
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Product</Label>
                {data?.product_id && (
                  <ProductHoverCard product_id={data?.product_id} />
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Weight (kg):</Label>
                <Label className="break-all">
                  {parseFloat(data?.weight).toFixed(2)}
                </Label>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <RoleGuard requiredRoles={["Business"]}>
                <Link href={`/collections/edit/${id}`}>
                  <Button className="w-full">Edit Collection</Button>
                </Link>
              </RoleGuard>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Delete Collection
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this collection? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCollection(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={`/collections`}>
                <Button className="w-full" variant="outline">
                  Back to Collections
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
