import "../globals.css";

import AuthenticationGuard from "@/components/guards/authentication";
import { Inter as FontSans } from "next/font/google";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "@/components/providers/query";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "3rEco",
  description: "Empowering the world to make sustainable choices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col w-screen h-screen bg-muted font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthenticationGuard>
          <Navbar />
          <TooltipProvider>
            <div className="flex w-full h-full">
              <Sidebar />
              <div className="relative flex flex-col w-full h-full overflow-hidden">
                <QueryProvider>
                  <div className="z-10 flex flex-col w-full h-full p-3 overflow-y-auto">
                    {children}
                  </div>
                </QueryProvider>
                <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-black pattern-bg-white pattern-size-2 pattern-opacity-5"></div>
              </div>
            </div>
          </TooltipProvider>
        </AuthenticationGuard>
        <Toaster />
      </body>
    </html>
  );
}
