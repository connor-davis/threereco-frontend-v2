"use client";

import { useEffect, useState } from "react";

import { Input } from "./ui/input";

export default function CollectorSearch({
  className,
  onSelected = (collector_id) => {},
  ...props
}) {
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      if (searchValue) {
        const response = await fetch(`/api/collector/search/${searchValue}`);

        console.log(await response.text());
      }
    }, 0);

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
    </div>
  );
}
