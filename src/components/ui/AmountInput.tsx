"use client";
import { KeyboardEvent, forwardRef, useImperativeHandle, useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Amount } from "./Amount";
import { formatUnits } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {
  maxName?: string;
  maxValue?: bigint;
  decimals?: number;
  symbol?: string;
}

export const AmountInput = forwardRef<HTMLInputElement, Props>(
  ({ maxName = "Balance", maxValue = 0n, decimals = 0, symbol, ...props }, ref) => {
    const inputEl = useRef<HTMLInputElement>(null);
    const setMaxValue = () => {
      if (inputEl && inputEl.current) {
        inputEl.current.value = formatUnits(maxValue, decimals);
        if (props.onChange) props.onChange({ target: inputEl.current } as any);
      }
    };
    useImperativeHandle(ref, () => inputEl.current!);

    return (
      <div className="flex flex-col justify-center items-end">
        <p className="text-sm text-fg/80 mb-1.5 mr-1.5">
          <span>{maxName}:</span>{" "}
          <button onClick={setMaxValue}>
            <Amount
              value={maxValue}
              decimals={decimals}
              suffix={symbol}
              displaySymbol={false}
              className="font-semibold"
            />
          </button>
        </p>
        <div className="relative">
          <Input
            ref={inputEl}
            type="number"
            placeholder="Amount"
            min={0}
            max={formatUnits(maxValue, decimals)}
            step={1}
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (!e.key.match(/^[0-9.]+$/)) e.preventDefault();
            }}
            className="pr-12"
            {...props}
          />
          <Button
            size="tiny"
            className="absolute bg-fg right-3 bottom-[calc(50%-1.25rem/2+1px)] px-1.5 py-0.5 h-5 w-min text-[0.8rem] rounded-md inline-flex items-center"
            onClick={setMaxValue}
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
