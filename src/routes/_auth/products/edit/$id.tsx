import {
  getApiBusinessesOptions,
  getApiProductsByIdOptions,
  putApiProductsByIdMutation,
} from "@/api-client/@tanstack/react-query.gen";
import Spinner from "@/components/spinners/spinner";
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
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editSchema = z.object({
  name: z.string(),
  gwCode: z.string(),
  carbonFactor: z.string(),
  price: z.string(),
  businessId: z.string(),
});

function Edit() {
  const params = useParams({ from: "/_auth/products/edit/$id" });
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    gwCode: string;
    carbonFactor: string;
  } | null>(null);

  const {
    data: productBusinesses,
    isLoading: isLoadingCollectorUsers,
    isError: isCollectorUsersError,
  } = useQuery({
    ...getApiBusinessesOptions({
      query: {
        usePaging: "false",
      },
    }),
  });

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useQuery({
    ...getApiProductsByIdOptions({
      path: {
        id: params.id,
      },
    }),
  });

  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
  });

  const editProduct = useMutation({
    ...putApiProductsByIdMutation(),
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

  useEffect(() => {
    const disposeable = setTimeout(() => {
      editForm.reset(product);
      setSelectedProduct(product!);
    }, 0);

    return () => clearTimeout(disposeable);
  }, [product]);

  if (isLoadingProduct)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner className="size-4" />
          <Label>Loading product.</Label>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit((values) =>
              editProduct.mutate({
                body: values,
                path: {
                  id: params.id,
                },
              })
            )}
            className="space-y-2"
          >
            <FormField
              control={editForm.control}
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
                        <SelectValue placeholder="Select a collector user" />
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

                  editForm.reset(product);
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
              control={editForm.control}
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
              Edit Product
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
export const Route = createFileRoute("/_auth/products/edit/$id")({
  component: Edit,
});
