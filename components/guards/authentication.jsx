"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loadingSpinner";
import useUserStore from "@/lib/state/user";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";

export default function AuthenticationGuard({ children }) {
  const router = useRouter();
  const { setUser } = useUserStore();

  const { data: user, isFetching: isFetchingUser } = useQuery({
    initialData: {},
    queryKey: ["authentication", "user"],
    queryFn: () =>
      new Promise(async (resolve, reject) => {
        const checkResponse = await fetch("/api/authentication/check", {
          method: "GET",
        });

        const status = checkResponse.status;

        if (status !== 200) {
          const currentPath = window.location.pathname;

          return router.push("/login?redirect=" + currentPath);
        }

        const { data } = await checkResponse.json();

        resolve(data);
      }),
  });

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => setUser(user), 0);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user]);

  if (isFetchingUser) {
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
