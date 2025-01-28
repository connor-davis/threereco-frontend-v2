import BusinessesTable from "@/components/tables/businesses-table";
import { createFileRoute } from "@tanstack/react-router";

function Businesses() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden">
      <BusinessesTable />
    </div>
  );
}

export const Route = createFileRoute("/_auth/businesses/")({
  component: Businesses,
});
