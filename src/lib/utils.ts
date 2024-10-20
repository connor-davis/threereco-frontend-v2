import { QueryClient } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient();

export const useDisposeable = (callback = () => {}, time = 0) => {
  useEffect(() => {
    const disposeable = setTimeout(callback, time);

    return () => clearTimeout(disposeable)
  }, [])
}
