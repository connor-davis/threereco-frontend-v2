"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useAuthenticationStore from "@/lib/state/authentication";

export default function CollectorSearch({
  className,
  value = null,
  defaultValue = null,
  onSelected = (collectorId) => {},
  ...props
}) {
  const { token } = useAuthenticationStore();

  const [searchValue, setSearchValue] = useState(defaultValue ?? value ?? null);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(defaultValue ?? value ?? null);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      if (searchValue ?? props.selected ?? props.defaultSelected) {
        const response = await fetch(
          `/api/collectors/search?query=${
            searchValue ?? props.selected ?? props.defaultSelected
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const collectors = await response.json();
          setSearchResults(collectors);
        } else {
          const jsonText = await response.text();

          try {
            const { error, reason } = JSON.parse(jsonText);

            toast.error(error, {
              description: reason,
            });
          } catch (error) {
            toast.error("Failed to search for collector", {
              description: jsonText,
            });
          }
        }
      }
    }, 500);

    return () => {
      clearTimeout(disposeableTimeout);
    };
  }, [searchValue]);

  return (
    <div className="flex flex-col space-y-3">
      <Input
        placeholder="Search collector"
        className={className}
        {...props}
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />

      {searchResults &&
        searchValue &&
        searchValue.length > 0 &&
        searchResults.length > 0 && (
          <div className="flex flex-col p-1 space-y-1 overflow-y-auto border bg-muted max-h-64 rounded-md">
            {searchResults.map((collector) => (
              <div
                className={cn(
                  "flex flex-col items-start justify-start h-auto rounded-md space-y-2 border p-2 cursor-pointer transition-all bg-background duration-200 ease-in-out",
                  selected === collector.id && "border-primary"
                )}
                key={collector.id}
                onClick={() => {
                  setSelected(collector.id);
                  onSelected(collector.id);
                }}
              >
                <Label>
                  {[collector.firstName, collector.lastName].join(" ")}
                </Label>
                <div className="flex flex-col space-y-1">
                  <Label className="flex items-center text-muted-foreground">
                    <MailIcon className="w-4 h-4 mr-2" />
                    {collector.user?.email}
                  </Label>
                  <Label className="flex items-center text-muted-foreground">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {collector.phoneNumber}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
