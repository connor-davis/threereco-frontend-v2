"use client";

import { useEffect, useState } from "react";

import useUserStore from "@/lib/state/user";

export default function RoleGuard({ requiredRoles = [], children }) {
  const { user } = useUserStore();

  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const disposeableTimeout = setTimeout(() => {
      if (!user) {
        return;
      }

      const hasRole = requiredRoles.some((role) => user.role.includes(role));

      setHasRole(hasRole);
    }, 200);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [user]);

  if (!hasRole) {
    return null;
  }

  return children;
}
