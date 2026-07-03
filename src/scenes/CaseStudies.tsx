import { useEffect, useRef } from "react";
import { gsap } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";
import { caseStudies } from "../content";
import { Counter } from "../motion/Counter";

export function CaseStudies() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia(root);

    // Desktop: pin each study and scrub its inner timeline
    mm.add("(min-width: 768px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-study]").forEach((panel) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.5,
          },
        });
        tl.fromTo(
          panel.querySelector("[data-study-index]"),
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 0.14, duration: 0.35 },
        )
          .fromTo(
            panel.querySelector("[data-study-title]"),
            { yPercent: 60, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.3 },
            0.05,
          )
          .fromTo(
            panel.querySelectorAll("[data-study-block]"),
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.35 },
            0.2,
          )
          .to({}, { duration: 0.3 }); // hold at full reveal before unpinning
      });
    });

    // Mobile: no pinning, simple entrance reveals
    mm.add("(max-width: 767px)", () => {
      gsap.utils
        .toArray<HTMLElement>("[data-study-title], [data-study-block]")
        .forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="work">
      <h2 className="mx-auto max-w-6xl px-6 pt-32 font-mono text-xs uppercase tracking-widest text-accent md:pt-48">
        02 / Selected work
      </h2>
      {caseStudies.map((cs) => (
        <article
          key={cs.index + cs.title}
          data-study
          className="relative flex min-h-svh items-center overflow-hidden border-b border-line"
        >
          <span
            data-study-index
            aria-hidden
            className="text-stroke pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none text-[38vw] font-bold leading-none opacity-15 md:text-[26vw]"
          >
            {cs.index}
          </span>
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 md:grid-cols-12">
            <header className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {cs.company} · {cs.period}
              </p>
              <h3
                data-study-title
                className="mt-4 text-4xl font-bold leading-tight md:text-5xl"
              >
                {cs.title}
              </h3>
              <ul className="mt-6 flex flex-wrap gap-2">
                {cs.tags.map((t) => (
                  <li
                    key={t}
                    className="border border-line px-3 py-1 font-mono text-xs text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </header>
            <div className="space-y-10 md:col-span-7 md:col-start-6">
              {(
                [
                  ["Problem", cs.problem],
                  ["Approach", cs.approach],
                  ["Impact", cs.impact],
                ] as const
              ).map(([label, body]) => (
                <div key={label} data-study-block>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-accent">
                    {label}
                  </h4>
                  <p className="mt-2 text-lg leading-relaxed text-paper/90 md:text-xl">{body}</p>
                </div>
              ))}
              <div data-study-block className="border-t border-line pt-6">
                <span className="text-5xl font-bold text-accent md:text-6xl">
                  <Counter stat={cs.stat} />
                </span>
                <p className="mt-2 font-mono text-xs text-muted">{cs.stat.label}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
