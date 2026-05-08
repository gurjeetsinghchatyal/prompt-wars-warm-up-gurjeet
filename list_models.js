import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    const names = data.models.map(m => m.name);
    console.log(JSON.stringify(names, null, 2));
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

listModels();
