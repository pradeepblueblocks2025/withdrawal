export function formatToIST(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { date: dateString, time: "" };
  }

  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return {
    date: dateFormatter.format(date),
    time: `${timeFormatter.format(date)} IST`,
  };
}
