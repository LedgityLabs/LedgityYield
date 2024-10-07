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
        let left = e.clientX - rect.left;
        let top = e.clientY - rect.top;
        const isInCard = left > 0 && top > 0 && left < card.offsetWidth && top < card.offsetHeight;
        if (isInCard) {
          let sDistance = 0;
          // If mouse is in:
          if (top <= card.offsetHeight / 2) {
            // * Top-left zone
            if (left <= card.offsetWidth / 2) sDistance = left < top ? left : top;
            // * Top-right zone
            else sDistance = card.offsetWidth - left < top ? card.offsetWidth - left : top;
          } else {
            // * Bottom-left zone
            if (left <= card.offsetWidth / 2)
              sDistance = left < card.offsetHeight - top ? left : card.offsetHeight - top;
            // * Bottom-right zone
            else
              sDistance =
                card.offsetWidth - left < card.offsetHeight - top
                  ? card.offsetWidth - left
                  : card.offsetHeight - top;
          }
          sDistance = sDistance * 0.95;
          const sYSides = card.offsetHeight - sDistance * 2;
          const sYRatio = card.offsetHeight / sYSides;
          const sXSides = card.offsetWidth - sDistance * 2;
          const sXRatio = card.offsetWidth / sXSides;
          const sTop = top - sDistance;
          const sLeft = left - sDistance;
          top = sTop * sYRatio;
          left = sLeft * sXRatio;
        }
        card.style.setProperty("--mouse-x", `${left}px`);
        card.style.setProperty("--mouse-y", `${top}px`);
      });
    }
  }

  useEffect(() => {
    if (window.innerWidth >= 640) {
      cards.current = document.querySelectorAll<HTMLDivElement>(".card");
      const tim = setInterval(() => {
        cards.current = document.querySelectorAll<HTMLDivElement>(".card");
      }, 1000);
      document.body.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.body.removeEventListener("mousemove", handleMouseMove);
        clearInterval(tim);
      };
    }
  }, [path]);
  return null;
};
