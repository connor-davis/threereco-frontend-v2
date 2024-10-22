import {
  getApiBusinessesOptions,
  getApiCollectorsOptions,
  getApiProductsOptions,
  postApiCollectionsMutation,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSchema = z.object({
  businessId: z.string(),
  collectorId: z.string(),
  productId: z.string(),
  weight: z.string(),
});

function Create() {
  const navigate = useNavigate();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {},
  });

  const {
    data: collectionBusinesses,
    isLoading: isLoadingCollectionBusinesses,
    isError: isCollectionBusinessesError,
  } = useQuery({
    ...getApiBusinessesOptions({
      query: {
        usePaging: "false",
      },
    }),
  });

  const {
    data: collectionCollectors,
    isLoading: isLoadingCollectionCollectors,
    isError: isCollectionCollectorsError,
  } = useQuery({
    ...getApiCollectorsOptions({
      query: {
        usePaging: "false",
      },
    }),
  });

  const {
    data: collectionProducts,
    isLoading: isLoadingCollectionProducts,
    isError: isCollectionProductsError,
  } = useQuery({
    ...getApiProductsOptions({
      query: {
        usePaging: "false",
      },
    }),
  });

  const createProduct = useMutation({
    ...postApiCollectionsMutation(),
    onError: (error) => {
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => {
      return navigate({ to: "/collections" });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-muted p-3 overflow-hidden">
      <div className="flex flex-col w-full h-auto p-4 space-y-2 lg:max-w-96 bg-background rounded-md border overflow-y-auto">
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit((values) =>
              createProduct.mutate({
                body: values,
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
                        <SelectValue placeholder="Select a collection business" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"--"}>None</SelectItem>
                      {collectionBusinesses?.map((business) => (
                        <SelectItem value={business.id}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    This is the collection business
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="collectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collector</FormLabel>

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
                        <SelectValue placeholder="Select a collection collector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"--"}>None</SelectItem>
                      {collectionCollectors?.map((collector) => (
                        <SelectItem value={collector.id}>
                          {[collector.firstName, collector.lastName].join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    This is the collection collector
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>

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
                        <SelectValue placeholder="Select a collection product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"--"}>None</SelectItem>
                      {collectionProducts?.map((product) => (
                        <SelectItem value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription>
                    This is the collection product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createForm.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Weight (kg)" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the collection weight
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

        <Link to="/collections">
          <Button variant="outline" className="w-full">
            Back To Collections
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_auth/collections/create")({
  component: Create,
});
