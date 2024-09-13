"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function LogoutBtn() {
  const logout = async () => {
    const logoutResponse = await fetch("/api/authentication/logout", {
      method: "POST",
    });

    if (logoutResponse.status !== 200)
      return toast.error("Unknown Error", {
        description: "Unknown error occured. Please contact the api developer.",
        duration: 2000,
      });
    else
      return toast.success("Success", {
        description: "You have been logged out successfully.",
        duration: 2000,
        onAutoClose: () => window.location.reload(),
      });
  };

  return (
    <Button
      className="w-full px-3 py-2 hover:text-destructive"
      variant="ghost"
      onClick={() => logout()}
    >
      Logout
      <LogOutIcon className="w-4 h-4 ml-auto" />
    </Button>
  );
}
