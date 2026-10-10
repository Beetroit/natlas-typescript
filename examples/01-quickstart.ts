import { Natlas } from "../src/index";

async function main() {
  const client = new Natlas({ baseURL: "http://127.0.0.1:8000/v1" });

  console.log("--- Yoruba Chat ---");
  const responseYo = await client.chat.create({
    language: "yoruba",
    toneEnforcement: true,
    messages: [
      { role: "user", content: "Bawo ni mo se le kọ iwe ni èdè Yorùbá?" },
    ],
  });
  console.log(responseYo.choices[0].message.content);

  console.log("\n--- Hausa Chat ---");
  const responseHa = await client.chat.create({
    language: "hausa",
    toneEnforcement: true,
    messages: [{ role: "user", content: "Barka dai! Yaya kake?" }],
  });
  console.log(responseHa.choices[0].message.content);
}

main().catch(console.error);
