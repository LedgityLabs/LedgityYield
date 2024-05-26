import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(duration);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeLeftString(futureDateInMilSeconds: number) {
  const futureDate = dayjs(futureDateInMilSeconds);
  const now = dayjs();
  const diff = dayjs(futureDate).diff(now);

  if (diff <= 0) {
    return "Passed";
  } else {
    const duration = dayjs.duration(diff);
    return duration.humanize(true);
  }
}
