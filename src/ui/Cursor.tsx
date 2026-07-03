import { useEffect, useRef } from "react";
import { gsap } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";

function cursorDisabled(): boolean {
  return prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches;
}

/** Custom cursor: accent dot + trailing ring that grows over interactive elements. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorDisabled()) return;
    document.documentElement.classList.add("custom-cursor");
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const interactive = (e.target as Element).closest("a, button, [data-cursor]");
      gsap.to(ring.current, { scale: interactive ? 2.2 : 1, duration: 0.3, ease: "power3.out" });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  if (typeof window !== "undefined" && cursorDisabled()) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-accent"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-paper/40"
      />
    </>
  );
}
