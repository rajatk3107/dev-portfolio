export interface Segment {
  text: string;
  accent: boolean;
}

/** Splits "a **b** c" into segments; **wrapped** parts get accent: true. */
export function parseAccents(text: string): Segment[] {
  return text
    .split("**")
    .map((part, i) => ({ text: part, accent: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
}

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface CaseStudy {
  index: string;
  company: string;
  period: string;
  title: string;
  problem: string;
  approach: string;
  impact: string;
  stat: Stat;
  tags: string[];
}

export interface TimelineEntry {
  period: string;
  role: string;
  company: string;
  note: string;
}

export const identity = {
  name: "Rajat Kumar Yadav",
  heroLines: ["RAJAT", "KUMAR", "YADAV"],
  role: "Full-Stack Lead Engineer",
  meta: "8 years · Gurgaon, India · open to hybrid / remote",
  blurb:
    "Currently leading at HighLevel — building SaaS used by thousands of agencies.",
  email: "rajatky07@gmail.com",
  linkedin: "https://www.linkedin.com/in/rajatky07/",
  github: "https://github.com/rajatk3107",
} as const;

export const about = {
  paragraphs: [
    "Most engineers either write clean code or make good architecture calls. After 8 years of doing both, I've learned **the real skill is knowing when to do which.**",
    "I'm a Full-Stack Lead Engineer at **HighLevel** — one of the fastest-growing SaaS platforms in the agency space. In three years I've grown from SDE III to Lead, which mostly means I now **own problems that didn't have solutions yet** when I joined.",
    "Before that, at Shippigo, I led a **monolith-to-microservices migration** from the ground up — wrote the base scaffolding the entire engineering team built on. The kind of project that either makes or breaks a platform. **It made ours.**",
  ],
  stats: [
    { value: 8, suffix: " yrs", label: "shipping product" },
    {
      value: 1,
      prefix: "$",
      suffix: "M+",
      label: "annual revenue driven by Offers",
    },
    { value: 50, suffix: "%", label: "faster backend response times" },
    { value: 3, suffix: " yrs", label: "SDE III → Lead" },
  ] satisfies Stat[],
};

export const caseStudies: CaseStudy[] = [
  {
    index: "01",
    company: "HighLevel",
    period: "2023 — present",
    title: "Offers: zero to $1M+ in platform revenue",
    problem:
      "Agencies on HighLevel had no way to package and sell their services as structured offers. No schema, no billing flow, no UI — the product did not exist.",
    approach:
      "Designed and built it end to end on the Dev-SaaS team: data model, NestJS services, Vue-facing surfaces, payments, rollout. Owned it from first schema to production.",
    impact:
      "Shipped from zero to production. Offers now drives over $1M in annual platform revenue.",
    stat: {
      value: 1,
      prefix: "$",
      suffix: "M+",
      label: "annual platform revenue",
    },
    tags: ["NestJS", "Vue.js", "MongoDB"],
  },
  {
    index: "02",
    company: "Shippigo",
    period: "2018 — 2022",
    title: "Monolith → microservices, from the ground up",
    problem:
      "A growing logistics platform strangled by its monolith — slow responses, coupled deploys, and a team stepping on each other's changes.",
    approach:
      "Led the migration from the ground up: planned the architecture, wrote the base service scaffolding every engineer built on, and led the backend division through the transition.",
    impact:
      "Response times cut by up to 50%. The scaffolding became the platform's foundation — the kind of project that makes or breaks a product. It made ours.",
    stat: { value: 50, suffix: "%", label: "faster response times" },
    tags: ["Node.js", "AWS", "Microservices"],
  },
  {
    index: "03",
    company: "HighLevel",
    period: "2024 — present",
    title: "Internal tooling adopted company-wide",
    problem:
      "Sales, Revenue, Support and Engineering each ran on manual workflows and cross-team requests that ate hours every week.",
    approach:
      "Identified the systemic gaps, defined the problems, and shipped internal tools from problem definition to production — without waiting for a brief.",
    impact:
      "Adopted across four departments. Manual workflows and cross-team coordination overhead eliminated.",
    stat: { value: 4, suffix: " teams", label: "adopted across departments" },
    tags: ["Node.js", "NestJS", "Automation"],
  },
];

export const timeline: TimelineEntry[] = [
  {
    period: "2026 — now",
    role: "Lead Engineer",
    company: "HighLevel",
    note: "End-to-end ownership of customer-facing features and platform infrastructure. Mentoring engineers, leading architecture decisions.",
  },
  {
    period: "2023 — 2026",
    role: "SDE III · Dev-SaaS",
    company: "HighLevel",
    note: "Built Offers from zero to $1M+ in annual platform revenue. Internal tooling adopted across four departments.",
  },
  {
    period: "2018 — 2022",
    role: "Web Developer",
    company: "Shippigo",
    note: "Led the monolith-to-microservices migration and the backend division. Cut response times by up to 50%.",
  },
  {
    period: "2017 — 2018",
    role: "Web Application Developer",
    company: "Zenways.io",
    note: "ES6 refactors, production firefighting, MongoDB aggregation pipelines for custom reporting.",
  },
];

export const skills = [
  "Node.js",
  "NestJS",
  "Vue.js",
  "TypeScript",
  "MongoDB",
  "Mongoose",
  "Docker",
  "AWS",
  "Microservices",
  "GraphQL",
  "gRPC",
  "System Design",
  "API Design",
  "Go",
];
