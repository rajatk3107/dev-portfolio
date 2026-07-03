import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";
import { heroState } from "../webgl/heroState";
import { identity } from "../content";

const HeroCanvas = lazy(() => import("../webgl/HeroCanvas"));

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!ready || reduced) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const split = new SplitText("[data-hero-line]", { type: "chars" });
      splits.push(split);
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.035,
      });
      gsap.from("[data-hero-meta]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        delay: 0.6,
        ease: "power3.out",
      });
      gsap.to("[data-hero-inner]", {
        yPercent: -14,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (st) => {
          heroState.scroll = st.progress;
        },
      });
    }, root);
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [ready, reduced]);

  return (
    <section ref={root} className="relative h-svh overflow-hidden">
      {!reduced && (
        <div className="absolute inset-0" aria-hidden>
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>
      )}
      <div
        data-hero-inner
        className="relative z-10 flex h-full flex-col justify-between p-6 pt-20 md:p-12 md:pt-24"
      >
        <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-muted">
          <span>{identity.role}</span>
          <span className="hidden md:block">{identity.meta}</span>
        </div>
        <h1 className="headline select-none text-[clamp(3.8rem,14vw,12rem)]">
          {identity.heroLines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span data-hero-line className={"block" + (i === 1 ? " text-stroke" : "")}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <div data-hero-meta className="flex items-end justify-between gap-6">
          <p className="max-w-md font-mono text-sm leading-relaxed text-muted">
            {identity.blurb}
          </p>
          <div className="flex shrink-0 flex-col items-center gap-2" aria-hidden>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              scroll
            </span>
            <span className="block h-10 w-px overflow-hidden bg-line">
              <span className="block h-full w-full motion-safe:animate-cue bg-accent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
