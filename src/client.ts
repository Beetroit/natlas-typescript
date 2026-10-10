import type { NatlasClientOptions } from "./types";
import { Chat } from "./resources/chat";
import { Audio } from "./resources/audio";

const DEFAULT_BASE_URL = "http://127.0.0.1:8000/v1";

export class Natlas {
  public readonly chat: Chat;
  public readonly audio: Audio;
  public readonly baseURL: string;

  constructor(options: NatlasClientOptions = {}) {
    const envURL =
      typeof process !== "undefined" ? process.env?.NATLAS_BASE_URL : undefined;
    const rawBaseURL = options.baseURL ?? envURL ?? DEFAULT_BASE_URL;

    this.baseURL = rawBaseURL.replace(/\/+$/, "");
    const apiKey =
      options.apiKey ??
      (typeof process !== "undefined" ? process.env?.NATLAS_API_KEY : undefined);
    const fetchFn = options.fetch ?? globalThis.fetch;

    this.chat = new Chat(this.baseURL, apiKey, fetchFn);
    this.audio = new Audio(this.baseURL, apiKey, fetchFn);
  }
}
