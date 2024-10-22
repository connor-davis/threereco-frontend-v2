import {
  deleteApiCollectionsByIdMutation,
  getApiCollectionsOptions,
  getApiCollectionsPagingQueryKey,
  getApiCollectionsQueryKey,
  getApiProductsPagingOptions,
} from "@/api-client/@tanstack/react-query.gen";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExportCollectionsDialog from "../dialogs/export/export-collections";
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

export default function CollectionsTable({ caption = undefined }) {
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(10);

  const queryClient = useQueryClient();

  const {
    data: paging,
    isLoading: isLoadingPaging,
    isError: isPagingError,
  } = useQuery({
    ...getApiProductsPagingOptions({ query: { count } }),
  });

  const {
    data: collections,
    isLoading: isLoadingCollections,
    isError: isCollectionsError,
  } = useQuery({
    ...getApiCollectionsOptions({
      query: {
        count,
        page,
        includeBusiness: "true",
        includeCollector: "true",
        includeProduct: "true",
      },
    }),
  });

  const deleteCollection = useMutation({
    ...deleteApiCollectionsByIdMutation(),
    onError: (error, variables) => {
      toast.error("Failed", {
        description: error.message,
        duration: 2000,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getApiCollectionsQueryKey({
          query: {
            count,
            page,
            includeBusiness: "true",
            includeCollector: "true",
            includeProduct: "true",
          },
        }),
      }),
  });

  useEffect(() => {
    const disposeable = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: getApiCollectionsPagingQueryKey({
          query: {
            count,
          },
        }),
      });

      queryClient.invalidateQueries({
        queryKey: getApiCollectionsQueryKey({
          query: {
            count,
            page,
            includeBusiness: "true",
            includeCollector: "true",
            includeProduct: "true",
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
          <Link to="/collections/create" className="w-full lg:max-w-[200px]">
            <Button variant="outline" className="w-full">
              <PlusIcon className="size-4 mr-2" />
              Create Collection
            </Button>
          </Link>

          <ExportCollectionsDialog />
        </div>
      </div>

      <div className="bg-background border rounded-md">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}

          {collections?.length === 0 && (
            <TableCaption className="py-4">
              There are no collection.
            </TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableCell>Business</TableCell>
              <TableCell>Collector</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Weight (kg)</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {collections?.map((collection, index) => (
              <TableRow key={index}>
                <TableCell>
                  {collection.businessId ? (
                    <Link
                      to="/businesses/$id"
                      params={{ id: collection.businessId }}
                    >
                      <Label className="font-normalh-auto text-primary underline cursor-pointer">
                        {collection.business?.name}
                      </Label>
                    </Link>
                  ) : (
                    "--"
                  )}
                </TableCell>

                <TableCell>
                  {collection.collectorId ? (
                    <Link
                      to="/collectors/$id"
                      params={{ id: collection.collectorId }}
                    >
                      <Label className="font-normalh-auto text-primary underline cursor-pointer">
                        {[
                          collection.collector?.firstName,
                          collection.collector?.lastName,
                        ].join(" ")}
                      </Label>
                    </Link>
                  ) : (
                    "--"
                  )}
                </TableCell>

                <TableCell>
                  {collection.productId ? (
                    <Link
                      to="/products/$id"
                      params={{ id: collection.productId }}
                    >
                      <Label className="font-normalh-auto text-primary underline cursor-pointer">
                        {collection.product?.name}
                      </Label>
                    </Link>
                  ) : (
                    "--"
                  )}
                </TableCell>

                <TableCell>{collection.weight}</TableCell>

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
                            to={"/collections/$id"}
                            params={{ id: collection.id }}
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="size-4 mr-2" />
                              <Label>View</Label>
                            </DropdownMenuItem>
                          </Link>

                          <Link
                            to={"/collections/edit/$id"}
                            params={{ id: collection.id }}
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
                          This action can not be undone. The collection will be
                          permanently removed from the server a long with all
                          it's data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteCollection.mutate({
                              path: {
                                id: collection.id,
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

            {(isLoadingPaging || isLoadingCollections) &&
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
