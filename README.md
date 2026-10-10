# @natlas/sdk (TypeScript / JavaScript SDK)

[![npm version](https://img.shields.io/npm/v/@natlas/sdk.svg)](https://www.npmjs.com/package/@natlas/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org)

The official **zero-runtime-dependency** TypeScript and JavaScript SDK for **N-ATLAS** (Nigeria's sovereign multilingual Large Language Model and Speech Recognition platform).

Built for the **National AI Innovation Challenge (NAIC 2026)** by NCAIR and NITDA under **Problem Statement 01: Developer Infrastructure** (Track B: Innovation & Enterprise).

---

## Architecture

```mermaid
flowchart TD
    subgraph ClientInstance ["Natlas Client (src/client.ts)"]
        Natlas["new Natlas({ baseURL, apiKey })"]
    end

    subgraph ChatResource ["Chat Resource (src/resources/chat.ts)"]
        Create["chat.create() (Non-streaming Promise)"]
        Stream["chat.stream() (AsyncGenerator)"]
    end

    subgraph AudioResource ["Audio Resource (src/resources/audio.ts)"]
        Transcribe["audio.transcribe() (Blob / Buffer / ArrayBuffer)"]
    end

    subgraph DialectEngine ["Dialect Integrity (src/dialects/)"]
        Guards["applyDialectGuard()"]
        Prompts["prompts.ts (Yoruba, Hausa, Igbo, Pidgin)"]
    end

    subgraph WebStreamsParser ["Zero-Dependency SSE Parser (src/utils/stream.ts)"]
        Parser["parseEventStream() via native ReadableStream"]
    end

    Natlas --> ChatResource
    Natlas --> AudioResource
    ChatResource --> Guards
    Guards --> Prompts
    Stream --> Parser
```

---

## Highlights

- **Zero Runtime Dependencies**: Built entirely on native web standards (`fetch`, `ReadableStream`, `FormData`, `Blob`). Zero security vulnerabilities, instant installation, and universal runtime compatibility.
- **Universal JavaScript Support**: Runs seamlessly across **Node.js 18+**, **Next.js (App & Pages Router, Edge & Node runtimes)**, **Vercel Edge**, **Cloudflare Workers**, **Bun**, and the **Browser**.
- **Dialect Guards & Tone Integrity**: Automatic system prompt injection preventing language drift back to English for **Yorùbá, Hausa, Igbo, and Nigerian Pidgin**.
- **Real-Time Token Streaming**: Native async generator `client.chat.stream()` for responsive UI applications.
- **Multilingual Voice/ASR**: Direct integration with official `NCAIR1` Whisper checkpoints (`Yoruba-ASR`, `Hausa-ASR`, `Igbo-ASR`, `NigerianAccentedEnglish`).
- **Dual Output Packaging**: Emits modern ESM (`dist/index.mjs`), CommonJS (`dist/index.js`), and TypeScript definitions (`dist/index.d.ts`).

---

## Installation

```bash
npm install @natlas/sdk
# or
pnpm add @natlas/sdk
# or
bun add @natlas/sdk
```

---

## Quickstart

### Multilingual Chat Completion
```typescript
import { Natlas } from "@natlas/sdk";

const client = new Natlas({ baseURL: "http://127.0.0.1:8000/v1" });

const response = await client.chat.create({
  language: "yoruba",
  toneEnforcement: true,
  messages: [
    { role: "user", content: "Bawo ni mo se le se iforukọsilẹ ile-iṣẹ mi?" },
  ],
});

console.log(response.choices[0].message.content);
```

### Real-Time Streaming
```typescript
for await (const chunk of client.chat.stream({
  language: "hausa",
  messages: [{ role: "user", content: "Barka dai!" }],
})) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
```

### Audio / Voice Note Transcription
```typescript
const result = await client.audio.transcribe({
  file: audioBlobOrBuffer,
  language: "yoruba",
});

console.log(result.text);
```

---

## Running in Next.js Route Handlers (Edge & Node)

```typescript
// app/api/chat/route.ts
import { Natlas } from "@natlas/sdk";

export const runtime = "edge"; // Zero dependencies makes it 100% Edge-ready!

const client = new Natlas();

export async function POST(req: Request) {
  const { messages, language } = await req.json();

  const stream = client.chat.stream({
    language,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

---

## Development & Testing

```bash
pnpm install
pnpm test
pnpm build
```
