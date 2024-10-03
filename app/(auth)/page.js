"use client";

import LoadingSpinner from "@/components/loadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="flex flex-col w-full h-full overflow-y-auto p-3">
      <Card className="lg:col-span-6 md:col-span-2 col-span-1">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Daily Collection Weights</CardTitle>
            <CardDescription>
              Showing the daily total of collection weights.
            </CardDescription>
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
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={{}}
            className="aspect-auto lg:h-[400px] md:h-[300px] h-[250px] w-full"
          >
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
        </CardContent>
      </Card>
    </div>
  );
}
