import { describe, expect, it, vi } from "vitest";
import { Natlas } from "../src/client";

describe("Natlas Client", () => {
  it("initializes with default URL", () => {
    const client = new Natlas();
    expect(client.baseURL).toBe("http://127.0.0.1:8000/v1");
  });

  it("trims trailing slashes from baseURL", () => {
    const client = new Natlas({ baseURL: "https://api.natlas.ng/v1///" });
    expect(client.baseURL).toBe("https://api.natlas.ng/v1");
  });

  it("executes chat create using custom fetch", async () => {
    const mockResponse = {
      id: "test-id",
      object: "chat.completion",
      created: 123456,
      model: "NCAIR1/N-ATLaS",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: "Adupe pupọ!" },
          finish_reason: "stop",
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const client = new Natlas({ fetch: mockFetch });
    const response = await client.chat.create({
      language: "yoruba",
      messages: [{ role: "user", content: "Bawo ni" }],
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(response.choices[0].message.content).toBe("Adupe pupọ!");

    const calledBody = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
    expect(calledBody.language).toBe("yoruba");
    expect(calledBody.tone_enforcement).toBe(true);
  });

  it("forwards pidgin language and tone enforcement in request payload", async () => {
    const mockResponse = {
      id: "pidgin-test",
      object: "chat.completion",
      created: 123456,
      model: "NCAIR1/N-ATLaS",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: "No wahala, you fit start!" },
          finish_reason: "stop",
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const client = new Natlas({ fetch: mockFetch });
    const response = await client.chat.create({
      language: "pidgin",
      toneEnforcement: true,
      messages: [{ role: "user", content: "How I fit start tech career for Lagos?" }],
    });

    expect(response.choices[0].message.content).toBe("No wahala, you fit start!");
    const sentBody = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
    expect(sentBody.language).toBe("pidgin");
    expect(sentBody.tone_enforcement).toBe(true);
    expect(sentBody.messages[0].role).toBe("system");
    expect(sentBody.messages[0].content).toContain("DO NOT speak Yoruba, Igbo, or Hausa");
    expect(sentBody.messages[0].content).toContain("No wahala");
  });
});
