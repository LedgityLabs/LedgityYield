"use client";

import React, { FC } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import { Card } from "./Card";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

// Forward ref is required here, else overlay will note fade out
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={twMerge(
      "fixed inset-0 z-[10000] bg-fg/50 backdrop-blur-md data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
      className,
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
      className="fixed inset-0 z-[10000] flex justify-center items-center data-[state=open]:animate-fadeAndMoveIn data-[state=closed]:animate-fadeAndMoveOut !pointer-events-none"
    >
      <Card
        className={twMerge(
          "grid max-w-lg max-h-screen gap-6 sm:p-8 p-4 pointer-events-auto",
          className,
        )}
      >
        <DialogPrimitive.Close
          className={twMerge("absolute z-10 -right-2 -top-2", "max-sm:right-0 max-sm:top-0")}
        >
          <Card
            radius="full"
            defaultGradient={true}
            className="w-10 h-10 flex justify-center items-center opacity-[85%] transition-opacity hover:opacity-100"
          >
            <i className="ri-close-fill text-2xl text-fg"></i>
            <span className="sr-only">Close</span>
          </Card>
        </DialogPrimitive.Close>
        <div className=" max-h-[calc(100vh-2rem)] scrollbar-thumb-slate-600 max-w-[calc(100vw)]">
          {children}
        </div>
      </Card>
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={twMerge("flex flex-col gap-6 text-center text-lg", className)} {...props} />
);

export const DialogFooter: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge("flex flex-col justify-center items-center flex-wrap gap-6", className)}
    {...props}
  />
);

export const DialogTitle: FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title
    className={twMerge("text-2xl font-heading font-bold text-center text-fg/90", className)}
    {...props}
  />
);

export const DialogDescription: FC<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
> = ({ className, ...props }) => (
  <DialogPrimitive.Title
    className={twMerge("flex flex-col items-center gap-4 text-center text-lg", className)}
    {...props}
  />
);
