"use client";
import { KeyboardEvent, forwardRef, useImperativeHandle, useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Amount } from "./Amount";
import { formatUnits } from "viem";
import clsx from "clsx";

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {
  maxName?: string;
  maxValue?: bigint;
  decimals?: number;
  symbol?: string;
  maxToBottom?: boolean;
}

export const AmountInput = forwardRef<HTMLInputElement, Props>(
  (
    { maxName = "Balance", maxValue = 0n, decimals = 0, symbol, maxToBottom = false, ...props },
    ref,
  ) => {
    const inputEl = useRef<HTMLInputElement>(null);
    const setMaxValue = () => {
      if (inputEl && inputEl.current) {
        inputEl.current.value = formatUnits(maxValue, decimals);
        if (props.onChange) props.onChange({ target: inputEl.current } as any);
      }
    };
    useImperativeHandle(ref, () => inputEl.current!);

    return (
      <div
        className={clsx(
          "flex flex-col items-end justify-center",
          maxToBottom && "flex-col-reverse",
        )}
      >
        <p className={clsx("mb-1.5 mr-1.5 text-sm text-fg/80", maxToBottom && "mb-0 mt-1.5")}>
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
            placeholder={`${symbol} amount`}
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (!e.key.match(/^[0-9.]+$/)) e.preventDefault();
            }}
            className="pr-14"
            {...props}
          />
          <Button
            size="tiny"
            className="absolute bottom-[calc(50%-1.25rem/2+1px)] right-3 inline-flex h-5 w-min items-center rounded-md bg-fg px-1.5 py-0.5 text-[0.8rem]"
            onClick={setMaxValue}
          >
            <span className="inline align-baseline">
              <span className="inline align-text-top text-xs leading-[0.85rem]">max</span>
            </span>
          </Button>
        </div>
      </div>
    );
  },
);
AmountInput.displayName = "AmountInput";
