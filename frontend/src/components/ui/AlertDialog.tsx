"use client";

import React, { FC } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "./Button";
import { Card } from "./Card";
import { twMerge } from "tailwind-merge";

export const AlertDialog = AlertDialogPrimitive.Root;

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogPortal = AlertDialogPrimitive.Portal;

// Forward ref is required here, else overlay will note fade out
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={twMerge(
      "fixed inset-0 z-[10000] bg-fg/50 backdrop-blur-md data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
      className
    )}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

export const AlertDialogContent: FC<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
> = ({ className, children, ...props }) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      {...props}
      className="fixed inset-0 z-[10000] flex justify-center items-center data-[state=open]:animate-fadeAndMoveIn data-[state=closed]:animate-fadeAndMoveOut !pointer-events-none"
    >
      <Card
        className={twMerge(
          "grid w-[calc(100%-2rem)] max-w-lg  gap-6 p-8 pointer-events-auto",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
);

export const AlertDialogHeader: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={twMerge("flex flex-col gap-4 text-center sm:text-left", className)} {...props} />
);

export const AlertDialogFooter: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge("flex sm:justify-end justify-center items-center flex-wrap gap-4", className)}
    {...props}
  />
);

export const AlertDialogTitle: FC<React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <AlertDialogPrimitive.Title
    className={twMerge("text-2xl font-heading font-bold", className)}
    {...props}
  />
);

export const AlertDialogDescription = AlertDialogPrimitive.Description;

interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  variant?: "primary" | "destructive";
}

export const AlertDialogAction: FC<AlertDialogActionProps & { customButton?: boolean }> = ({
  children,
  variant = "primary",
  customButton = false,
  ...props
}) => (
  <AlertDialogPrimitive.Action asChild>
    {(!customButton && (
      <Button variant={variant} size="small" {...props}>
        {children || "Proceed"}
      </Button>
    )) ||
      children}
  </AlertDialogPrimitive.Action>
);

export const AlertDialogCancel: FC<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
> = ({ children, ...props }) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button variant="outline" size="small" {...props}>
      {children || "Get back"}
    </Button>
  </AlertDialogPrimitive.Cancel>
);
