"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loadingSpinner";
import useUserStore from "@/lib/state/user";

export default function AuthenticationGuard({ children }) {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [isChecking, setChecking] = useState(true);

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

      const data = await checkResponse.json();

      setUser(data);

      setChecking(false);
    }, 500);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
}
