import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import { DownloadCloudIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthenticationStore from "@/lib/state/authentication";
import { useState } from "react";

export default function ExportDataDialog({ isFullView }) {
  const { token } = useAuthenticationStore();

  const [selectedDataType, setSelectedDataType] = useState("business");

  const exportData = async () => {
    const response = await fetch("/api/export/" + selectedDataType, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.arrayBuffer();
      const blob = new Blob([data], { type: "text/csv" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor tag for downloading
      const a = document.createElement("a");

      // Set the URL and download attribute of the anchor tag
      a.href = url;
      a.download = "download.csv";

      // Trigger the download by clicking the anchor tag
      a.click();
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-start p-3 transition-all duration-300 hover:bg-transparent hover:text-primary text-muted-foreground"
        >
          <DownloadCloudIcon className={cn("w-4 h-4", isFullView && "mr-2")} />
          {isFullView && "Export Data"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose a data type below to export to a{" "}
            <span className="text-primary">".csv"</span> file.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full h-auto space-y-5">
          <Select
            onValueChange={(value) => setSelectedDataType(value)}
            defaultValue={selectedDataType}
            value={selectedDataType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Data Types</SelectLabel>
                <SelectItem value="business">Businesses</SelectItem>
                <SelectItem value="collector">Collectors</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="collection">Collections</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
