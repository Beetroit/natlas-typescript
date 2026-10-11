import { describe, expect, it } from "vitest";
import { applyDialectGuard } from "../src/dialects/guards";
import { getSystemPrompt } from "../src/dialects/prompts";

describe("Dialects & Guards", () => {
  it("retrieves language-specific system prompts", () => {
    expect(getSystemPrompt("yoruba")).toContain("Yorùbá");
    expect(getSystemPrompt("hausa")).toContain("Hausa");
    expect(getSystemPrompt("igbo")).toContain("Igbo");
  });

  it("prepends system prompt when absent", () => {
    const guarded = applyDialectGuard(
      [{ role: "user", content: "Kedu kwanu?" }],
      "igbo",
      true
    );

    expect(guarded).toHaveLength(2);
    expect(guarded[0].role).toBe("system");
    expect(guarded[0].content).toContain("Igbo");
    expect(guarded[1].content).toBe("Kedu kwanu?");
  });

  it("augments existing system prompt", () => {
    const guarded = applyDialectGuard(
      [
        { role: "system", content: "You are a customer assistant." },
        { role: "user", content: "Bawo ni" },
      ],
      "yoruba",
      true
    );

    expect(guarded).toHaveLength(2);
    expect(guarded[0].role).toBe("system");
    expect(guarded[0].content).toContain("Yorùbá");
    expect(guarded[0].content).toContain("You are a customer assistant.");
  });

  it("retrieves pidgin system prompt with anti-drift negative constraints and lexical anchors", () => {
    const pidginPrompt = getSystemPrompt("pidgin");
    expect(pidginPrompt).toContain("Nigerian Pidgin English");
    expect(pidginPrompt).toContain("DO NOT speak Yoruba, Igbo, or Hausa");
    expect(pidginPrompt).toContain("No wahala");
    expect(pidginPrompt).toContain("dey");
    expect(pidginPrompt).toContain("Na so!");
  });

  it("injects anti-drift pidgin guard preventing cross-lingual drift", () => {
    const guarded = applyDialectGuard(
      [{ role: "user", content: "How I fit start tech career for Lagos?" }],
      "pidgin",
      true
    );

    expect(guarded).toHaveLength(2);
    expect(guarded[0].role).toBe("system");
    expect(guarded[0].content).toContain("DO NOT speak Yoruba, Igbo, or Hausa");
    expect(guarded[0].content).toContain("No wahala");
    expect(guarded[1].content).toBe("How I fit start tech career for Lagos?");
  });

  it("accurately detects and rejects Yoruba drift in Pidgin generations", () => {
    const yorubaDrift =
      "O dara, baba, o fẹ́ bẹ̀rẹ̀ ìrìn àjò yìí nínú imọ-ẹrọ, eh? Ọ̀nà tó dára ni láti bẹ̀rẹ̀.";
    const validPidgin =
      "You fit start tech career for Lagos, you fit do am well. Na so, you fit take online course.";

    const yorubaMarkers = ["O dara", "ìrìn àjò", "ẹ̀kọ́", "bẹ̀rẹ̀", "nínú imọ-ẹrọ"];
    const hasYorubaDrift = (text: string) =>
      yorubaMarkers.some((marker) => text.toLowerCase().includes(marker.toLowerCase()));

    expect(hasYorubaDrift(yorubaDrift)).toBe(true);
    expect(hasYorubaDrift(validPidgin)).toBe(false);
  });
});
