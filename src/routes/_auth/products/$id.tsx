import {
  deleteApiProductsByIdMutation,
  getApiProductsByIdOptions,
} from "@/api-client/@tanstack/react-query.gen";
import Spinner from "@/components/spinners/spinner";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { toast } from "sonner";

function Product() {
  const params = useParams({ from: "/_auth/products/$id" });

  const navigate = useNavigate();

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useQuery({
    ...getApiProductsByIdOptions({
      path: {
        id: params.id,
      },
      query: {
        includeBusiness: "true",
      },
    }),
  });

  const deleteProduct = useMutation({
    ...deleteApiProductsByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => navigate({ to: "/products" }),
  });

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
    <div className="flex flex-col w-full h-full items-center lg:justify-center">
      <Card className="lg:max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Below are the product's details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full h-auto space-y-2">
            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Name</Label>
              <Label className="font-normal">{product?.name ?? "N/F"}</Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">GW Code</Label>
              <Label className="font-normal">{product?.gwCode ?? "N/F"}</Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">tCO2/ton Factor</Label>
              <Label className="font-normal">
                {product?.carbonFactor ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Price</Label>
              <Label className="font-normal">R {product?.price ?? "N/F"}</Label>
            </div>

            {product?.businessId && (
              <div className="grid lg:grid-cols-2">
                <Label className="font-bold">User</Label>
                <Link to="/businesses/$id" params={{ id: product?.businessId }}>
                  <Label className="font-normalh-auto text-primary underline cursor-pointer">
                    {product?.business?.name}
                  </Label>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full h-auto space-y-2">
            <Link to="/products/edit/$id" params={{ id: params.id }}>
              <Button className="w-full">Edit Product</Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" className="w-full">
                  Delete Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can not be undone. The product will be
                    permanently removed from the server a long with all their
                    data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteProduct.mutate({
                        path: {
                          id: params.id,
                        },
                      })
                    }
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Link to="/products">
              <Button className="w-full" variant="outline">
                Back To Products
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/products/$id")({
  component: Product,
});
