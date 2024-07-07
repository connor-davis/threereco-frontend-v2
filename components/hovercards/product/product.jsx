"use client";

import { DollarSignIcon, PhoneIcon, WeightIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loadingSpinner";
import useAuthenticationStore from "@/lib/state/authentication";

export default function ProductHoverCard({ product_id = undefined }) {
  const { token } = useAuthenticationStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["products", product_id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const productResponse = await fetch("/api/product/" + product_id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (productResponse.status !== 200) {
          return reject("Failed to fetch product");
        }

        const data = await productResponse.json();

        resolve(data.product);
      });
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="block p-0 text-start">
          {data?.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold">{data?.name}</h4>
              <p className="text-sm break-normal">{data?.description}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <span>R {parseFloat(data?.price).toFixed(2)} per kg</span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
