import * as fs from "node:fs";
import { Natlas } from "../src/index";

async function main() {
  const client = new Natlas();

  const filePath = "sample_voice.wav";
  if (!fs.existsSync(filePath)) {
    console.log(`Please place an audio file at ${filePath} to run this example.`);
    return;
  }

  const audioBuffer = fs.readFileSync(filePath);
  const result = await client.audio.transcribe({
    file: audioBuffer,
    language: "yoruba",
  });

  console.log("Transcribed Text:", result.text);
  console.log("Model:", result.model);
}

main().catch(console.error);
