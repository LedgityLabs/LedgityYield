"use client";
import { FC } from "react";

export const CardsHelper: FC = () => {
  function handleMouseMove(e: MouseEvent) {
    console.log("mouse move");
    document
      .querySelectorAll<HTMLElement>(".card")
      .forEach((card: HTMLElement) => {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
  }
  if (typeof window !== "undefined") {
    document.body.addEventListener("mousemove", handleMouseMove);
  }
  return null;
};
export default CardsHelper;
