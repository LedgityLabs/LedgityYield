"use client";
import { KeyboardEvent, forwardRef, useImperativeHandle, useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Amount } from "./Amount";
import { formatUnits } from "viem";
import clsx from "clsx";
import { TokenLogo } from "./TokenLogo";

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {
  maxName?: string;
  maxValue?: bigint;
  decimals?: number;
  symbol?: string;
  maxToBottom?: boolean;
}

export const AmountInputWithLogo = forwardRef<HTMLInputElement, Props>(
  (
    {
      children,
      maxName = "Balance",
      maxValue = 0n,
      decimals = 0,
      symbol,
      maxToBottom = false,
      ...props
    },
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
        <p
          className={clsx(
            "mb-1.5 mr-1.5 text-sm text-fg/80",
            maxToBottom && "mb-0 mt-1.5",
          )}
        >
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
        <div className="flex w-full rounded-xl border-2 border-border bg-accent font-medium h-[calc(2.9rem+3px)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground">
          <TokenLogo symbol={symbol!} size={35} className="mx-1 p-1" />
          <Input
            ref={inputEl}
            placeholder={`${symbol} amount`}
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (!e.key.match(/^[0-9.]+$/)) e.preventDefault();
            }}
            disableDefaultCss={true}
            className="bg-accent font-medium w-full my-0.5 rounded-r-lg"
            {...props}
          />
          {children}
        </div>
      </div>
    );
  },
);
AmountInputWithLogo.displayName = "AmountInputWithLogo";
