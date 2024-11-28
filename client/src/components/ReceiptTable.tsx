import { FC, useCallback, useEffect, useState } from "react";
import { Receipt } from "@/d";
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
import { fetchReceipt, fetchReceipts, fetchUser } from "@/redux/store";
import { MoreHorizontal } from "lucide-react";

const recipientFields = [
  { accessorKey: "username", fieldName: "Username" },
  { accessorKey: "name", fieldName: "Name" },
  { accessorKey: "phone", fieldName: "Phone" },
  { accessorKey: "email", fieldName: "Email" },
];

type DialogState = {
  id: string | null;
  title: string;
  fetchFunction: (id: string) => any;
  dataSelector: (state: ReturnType<typeof useAppState>) => any;
  loadingSelector: (state: ReturnType<typeof useAppState>) => boolean;
  fields: any[];
};

const receiptFields = [
  { accessorKey: "senderName", fieldName: "Sender Name" },
  { accessorKey: "amount", fieldName: "Amount" },
  { accessorKey: "date", fieldName: "Transaction Date" },
  { accessorKey: "confirmation", fieldName: "Confirmation" },
  { accessorKey: "memo", fieldName: "Memo" },
];

interface ReceiptTableProps {}

export const ReceiptTable: FC<ReceiptTableProps> = () => {
  const { authenticate, receipts } = useAppState();
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const fetchPageData = useCallback(() => {
    dispatch(
      fetchReceipts({
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

  const adminColumns: ColumnDef<Receipt>[] = [
    {
      accessorKey: "senderName",
      header: "Sender Name",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "confirmation",
      header: "Confirmation",
    },
    {
      accessorKey: "memo",
      header: "Memo",
    },
    {
      id: "associatedRecipient",
      header: "Associated Recipient",
      cell: ({ row }) => {
        const receipt = row.original;

        return receipt.associatedRecipient ? (
          <Button
            onClick={() => {
              setDialogState({
                id: receipt.associatedRecipient,
                title: "Recipient Details",
                fetchFunction: fetchUser,
                dataSelector: (state) => state.authenticate.foundUser,
                loadingSelector: (state) => state.authenticate.isLoading,
                fields: recipientFields,
              });
              setIsDialogOpen(true);
            }}
          >
            View Recipient
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
        const receipt = row.original;

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
                onClick={() => navigator.clipboard.writeText(receipt._id)}
              >
                Copy Receipt ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    id: receipt._id,
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
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Edit Rece</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Delete Seller</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const userColumns: ColumnDef<Receipt>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "confirmation",
      header: "Confirmation",
    },
    {
      accessorKey: "memo",
      header: "Memo",
    },
    {
      id: "associatedRecipient",
      header: "Associated Recipient",
      cell: ({ row }) => {
        const receipt = row.original;

        return receipt.associatedRecipient ? (
          <Button
            onClick={() => {
              setDialogState({
                id: receipt.associatedRecipient,
                title: "Recipient Details",
                fetchFunction: fetchUser,
                dataSelector: (state) => state.authenticate.foundUser,
                loadingSelector: (state) => state.authenticate.isLoading,
                fields: recipientFields,
              });
              setIsDialogOpen(true);
            }}
          >
            View Recipient
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
        const receipt = row.original;

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
                onClick={() => navigator.clipboard.writeText(receipt._id)}
              >
                Copy Receipt ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDialogState({
                    id: receipt._id,
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
          authenticate.user?.role === "ADMIN" ? adminColumns : userColumns
        }
        data={receipts.receipts}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalRecords={receipts.meta?.itemCount || 0}
        onPaginationChange={handlePaginationChange}
        loading={receipts.isLoadingReceipts}
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
