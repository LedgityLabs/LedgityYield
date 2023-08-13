import { AnimeInstance } from "animejs";

export const animateScroll = (
  animation: AnimeInstance,
  animatedElement: HTMLElement,
  from: "top" | "bottom" = "top",
) => {
  // Compute trigger zone
  const scrollStart = animatedElement.offsetTop;
  const elHeight = animatedElement.offsetHeight;
  const scrollEnd = scrollStart + elHeight;

  const scrollPercent = () => {
    // If scroll trigger is viewport bottom
    if (from === "bottom") {
      const viewportBottom = window.scrollY + window.innerHeight;
      if (viewportBottom < scrollStart) return 0;
      else if (viewportBottom > scrollEnd) return 1;
      return (viewportBottom - scrollStart) / elHeight;
    }
    // Else if scroll trigger is viewport top
    else {
      const viewportTop = window.scrollY;
      if (viewportTop < scrollStart) return 0;
      else if (viewportTop > scrollEnd) return 1;
      return (viewportTop - scrollStart) / elHeight;
    }
  };

  // Call seek on scroll
  const handleScroll = () => animation.seek(scrollPercent() * animation.duration);

  // Add scroll listener
  window.addEventListener("scroll", handleScroll);

  // Return cleanup function
  return () => window.removeEventListener("scroll", handleScroll);
};
