"use client";

import { Button } from "@/components/ui";
import { type NextPage } from "next";
import Link from "next/link";

interface Props {
  error: Error;
  reset: () => void;
}

const Page: NextPage<Props> = ({ error, reset }) => {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-[90vw] max-w-[380px] flex flex-col justify-center items-center gap-16 transform scale-90 sm:scale-100 animate-fadeAndMoveIn">
        <h1 className="text-8xl font-extrabold font-heading text-center text-primary">
          Render
          <br />
          Error
        </h1>
        <div className="flex flex-col justify-center items-center gap-3">
          <p className="text-lg font-medium text-center whitespace-nowrap">
            Oops! An error occured while rendering
            <br />
            this page, with the following reason:
          </p>
          <code className="p-8 bg-fg text-bg font-['monospace'] rounded-3xl ">
            {error.name} {error.message || "Unknown error"}
          </code>
        </div>
        <div className="flex gap-6 justify-center items-center">
          <Link href="/">
            <Button>Go back</Button>
          </Link>
          <Button variant="outline" onClick={reset}>
            Retry
          </Button>
        </div>
      </div>
    </main>
  );
};
export default Page;
