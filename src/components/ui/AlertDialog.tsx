"use client";

import React, { FC } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button, Card, buttonVariants } from "@/components/ui";
import { twMerge } from "tailwind-merge";

export const AlertDialog = AlertDialogPrimitive.Root;

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogOverlay: FC<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
> = ({ className, children, ...props }) => (
  <AlertDialogPrimitive.Overlay
    className={twMerge(
      "fixed inset-0 z-[10000] bg-fg/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
);

export const AlertDialogContent: FC<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
> = ({ className, children, ...props }) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content {...props} asChild>
      <Card
        circleIntensity={0.07}
        className={twMerge(
          "fixed left-[50%] top-[50%] z-[10001] grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
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

export const AlertDialogAction: FC<AlertDialogActionProps> = ({
  children,
  variant = "primary",
  ...props
}) => (
  <AlertDialogPrimitive.Action asChild>
    <Button variant={variant} size="small" {...props}>
      {children || "Proceed"}
    </Button>
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
