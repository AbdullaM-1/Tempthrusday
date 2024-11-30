import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components";
import { CookiesApi, FormatterDate } from "@/utils";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type ChartItem = {
  x: string;
  totalAmount: number;
  transactionCount: number;
};

type StatData = {
  _id: { year: number; month?: number; day?: number };
  totalAmount: number;
  transactionCount: number;
};

const chartConfig = {
  x: {
    color: "#ff0000",
    label: "Date",
  },
  totalAmount: {
    color: "currentColor",
    label: "Total",
  },
  transactionCount: {
    color: "currentColor",
    label: "Transaction Count",
  },
} satisfies ChartConfig;

interface OverviewProps {
  period: "weekly" | "monthly" | "yearly";
  date?: Date;
}

const { VITE_APP_BASE_URL } = import.meta.env;

export const Overview: FC<OverviewProps> = ({ period = "monthly", date }) => {
  const [data, setData] = useState<ChartItem[] | null>([]);

  useEffect(() => {
    const accessToken = CookiesApi.getValue("accessToken"); // Bearer token for authorization header
    if (accessToken && date) {
      axios
        .get(
          `${VITE_APP_BASE_URL}/api/receipts/stats?period=${period}&date=${date.toISOString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          setData(
            response.data.data.map((item: StatData) => ({
              x:
                period === "yearly"
                  ? `${FormatterDate.getMonthName(item._id.month!)} ${
                      item._id.year
                    }`
                  : FormatterDate.formatDate(
                      item._id.year,
                      item._id.month,
                      item._id.day
                    ),
              totalAmount: item.totalAmount,
              transactionCount: item.transactionCount,
            }))
          );
        });
    }
  }, [period, date]);

  return data ? (
    <ResponsiveContainer width="100%" height={350}>
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value: string) => {
              const splitValue = value.split(" ");
              return period === "yearly"
                ? splitValue[0].slice(0, 3)
                : `${splitValue[0].slice(0, 3)} ${splitValue[1].replace(
                    ",",
                    ""
                  )}`;
            }}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="totalAmount"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  ) : (
    <></>
  );
};
