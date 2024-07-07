"use client";

import useAuthenticationStore from "@/lib/state/authentication";
import useUserStore from "@/lib/state/user";

import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function LogoutBtn() {
  const { setToken } = useAuthenticationStore();
  const { setUser } = useUserStore();

  const logout = () => {
    setToken(null);
    setUser(null);
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
