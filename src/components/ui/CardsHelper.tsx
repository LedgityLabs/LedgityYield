"use client";
import { FC } from "react";

let instantiated = false;
export const CardsHelper: FC = () => {
  function handleMouseMove(e: MouseEvent) {
    document
      .querySelectorAll<HTMLElement>(".card")
      .forEach((card: HTMLElement) => {
        const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
        setTimeout(() => {
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }, 300);
      });
  }
  if (typeof window !== "undefined") {
    if (!instantiated) {
      document.body.addEventListener("mousemove", handleMouseMove);
      instantiated = true;
    }
  }
  return null;
};
export default CardsHelper;
