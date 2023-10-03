import { FC } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { twMerge } from "tailwind-merge";

export const ToastProvider = ToastPrimitives.Provider;

export const ToastViewport: FC<React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Viewport
    className={twMerge(
      "fixed top-0 z-[100000000000000000000000000] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[350px]",
      className,
    )}
    {...props}
  />
);

export interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: "default" | "destructive";
}

export const Toast: FC<ToastProps> = ({ className, variant = "default", ...props }) => {
  return (
    <ToastPrimitives.Root
      className={twMerge(
        "relative flex w-full items-center justify-between overflow-hidden rounded-2xl border-2 m-2 drop-shadow-lg p-4 pt-3 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        {
          default: "border-slate-400 bg-bg text-fg",
          destructive: "border-red-400 bg-destructive text-destructive-fg",
        }[variant],
        className,
      )}
      {...props}
    />
  );
};

export const ToastAction: FC<React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Action
    className={twMerge(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-opacity hover:bg-opacity-70",
      className,
    )}
    {...props}
  />
);

export const ToastClose: FC<React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Close
    className={twMerge(
      "absolute right-2 top-2 p-1 transition-opacity  hover:opacity-70",
      className,
    )}
    toast-close=""
    {...props}
  >
    <i className="ri-close-line text-lg" />
  </ToastPrimitives.Close>
);

export const ToastTitle: FC<React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>> = ({
  className,
  ...props
}) => (
  <ToastPrimitives.Title
    className={twMerge("text-lg font-heading font-bold", className)}
    {...props}
  />
);

export const ToastDescription: FC<
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
> = ({ className, children, ...props }) => (
  <ToastPrimitives.Description className={twMerge("text-sm font-medium", className)} {...props}>
    <i className="ri-arrow-right-s-line text-lg" /> {children}
  </ToastPrimitives.Description>
);
