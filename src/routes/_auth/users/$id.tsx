import {
  deleteApiUsersByIdMutation,
  getApiUsersByIdOptions,
} from "@/api-client/@tanstack/react-query.gen";
import PasswordResetDialog from "@/components/dialogs/password-reset/password-reset";
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

function User() {
  const params = useParams({ from: "/_auth/users/$id" });

  const navigate = useNavigate();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useQuery({
    ...getApiUsersByIdOptions({
      path: {
        id: params.id,
      },
    }),
  });

  const deleteUser = useMutation({
    ...deleteApiUsersByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () => navigate({ to: "/users" }),
  });

  if (isLoadingUser)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner className="size-4" />
          <Label>Loading user.</Label>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full items-center lg:justify-center">
      <Card className="lg:max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle>User Details</CardTitle>
          <CardDescription>Below are the user's details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full h-auto space-y-2">
            <div className="grid lg:grid-cols-2 gap-2">
              <Label className="font-bold">Email</Label>
              <Label className="font-normal">{user?.email ?? "N/F"}</Label>
            </div>

            <div className="grid lg:grid-cols-2 gap-2">
              <Label className="font-bold">Role</Label>
              <Label className="font-normal capitalize">
                {user?.role.replace("_", " ") ?? "N/F"}
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full h-auto space-y-2">
            <Link to="/users/edit/$id" params={{ id: params.id }}>
              <Button className="w-full">Edit User</Button>
            </Link>

            <PasswordResetDialog userId={params.id} />

            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" className="w-full">
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can not be undone. The user will be permanently
                    removed from the server a long with all their data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteUser.mutate({
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

            <Link to="/users">
              <Button className="w-full" variant="outline">
                Back To Users
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_auth/users/$id")({
  component: User,
});
