import {
  getApiAuthenticationCheck,
  GetApiAuthenticationCheckResponse,
} from "@/api-client";
import SideBar from "@/components/sidebar";
import SideBarTrigger from "@/components/sidebar-trigger";
import Spinner from "@/components/spinners/spinner";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

const Auth = () => {
  const {
    data: user,
    isFetching: isFetchingAuthentication,
    isError: isAuthenticationError,
  }: {
    data: GetApiAuthenticationCheckResponse;
    isFetching: boolean;
    isError: boolean;
  } = useQuery({
    initialData: {},
    queryKey: ["user-state"],
    queryFn: () =>
      new Promise(async (resolve, reject) => {
        const { data, error } = await getApiAuthenticationCheck();

        if (error) reject(error);
        else resolve(data);
      }),
    retry: false,
  });

  if (isFetchingAuthentication)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center space-x-3">
          <Spinner className="w-4 h-4" />
          <Label>Checking authentication...</Label>
        </div>
      </div>
    );

  if (isAuthenticationError)
    return (
      <Navigate to="/authentication/login" search={{ to: location.pathname }} />
    );

  if (!user.mfaEnabled)
    return (
      <Navigate
        to="/authentication/mfa/enable"
        search={{ to: location.pathname }}
      />
    );

  if (!user.mfaVerified)
    return (
      <Navigate
        to="/authentication/mfa/verify"
        search={{ to: location.pathname }}
      />
    );

  return (
    <div className="flex w-full h-full bg-muted overflow-hidden">
      <SideBar />

      <div className="flex flex-col w-full h-full bg-muted overflow-y-auto p-2 space-y-2">
        <SideBarTrigger />
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth")({
  component: Auth,
});
