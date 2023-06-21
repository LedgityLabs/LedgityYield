"use client";
import Loader from "@/app/loading";
import dynamic from "next/dynamic";
import { FC } from "react";

export const LazyDApp: FC<{ children: React.ReactNode }> = ({ children }) => {
  const DApp = dynamic(() => import("@/components/app/DApp"), { loading: Loader });
  return <DApp>{children}</DApp>;
};
