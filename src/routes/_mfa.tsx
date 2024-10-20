import { getApiAuthenticationCheckOptions } from "@/api-client/@tanstack/react-query.gen";
import Spinner from "@/components/spinners/spinner";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

const Auth = () => {
  const {
    data: user,
    isFetching: isFetchingAuthentication,
    isError: isAuthenticationError,
  } = useQuery({
    ...getApiAuthenticationCheckOptions(),
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

  return <Outlet />;
};

export const Route = createFileRoute("/_mfa")({
  component: Auth,
});
