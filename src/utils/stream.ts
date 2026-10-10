/**
 * Zero-dependency Server-Sent Events (SSE) stream parser using native Web Streams API.
 */

export async function* parseEventStream<T>(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<T, void, unknown> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) {
          continue;
        }

        const dataContent = trimmed.slice(5).trim();
        if (dataContent === "[DONE]") {
          return;
        }

        try {
          const parsed = JSON.parse(dataContent) as T;
          yield parsed;
        } catch {
          // Ignore malformed heartbeats or non-JSON comments
        }
      }
    }

    if (buffer.trim().startsWith("data:")) {
      const dataContent = buffer.trim().slice(5).trim();
      if (dataContent !== "[DONE]") {
        try {
          const parsed = JSON.parse(dataContent) as T;
          yield parsed;
        } catch {
          // Ignore
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
