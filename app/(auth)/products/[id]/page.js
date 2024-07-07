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

export default function ViewProductPage({ params: { id } }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const productResponse = await fetch("/api/product/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (productResponse.status !== 200) {
          return reject("Failed to fetch product");
        }

        const data = await productResponse.json();

        resolve(data.product);
      });
    },
  });

  const deleteProduct = async (id) => {
    const response = await fetch("/api/product/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the product.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("products");
          router.replace("/products");
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
          <CardTitle className="text-center">Product Details</CardTitle>
          <CardDescription className="text-center">
            View the details of the product below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Name:</Label>
                <Label className="break-all">{data?.name}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Description:</Label>
                <Label className="break-all">{data?.description}</Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="font-bold">Price:</Label>
                <Label className="break-all">{`R ${parseFloat(
                  data?.price
                ).toFixed(2)}`}</Label>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link href={`/products/edit/${id}`}>
                <Button className="w-full">Edit Product</Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => {}}
                  >
                    Delete Product
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hold On!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this product? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProduct(id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Link href={`/products`}>
                <Button className="w-full" variant="outline">
                  Back to Products
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
