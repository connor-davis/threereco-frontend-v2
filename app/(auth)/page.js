"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Under Construction</CardTitle>
            <CardDescription className="text-center">
              This page is currently under construction. Please check back
              later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
