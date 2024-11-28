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
  ViewEntityDialog,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { fetchUser, fetchUsers } from "@/redux/store";
import { MoreHorizontal } from "lucide-react";

const userFields = [
  { accessorKey: "username", fieldName: "Username" },
  { accessorKey: "name", fieldName: "Name" },
  { accessorKey: "phone", fieldName: "Phone" },
  { accessorKey: "email", fieldName: "Email" },
  { accessorKey: "address", fieldName: "Address" },
  { accessorKey: "createdAt", fieldName: "Created At" },
  { accessorKey: "updatedAt", fieldName: "Last Updated At" },
];

type DialogState = {
  id: string | null;
  title: string;
  fetchFunction: (id: string) => any;
  dataSelector: (state: ReturnType<typeof useAppState>) => any;
  loadingSelector: (state: ReturnType<typeof useAppState>) => boolean;
  fields: any[];
};

interface UserTableProps {}

export const UserTable: FC<UserTableProps> = () => {
  const { authenticate } = useAppState();
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const fetchPageData = useCallback(() => {
    dispatch(
      fetchUsers({
        page: pagination.pageIndex + 1, // Convert 0-based index to 1-based
        limit: pagination.pageSize,
      })
    );
  }, [dispatch, pagination]);

  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    setPagination({ pageIndex, pageSize });
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      setDialogState(null);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const columns: ColumnDef<User>[] = [
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
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    id: user._id,
                    title: "Seller Details",
                    fetchFunction: fetchUser,
                    dataSelector: (state) => state.authenticate.foundUser,
                    loadingSelector: (state) => state.authenticate.isLoading,
                    fields: userFields,
                  });
                  setIsDialogOpen(true);
                }}
              >
                View Seller
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Seller</DropdownMenuItem>
              <DropdownMenuItem>Delete Seller</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
      {dialogState && (
        <ViewEntityDialog
          isDialogOpen={isDialogOpen}
          handleDialogOpenChange={handleDialogOpenChange}
          title={dialogState.title}
          fetchFunction={dialogState.fetchFunction}
          dataSelector={dialogState.dataSelector}
          loadingSelector={dialogState.loadingSelector}
          fields={dialogState.fields}
          id={dialogState.id!}
        />
      )}
    </div>
  );
};
