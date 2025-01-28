import CollectionsTable from "@/components/tables/collections-table";
import { createFileRoute } from "@tanstack/react-router";

function Collections() {
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden">
      <CollectionsTable />
    </div>
  );
}

export const Route = createFileRoute("/_auth/collections/")({
  component: Collections,
});
