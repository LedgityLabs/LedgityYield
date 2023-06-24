"use client";

import React, { FC } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import { Card } from "./Card";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay: FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Overlay
    className={twMerge(
      "fixed inset-0 z-[10000] bg-fg/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
);

export const DialogContent: FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>> = ({
  className,
  children,
  ...props
}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content {...props} asChild>
      <Card
        className={twMerge(
          "fixed left-[50%] top-[50%] z-[10001] grid w-[calc(100%-2rem)]  max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-5 top-5 opacity-70 transition-opacity hover:opacity-100">
          <i className="ri-close-fill text-2xl"></i>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </Card>
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={twMerge("flex flex-col gap-4 text-center sm:text-left", className)} {...props} />
);

export const DialogFooter: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge("flex sm:justify-end justify-center items-center flex-wrap gap-4", className)}
    {...props}
  />
);

export const DialogTitle: FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title className={twMerge("text-2xl font-heading font-bold", className)} {...props} />
);

export const DialogDescription = DialogPrimitive.Description;
