import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components";
import { DollarSign } from "lucide-react";
import axios from "axios";
import { CookiesApi } from "@/utils";
import { Period } from "@/d";

type Summary = { total: number; profit: number; difference: number };
type StatsSummary = {
  [key in Period]: Summary;
};

const initialStats: StatsSummary = {
  daily: { total: 0, profit: 0, difference: 0 },
  weekly: { total: 0, profit: 0, difference: 0 },
  monthly: { total: 0, profit: 0, difference: 0 },
  yearly: { total: 0, profit: 0, difference: 0 },
};

interface StatsSummaryProps {
  isUser: boolean;
}

const { VITE_APP_BASE_URL } = import.meta.env;

export const StatsSummary: FC<StatsSummaryProps> = ({ isUser }) => {
  const [stats, setStats] = useState<StatsSummary>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = CookiesApi.getValue("accessToken"); // Bearer token for authorization header
    if (accessToken) {
      axios
        .get(`${VITE_APP_BASE_URL}/api/receipts/stats/summary`)
        .then((response) => {
          setStats(response.data.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return loading ? (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {isUser && <Skeleton className="text-xl h-8 w-40 mb-2" />}
              <Skeleton className="h-5 w-32" />
            </CardTitle>
            <Skeleton className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            {/* Main Profit Display */}
            <div className="text-3xl font-bold">
              <Skeleton className="h-10 w-24" />
            </div>
            <p className="text-xs">
              <Skeleton className="h-4 w-40 mt-2" />
            </p>

            {/* Subtext for Total Revenue */}
            {!isUser && (
              <div className="mt-4 flex flex-col space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {Object.keys(stats).map((period) =>
        isUser ? (
          <Card key={period} x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <span className="text-xl">
                  {period === "daily"
                    ? "Today's"
                    : period === "weekly"
                    ? "Last Week's"
                    : period === "monthly"
                    ? "Last Month's"
                    : "Last Year's"}
                </span>
                <br />
                Total Amount Received
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Main Profit Display */}
              <div className="text-3xl font-bold">
                ${stats[period as Period].total.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats[period as Period].difference < 0 ? (
                  <span className="text-red-600">
                    -{stats[period as Period].difference.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-green-600">
                    +{stats[period as Period].difference.toFixed(2)}
                  </span>
                )}{" "}
                from{" "}
                {period === "daily"
                  ? "yesterday"
                  : `last ${period.replace("ly", "")}`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card key={period} x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {period === "daily"
                  ? "Today's"
                  : period === "weekly"
                  ? "Last Week's"
                  : period === "monthly"
                  ? "Last Month's"
                  : "Last Year's"}{" "}
                Total Profit
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Main Profit Display */}
              <div className="text-3xl font-bold text-green-600">
                ${stats[period as Period].profit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats[period as Period].difference < 0 ? (
                  <span className="text-red-600">
                    -{stats[period as Period].difference.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-green-600">
                    +{stats[period as Period].difference.toFixed(2)}
                  </span>
                )}{" "}
                from{" "}
                {period === "daily"
                  ? "yesterday"
                  : `last ${period.replace("ly", "")}`}
              </p>

              {/* Subtext for Total Revenue */}
              <div className="mt-4 flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Amount Received
                </span>
                <span className="text-lg font-semibold">
                  ${stats[period as Period].total}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};
