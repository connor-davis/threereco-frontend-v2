import useRole from "@/lib/state/role";
import { ReactNode } from "react";

export default function RoleGuard({
  requiredRoles = [],
  children,
}: {
  requiredRoles: string[];
  children: ReactNode;
}) {
  const { role } = useRole();

  return role;
}
