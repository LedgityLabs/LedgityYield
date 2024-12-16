"use client";
import {
  ChangeEvent,
  KeyboardEvent,
  KeyboardEventHandler,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Amount } from "./Amount";
import { formatUnits } from "viem";

interface Props extends React.ComponentPropsWithoutRef<typeof Input> {}

export const RateInput = forwardRef<HTMLInputElement, Props>(
  ({ ...props }, ref) => {
    const inputEl = useRef<HTMLInputElement>(null);

    return (
      <div className="flex flex-col justify-center items-end">
        <div className="relative">
          <Input
            ref={inputEl}
            placeholder="Rate"
            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
              if (!e.key.match(/^[0-9.]+$/)) e.preventDefault();
            }}
            className="pr-8"
            {...props}
          />
          <span className="absolute right-3 top-0 bottom-0 w-min text-lg font-bold inline-flex justify-center items-center ">
            %
          </span>
        </div>
      </div>
    );
  },
);
RateInput.displayName = "RateInput";
