"use client";
import { ChangeEvent, FC, useRef, useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { twMerge } from "tailwind-merge";
import { Amount } from "./Amount";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  maxValue?: number;
  maxName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AmountInput: FC<Props> = ({ className, onChange, maxValue = 0, maxName = "Balance" }) => {
  const inputEl = useRef<HTMLInputElement>(null);

  return (
    <div className={twMerge("flex flex-col justify-center items-end", className)}>
      <p className="text-sm text-fg/80 mb-1.5 mr-1.5">
        <span>{maxName}:</span> <Amount value={maxValue} className="font-semibold" />
      </p>
      <div className="relative">
        <Input
          onChange={onChange}
          ref={inputEl}
          type="number"
          className={"font-medium"}
          placeholder="Amount"
          min={0}
          max={maxValue}
        />
        <Button
          size="tiny"
          className="absolute bg-fg right-3 bottom-[calc(50%-1.25rem/2+1px)] px-1.5 py-0.5 h-5 w-min text-[0.8rem] rounded-md inline-flex items-center"
          onClick={() => {
            inputEl!.current!.value = maxValue.toString();
            if (onChange) onChange({ target: inputEl!.current! } as any);
          }}
        >
          <span className="inline align-baseline">
            <span className="text-xs inline align-text-top leading-[0.85rem]">max</span>
          </span>
        </Button>
      </div>
    </div>
  );
};
