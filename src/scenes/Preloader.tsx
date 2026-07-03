import { useEffect, useRef, useState } from "react";
import { gsap } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";

/** Full-screen count-up that shutters away, then unmounts. Calls onComplete when done. */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const completed = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const notifyReady = () => {
      if (completed.current) return;
      completed.current = true;
      onComplete();
    };
    if (prefersReducedMotion()) {
      notifyReady();
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
      },
    });
    tl.to(obj, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(obj.v)).padStart(3, "0");
      },
    }).to(
      root.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: "expo.inOut",
        onStart: () => {
          document.body.style.overflow = "";
          notifyReady();
        },
      },
      "+=0.15",
    );
    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[110] flex items-end justify-between bg-ink p-6 md:p-10">
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        rajat kumar yadav — portfolio
      </span>
      <span ref={num} className="font-mono text-6xl text-accent md:text-7xl">
        000
      </span>
    </div>
  );
}
