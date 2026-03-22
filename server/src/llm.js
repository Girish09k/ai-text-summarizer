const Groq = require("groq-sdk");
const { buildPrompt } = require("./prompt");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function summarizeText(text) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: buildPrompt(text),
      },
    ],
  });

  const rawContent = response.choices[0]?.message?.content;

  if (!rawContent) {
    throw new Error("Empty response from LLM.");
  }

  const cleaned = rawContent.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("LLM returned malformed JSON. Raw: " + rawContent);
  }

  if (
    typeof parsed.summary !== "string" ||
    !Array.isArray(parsed.keyPoints) ||
    parsed.keyPoints.length !== 3 ||
    !["positive", "neutral", "negative"].includes(parsed.sentiment)
  ) {
    throw new Error("LLM response did not match expected schema.");
  }

  return parsed;
}

module.exports = { summarizeText };