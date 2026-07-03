import { useEffect, useRef } from "react";
import { gsap, SplitText } from "../motion/gsap";
import { prefersReducedMotion } from "../motion/prefersReducedMotion";
import { identity } from "../content";
import { Magnetic } from "../motion/Magnetic";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const big = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = big.current;
    const split = el ? new SplitText(el, { type: "chars" }) : null;
    const hover = split
      ? gsap
          .timeline({ paused: true })
          .to(split.chars, {
            yPercent: -12,
            color: "#c6f24e",
            stagger: { each: 0.015, from: "center" },
            duration: 0.3,
            ease: "power2.out",
          })
      : null;
    const enter = () => hover?.play();
    const leave = () => hover?.reverse();
    el?.addEventListener("mouseenter", enter);
    el?.addEventListener("mouseleave", leave);

    const ctx = gsap.context(() => {
      gsap.from("[data-contact-item]", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    }, root);

    return () => {
      el?.removeEventListener("mouseenter", enter);
      el?.removeEventListener("mouseleave", leave);
      hover?.kill();
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="contact" className="flex min-h-svh flex-col justify-between px-6 pt-40">
      <div className="mx-auto w-full max-w-6xl">
        <h2 data-contact-item className="font-mono text-xs uppercase tracking-widest text-accent">
          04 / Contact
        </h2>
        <p data-contact-item className="mt-8 max-w-xl text-xl text-paper/80 md:text-2xl">
          Scaling a SaaS product and need someone who can lead the team{" "}
          <em className="text-paper">and</em> do the work?
        </p>
        <div data-contact-item>
          <Magnetic className="mt-16 inline-block">
            <a
              ref={big}
              href={`mailto:${identity.email}`}
              className="headline block select-none text-[clamp(3rem,11vw,9rem)]"
            >
              LET'S TALK
            </a>
          </Magnetic>
        </div>
        <ul
          data-contact-item
          className="mt-20 flex flex-wrap gap-8 font-mono text-sm uppercase tracking-widest"
        >
          <li>
            <a className="link-underline" href={`mailto:${identity.email}`}>
              Email
            </a>
          </li>
          <li>
            <a className="link-underline" href={identity.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="link-underline" href={identity.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
      <footer className="mx-auto mt-32 flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line py-8 font-mono text-xs text-muted">
        <span>© 2026 Rajat Kumar Yadav</span>
        <span>Built with React, GSAP &amp; Three.js</span>
      </footer>
    </section>
  );
}
