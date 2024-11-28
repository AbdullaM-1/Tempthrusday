import { ReceiptTable } from "@/components";
import { FC } from "react";

interface ReceiptsPageProps {}

export const ReceiptsPage: FC<ReceiptsPageProps> = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Receipts</h1>
      </div>
      <div className="mt-8">
        <ReceiptTable />
      </div>
    </>
  );
};
