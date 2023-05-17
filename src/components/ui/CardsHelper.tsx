"use client";
import { usePathname } from "next/navigation";
import { FC, useEffect, useRef } from "react";

export const CardsHelper: FC = () => {
  let cards = useRef<NodeListOf<HTMLDivElement> | null>();
  const path = usePathname();

  function handleMouseMove(e: MouseEvent) {
    if (cards.current) {
      cards.current.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    }
  }

  useEffect(() => {
    cards.current = document.querySelectorAll<HTMLDivElement>(".card");
    document.body.addEventListener("mousemove", handleMouseMove);
    return () =>
      document.body.removeEventListener("mousemove", handleMouseMove);
  }, [path]);
  return null;
};
export default CardsHelper;
