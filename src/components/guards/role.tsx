import { getApiAuthenticationCheckOptions } from "@/api-client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function RoleGuard({
  requiredRoles = [],
  children,
}: {
  requiredRoles: string[];
  children: ReactNode;
}) {
  const {
    data: user,
    isFetching: isFetchingAuthentication,
    isError: isAuthenticationError,
  } = useQuery({
    ...getApiAuthenticationCheckOptions({
      keepalive: true,
    }),
  });

  if (!user) return null;
  if (!requiredRoles.includes(user!.role)) return null;

  return children;
}
