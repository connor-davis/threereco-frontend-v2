"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loadingSpinner";
import { PhoneIcon } from "lucide-react";
import useAuthenticationStore from "@/lib/state/authentication";

export default function CollectorHoverCard({ collector_id = undefined }) {
  const { token } = useAuthenticationStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["collectors", collector_id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const collectorResponse = await fetch(
          "/api/collector/" + collector_id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (collectorResponse.status !== 200) {
          return reject("Failed to fetch collector");
        }

        const data = await collectorResponse.json();

        resolve(data.collector);
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
          {[data?.first_name, data?.last_name].join(" ")}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold">
                {[data?.first_name, data?.last_name].join(" ")}
              </h4>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{data?.phone_number}</span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
