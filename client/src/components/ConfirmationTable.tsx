import { FC, useCallback, useEffect, useState } from "react";
import { Confirmation } from "@/d";
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
  Label,
  ViewEntityDialog,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import {
  fetchConfirmation,
  fetchConfirmations,
  fetchReceipt,
} from "@/redux/store";
import { MoreHorizontal } from "lucide-react";

const receiptFields = [
  { accessorKey: "senderName", fieldName: "Sender Name" },
  { accessorKey: "amount", fieldName: "Amount" },
  { accessorKey: "date", fieldName: "Transaction Date" },
  { accessorKey: "confirmation", fieldName: "Confirmation" },
  { accessorKey: "memo", fieldName: "Memo" },
];

const confirmationFeilds = [
  {
    section: "User Details",
    fields: [
      { accessorKey: "user.username", fieldName: "Username" },
      { accessorKey: "user.name", fieldName: "Name" },
      { accessorKey: "user.email", fieldName: "Email" },
      { accessorKey: "user.phone", fieldName: "Phone" },
    ],
  },
  {
    section: "Confirmation Details",
    fields: [
      { accessorKey: "code", fieldName: "Code" },
      { accessorKey: "createdAt", fieldName: "Created At" },
      { accessorKey: "updatedAt", fieldName: "Last Updated At" },
    ],
  },
];

type DialogState = {
  id: string | null;
  title: string;
  fetchFunction: (id: string) => any;
  dataSelector: (state: ReturnType<typeof useAppState>) => any;
  loadingSelector: (state: ReturnType<typeof useAppState>) => boolean;
  fields: any[];
};

interface ConfirmationTableProps {}

export const ConfirmationTable: FC<ConfirmationTableProps> = () => {
  const { authenticate, confirmations } = useAppState();
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const fetchPageData = useCallback(() => {
    dispatch(
      fetchConfirmations({
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

  const userColumns: ColumnDef<Confirmation>[] = [
    {
      accessorKey: "code",
      header: "Confirmation Code",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "associatedReceipt",
      header: "Associated Receipt",
      cell: ({ row }) => {
        const confirmation = row.original;

        return confirmation.associatedReceipt ? (
          <Button
            onClick={() => {
              setDialogState({
                id: confirmation.associatedReceipt!._id,
                title: "Receipt Details",
                fetchFunction: fetchReceipt,
                dataSelector: (state) => state.receipts.foundReceipt,
                loadingSelector: (state) => state.receipts.isLoading,
                fields: receiptFields,
              });
              setIsDialogOpen(true);
            }}
          >
            View Receipt
          </Button>
        ) : (
          <Label>N/A</Label>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const confirmation = row.original;

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
                onClick={() => navigator.clipboard.writeText(confirmation._id)}
              >
                Copy Confirmation ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    id: confirmation._id,
                    title: "Confirmation Details",
                    fetchFunction: fetchConfirmation,
                    dataSelector: (state) =>
                      state.confirmations.foundConfirmation,
                    loadingSelector: (state) => state.confirmations.isLoading,
                    fields: confirmationFeilds,
                  });
                  setIsDialogOpen(true);
                }}
              >
                View Confirmation
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Confirmation</DropdownMenuItem>
              <DropdownMenuItem>Delete Confirmation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const adminColumns: ColumnDef<Confirmation>[] = [
    {
      accessorKey: "code",
      header: "Confirmation Code",
    },
    {
      accessorKey: "user.name",
      header: "User Name",
    },
    {
      accessorKey: "user.email",
      header: "User Email",
    },
    {
      id: "associatedReceipt",
      header: "Associated Receipt",
      cell: ({ row }) => {
        const confirmation = row.original;

        return confirmation.associatedReceipt ? (
          <Button
            onClick={() => {
              setDialogState({
                id: confirmation.associatedReceipt!._id,
                title: "Receipt Details",
                fetchFunction: fetchReceipt,
                dataSelector: (state) => state.receipts.foundReceipt,
                loadingSelector: (state) => state.receipts.isLoading,
                fields: receiptFields,
              });
              setIsDialogOpen(true);
            }}
          >
            View Receipt
          </Button>
        ) : (
          <Label>N/A</Label>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const confirmation = row.original;

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
                onClick={() => navigator.clipboard.writeText(confirmation._id)}
              >
                Copy Confirmation ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    id: confirmation._id,
                    title: "Confirmation Details",
                    fetchFunction: fetchConfirmation,
                    dataSelector: (state) =>
                      state.confirmations.foundConfirmation,
                    loadingSelector: (state) => state.confirmations.isLoading,
                    fields: [
                      { accessorKey: "code", fieldName: "Code" },
                      { accessorKey: "createdAt", fieldName: "Created At" },
                      {
                        accessorKey: "updatedAt",
                        fieldName: "Last Updated At",
                      },
                    ],
                  });
                  setIsDialogOpen(true);
                }}
              >
                View Confirmation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto">
      <DataTable
        columns={
          authenticate.user?.role === "USER" ? userColumns : adminColumns
        }
        data={confirmations.confirmations}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalRecords={confirmations.meta?.itemCount || 0}
        onPaginationChange={handlePaginationChange}
        loading={confirmations.isLoadingConfirmations}
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
