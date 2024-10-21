import {
  deleteApiBusinessesByIdMutation,
  getApiBusinessesByIdOptions,
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

function Business() {
  const params = useParams({ from: "/_auth/businesses/$id" });

  const navigate = useNavigate();

  const {
    data: business,
    isLoading: isLoadingBusiness,
    isError: isBusinessError,
  } = useQuery({
    ...getApiBusinessesByIdOptions({
      path: {
        id: params.id,
      },
      query: {
        includeUser: "true",
      },
    }),
  });

  const deleteBusiness = useMutation({
    ...deleteApiBusinessesByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => navigate({ to: "/businesses" }),
  });

  if (isLoadingBusiness)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner className="size-4" />
          <Label>Loading business.</Label>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full items-center lg:justify-center">
      <Card className="lg:max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle>Business Details</CardTitle>
          <CardDescription>Below are the business's details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full h-auto space-y-2">
            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Name</Label>
              <Label className="font-normal">{business?.name ?? "N/F"}</Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Type</Label>
              <Label className="font-normal">{business?.type ?? "N/F"}</Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Description</Label>
              <Label className="font-normal">
                {business?.description ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Phone Number</Label>
              <Label className="font-normal">
                {business?.phoneNumber ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Address</Label>
              <Label className="font-normal">
                {[
                  business?.address,
                  business?.city,
                  business?.province,
                  business?.zipCode,
                ].join(", ")}
              </Label>
            </div>

            {business?.userId && (
              <div className="grid lg:grid-cols-2">
                <Label className="font-bold">User</Label>
                <Link to="/users/$id" params={{ id: business?.userId }}>
                  <Label className="font-normalh-auto text-primary underline cursor-pointer">
                    {business?.user?.email}
                  </Label>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full h-auto space-y-2">
            <Link to="/businesses/edit/$id" params={{ id: params.id }}>
              <Button className="w-full">Edit Business</Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" className="w-full">
                  Delete Business
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can not be undone. The business will be
                    permanently removed from the server a long with all their
                    data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteBusiness.mutate({
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

            <Link to="/businesses">
              <Button className="w-full" variant="outline">
                Back To Businesses
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/businesses/$id")({
  component: Business,
});
