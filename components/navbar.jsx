"use client";

import {
  BoxIcon,
  BuildingIcon,
  ChevronDown,
  HandIcon,
  LayoutDashboardIcon,
  TruckIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import Link from "next/link";
import LogoutBtn from "./logoutBtn";
import useUserStore from "@/lib/state/user";

export default function Navbar({}) {
  const { user } = useUserStore();

  return (
    <nav className="flex items-center justify-between w-full h-auto px-3 bg-white border-b">
      <div>
        <Label className="py-4 playwright text-primary">3rEco</Label>
      </div>

      <div className="flex items-center justify-end">
        {user && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="px-3 py-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
              >
                {user.email} <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-80">
              <LogoutBtn />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  );
}
