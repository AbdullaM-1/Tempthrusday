import { FC, useEffect, useState } from "react";
import { subDays, subMonths, subYears } from "date-fns";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DatePickerWithRange,
} from "@/components";
import { Overview } from "./";
import { Stringify } from "@/utils";
import { DateRange } from "react-day-picker";

interface StatsDetailProps {}

type Peroid = "weekly" | "monthly" | "yearly";

export const StatsDetail: FC<StatsDetailProps> = () => {
  const [period, setPeriod] = useState<Peroid>("monthly");
  const [date, setDate] = useState<DateRange>({ from: new Date() });

  const handleDateSelect = (
    selectedRange: DateRange | undefined,
    selectedDate: Date
  ) => {
    if (!selectedRange) return;

    let fromDate: Date;
    switch (period) {
      case "weekly":
        fromDate = subDays(selectedDate, 6);
        break;
      case "monthly":
        fromDate = subMonths(selectedDate, 1);
        break;
      case "yearly":
        fromDate = subYears(selectedDate, 1);
        break;
      default:
        fromDate = subDays(selectedDate, 6);
    }

    setDate({ from: fromDate, to: selectedDate });
  };

  useEffect(() => {
    if (date?.to) handleDateSelect(date, date.to);
  }, [period]);

  useEffect(() => {
    if (!date?.to) handleDateSelect(date, new Date());
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-7">
        <CardHeader className="flex-col md:flex-row items-center justify-between">
          <CardTitle>{Stringify.toTitleCase(period)} Overview</CardTitle>

          <div className="inline-flex gap-4">
            <DatePickerWithRange
              date={date}
              handleDateSelect={handleDateSelect}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-fit">
                <Button>Period</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={period}
                  onValueChange={(value: string) => setPeriod(value as Peroid)}
                >
                  <DropdownMenuRadioItem value="yearly">
                    Yearly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="monthly">
                    Monthly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="weekly">
                    Weekly
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview period={period} date={date?.to} />
        </CardContent>
      </Card>
    </div>
  );
};
