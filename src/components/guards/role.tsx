import useRole from "@/lib/state/role";

export default function RoleGuard({
  requiredRoles = [],
  children,
}: React.PropsWithChildren<{ requiredRoles: string[] }>) {
  const { role } = useRole();

  return role;
}
