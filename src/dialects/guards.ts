import type { ChatMessage, SupportedLanguage } from "../types";
import { getSystemPrompt } from "./prompts";

export function applyDialectGuard(
  messages: readonly ChatMessage[],
  language?: SupportedLanguage,
  toneEnforcement = true
): ChatMessage[] {
  if (!language || !toneEnforcement) {
    return [...messages];
  }

  const prompt = getSystemPrompt(language);
  const result: ChatMessage[] = [];
  let foundSystem = false;

  for (const msg of messages) {
    if (msg.role === "system") {
      foundSystem = true;
      result.push({
        role: "system",
        content: `${prompt}\n\nAdditional instructions:\n${msg.content}`,
      });
    } else {
      result.push({ ...msg });
    }
  }

  if (!foundSystem) {
    result.unshift({
      role: "system",
      content: prompt,
    });
  }

  return result;
}
