import { getApiAuthenticationCheckOptions } from "@/api-client/@tanstack/react-query.gen";
import SideBar from "@/components/sidebar";
import SideBarTrigger from "@/components/sidebar-trigger";
import Spinner from "@/components/spinners/spinner";
import { Label } from "@/components/ui/label";
import useRole from "@/lib/state/role";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

const Auth = () => {
  const { setRole } = useRole();

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

  if (!user?.mfaEnabled)
    return <Navigate to="/mfa/enable" search={{ to: location.pathname }} />;

  if (!user?.mfaVerified)
    return <Navigate to="/mfa/verify" search={{ to: location.pathname }} />;

  useEffect(() => {
    const disposeable = setTimeout(() => {
      if (user) setRole(user.role);
    }, 0);

    return () => clearTimeout(disposeable);
  }, [user]);

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
