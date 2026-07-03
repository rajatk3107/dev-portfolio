import { useEffect, useRef } from "react";
import { gsap } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";
import { timeline, skills } from "../content";

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = root.current?.querySelector("[data-marquee]");
    let pause: (() => void) | undefined;
    let play: (() => void) | undefined;
    const ctx = gsap.context(() => {
      gsap.from("[data-xp-row]", {
        y: 48,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-xp-list]", start: "top 75%", once: true },
      });
      if (track) {
        const tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
        pause = () => tween.pause();
        play = () => tween.play();
        track.addEventListener("mouseenter", pause);
        track.addEventListener("mouseleave", play);
      }
    }, root);
    return () => {
      if (track && pause && play) {
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", play);
      }
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="experience" className="py-32 md:py-48">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-14 font-mono text-xs uppercase tracking-widest text-accent">
          03 / Experience
        </h2>
        <ol data-xp-list>
          {timeline.map((t) => (
            <li
              key={t.period + t.role}
              data-xp-row
              className="grid gap-2 border-t border-line py-8 md:grid-cols-12 md:gap-6"
            >
              <span className="font-mono text-xs text-muted md:col-span-3 md:pt-1">
                {t.period}
              </span>
              <span className="text-xl font-semibold md:col-span-4">
                {t.role}
                <span className="mt-1 block text-sm font-normal text-muted">{t.company}</span>
              </span>
              <p className="text-sm leading-relaxed text-paper/80 md:col-span-5">{t.note}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-24 overflow-hidden border-y border-line py-6" aria-label="Skills">
        <div
          data-marquee
          className={
            reduced
              ? "flex flex-wrap gap-x-10 gap-y-4 px-6"
              : "flex w-max gap-10 whitespace-nowrap will-change-transform"
          }
        >
          {(reduced ? skills : [...skills, ...skills]).map((s, i) => (
            <span
              key={s + i}
              className="flex items-center gap-10 font-mono text-sm uppercase tracking-widest text-muted"
            >
              {s} <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
