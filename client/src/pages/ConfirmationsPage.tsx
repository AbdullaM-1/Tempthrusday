import { AddConfirmationDialog } from "@/components";
import { ConfirmationTable } from "@/components/ConfirmationTable";
import { FC } from "react";

interface ConfirmationsPageProps {}

export const ConfirmationsPage: FC<ConfirmationsPageProps> = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Confirmations</h1>
        <AddConfirmationDialog />
      </div>
      <div className="mt-8">
        <ConfirmationTable />
      </div>
    </>
  );
};
