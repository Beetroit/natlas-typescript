import type { TranscriptionOptions, TranscriptionResponse } from "../types";
import { APIConnectionError, APIStatusError } from "../errors";

const ASR_MODELS: Record<string, string> = {
  yoruba: "NCAIR1/Yoruba-ASR",
  hausa: "NCAIR1/Hausa-ASR",
  igbo: "NCAIR1/Igbo-ASR",
  english: "NCAIR1/NigerianAccentedEnglish",
  pidgin: "NCAIR1/NigerianAccentedEnglish",
};

export class Audio {
  constructor(
    private readonly baseURL: string,
    private readonly apiKey?: string,
    private readonly fetchFn: typeof globalThis.fetch = globalThis.fetch
  ) {}

  async transcribe(options: TranscriptionOptions): Promise<TranscriptionResponse> {
    const lang = (options.language ?? "english").toLowerCase();
    const resolvedModel = options.model ?? ASR_MODELS[lang] ?? "NCAIR1/NigerianAccentedEnglish";

    const formData = new FormData();

    let blob: Blob;
    if (options.file instanceof Blob) {
      blob = options.file;
    } else {
      blob = new Blob([options.file as BlobPart], { type: "audio/wav" });
    }

    formData.append("file", blob, "audio.wav");
    formData.append("model", resolvedModel);
    formData.append("language", lang);

    const headers: Record<string, string> = {
      "User-Agent": "@natlas/sdk/0.1.0",
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    let response: Response;
    try {
      response = await this.fetchFn(`${this.baseURL}/audio/transcriptions`, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch (err: unknown) {
      throw new APIConnectionError("Failed to reach N-ATLAS ASR server", err);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new APIStatusError(
        `Audio transcription failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    return (await response.json()) as TranscriptionResponse;
  }
}
