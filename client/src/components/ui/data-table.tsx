import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/components";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  totalRecords: number; // Total records from the server
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  onPaginationChange,
  totalRecords,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalRecords / pageSize), // Total pages
    manualPagination: true, // Enable manual pagination
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      let newPaginationState: { pageIndex: number; pageSize: number };

      // If 'updater' is a function, call it with the current pagination state
      if (typeof updater === "function") {
        newPaginationState = updater(table.getState().pagination);
      } else {
        // If 'updater' is an object, use it directly
        newPaginationState = updater;
      }

      const { pageIndex, pageSize } = newPaginationState;
      onPaginationChange(pageIndex, pageSize); // Call the external handler
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const Skeleton = () => (
    <TableRow>
      {columns.map((_, index) => (
        <TableCell key={index}>
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div>
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
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} />
                ))
              : table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
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
              : !loading && (
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
        <Button
          // variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          // variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span>
          Page {pageIndex + 1} of {Math.ceil(totalRecords / pageSize)}
        </span>
      </div>
    </div>
  );
}
