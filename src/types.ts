/**
 * Strict TypeScript type contracts for N-ATLAS SDK.
 * Zero `any` policy enforced.
 */

export type SupportedLanguage = "yoruba" | "hausa" | "igbo" | "english" | "pidgin";

export interface ChatMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

export interface ChatCompletionOptions {
  readonly model?: string;
  readonly messages: readonly ChatMessage[];
  readonly language?: SupportedLanguage;
  readonly toneEnforcement?: boolean;
  readonly temperature?: number;
  readonly repetitionPenalty?: number;
  readonly maxTokens?: number;
  readonly topP?: number;
}

export interface ChatCompletionChoice {
  readonly index: number;
  readonly message: ChatMessage;
  readonly finish_reason: string | null;
}

export interface UsageInfo {
  readonly prompt_tokens: number;
  readonly completion_tokens: number;
  readonly total_tokens: number;
}

export interface ChatCompletionResponse {
  readonly id: string;
  readonly object: "chat.completion";
  readonly created: number;
  readonly model: string;
  readonly choices: readonly ChatCompletionChoice[];
  readonly usage?: UsageInfo;
}

export interface ChatCompletionChunkDelta {
  readonly role?: string;
  readonly content?: string;
}

export interface ChatCompletionChunkChoice {
  readonly index: number;
  readonly delta: ChatCompletionChunkDelta;
  readonly finish_reason: string | null;
}

export interface ChatCompletionChunk {
  readonly id: string;
  readonly object: "chat.completion.chunk";
  readonly created: number;
  readonly model: string;
  readonly choices: readonly ChatCompletionChunkChoice[];
}

export interface TranscriptionOptions {
  readonly file: Blob | File | ArrayBuffer | Uint8Array;
  readonly language?: SupportedLanguage | string;
  readonly model?: string;
}

export interface TranscriptionResponse {
  readonly text: string;
  readonly language: string;
  readonly model: string;
  readonly duration_seconds?: number;
  readonly confidence?: number;
}

export interface NatlasClientOptions {
  readonly baseURL?: string;
  readonly apiKey?: string;
  readonly timeoutMs?: number;
  readonly fetch?: typeof globalThis.fetch;
}
