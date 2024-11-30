export class FormatterDate {
  // public static formatDate(date: Date, full: boolean): string;
  // public static formatDate(year: number, month: number, day: number): string;

  public static formatDate(
    param1: string | number,
    param2?: boolean | number | undefined,
    param3?: number | undefined
  ) {
    if (typeof param1 === "string") {
      const date = new Date(param1);
      const full = param2 || true;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return full
        ? `${year}-${month}-${day} ${hours}:${minutes}`
        : `${year}-${month}-${day}`;
    } else if (
      typeof param1 === "number" &&
      typeof param2 === "number" &&
      typeof param3 === "number"
    ) {
      const date = new Date(param1, param2! - 1, param3!);
      // Format the date as December 31, 2021
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (
      typeof param1 === "number" &&
      typeof param2 === "number" &&
      typeof param3 === "undefined"
    ) {
      const year = param1; // Year
      const week = param2; // Week number

      // Calculate the Week Start Date and Week End Date

      // January 1st of the year
      let januaryFirst = new Date(year, 0, 1);
      // January 1st of the year + 7 days * (week - 1)
      let weekStart = new Date(
        januaryFirst.setDate(
          januaryFirst.getDate() - januaryFirst.getDay() + 7 * (week - 1)
        )
      );
      // January 1st of the year + 7 days * week
      let weekEnd = new Date(
        januaryFirst.setDate(
          januaryFirst.getDate() - januaryFirst.getDay() + 7 * week
        )
      );

      return `${weekStart.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`;
    }

    return "";
  }

  public static getMonthName(month: number) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[month - 1];
  }
}
