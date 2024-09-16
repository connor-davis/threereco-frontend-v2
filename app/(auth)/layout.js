"use client";

import AuthenticationGuard from "@/components/guards/authentication";
import Navbar from "@/components/navbar";
import QueryProvider from "@/components/providers/query";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import queryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationGuard>
        <Navbar />
        <TooltipProvider>
          <div className="flex w-full h-full overflow-hidden">
            <Sidebar />
            <div className="relative flex flex-col w-full h-full overflow-hidden">
              <div className="z-10 flex flex-col w-full h-full p-3 overflow-y-auto">
                {children}
              </div>
              <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-black pattern-bg-white pattern-size-2 pattern-opacity-5"></div>
            </div>
          </div>
        </TooltipProvider>
      </AuthenticationGuard>
      <Toaster />
    </QueryClientProvider>
  );
}
