"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Amount } from "./Amount";
import { formatUnits } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {}

export const RateInput = forwardRef<HTMLInputElement, Props>(({ ...props }, ref) => {
  const inputEl = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col justify-center items-end">
      <div className="relative">
        <Input ref={inputEl} type="number" placeholder="Amount" min={0} step={0.001} {...props} />
        <span className="absolute right-3 bottom-[calc(50%-1.25rem/2+1px)] w-min text-[0.8rem]">%</span>
      </div>
    </div>
  );
});
RateInput.displayName = "RateInput";
