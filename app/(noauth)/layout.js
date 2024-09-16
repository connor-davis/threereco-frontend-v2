import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <Suspense>
      {children}

      <Toaster />
    </Suspense>
  );
}
