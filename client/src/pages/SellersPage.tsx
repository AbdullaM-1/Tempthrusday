import { AddSellerDialog, UserTable } from "@/components";
import { FC } from "react";

interface SellersPageProps {}

export const SellersPage: FC<SellersPageProps> = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Sellers</h1>
        <AddSellerDialog />
      </div>
      <div className="mt-8">
        <UserTable />
      </div>
    </>
  );
};
