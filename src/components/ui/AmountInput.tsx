"use client";
import { forwardRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";
import { Amount } from "./Amount";

interface Props extends React.ComponentProps<typeof Input> {
  maxValue?: number;
  maxName?: string;
}

export const AmountInput = forwardRef<HTMLInputElement, Props>(
  ({ className, maxValue = 0, maxName = "Balance", ...props }, ref) => {
    return (
      <div className="flex flex-col justify-center items-end">
        <p className="text-sm text-fg/80 mb-1.5 mr-1.5">
          <span>{maxName}:</span> <Amount value={maxValue} className="font-semibold" />
        </p>
        <div className="relative">
          <Input
            ref={ref}
            type="number"
            className={twMerge("font-medium", className)}
            placeholder="Amount"
            min={0}
            max={maxValue}
            {...props}
          />
          <Button
            size="tiny"
            className="absolute bg-fg right-3 bottom-[calc(50%-1.25rem/2+1px)] px-1.5 py-0.5 h-5 w-min text-[0.8rem] rounded-md inline-flex items-center"
            onClick={() => {
              if (ref && typeof ref !== "function") {
                ref.current!.value = maxValue.toString();
                if (props.onChange) props.onChange({ target: ref.current! } as any);
              }
            }}
          >
            <span className="inline align-baseline">
              <span className="text-xs inline align-text-top leading-[0.85rem]">max</span>
            </span>
          </Button>
        </div>
      </div>
    );
  }
);
AmountInput.displayName = "AmountInput";
