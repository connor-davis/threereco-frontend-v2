import Providers from "@/components/providers";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col w-screen h-screen bg-muted">
      <Providers>
        <Outlet />
      </Providers>
    </div>
  ),
});
