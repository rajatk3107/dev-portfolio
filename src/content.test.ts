import { describe, expect, it } from "vitest";
import { parseAccents, caseStudies, identity, about, timeline, skills } from "./content";

describe("parseAccents", () => {
  it("marks **wrapped** segments as accent", () => {
    expect(parseAccents("plain **hot** end")).toEqual([
      { text: "plain ", accent: false },
      { text: "hot", accent: true },
      { text: " end", accent: false },
    ]);
  });

  it("returns a single non-accent segment when there are no markers", () => {
    expect(parseAccents("nothing")).toEqual([{ text: "nothing", accent: false }]);
  });
});

describe("content integrity", () => {
  it("has exactly three case studies with complete fields", () => {
    expect(caseStudies).toHaveLength(3);
    for (const cs of caseStudies) {
      for (const field of [cs.index, cs.company, cs.period, cs.title, cs.problem, cs.approach, cs.impact]) {
        expect(field.length).toBeGreaterThan(0);
      }
      expect(cs.tags.length).toBeGreaterThan(0);
      expect(cs.stat.label.length).toBeGreaterThan(0);
    }
  });

  it("has valid contact details", () => {
    expect(identity.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(identity.linkedin).toMatch(/^https:\/\//);
    expect(identity.github).toMatch(/^https:\/\//);
  });

  it("about paragraphs have balanced accent markers", () => {
    for (const p of about.paragraphs) {
      expect((p.match(/\*\*/g) ?? []).length % 2).toBe(0);
    }
  });

  it("timeline has all four roles", () => {
    expect(timeline).toHaveLength(4);
    for (const t of timeline) {
      expect(t.period.length).toBeGreaterThan(0);
      expect(t.role.length).toBeGreaterThan(0);
      expect(t.company.length).toBeGreaterThan(0);
    }
  });

  it("skills are non-empty and unique", () => {
    expect(skills.length).toBeGreaterThan(5);
    expect(new Set(skills).size).toBe(skills.length);
  });
});
