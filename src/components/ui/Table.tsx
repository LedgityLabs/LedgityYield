import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

export const Table: FC<React.HTMLAttributes<HTMLTableElement>> = ({ className, ...props }) => (
  <table className={twMerge("w-full caption-bottom text-sm", className)} {...props} />
);

export const TableHeader: FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ ...props }) => (
  <thead {...props} />
);

export const TableBody: FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ ...props }) => (
  <tbody {...props} />
);

export const TableFooter: FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  ...props
}) => (
  <tfoot className={twMerge("bg-primary font-medium text-primary-foreground", className)} {...props} />
);

export const TableRow: FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => (
  <tr
    className={twMerge(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
);

export const TableHead: FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <th
    className={twMerge(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
);

export const TableCell: FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <td className={twMerge("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
);

export const TableCaption: FC<React.HTMLAttributes<HTMLTableCaptionElement>> = ({
  className,
  ...props
}) => <caption className={twMerge("mt-4 text-sm text-muted-foreground", className)} {...props} />;
