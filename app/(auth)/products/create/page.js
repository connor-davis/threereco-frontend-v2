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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RoleGuard from "@/components/guards/role";
import SearchSelect from "@/components/searchSelect";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAuthenticationStore from "@/lib/state/authentication";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/state/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number().positive().min(0, "Price must be greater than 0"),
});

export default function CreateProductPage() {
  const router = useRouter();
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  const [businessId, setBusinessId] = useState(null);

  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
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
          return reject("Failed to fetch employees");
        }

        const data = await businessesResponse.json();

        resolve(data.businesses);
      });
    },
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (user && data) {
        if (user.role === "Business") {
          const business = data.find(
            (business) => business.user_id === user.id
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
  }, [user, data]);

  const onProductSubmit = async (values) => {
    if (!businessId) {
      return toast.error("Error", {
        description: "You must select a business.",
        duration: 2000,
      });
    }

    const productResponse = await fetch("/api/product/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, business_id: businessId }),
    });

    if (productResponse.ok) {
      toast.success("Success", {
        description: "You have successfully created a product.",
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
          <CardTitle className="text-center">Create Product</CardTitle>
          <CardDescription className="text-center">
            Fill in the form below to create a product.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full h-full space-y-3 overflow-y-auto max-h-96">
          <Form {...productForm}>
            <form
              onSubmit={productForm.handleSubmit(onProductSubmit)}
              className="space-y-8"
            >
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Paper" {...field} />
                    </FormControl>
                    <FormDescription>The products name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A description of paper"
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormDescription>The products description.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    list={data}
                    valueKey="id"
                    labelKey="business_name"
                    onValueChange={(value) => setBusinessId(value)}
                  />
                  <Label className="text-sm text-muted-foreground">
                    Select a business to add the product to.
                  </Label>
                </div>
              </RoleGuard>

              <Button type="submit" className="w-full">
                Create Product
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
