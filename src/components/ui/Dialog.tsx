"use client";

import React, { FC } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import { Card } from "./Card";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

// export const DialogOverlay: FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>> = ({
//   className,
//   ...props
// }) => (
//   <DialogPrimitive.Overlay
//     className={twMerge(
//       "fixed inset-0 z-[10000] bg-fg/50 backdrop-blur-md",
//       "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
//       className
//     )}
//     {...props}
//   />
// );

// Forward ref is required here, else overlay will note fade out
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={twMerge(
      "fixed inset-0 z-[10000] bg-fg/50 backdrop-blur-md data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent: FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>> = ({
  className,
  children,
  ...props
}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      {...props}
      className="fixed inset-0 z-[10001] flex justify-center items-center data-[state=open]:animate-fadeAndMoveIn data-[state=closed]:animate-fadeAndMoveOut !pointer-events-none"
    >
      <Card
        className={twMerge(
          "grid w-[calc(100%-2rem)] max-w-lg  gap-6 p-8 pointer-events-auto",
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
