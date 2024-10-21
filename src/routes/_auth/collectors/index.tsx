import CollectorsTable from "@/components/tables/collectors-table";
import { createFileRoute } from "@tanstack/react-router";

function Collectors() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <CollectorsTable />
    </div>
  );
}

export const Route = createFileRoute("/_auth/collectors/")({
  component: Collectors,
});
