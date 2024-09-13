"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneIcon } from "lucide-react";

export default function BusinessHoverCard({ business = undefined }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="block p-0 text-start">
          {business?.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold">{business?.name}</h4>
              <p className="text-sm break-normal">{business?.description}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{business?.phoneNumber}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              <Badge className="mr-2">{business?.type}</Badge>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
