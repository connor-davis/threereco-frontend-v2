import UsersTable from "@/components/tables/users-table";
import { createFileRoute } from "@tanstack/react-router";

function Users() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden">
      <UsersTable />
    </div>
  );
}

export const Route = createFileRoute("/_auth/users/")({
  component: Users,
});
