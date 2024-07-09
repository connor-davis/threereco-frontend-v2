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

import { Button } from "@/components/ui/button";
import CollectorSearch from "@/components/collectorSearch";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import LoadingSpinner from "@/components/loadingSpinner";
import RoleGuard from "@/components/guards/role";
import { toast } from "sonner";
import useAuthenticationStore from "@/lib/state/authentication";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/state/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const collectionSchema = z.object({
  business_id: z.string().uuid("Business ID must be a valid UUID"),
  collector_id: z.string().uuid("Collector ID must be a valid UUID"),
  product_id: z.string().uuid("Product ID must be a valid UUID"),
  weight: z.coerce.number().positive().min(0, "Weight must be greater than 0"),
});

export default function CreateCollectionPage() {
  const router = useRouter();
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  const collectionForm = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      business_id: "",
      collector_id: "",
      product_id: "",
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
    queryKey: ["businesses"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessesResponse = await fetch("/api/business", {
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

        resolve(data.businesses);
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
    queryKey: ["collectors"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const collectorsResponse = await fetch("/api/collector", {
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

        resolve(data.collectors);
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
    queryKey: ["products"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const productsResponse = await fetch("/api/product", {
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

        resolve(data.products);
      });
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (user && businesses) {
        if (user.role === "Business") {
          const business = businesses.find(
            (business) => business.user_id === user.id
          );

          if (business) {
            collectionForm.setValue("business_id", business.id);
          }
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user, businesses]);

  const onCollectionSubmit = async (values) => {
    const collectionResponse = await fetch("/api/collection/add", {
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
                  name="business_id"
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
                              {business.business_name}
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
                name="collector_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collector</FormLabel>
                    <CollectorSearch
                      onSelected={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
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
                name="product_id"
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
