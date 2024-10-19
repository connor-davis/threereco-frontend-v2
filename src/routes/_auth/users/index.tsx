import { createFileRoute } from "@tanstack/react-router";

function Users() {
  return <div>Hello /_auth/users/!</div>;
}

export const Route = createFileRoute("/_auth/users/")({
  component: Users,
});
