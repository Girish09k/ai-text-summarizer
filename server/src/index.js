const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const { summarizeText } = require("./llm");
const { validateInput } = require("./validate");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

// Main summarize endpoint
app.post("/api/summarize", async (req, res) => {
  const text = req.body?.text;

  const validationError = validateInput(text);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await summarizeText(text.trim());
    return res.json(result);
  } catch (error) {
    console.error("Summarization error:", error.message);

    if (error.message.includes("API_KEY") || error.message.includes("GROQ")){
      return res.status(500).json({ error: "Server configuration error: API key missing." });
    }
    if (error.message.includes("malformed JSON") || error.message.includes("schema")) {
      return res.status(502).json({ error: "LLM returned an unexpected response. Try again." });
    }

    return res.status(500).json({ error: "Failed to summarize text. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});