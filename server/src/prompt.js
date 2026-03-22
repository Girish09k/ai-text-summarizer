function buildPrompt(userText) {
  return `You are an assistant that converts unstructured text into a strict JSON summary.

Return ONLY valid JSON with exactly this shape — no markdown, no extra text, no code fences:
{
  "summary": "one sentence that captures the main idea",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive | neutral | negative"
}

Rules:
- summary must be exactly one sentence
- keyPoints must contain exactly 3 short, distinct bullet-style strings
- sentiment must be exactly one of: positive, neutral, negative
- do not include markdown formatting
- do not include any keys other than summary, keyPoints, sentiment

Text to analyze:
${userText}`;
}

module.exports = { buildPrompt };