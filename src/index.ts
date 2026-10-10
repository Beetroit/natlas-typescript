/**
 * @natlas/sdk
 * Official zero-dependency TypeScript SDK for N-ATLAS.
 */

export { Natlas } from "./client";
export {
  NatlasError,
  APIConnectionError,
  APIStatusError,
  AudioProcessingError,
} from "./errors";
export {
  BASE_SYSTEM_PROMPT,
  YORUBA_SYSTEM_PROMPT,
  HAUSA_SYSTEM_PROMPT,
  IGBO_SYSTEM_PROMPT,
  PIDGIN_SYSTEM_PROMPT,
  ENGLISH_SYSTEM_PROMPT,
  LANGUAGE_PROMPTS,
  getSystemPrompt,
} from "./dialects/prompts";
export { applyDialectGuard } from "./dialects/guards";
export type {
  ChatCompletionChoice,
  ChatCompletionChunk,
  ChatCompletionChunkChoice,
  ChatCompletionChunkDelta,
  ChatCompletionOptions,
  ChatCompletionResponse,
  ChatMessage,
  NatlasClientOptions,
  SupportedLanguage,
  TranscriptionOptions,
  TranscriptionResponse,
  UsageInfo,
} from "./types";
