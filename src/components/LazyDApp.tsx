"use client";
import dynamic from "next/dynamic";
import { FC } from "react";

export const LazyDApp: FC<{ children: React.ReactNode }> = ({ children }) => {
  const DApp = dynamic(() => import("@/components/DApp"), { ssr: false });
  return <DApp>{children}</DApp>;
};
