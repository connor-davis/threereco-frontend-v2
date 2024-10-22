import useRole from "@/lib/state/role";

export default function RoleGuard({
  requiredRoles = [],
  children,
}: React.PropsWithChildren<{ requiredRoles: string[] }>) {
  const { role } = useRole();

  if (!role) return null;
  if (!requiredRoles.includes(role)) return null;

  return children;
}
