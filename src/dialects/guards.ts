import type { ChatMessage, SupportedLanguage } from "../types";
import { getSystemPrompt } from "./prompts";

export function applyDialectGuard(
  messages: readonly ChatMessage[],
  language?: SupportedLanguage,
  toneEnforcement = true
): ChatMessage[] {
  if (!language || !toneEnforcement) {
    return messages.slice();
  }

  const prompt = getSystemPrompt(language);
  const len = messages.length;

  let foundSystem = false;
  for (let i = 0; i < len; i++) {
    if (messages[i].role === "system") {
      foundSystem = true;
      break;
    }
  }

  // Speed optimization: avoid unnecessary shallow object cloning ({ ...msg })
  // and pre-allocate fixed-length array to minimize allocations/garbage collection.
  if (!foundSystem) {
    const result = new Array<ChatMessage>(len + 1);
    result[0] = { role: "system", content: prompt };
    for (let i = 0; i < len; i++) {
      result[i + 1] = messages[i];
    }
    return result;
  }

  const result = new Array<ChatMessage>(len);
  for (let i = 0; i < len; i++) {
    const msg = messages[i];
    if (msg.role === "system") {
      result[i] = {
        role: "system",
        content: `${prompt}\n\nAdditional instructions:\n${msg.content}`,
      };
    } else {
      result[i] = msg;
    }
  }
  return result;
}
