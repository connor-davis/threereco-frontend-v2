"use client";

import {
  BoxIcon,
  BuildingIcon,
  ExpandIcon,
  HandIcon,
  LayoutDashboardIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import { Button } from "./ui/button";
import Link from "next/link";
import RoleGuard from "./guards/role";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Sidebar() {
  const [isFullView, setIsFullView] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-white h-full w-auto",
        isFullView && "w-48"
      )}
    >
      <Button
        onClick={() => setIsFullView(!isFullView)}
        variant="ghost"
        className="p-3 ml-auto transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
      >
        {isFullView ? (
          <PanelLeftCloseIcon className="w-4 h-4" />
        ) : (
          <PanelLeftOpenIcon className="w-4 h-4" />
        )}
      </Button>
      <Link href="/">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
            >
              <LayoutDashboardIcon
                className={cn("w-4 h-4", isFullView && "mr-2")}
              />
              {isFullView && "Dashboard"}
            </Button>
          </TooltipTrigger>
          {!isFullView && (
            <TooltipContent side="right">
              <span>Dashboard</span>
            </TooltipContent>
          )}
        </Tooltip>
      </Link>
      <RoleGuard requiredRoles={["System Admin"]}>
        <Link href="/staff">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
              >
                <UsersIcon className={cn("w-4 h-4", isFullView && "mr-2")} />
                {isFullView && "Staff"}
              </Button>
            </TooltipTrigger>
            {!isFullView && (
              <TooltipContent side="right">
                <span>Staff</span>
              </TooltipContent>
            )}
          </Tooltip>
        </Link>
      </RoleGuard>
      <RoleGuard requiredRoles={["System Admin", "Staff"]}>
        <Link href="/businesses">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
              >
                <BuildingIcon className={cn("w-4 h-4", isFullView && "mr-2")} />
                {isFullView && "Businesses"}
              </Button>
            </TooltipTrigger>
            {!isFullView && (
              <TooltipContent side="right">
                <span>Businesses</span>
              </TooltipContent>
            )}
          </Tooltip>
        </Link>
      </RoleGuard>
      <RoleGuard requiredRoles={["System Admin", "Staff", "Business"]}>
        <Link href="/collectors">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
              >
                <HandIcon className={cn("w-4 h-4", isFullView && "mr-2")} />
                {isFullView && "Collectors"}
              </Button>
            </TooltipTrigger>
            {!isFullView && (
              <TooltipContent side="right">
                <span>Collectors</span>
              </TooltipContent>
            )}
          </Tooltip>
        </Link>
        <Link href="/products">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
              >
                <BoxIcon className={cn("w-4 h-4", isFullView && "mr-2")} />
                {isFullView && "Products"}
              </Button>
            </TooltipTrigger>
            {!isFullView && (
              <TooltipContent side="right">
                <span>Products</span>
              </TooltipContent>
            )}
          </Tooltip>
        </Link>
        <Link href="/collections">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
              >
                <TruckIcon className={cn("w-4 h-4", isFullView && "mr-2")} />
                {isFullView && "Collections"}
              </Button>
            </TooltipTrigger>
            {!isFullView && (
              <TooltipContent side="right">
                <span>Collections</span>
              </TooltipContent>
            )}
          </Tooltip>
        </Link>
      </RoleGuard>
    </div>
  );
}
