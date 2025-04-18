import { getApiCollectorsExport } from "@/api-client";
import {
  deleteApiCollectorsByIdMutation,
  getApiCollectorsOptions,
  getApiCollectorsPagingOptions,
  getApiCollectorsPagingQueryKey,
  getApiCollectorsQueryKey,
} from "@/api-client/@tanstack/react-query.gen";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadCloudIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CollectorsTable({ caption = undefined }) {
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(10);

  const queryClient = useQueryClient();

  const {
    data: paging,
    isLoading: isLoadingPaging,
    isError: isPagingError,
  } = useQuery({
    ...getApiCollectorsPagingOptions({ query: { count } }),
  });

  const {
    data: collectors,
    isLoading: isLoadingCollectors,
    isError: isCollectorsError,
  } = useQuery({
    ...getApiCollectorsOptions({
      query: {
        count,
        page,
        includeUser: "true",
      },
    }),
  });

  const deleteCollector = useMutation({
    ...deleteApiCollectorsByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getApiCollectorsQueryKey({
          query: {
            count,
            page,
          },
        }),
      }),
  });

  const exportData = async () => {
    const { data, error } = await getApiCollectorsExport();

    if (error)
      return toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    else {
      if (data.length === 0 || typeof data !== "string")
        return toast.error("Failed", {
          description: "There are no collections for that date range.",
          duration: 2000,
        });

      const blob = new Blob([data], { type: "text/csv" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor tag for downloading
      const a = document.createElement("a");

      // Set the URL and download attribute of the anchor tag
      a.href = url;
      a.download =
        "collectors-export-" +
        format(new Date(), "dd-MM-yyyy-hh-mm-ss") +
        ".csv";

      // Trigger the download by clicking the anchor tag
      a.click();
      return;
    }
  };

  useEffect(() => {
    const disposeable = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: getApiCollectorsPagingQueryKey({
          query: {
            count,
          },
        }),
      });

      queryClient.invalidateQueries({
        queryKey: getApiCollectorsQueryKey({
          query: {
            count,
            page,
          },
        }),
      });
    }, 0);

    return () => clearTimeout(disposeable);
  }, [page, count]);

  return (
    <div className="flex flex-col w-full h-auto space-y-2">
      <div className="flex flex-col w-full lg:flex-row items-center lg:justify-between space-y-2 lg:space-y-0 lg:space-x-2">
        <div className="flex flex-col w-full lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2"></div>

        <div className="flex flex-col w-full lg:flex-row items-center lg:justify-end space-y-2 lg:space-y-0 lg:space-x-2">
          <Link to="/collectors/create" className="w-full lg:max-w-[200px]">
            <Button variant="outline" className="w-full">
              <PlusIcon className="size-4 mr-2" />
              Create Collector
            </Button>
          </Link>

          <Button variant="outline" onClick={() => exportData()}>
            <DownloadCloudIcon className="w-4 h-4 mr-2" />
            Export Collectors
          </Button>
        </div>
      </div>

      <div className="bg-background border rounded-md">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}

          {collectors?.length === 0 && (
            <TableCaption className="py-4">
              There are no collectors.
            </TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>ID Number</TableCell>
              <TableCell>Tracker Code</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {collectors?.map((collector, index) => (
              <TableRow key={index}>
                <TableCell>
                  {[collector.firstName, collector.lastName].join(" ")}
                </TableCell>
                <TableCell>{collector.idNumber}</TableCell>
                <TableCell>{collector.trackerCode ?? "--"}</TableCell>
                <TableCell>
                  {collector.userId ? (
                    <Link to="/users/$id" params={{ id: collector.userId }}>
                      <Label className="font-normalh-auto text-primary underline cursor-pointer">
                        {collector.user?.email}
                      </Label>
                    </Link>
                  ) : (
                    "--"
                  )}
                </TableCell>

                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <DotsHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <Link
                            to={"/collectors/$id"}
                            params={{ id: collector.id }}
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="size-4 mr-2" />
                              <Label>View</Label>
                            </DropdownMenuItem>
                          </Link>

                          <Link
                            to={"/collectors/edit/$id"}
                            params={{ id: collector.id }}
                          >
                            <DropdownMenuItem>
                              <PencilIcon className="size-4 mr-2" />
                              <Label>Edit</Label>
                            </DropdownMenuItem>
                          </Link>

                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                              <TrashIcon className="size-4 mr-2" />
                              <Label>Delete</Label>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action can not be undone. The collector will be
                          permanently removed from the server a long with all
                          their data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteCollector.mutate({
                              path: {
                                id: collector.id,
                              },
                            })
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}

            {(isLoadingPaging || isLoadingCollectors) &&
              new Array(count).fill(0).map((_, index) => (
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2">
        <Select
          defaultValue="10"
          onValueChange={(value) => setCount(parseInt(value))}
        >
          <SelectTrigger className="w-full lg:max-w-[200px]">
            <SelectValue placeholder="Number of users to display?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Previous Page</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={page === (paging?.totalPages ?? 1)}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Next Page</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
