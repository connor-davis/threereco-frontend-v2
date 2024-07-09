"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* <div
        className={cn(
          "grid w-full h-auto gap-3",
          user?.role === "System Admin" && "grid-cols-5",
          user?.role === "Staff" && "grid-cols-4",
          user?.role === "Business" && "grid-cols-3"
        )}
      >
        <RoleGuard requiredRoles={["System Admin"]}>
          <div className="flex flex-col items-center justify-center p-10 space-y-3 border bg-background">
            <Label>Staff</Label>
            <Label className="text-muted-foreground">0</Label>
          </div>
        </RoleGuard>
        <RoleGuard requiredRoles={["System Admin", "Staff"]}>
          <div className="flex flex-col items-center justify-center p-10 space-y-3 border bg-background">
            <Label>Businesses</Label>
            <Label className="text-muted-foreground">0</Label>
          </div>
        </RoleGuard>
        <RoleGuard requiredRoles={["System Admin", "Staff", "Business"]}>
          <div className="flex flex-col items-center justify-center p-10 space-y-3 border bg-background">
            <Label>Collectors</Label>
            <Label className="text-muted-foreground">0</Label>
          </div>
          <div className="flex flex-col items-center justify-center p-10 space-y-3 border bg-background">
            <Label>Products</Label>
            <Label className="text-muted-foreground">0</Label>
          </div>
          <div className="flex flex-col items-center justify-center p-10 space-y-3 border bg-background">
            <Label>Collections</Label>
            <Label className="text-muted-foreground">0</Label>
          </div>
        </RoleGuard>
      </div> */}
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Under Construction</CardTitle>
            <CardDescription className="text-center">
              This page is currently under construction. Please check back
              later.
            </CardDescription>
            <CardContent>
              Please contact the administrator if you have any questions or
              concerns.
            </CardContent>
            <CardFooter className="text-center">Thank You!</CardFooter>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
