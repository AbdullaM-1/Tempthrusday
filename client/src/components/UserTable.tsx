import { FC, useCallback, useEffect, useState } from "react";
import { User } from "@/d";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchUsers } from "@/redux/store";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user._id)}
            >
              Copy Seller ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Seller</DropdownMenuItem>
            <DropdownMenuItem>Edit Seller</DropdownMenuItem>
            <DropdownMenuItem>Delete Seller</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface UserTableProps {}

export const UserTable: FC<UserTableProps> = () => {
  const { authenticate } = useAppState();
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchPageData = useCallback(() => {
    dispatch(
      fetchUsers({
        page: pagination.pageIndex + 1, // Convert 0-based index to 1-based
        limit: pagination.pageSize,
      })
    );
  }, [dispatch, pagination]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPagination({ pageIndex, pageSize });
  };

  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={authenticate.users}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalRecords={authenticate.meta?.itemCount || 0}
        onPaginationChange={handlePaginationChange}
        loading={authenticate.isLoadingUsers}
      />
    </div>
  );
};
