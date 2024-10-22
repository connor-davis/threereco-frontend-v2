import ProductsTable from "@/components/tables/products-table";
import { createFileRoute } from "@tanstack/react-router";

function Products() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <ProductsTable />
    </div>
  );
}

export const Route = createFileRoute("/_auth/products/")({
  component: Products,
});
