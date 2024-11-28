import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@/components";
import { LoaderCircleIcon } from "lucide-react";
import { useAppDispatch, useAppState } from "@/hooks";

interface Field {
  accessorKey?: string;
  fieldName: string;
  cell?: React.ReactNode;
  id?: string;
}

interface Section {
  section?: string;
  fields?: Field[];
  [key: string]: any;
}
interface ViewEntityDialogProps {
  isDialogOpen: boolean;
  handleDialogOpenChange: (isOpen: boolean) => void;
  title: string;
  fetchFunction: (id: string) => any;
  dataSelector: (state: ReturnType<typeof useAppState>) => any;
  loadingSelector: (state: ReturnType<typeof useAppState>) => boolean;
  fields: Section[];
  id: string;
}

export const ViewEntityDialog: React.FC<ViewEntityDialogProps> = ({
  isDialogOpen,
  handleDialogOpenChange,
  title,
  fetchFunction,
  dataSelector,
  loadingSelector,
  fields,
  id,
}) => {
  const dispatch = useAppDispatch();
  const appState = useAppState();
  const data = dataSelector(appState);
  const isLoading = loadingSelector(appState);

  useEffect(() => {
    if (isDialogOpen) {
      dispatch(fetchFunction(id));
    }
  }, [dispatch, fetchFunction, id, isDialogOpen]);

  // Utility function to evaluate deep keys in data
  const getValueByAccessor = (obj: any, accessor: string | undefined) => {
    if (!accessor) return null;
    return accessor
      .split(".")
      .reduce((acc, key) => (acc ? acc[key] : null), obj);
  };

  // Render fields, whether grouped in sections or flat
  const renderFields = (fields: Section[]) => {
    return fields.map((fieldGroup, idx) => {
      // Handle flat fields
      if (!fieldGroup.section && !fieldGroup.fields) {
        const flatField = fieldGroup as Field;
        return (
          <TableRow key={flatField.id || idx} className="border-b">
            <TableCell className="px-4 py-2 font-medium text-gray-600">
              {flatField.fieldName}
            </TableCell>
            <TableCell className="px-4 py-2">
              {flatField.cell ??
                getValueByAccessor(data, flatField.accessorKey) ??
                "N/A"}
            </TableCell>
          </TableRow>
        );
      }

      // Handle sections
      const { section, fields: groupFields } = fieldGroup as Section;
      return (
        <div key={idx} className="space-y-4">
          {section && (
            <h2 className="text-lg font-semibold border-b pb-2">{section}</h2>
          )}
          <Table className="min-w-full border border-gray-300">
            <TableBody>
              {groupFields?.map((field, fieldIdx) => (
                <TableRow key={field.id || fieldIdx} className="border-b">
                  <TableCell className="px-4 py-2 font-medium text-gray-600">
                    {field.fieldName}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {field.cell ??
                      getValueByAccessor(data, field.accessorKey) ??
                      "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <LoaderCircleIcon
              className="animate-spin text-primary-500"
              size={32}
            />
          </div>
        ) : data ? (
          <div className="space-y-6">{renderFields(fields)}</div>
        ) : (
          <div className="flex justify-center items-center p-4 text-gray-500">
            No data available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
