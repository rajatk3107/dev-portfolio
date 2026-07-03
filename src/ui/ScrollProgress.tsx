import { useEffect, useRef } from "react";
import { gsap } from "../motion/gsap";

/** Thin accent bar along the top edge showing scroll progress. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[90] h-0.5 origin-left scale-x-0 bg-accent"
    />
  );
}
