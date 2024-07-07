"use client";

import useAuthenticationStore from "@/lib/state/authentication";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loadingSpinner";
import useUserStore from "@/lib/state/user";

export default function AuthenticationGuard({ children }) {
  const router = useRouter();
  const { token } = useAuthenticationStore();
  const { setUser } = useUserStore();

  const [isChecking, setChecking] = useState(true);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      if (!token) {
        const currentPath = window.location.pathname;

        return router.replace("/login?redirect=" + currentPath);
      } else {
        const checkResponse = await fetch("/api/authentication/check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!checkResponse.ok) {
          const currentPath = window.location.pathname;

          return router.replace("/login?redirect=" + currentPath);
        }

        const user = await checkResponse.json();

        setUser(user);
        setChecking(false);
      }
    }, 200);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [token]);

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
}
