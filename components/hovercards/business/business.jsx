"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loadingSpinner";
import { PhoneIcon } from "lucide-react";
import useAuthenticationStore from "@/lib/state/authentication";
import useUserStore from "@/lib/state/user";

export default function BusinessHoverCard({ business_id = undefined }) {
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["businesses", business_id],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessResponse = await fetch("/api/business/" + business_id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (businessResponse.status !== 200) {
          return reject("Failed to fetch business");
        }

        const data = await businessResponse.json();

        resolve(data.business);
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
          {data?.business_name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold">{data?.business_name}</h4>
              <p className="text-sm break-normal">
                {data?.business_description}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{data?.phone_number}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              <Badge className="mr-2">{data?.business_type}</Badge>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
