import { describe, expect, it } from "vitest";
import { parseEventStream } from "../src/utils/stream";

describe("parseEventStream", () => {
  it("parses SSE chunks correctly and ignores [DONE]", async () => {
    const ssePayload = [
      'data: {"id":"1","object":"chat.completion.chunk","created":100,"model":"m","choices":[{"index":0,"delta":{"content":"Bawo"},"finish_reason":null}]}\n\n',
      'data: {"id":"2","object":"chat.completion.chunk","created":101,"model":"m","choices":[{"index":0,"delta":{"content":" ni"},"finish_reason":null}]}\n\n',
      "data: [DONE]\n\n",
    ].join("");

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(ssePayload));
        controller.close();
      },
    });

    interface ChunkType {
      id: string;
      choices: Array<{ delta: { content: string } }>;
    }

    const chunks: ChunkType[] = [];
    for await (const chunk of parseEventStream<ChunkType>(readable)) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0].choices[0].delta.content).toBe("Bawo");
    expect(chunks[1].choices[0].delta.content).toBe(" ni");
  });
});
