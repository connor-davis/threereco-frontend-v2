import {
  deleteApiCollectionsByIdMutation,
  getApiCollectionsByIdOptions,
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

function Collection() {
  const params = useParams({ from: "/_auth/collections/$id" });

  const navigate = useNavigate();

  const {
    data: collection,
    isLoading: isLoadingCollection,
    isError: isCollectionError,
  } = useQuery({
    ...getApiCollectionsByIdOptions({
      path: {
        id: params.id,
      },
      query: {
        includeBusiness: "true",
        includeCollector: "true",
        includeProduct: "true",
      },
    }),
  });

  const deleteCollection = useMutation({
    ...deleteApiCollectionsByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => navigate({ to: "/collections" }),
  });

  if (isLoadingCollection)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner className="size-4" />
          <Label>Loading collection.</Label>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full items-center lg:justify-center">
      <Card className="lg:max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle>Collection Details</CardTitle>
          <CardDescription>Below are the collection's details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full h-auto space-y-2">
            {collection?.businessId && (
              <div className="grid lg:grid-cols-2">
                <Label className="font-bold">Business</Label>
                <Link
                  to="/businesses/$id"
                  params={{ id: collection?.businessId }}
                >
                  <Label className="font-normalh-auto text-primary underline cursor-pointer">
                    {collection?.business?.name}
                  </Label>
                </Link>
              </div>
            )}

            {collection?.collectorId && (
              <div className="grid lg:grid-cols-2">
                <Label className="font-bold">Collector</Label>
                <Link
                  to="/collectors/$id"
                  params={{ id: collection?.collectorId }}
                >
                  <Label className="font-normalh-auto text-primary underline cursor-pointer">
                    {[
                      collection?.collector?.firstName,
                      collection?.collector?.lastName,
                    ].join(" ")}
                  </Label>
                </Link>
              </div>
            )}

            {collection?.productId && (
              <div className="grid lg:grid-cols-2">
                <Label className="font-bold">Product</Label>
                <Link to="/products/$id" params={{ id: collection?.productId }}>
                  <Label className="font-normalh-auto text-primary underline cursor-pointer">
                    {collection?.product?.name}
                  </Label>
                </Link>
              </div>
            )}

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Weight</Label>
              <Label className="font-normal">
                {collection?.weight ?? "N/F"} kg
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full h-auto space-y-2">
            <Link to="/collections/edit/$id" params={{ id: params.id }}>
              <Button className="w-full">Edit Collection</Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" className="w-full">
                  Delete Collection
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can not be undone. The collection will be
                    permanently removed from the server a long with all it's
                    data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteCollection.mutate({
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

            <Link to="/collections">
              <Button className="w-full" variant="outline">
                Back To Collections
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/collections/$id")({
  component: Collection,
});
