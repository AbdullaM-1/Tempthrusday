export class FormatterDate {
  public static formatDate({
    dateString,
    full = true,
  }: {
    dateString: string;
    full?: boolean;
  }) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return full
      ? `${year}-${month}-${day} ${hours}:${minutes}`
      : `${year}-${month}-${day}`;
  }

  public static formatDateForCreate(vacancyDate: string, vacancyTime: string) {
    const [year, month, day] = vacancyDate.split("-").map(Number);

    const [hours, minutes] = vacancyTime.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  }

  public static formatterDateForUpdateHangar(
    vacancyDate: string,
    vacancyTime: string
  ) {
    const date = new Date(vacancyDate);
    const time = new Date(vacancyTime);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
  }

  public static formatDateForChatProfile(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Check if the date is within the current week
    if (date >= startOfWeek && date < now) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    // Check if the date is within the current month
    if (date >= startOfMonth && date < now) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    // Check if the date is within the current year
    if (date >= startOfYear && date < now) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    // If the date is not within the current year, show the year
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  public static formatDateForChatMessagesBanner(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }

    // Check if the date is yesterday
    if (
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString()
    ) {
      return "Yesterday";
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Check if the date is within the current week
    if (date >= startOfWeek && date < now) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    // Check if the date is within the current month
    if (date >= startOfMonth && date < now) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    // Check if the date is within the current year
    if (date >= startOfYear && date < now) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    // If the date is not within the current year, show the year
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  public static formatDateForDisplayRange(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}
