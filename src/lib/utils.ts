import { QueryClient } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { Fetcher } from "openapi-typescript-fetch";
import { twMerge } from "tailwind-merge";
import { paths } from "./api-spec";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient();

const fetcher = Fetcher.for<paths>();

fetcher.configure({
  baseUrl: "/api",
});

export const apiClient = fetcher;
