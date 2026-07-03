import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./prefersReducedMotion";
import type { Stat } from "../content";

/** Animated number that counts up once when scrolled into view. */
export function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (v: number) => `${stat.prefix ?? ""}${Math.round(v)}${stat.suffix ?? ""}`;
    if (prefersReducedMotion()) {
      el.textContent = format(stat.value);
      return;
    }
    el.textContent = format(0);
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: stat.value,
          duration: 1.6,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = format(obj.v);
          },
        });
      },
    });
    return () => st.kill();
  }, [stat]);

  return <span ref={ref} />;
}
