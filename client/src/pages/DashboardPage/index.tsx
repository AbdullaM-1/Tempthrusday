import { FC } from "react";
import { StatsDetail, StatsSummary } from "@/pages/DashboardPage/components";
import { useAppState } from "@/hooks";
import { Label } from "recharts";

interface DashboardPageProps {}

const { CLIENT_EMAIL } = import.meta.env;

export const DashboardPage: FC<DashboardPageProps> = () => {
  const { authenticate } = useAppState();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Label>Zelle Username: {CLIENT_EMAIL}</Label>
      </div>

      <div className="mt-8 space-y-4">
        <StatsSummary isUser={authenticate.user?.role === "USER"} />
        <StatsDetail />
      </div>
    </>
  );
};
