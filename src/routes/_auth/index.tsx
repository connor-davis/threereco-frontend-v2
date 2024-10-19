import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/")({
  component: Index,
});

function Index() {
  return <div className="flex flex-col w-full h-full space-y-3 p-3"></div>;
}
