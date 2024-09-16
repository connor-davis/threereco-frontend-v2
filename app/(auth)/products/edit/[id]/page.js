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
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RoleGuard from "@/components/guards/role";
import SearchSelect from "@/components/searchSelect";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/state/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS } from "@/lib/constants";

const productSchema = z.object({
  price: z.coerce.number().positive().min(0, "Price must be greater than 0"),
});

export default function EditProductPage({ params: { id } }) {
  const router = useRouter();
  const { user } = useUserStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [businessId, setBusinessId] = useState(null);

  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
    },
  });

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    initialData: {},
    queryKey: ["products", id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const productResponse = await fetch("/api/products?id=" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (productResponse.status !== 200) {
          return reject("Failed to fetch product");
        }

        const data = await productResponse.json();

        resolve(data);
      });
    },
  });

  const {
    data: businesses,
    status: businessesStatus,
    error: businessesError,
    isLoading: isLoadingBusinesses,
    isError: isBusinessesError,
  } = useQuery({
    initalData: [],
    queryKey: ["businesses"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessesResponse = await fetch("/api/businesses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (businessesResponse.status !== 200) {
          return reject("Failed to fetch employees");
        }

        const data = await businessesResponse.json();

        resolve(data);
      });
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (data) {
        productForm.reset(data);
        setSelectedProduct({
          name: data.name,
          gwCode: data.gwCode,
          carbonFactor: data.carbonFactor,
        });
        setBusinessId(data.businessId);
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [data]);

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (user && businesses) {
        if (user.role === "Business") {
          const business = businesses.find(
            (business) => business.userId === user.id
          );

          if (business) {
            setBusinessId(business.id);
          }
        }
      }
    }, 100);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user, businesses]);

  const onProductSubmit = async (values) => {
    if (!businessId) {
      return toast.error("Error", {
        description: "You must select a business.",
        duration: 2000,
      });
    }

    const productResponse = await fetch("/api/products?id=" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, ...selectedProduct, businessId }),
    });

    if (productResponse.ok) {
      toast.success("Success", {
        description: "You have successfully edited a product.",
        duration: 2000,
        onAutoClose: () => {
          router.replace("/products");
        },
      });
    } else {
      const errorText = await productResponse.text();

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
          <CardTitle className="text-center">Edit Product</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to edit a product.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Form {...productForm}>
            <form
              onSubmit={productForm.handleSubmit(onProductSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col w-full h-auto space-y-2">
                <Label>Product</Label>

                <Select
                  value={selectedProduct?.name ?? ""}
                  onValueChange={(value) => {
                    const product = PRODUCTS.find(
                      (product) => product.name === value
                    );

                    setSelectedProduct(product);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((product) => (
                      <SelectItem value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label className="text-sm text-muted-foreground">
                  Select the type of product you are adding.
                </Label>
              </div>
              <FormField
                control={productForm.control}
                name="price"
                type="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (R)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1.5" {...field} />
                    </FormControl>
                    <FormDescription>
                      The products price per kilogram.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RoleGuard requiredRoles={["System Admin", "Staff"]}>
                <div className="flex flex-col space-y-3">
                  <Label>Business</Label>
                  <SearchSelect
                    list={businesses}
                    defaultValue={businessId}
                    valueKey="id"
                    labelKey="name"
                    onValueChange={(value) => setBusinessId(value)}
                  />
                  <Label className="text-sm text-muted-foreground">
                    Select a business to add the product to.
                  </Label>
                </div>
              </RoleGuard>

              <Button type="submit" className="w-full">
                Update Product
              </Button>
            </form>
          </Form>

          <Link href="/products">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
