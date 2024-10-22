import { queryClient } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider } from "./ui/sidebar";
import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="charos-theme">
      <QueryClientProvider client={queryClient}>
        <SidebarProvider defaultOpen={false}>
          <TooltipProvider>
            {children}
            <Toaster />

            <TanStackRouterDevtools position="bottom-right" />
          </TooltipProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
