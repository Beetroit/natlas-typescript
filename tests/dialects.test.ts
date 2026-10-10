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
});
