"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";
import { PhoneIcon } from "lucide-react";

export default function CollectorHoverCard({ collector = undefined }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="block p-0 text-start">
          {[collector?.firstName, collector?.lastName].join(" ")}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold">
                {[collector?.firstName, collector?.lastName].join(" ")}
              </h4>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{collector?.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
