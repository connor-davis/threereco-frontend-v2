"use client";

import { ChevronDown, UserIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import useUserStore from "@/lib/state/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutBtn from "./logoutBtn";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import ProfileAvatar from "./profileAvatar";

export default function Navbar({}) {
  const { user } = useUserStore();

  const path = usePathname();

  return (
    <nav className="flex items-center justify-between w-full h-auto p-3 bg-background border-b">
      <div>
        <Label className="py-4 playwright text-primary">3rEco</Label>
      </div>

      <div className="flex items-center justify-end">
        {user && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="px-3 py-0 transition-all h-auto duration-300 hover:bg-primary/20 hover:text-primary text-muted-foreground"
              >
                <div className="flex items-center space-x-2">
                  <ProfileAvatar />
                  <Label className="p-3">{user.email}</Label>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-80">
              <Link href={`/profile?redirect=${path}`}>
                <Button
                  className="w-full px-3 py-2 hover:text-primary"
                  variant="ghost"
                >
                  Profile
                  <UserIcon className="w-4 h-4 ml-auto" />
                </Button>
              </Link>

              <LogoutBtn />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  );
}
