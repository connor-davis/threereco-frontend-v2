"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Input } from "./ui/input";
import { useState } from "react";

export default function SearchSelect({
  list = [],
  defaultValue = undefined,
  valueKey = "id",
  labelKey = "email",
  onValueChange = (value) => {},
}) {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <Select
      onValueChange={(value) => {
        onValueChange(value);
        setValue(value);
      }}
      defaultValue={value}
      value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        <Input
          type="text"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          placeholder={`Search for ${labelKey}...`}
        />
        <SelectItem value={undefined}>--</SelectItem>
        {list
          .filter((item) =>
            item[labelKey].toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <SelectItem key={item[valueKey]} value={item[valueKey]}>
              {item[labelKey]}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
