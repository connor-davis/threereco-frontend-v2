"use client";

import LoadingSpinner from "@/components/loadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { getRandomFillColor } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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

export default function DashboardPage() {
  const {
    data: datedCollectionWeights,
    isFetching: isFetchingDatedCollectionWeights,
  } = useQuery({
    initialData: [],
    queryKey: ["analytics", "dated-collection-weights"],
    queryFn: () =>
      new Promise(async (resolve, reject) => {
        const analyticsResponse = await fetch(
          "/api/analytics/stock/dated-collection-weights?month=8&year=2024",
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

        resolve([
          [...new Set(data.map((item) => item.productName))],
          Object.keys(mapping).map((key) => ({ ...mapping[key], date: key })),
        ]);
      }),
  });

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
