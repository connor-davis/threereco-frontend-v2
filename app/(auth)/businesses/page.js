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
  ArrowUpDownIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fuzzyFilter, fuzzySort } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import LoadingSpinner from "@/components/loadingSpinner";
import { useState } from "react";
import { toast } from "sonner";

const columns = [
  {
    id: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "name",
    cell: ({ row }) => row.original.name,
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "type",
    cell: ({ row }) => row.original.type,
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "description",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate text-ellipsis max-w-64">
            {row.original.description}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="break-normal max-w-64">
            {row.original.description}
          </div>
        </TooltipContent>
      </Tooltip>
    ),
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Phone Number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "phoneNumber",
    cell: ({ row }) => row.original.phoneNumber,
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    id: "Address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDownIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    accessorKey: "address",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate text-ellipsis max-w-64">
            {[
              `${row.original.address}`,
              `${row.original.city}`,
              `${row.original.province}`,
              `${row.original.zipCode}`,
            ].join(", ")}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="break-normal max-w-64">
            {[
              `${row.original.address}`,
              `${row.original.city}`,
              `${row.original.province}`,
              `${row.original.zipCode}`,
            ].join(", ")}
          </div>
        </TooltipContent>
      </Tooltip>
    ),
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
];

export default function BusinessPage() {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { data, status, error, isLoading, isError } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => {
      return new Promise(async (resolve, reject) => {
        const businessesResponse = await fetch("/api/businesses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (businessesResponse.status !== 200) {
          return reject("Failed to fetch employees");
        }

        const data = await businessesResponse.json();

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
          <span className="text-muted-foreground">Loading businesses</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const deleteBusiness = async (id) => {
    const response = await fetch("/api/businesses?id=" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return toast.success("Success", {
        description: "You have successfully deleted the business.",
        duration: 2000,
        onAutoClose: () => {
          queryClient.invalidateQueries("businesses");
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
            placeholder="Search for business..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />

          <div className="flex items-center space-x-3">
            <Link href="/businesses/create">
              <Button variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Business
              </Button>
            </Link>
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
                            <Link href={`/businesses/${row.original.id}`}>
                              <Button variant="outline">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            View Business
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/businesses/edit/${row.original.id}`}>
                              <Button variant="outline">
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            Edit Business
                          </TooltipContent>
                        </Tooltip>

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
                                Are you sure you want to delete this business?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBusiness(row.original.id)}
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
