import type {
  ChatCompletionChunk,
  ChatCompletionOptions,
  ChatCompletionResponse,
} from "../types";
import { applyDialectGuard } from "../dialects/guards";
import { APIConnectionError, APIStatusError } from "../errors";
import { parseEventStream } from "../utils/stream";

export class Chat {
  constructor(
    private readonly baseURL: string,
    private readonly apiKey?: string,
    private readonly fetchFn: typeof globalThis.fetch = globalThis.fetch
  ) {}

  private getHeaders(isStream = false): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "@natlas/sdk/0.1.0",
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    if (isStream) {
      headers["Accept"] = "text/event-stream";
    }
    return headers;
  }

  async create(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const guardedMessages = applyDialectGuard(
      options.messages,
      options.language,
      options.toneEnforcement ?? true
    );

    const body = {
      model: options.model ?? "NCAIR1/N-ATLaS",
      messages: guardedMessages,
      temperature: options.temperature ?? 0.1,
      repetition_penalty: options.repetitionPenalty ?? 1.12,
      max_tokens: options.maxTokens ?? 1024,
      top_p: options.topP ?? 0.9,
      stream: false,
    };

    let response: Response;
    try {
      response = await this.fetchFn(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: this.getHeaders(false),
        body: JSON.stringify(body),
      });
    } catch (err: unknown) {
      throw new APIConnectionError("Failed to reach N-ATLAS server", err);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new APIStatusError(
        `Chat completion request failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    return (await response.json()) as ChatCompletionResponse;
  }

  async *stream(
    options: ChatCompletionOptions
  ): AsyncGenerator<ChatCompletionChunk, void, unknown> {
    const guardedMessages = applyDialectGuard(
      options.messages,
      options.language,
      options.toneEnforcement ?? true
    );

    const body = {
      model: options.model ?? "NCAIR1/N-ATLaS",
      messages: guardedMessages,
      temperature: options.temperature ?? 0.1,
      repetition_penalty: options.repetitionPenalty ?? 1.12,
      max_tokens: options.maxTokens ?? 1024,
      top_p: options.topP ?? 0.9,
      stream: true,
    };

    let response: Response;
    try {
      response = await this.fetchFn(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: this.getHeaders(true),
        body: JSON.stringify(body),
      });
    } catch (err: unknown) {
      throw new APIConnectionError("Failed to reach N-ATLAS server for streaming", err);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new APIStatusError(
        `Chat streaming request failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    if (!response.body) {
      throw new APIConnectionError("No response body available for streaming");
    }

    yield* parseEventStream<ChatCompletionChunk>(response.body);
  }
}
