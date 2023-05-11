"use client";

import { type NextPage } from "next";
import Link from "next/link";

interface Props {
  error: Error;
  reset: () => void;
}

const Page: NextPage<Props> = ({ error, reset }) => {
  return (
    <main className="flex flex-col">
      <h2>{error.message || "Something went wrong"}</h2>
      <button onClick={reset}>Retry</button>
      <Link href="/">Go back home</Link>
      <Link href="/app">Go back app</Link>
    </main>
  );
};
export default Page;
