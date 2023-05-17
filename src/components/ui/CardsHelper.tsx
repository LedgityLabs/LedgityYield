"use client";
import { FC, useRef } from "react";

export const CardsHelper: FC = () => {
  const instantiated = useRef(false);
  let cards: HTMLDivElement[] = [];

  function handleMouseMove(e: MouseEvent) {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  }

  if (typeof window !== "undefined") {
    cards = Array.prototype.slice.call(
      document.querySelectorAll<HTMLDivElement>(".card")
    );
    if (!instantiated.current) {
      console.log("instantiated");
      document.body.addEventListener("mousemove", handleMouseMove);
      instantiated.current = true;
    }
  }
  return null;
};
export default CardsHelper;
