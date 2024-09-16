"use client";

import LoadingSpinner from "@/components/loadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRandomFillColor } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(8);
  const [selectedYear, setSelectedYear] = useState(2024);

  const queryClient = useQueryClient();

  const [datedCollectionWeights, setDatedCollectionWeights] = useState([]);
  const [isFetchingDatedCollectionWeights, setFetchingDatedCollectionWeights] =
    useState(true);

  useEffect(() => {
    const disposeableTimeout = setTimeout(async () => {
      const analyticsResponse = await fetch(
        "/api/analytics/stock/dated-collection-weights?month=" +
          selectedMonth +
          "&year=" +
          selectedYear,
        { method: "GET" }
      );

      const status = analyticsResponse.status;

      if (status !== 200)
        return toast.error("Error", {
          description: "Failed to fetch dated collection weights analytics.",
          duration: 2000,
        });

      const data = await analyticsResponse.json();

      const productNames = [];
      const mapping = {};

      for (const item of data) {
        productNames.push(item.productName);

        if (!mapping[item.collectionDate]) mapping[item.collectionDate] = {};

        mapping[item.collectionDate][item.productName] = item.totalWeight;
      }

      setDatedCollectionWeights([
        [...new Set(data.map((item) => item.productName))],
        Object.keys(mapping).map((key) => ({ ...mapping[key], date: key })),
      ]);
      setFetchingDatedCollectionWeights(false);
    }, 500);

    return () => clearTimeout(disposeableTimeout);
  }, [selectedMonth, selectedYear]);

  if (isFetchingDatedCollectionWeights)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-3">
          <LoadingSpinner />
          <Label className="text-muted-foreground">Loading graphs.</Label>
        </div>
      </div>
    );

  return (
    <div className="grid lg:grid-cols-12 md:grid-cols-6 grid-cols-1 w-full h-full overflow-hidden gap-3">
      <div className="flex flex-col w-full h-full p-3 space-y-3 overflow-y-auto bg-background border rounded-md lg:col-span-12 md:col-span-6 col-span-1">
        <div className="flex w-full items-center h-auto justify-between">
          <div className="flex flex-col h-auto space-y-3">
            <Label>Daily Collection Weights</Label>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              value={selectedMonth ?? 0}
              defaultValue={selectedMonth ?? 0}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem value={index}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear ?? 0}
              defaultValue={selectedYear ?? 0}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ChartContainer config={{}}>
          <BarChart accessibilityLayer data={datedCollectionWeights[1]}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip />
            <Legend />

            {datedCollectionWeights[0].map((productName) => (
              <Bar
                dataKey={productName}
                fill={getRandomFillColor()}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
