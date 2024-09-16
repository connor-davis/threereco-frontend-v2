"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fuzzyFilter, fuzzySort } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";

import RoleGuard from "@/components/guards/role";
import BusinessHoverCard from "@/components/hovercards/business/business";
import CollectorHoverCard from "@/components/hovercards/collector/collector";
import ProductHoverCard from "@/components/hovercards/product/product";
import LoadingSpinner from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthenticationStore from "@/lib/state/authentication";
import useUserStore from "@/lib/state/user";
import Link from "next/link";
import { toast } from "sonner";
import ExportCollectionsDialog from "@/components/dialogs/exportCollections";

const columns = [
  {
    id: "Business",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Business
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "business",
    cell: ({ row }) => (
      <>
        <RoleGuard requiredRoles={["System Admin", "Staff"]}>
          <BusinessHoverCard business={row.original.business} />
        </RoleGuard>
        <RoleGuard requiredRoles={["Business"]}>--</RoleGuard>
      </>
    ),
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Collector",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Collector
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "collector",
    cell: ({ row }) => (
      <CollectorHoverCard collector={row.original.collector} />
    ),
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Product",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "product",
    cell: ({ row }) => <ProductHoverCard product={row.original.product} />,
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Weight",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Weight (kg)
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "weight",
    cell: ({ row }) => parseFloat(row.original.weight).toFixed(2),
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
];

export default function CollectionsPage() {
  const { token } = useAuthenticationStore();
  const { user } = useUserStore();

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["collections"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const collectionsResponse = await fetch(
          "/api/collections?includeBusiness=true&includeCollector=true&includeProduct=true",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (collectionsResponse.status !== 200) {
          return reject("Failed to fetch collections");
        }

        const data = await collectionsResponse.json();

        resolve(data);
      });
    },
  });

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    sortDescFirst: false,
    enableSorting: true,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center space-x-3">
          <LoadingSpinner />
          <span className="text-muted-foreground">Loading collections</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const deleteCollection = async (id) => {
    const response = await fetch("/api/collections?id=" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the collection.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("collections");
        },
      });
    } else {
      const errorText = await response.text();

      try {
        const { error, reason } = JSON.parse(errorText);

        toast.error(error, {
          description: reason,
          duration: 2000,
        });
      } catch {
        toast.error("An error occurred", {
          description: "Please try again later.",
          duration: 2000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-y-auto">
      <div className="flex flex-col w-full h-full p-3 overflow-y-auto">
        <div className="flex items-center justify-between pb-3">
          <Input
            placeholder="Search for collection..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />

          <div className="flex items-center space-x-3">
            <RoleGuard requiredRoles={["Business"]}>
              <Link href="/collections/create">
                <Button variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Collection
                </Button>
              </Link>
            </RoleGuard>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <RoleGuard requiredRoles={["System Admin", "Admin"]}>
              <ExportCollectionsDialog />
            </RoleGuard>
          </div>
        </div>
        <div className="border rounded-md bg-background">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/collections/${row.original.id}`}>
                              <Button variant="outline">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            View Collection
                          </TooltipContent>
                        </Tooltip>

                        <RoleGuard requiredRoles={["Business"]}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/collections/edit/${row.original.id}`}
                              >
                                <Button variant="outline">
                                  <PencilIcon className="w-4 h-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              Edit Collection
                            </TooltipContent>
                          </Tooltip>
                        </RoleGuard>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hold On!</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this collection?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteCollection(row.original.id)
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end py-4 space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
