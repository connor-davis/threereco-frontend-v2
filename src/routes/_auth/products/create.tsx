import {
  getApiBusinessesOptions,
  postApiProductsMutation,
} from "@/api-client/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSchema = z.object({
  name: z
    .string()
    .optional()
    .nullable(),
  gwCode: z
    .string()
    .optional()
    .nullable(),
  carbonFactor: z
    .string()
    .optional()
    .nullable(),
  price: z.string(),
  businessId: z.string(),
});

function Create() {
  const navigate = useNavigate();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {},
  });

  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    gwCode: string;
    carbonFactor: string;
  } | null>(null);

  const {
    data: productBusinesses,
    isLoading: isLoadingProductBusinesses,
    isError: isProductBusinessesError,
  } = useQuery({
    ...getApiBusinessesOptions({
      query: {
        usePaging: "false",
      },
    }),
  });

  const createProduct = useMutation({
    ...postApiProductsMutation(),
    onError: (error) => {
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => {
      return navigate({ to: "/products" });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit((values) =>
              selectedProduct
                ? createProduct.mutate({
                    body: {
                      ...values,
                      ...selectedProduct,
                    },
                  })
                : toast.error("Failed", {
                    description: "Please select a product.",
                    duration: 2000,
                  })
            )}
            className="space-y-2"
          >
            <FormField
              control={createForm.control}
              name="businessId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business</FormLabel>

                  <Select
                    onValueChange={(value) =>
                      value !== "--"
                        ? field.onChange(value)
                        : field.onChange(null)
                    }
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product business" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"--"}>None</SelectItem>
                      {productBusinesses?.map((business) => (
                        <SelectItem value={business.id}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    This is the product business
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col w-full h-auto space-y-2">
              <Label>Product</Label>

              <Select
                onValueChange={(value) => {
                  const product = PRODUCTS.find(
                    (product) => product.name === value
                  );

                  if (!product) {
                    return setSelectedProduct(null);
                  }

                  setSelectedProduct(product);
                }}
                value={selectedProduct?.name ?? ""}
                defaultValue={selectedProduct?.name ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"--"}>None</SelectItem>
                  {PRODUCTS.map((product) => (
                    <SelectItem value={product.name}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label className="text-muted-foreground text-xs font-normal">
                This is the product
              </Label>
            </div>

            <FormField
              control={createForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Price" {...field} />
                  </FormControl>
                  <FormDescription>This is the product price</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Product
            </Button>
          </form>
        </Form>

        <Link to="/products">
          <Button variant="outline" className="w-full">
            Back To Products
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/products/create")({
  component: Create,
});