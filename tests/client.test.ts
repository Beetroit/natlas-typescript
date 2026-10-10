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
  });
});
