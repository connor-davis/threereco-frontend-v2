import "../globals.css";

import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

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
        {children}

        <Toaster />
      </body>
    </html>
  );
}
