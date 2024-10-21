import { postApiAuthenticationLogout } from "@/api-client";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { BuildingIcon, HandIcon, LogOutIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SideBar() {
  const { open } = useSidebar();

  const navigate = useNavigate();

  const logout = async () => {
    const { error, response } = await postApiAuthenticationLogout();

    if (error)
      return toast.error(response.statusText, {
        description: error.message,
        duration: 2000,
      });
    else
      return navigate({
        to: "/authentication/login",
        search: { to: location.pathname },
      });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link to="/">
                      <DashboardIcon className="size-4" />
                      <Label className="cursor-pointer">Dashboard</Label>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">Dashboard</TooltipContent>
                )}
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link to="/users">
                      <UsersIcon className="size-4" />
                      <Label className="cursor-pointer">Users</Label>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {!open && <TooltipContent side="right">Users</TooltipContent>}
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link to="/businesses">
                      <BuildingIcon className="size-4" />
                      <Label className="cursor-pointer">Businesses</Label>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">Businesses</TooltipContent>
                )}
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link to="/collectors">
                      <HandIcon className="size-4" />
                      <Label className="cursor-pointer">Collectors</Label>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">Collectors</TooltipContent>
                )}
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton>
                      <LogOutIcon className="size-4" />
                      Logout
                    </SidebarMenuButton>
                  </TooltipTrigger>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out and you will need to login again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => logout()}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {!open && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
