/**
 * DocSaathi AI — Utility: List available Gemini models that support generateContent
 * Run: node scripts/list-models.mjs
 * Requires GEMINI_API_KEY in .env.local (read via dotenv)
 */
import { readFileSync } from "fs";
import { GoogleGenAI } from "@google/genai";

// Manually parse .env.local without exposing the key to any output
let apiKey = "";
try {
  const envContent = readFileSync(".env.local", "utf-8");
  const match = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
  if (match) apiKey = match[1].trim();
} catch {
  apiKey = process.env.GEMINI_API_KEY?.trim() || "";
}

if (!apiKey || apiKey.length < 10) {
  console.error("❌ No valid GEMINI_API_KEY found in .env.local or environment.");
  process.exit(1);
}

console.log("🔍 Querying Gemini API for available models...\n");

const ai = new GoogleGenAI({ apiKey });

try {
  const modelPage = await ai.models.list();
  const models = [];
  for await (const m of modelPage) {
    models.push(m);
  }

  const generateContentModels = models.filter(
    (m) => m.supportedActions?.includes("generateContent") || m.name?.includes("gemini")
  );

  console.log("✅ Models supporting generateContent:\n");
  generateContentModels.forEach((m) => {
    const actions = m.supportedActions?.join(", ") || "unknown";
    console.log(`  • ${m.name}`);
    console.log(`    Display name: ${m.displayName || "N/A"}`);
    console.log(`    Supported actions: ${actions}`);
    console.log(`    Input token limit: ${m.inputTokenLimit || "N/A"}`);
    console.log();
  });

  // Suggest best flash model
  const flashModels = generateContentModels
    .filter((m) => m.name?.includes("flash") && !m.name?.includes("thinking"))
    .map((m) => m.name);

  if (flashModels.length > 0) {
    console.log("💡 Recommended Flash models for DocSaathi AI:");
    flashModels.forEach((n) => console.log(`   ${n}`));
    console.log("\n✅ Update MODELS_TO_TRY in route.ts with these model names.");
  }
} catch (err) {
  console.error("❌ Failed to list models:", err.message || err);
  process.exit(1);
}
