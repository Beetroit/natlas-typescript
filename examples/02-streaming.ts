import { Natlas } from "../src/index";

async function main() {
  const client = new Natlas();

  console.log("Streaming response in Igbo:");
  for await (const chunk of client.chat.stream({
    language: "igbo",
    messages: [{ role: "user", content: "Kọwaa ihe bụ nka na ụzụ." }],
  })) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    process.stdout.write(delta);
  }
  console.log("\n");
}

main().catch(console.error);
