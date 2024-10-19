import { PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SideBarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => toggleSidebar()}>
          <PanelLeftOpen className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Open Sidebar</TooltipContent>
    </Tooltip>
  );
}
