"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Transaction } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DeleteTransactionButton from "../delete-transaction-button";
import CreateTransactionDialog from "../dialogs/transactions/create-transaction-dialog";
import Spinner from "../spinners/spinner";
import { Label } from "../ui/label";
import VerifyTransactionButton from "../verify-transaction-button";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "amount",
    id: "Transaction Amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.amount);

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "fromAccountNumber",
    id: "Transaction From",
    header: () => <div>From</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.original.fromAccountNumber}</div>
      );
    },
  },
  {
    accessorKey: "toAccountNumber",
    id: "Transaction To",
    header: () => <div>To</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.toAccountNumber}</div>;
    },
  },
  {
    accessorKey: "providerCode",
    id: "Transaction Provider Code",
    header: () => <div>Provider Code</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.providerCode}</div>;
    },
  },
  {
    accessorKey: "provider",
    id: "Transaction Provider",
    header: () => <div>Provider</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.provider}</div>;
    },
  },
  {
    id: "Transaction Actions Administrator",
    enableHiding: false,
    cell: ({ row, column }) => {
      const id = row.original.id;

      if (row.original.verified) return column.toggleVisibility();

      return (
        <div className="flex items-center space-x-3">
          <VerifyTransactionButton id={id} />
          <DeleteTransactionButton id={id} />
        </div>
      );
    },
  },
  {
    id: "Transaction Actions Customer",
    enableHiding: false,
    cell: ({ row, column }) => {
      const id = row.original.id;

      if (row.original.verified) return column.toggleVisibility();

      return (
        <div className="flex items-center space-x-3">
          <DeleteTransactionButton id={id} />
        </div>
      );
    },
  },
];

export default function TransactionsTable({
  data = [],
}: {
  data: Transaction[];
}) {
  const {
    data: user,
    isFetching: isFetchingUser,
    isError: isUserError,
  } = useQuery<{ role: string }, string>({
    initialData: { role: "customer " },
    queryKey: ["transactions", "user-state"],
    queryFn: () =>
      new Promise(async (resolve, reject) => {
        const checkResponse = await fetch("/api/authentication/check", {
          method: "GET",
        });

        const checkStatus = checkResponse.status;

        if (checkStatus !== 200) return reject();
        else {
          const user = await checkResponse.json();

          resolve(user);
        }
      }),
    retry: false,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns:
      user.role === "customer"
        ? columns.filter(
            (column) => column.id !== "Transaction Actions Administrator"
          )
        : columns.filter(
            (column) => column.id !== "Transaction Actions Customer"
          ),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isFetchingUser)
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex items-center space-x-3">
          <Spinner className="w-4 h-4" />
          <Label>Checking user...</Label>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full bg-background border p-3 rounded-md">
      <div className="flex items-center justify-between w-full">
        <Label className="font-bold text-xl">Transactions</Label>

        <div className="flex items-center space-x-3">
          {user.role === "customer" && <CreateTransactionDialog />}
        </div>
      </div>

      <div className="flex items-center py-4">
        <></>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
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
      <div className="rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}
