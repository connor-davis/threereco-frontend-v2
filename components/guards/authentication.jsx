"use client";

import useUserStore from "@/lib/state/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "../loadingSpinner";
import { Label } from "../ui/label";

export default function AuthenticationGuard({ children }) {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isAuthenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      const checkResponse = await fetch("/api/authentication/check", {
        method: "GET",
      });

      const status = checkResponse.status;

      if (status !== 200) {
        const currentPath = window.location.pathname;

        return router.push("/login?redirect=" + currentPath);
      }

      const { data } = await checkResponse.json();

      setUser(data);

      setAuthenticating(false);
    }, 500);

    return () => clearTimeout(disposeableTimeout);
  }, []);

  if (isAuthenticating) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center space-x-3">
          <LoadingSpinner />
          <Label className="text-muted-foreground">
            Checking Authentication
          </Label>
        </div>
      </div>
    );
  }

  return children;
}
