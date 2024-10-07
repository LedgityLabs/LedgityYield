import { FC } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
}

export const DaysUntil: FC<Props> = ({ date }) => {
  // Build date objects
  const targetDate = new Date(date);
  const currentDate = new Date();

  // Reset the time part of the current date to midnight
  currentDate.setHours(0, 0, 0, 0);

  // Compute the difference in days
  const diffInMilliseconds = Number(targetDate) - Number(currentDate);
  let diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  diffInDays = Math.ceil(diffInDays);

  return diffInDays;
};
