"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";

export default function ProductHoverCard({ product = undefined }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="block p-0 text-start">
          {product?.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold">{product?.name}</h4>
              <p className="text-sm break-normal">{product?.description}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <span>R {parseFloat(product?.price).toFixed(2)} per kg</span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
