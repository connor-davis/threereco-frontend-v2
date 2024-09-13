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
import { useQuery, useQueryClient } from "@tanstack/react-query";

import CollectorSearch from "@/components/collectorSearch";
import RoleGuard from "@/components/guards/role";
import LoadingSpinner from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthenticationStore from "@/lib/state/authentication";
import useUserStore from "@/lib/state/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const collectionSchema = z.object({
  businessId: z.string().uuid("Business ID must be a valid UUID"),
  collectorId: z.string().uuid("Collector ID must be a valid UUID"),
  productId: z.string().uuid("Product ID must be a valid UUID"),
  weight: z.coerce.number().positive().min(0, "Weight must be greater than 0"),
});

export default function CreateCollectionPage() {
  const router = useRouter();
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  const collectionForm = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      businessId: "",
      collectorId: "",
      productId: "",
      weight: 0,
    },
  });

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const {
    data: businesses,
    status: businessesStatus,
    error: businessesError,
    isLoading: isLoadingBusinesses,
    isError: isBusinessesError,
  } = useQuery({
    initialData: [],
    queryKey: ["businesses"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessesResponse = await fetch("/api/businesses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (businessesResponse.status !== 200) {
          return reject("Failed to fetch businesses");
        }

        const data = await businessesResponse.json();

        resolve(data);
      });
    },
  });

  const {
    data: collectors,
    status: collectorsStatus,
    error: collectorsError,
    isLoading: isLoadingCollectors,
    isError: isCollectorsError,
  } = useQuery({
    initialData: [],
    queryKey: ["collectors"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const collectorsResponse = await fetch("/api/collectors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (collectorsResponse.status !== 200) {
          return reject("Failed to fetch collectors");
        }

        const data = await collectorsResponse.json();

        resolve(data);
      });
    },
  });

  const {
    data: products,
    status: productsStatus,
    error: productsError,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useQuery({
    initialData: [],
    queryKey: ["products"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const productsResponse = await fetch("/api/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (productsResponse.status !== 200) {
          return reject("Failed to fetch products");
        }

        const data = await productsResponse.json();

        resolve(data);
      });
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (user && businesses) {
        if (user.role === "Business") {
          const business = businesses.find(
            (business) => business.userId === user.id
          );

          if (business) {
            collectionForm.setValue("businessId", business.id);
          }
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user, businesses]);

  const onCollectionSubmit = async (values) => {
    const collectionResponse = await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (collectionResponse.ok) {
      toast.success("Success", {
        description: "You have successfully created a collection.",
        duration: 2000,
        onAutoClose: () => {
          router.replace("/collections");
        },
      });
    } else {
      const errorText = await collectionResponse.text();

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

  if (isLoadingBusinesses || isLoadingCollectors || isLoadingProducts) {
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
          <CardTitle className="text-center">Create Collection</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create a collection.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Form {...collectionForm}>
            <form
              onSubmit={collectionForm.handleSubmit(onCollectionSubmit)}
              className="space-y-8"
            >
              <RoleGuard requiredRoles={["System Admin", "Staff"]}>
                <FormField
                  control={collectionForm.control}
                  name="businessId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a business" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businesses.map((business) => (
                            <SelectItem key={business.id} value={business.id}>
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a business to add the collection to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </RoleGuard>

              <FormField
                control={collectionForm.control}
                name="collectorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collector</FormLabel>
                    <CollectorSearch
                      onSelected={field.onChange}
                      defaultSelected={field.value}
                      selected={field.value}
                    />
                    <FormDescription>
                      Select a collector to add the collection to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={collectionForm.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a product to add the collection to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={collectionForm.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="Weight e.g. 1.24" {...field} />
                    </FormControl>
                    <FormDescription>
                      The collections weight in kg.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Collection
              </Button>
            </form>
          </Form>

          <Link href="/collections">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
