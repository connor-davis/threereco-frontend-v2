import {
  deleteApiCollectorsByIdMutation,
  getApiCollectorsByIdOptions,
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

function Collector() {
  const params = useParams({ from: "/_auth/collectors/$id" });

  const navigate = useNavigate();

  const {
    data: collector,
    isLoading: isLoadingCollector,
    isError: isCollectorError,
  } = useQuery({
    ...getApiCollectorsByIdOptions({
      path: {
        id: params.id,
      },
      query: {
        includeUser: "true",
      },
    }),
  });

  const deleteCollector = useMutation({
    ...deleteApiCollectorsByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => navigate({ to: "/collectors" }),
  });

  if (isLoadingCollector)
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
              <Label className="font-bold">First Name</Label>
              <Label className="font-normal">
                {collector?.firstName ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Last Name</Label>
              <Label className="font-normal">
                {collector?.lastName ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Phone Number</Label>
              <Label className="font-normal">
                {collector?.phoneNumber ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">ID Number</Label>
              <Label className="font-normal">
                {collector?.idNumber ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Address</Label>
              <Label className="font-normal">
                {[
                  collector?.address,
                  collector?.city,
                  collector?.province,
                  collector?.zipCode,
                ].join(", ")}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Bank Name</Label>
              <Label className="font-normal">
                {collector?.bankName ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Bank Account Holder</Label>
              <Label className="font-normal">
                {collector?.bankAccountHolder ?? "N/F"}
              </Label>
            </div>

            <div className="grid lg:grid-cols-2">
              <Label className="font-bold">Bank Account Number</Label>
              <Label className="font-normal">
                {collector?.bankAccountNumber ?? "N/F"}
              </Label>
            </div>

            {collector?.userId && (
              <div className="grid lg:grid-cols-2">
                <Label className="font-bold">User</Label>
                <Link to="/users/$id" params={{ id: collector?.userId }}>
                  <Label className="font-normalh-auto text-primary underline cursor-pointer">
                    {collector?.user?.email}
                  </Label>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full h-auto space-y-2">
            <Link to="/collectors/edit/$id" params={{ id: params.id }}>
              <Button className="w-full">Edit Collector</Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" className="w-full">
                  Delete Collector
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can not be undone. The collector will be
                    permanently removed from the server a long with all their
                    data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteCollector.mutate({
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

            <Link to="/collectors">
              <Button className="w-full" variant="outline">
                Back To Collectors
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/collectors/$id")({
  component: Collector,
});
