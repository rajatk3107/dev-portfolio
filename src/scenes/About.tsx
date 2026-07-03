import { useEffect, useRef } from "react";
import { gsap, SplitText } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";
import { about, parseAccents } from "../content";
import { Counter } from "../motion/Counter";

export function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((p) => {
        const split = new SplitText(p, { type: "words" });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.015,
            ease: "none",
            scrollTrigger: { trigger: p, start: "top 78%", end: "top 30%", scrub: true },
          },
        );
      });
    }, root);
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={root} id="about" className="mx-auto max-w-5xl px-6 py-32 md:py-48">
      <h2 className="mb-14 font-mono text-xs uppercase tracking-widest text-accent">01 / About</h2>
      <div className="space-y-10">
        {about.paragraphs.map((para) => (
          <p
            key={para.slice(0, 24)}
            data-reveal
            className="text-2xl font-medium leading-snug md:text-4xl"
          >
            {parseAccents(para).map((seg, i) => (
              <span key={i} className={seg.accent ? "text-accent" : undefined}>
                {seg.text}
              </span>
            ))}
          </p>
        ))}
      </div>
      <dl className="mt-24 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
        {about.stats.map((stat) => (
          <div key={stat.label} className="bg-ink p-6 md:p-8">
            <dd className="text-4xl font-bold md:text-5xl">
              <Counter stat={stat} />
            </dd>
            <dt className="mt-3 font-mono text-xs leading-relaxed text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
