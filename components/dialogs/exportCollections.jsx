import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import useAuthenticationStore from "@/lib/state/authentication";
import { cn } from "@/lib/utils";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarIcon, DownloadCloudIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function ExportCollectionsDialog() {
  const { token } = useAuthenticationStore();

  const [date, setDate] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const exportData = async () => {
    const response = await fetch(
      "/api/collections/export?startDate=" +
        date.from.toISOString() +
        "&endDate=" +
        date.to.toISOString(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.arrayBuffer();
      const blob = new Blob([data], { type: "text/csv" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor tag for downloading
      const a = document.createElement("a");

      // Set the URL and download attribute of the anchor tag
      a.href = url;
      a.download =
        "collections-export-" +
        format(new Date(), "dd-MM-yyyy-hh-mm-ss") +
        ".csv";

      // Trigger the download by clicking the anchor tag
      a.click();
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DownloadCloudIcon className="w-4 h-4 mr-2" />
          Export Collections
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Collections</DialogTitle>
          <DialogDescription>
            Select the date range for the collections to export.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full h-auto space-y-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={3}
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => exportData()}>
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
