"use client";
import * as SelectPrimitive from "@radix-ui/react-select";
import { twMerge } from "tailwind-merge";
import React, { FC } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export const Select = SelectPrimitive.Root;

export const SelectGroup = SelectPrimitive.Group;

export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger: FC<
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger & typeof Button>
> = ({ className, children, ...props }) => (
  <SelectPrimitive.Trigger className={twMerge("flex", className)} {...props} asChild>
    <Button variant="outline">{children}</Button>
  </SelectPrimitive.Trigger>
);

export const SelectContent: FC<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>> = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Portal className="z-50">
    <SelectPrimitive.Content
      position="popper"
      align="center"
      className={twMerge("mt-1 rounded-3xl", className)}
      {...props}
    >
      <SelectPrimitive.Viewport style={{ overflow: "visible" }}>
        {/* <div className="p-2 bg-accent flex flex-col justify-center border-2 border-border shadow-[0px_4px_12px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden"> */}
        <Card animated={false} className="p-2 bg-accent overflow-hidden">
          {children}
        </Card>
        {/* </div> */}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

export const SelectLabel: FC<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>> = ({
  className,
  ...props
}) => <SelectPrimitive.Label className={twMerge(className)} {...props} />;

export const SelectItem: FC<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>> = ({
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Item
    className={twMerge(
      "w-full flex justify-between items-center gap-8 px-3 h-[2.9rem] hover:bg-bg transition-colors rounded-xl cursor-pointer first-of-type:rounded-t-[1.25rem] last-of-type:rounded-b-[1.25rem]",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText className="font-semibold">{children}</SelectPrimitive.ItemText>
    <div className="w-4 flex justify-center items-center">
      <SelectPrimitive.ItemIndicator>
        <i className="ri-check-line"></i>
      </SelectPrimitive.ItemIndicator>
    </div>
  </SelectPrimitive.Item>
);

export const SelectSeparator: FC<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>> = ({
  className,
  ...props
}) => (
  <SelectPrimitive.Separator className={twMerge("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);
