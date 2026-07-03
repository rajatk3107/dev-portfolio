/** Hero scroll progress (0..1). Written by the Hero scene's ScrollTrigger,
 * read every frame by the particle shader — a mutable singleton avoids
 * re-rendering React on scroll. */
export const heroState = { scroll: 0 };
