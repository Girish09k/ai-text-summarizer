# 🧠 AI Text Summarizer

A small full-stack app that accepts unstructured text and returns a structured summary using the **Anthropic Claude API**.

**Output includes:** a one-sentence summary, three key points, and a sentiment label (positive / neutral / negative).

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React + Vite                      |
| Backend  | Node.js + Express                 |
| LLM API  | Anthropic Claude (claude-3-5-haiku) |
| Other    | dotenv, cors, axios               |

---

## Setup & Run

### Prerequisites
- Node.js v18+
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-text-summarizer.git
cd ai-text-summarizer
```

### 2. Set up the backend
```bash
cd server
cp .env.example .env
# Open .env and add your ANTHROPIC_API_KEY
npm install
npm run dev
```

### 3. Set up the frontend (new terminal)
```bash
cd client
npm install
npm run dev
```

### 4. Open the app

Go to [http://localhost:5173](http://localhost:5173)

---

## Which LLM & Why

I used **Anthropic's Claude** (`claude-3-5-haiku-20241022`) because:
- It's fast and cost-effective for structured extraction tasks
- It follows JSON formatting instructions reliably
- It's a natural choice when building tools that demonstrate LLM integration skills

---

## Prompt Design

The prompt instructs the model to act as a strict information extractor and return **only** valid JSON — no markdown, no extra keys, no prose. Key decisions:

- **Role framing**: telling the model it's a JSON extractor (not a chatbot) reduces conversational filler
- **Explicit schema**: including the exact shape and types reduces ambiguous outputs
- **Allowed value constraints**: listing `positive | neutral | negative` explicitly prevents the model from inventing new labels
- **Negative rules**: "do not include markdown" prevents code fences that break `JSON.parse`

---

## Example Output

Input text:
> NASA's James Webb Space Telescope has captured unprecedented images of distant galaxies...

Output:
```json
{
  "summary": "NASA's James Webb Space Telescope is revolutionizing our understanding of the early universe through unprecedented infrared observations.",
  "keyPoints": [
    "Webb captured images of galaxy formation just 300 million years after the Big Bang",
    "Infrared capabilities allow scientists to see through cosmic dust clouds",
    "Findings are expected to reshape understanding of star and galaxy formation"
  ],
  "sentiment": "positive"
}
```

![Screenshot of the app showing the summary result cards]

---

## Trade-offs & Shortcuts

- **No authentication**: skipped since this is a local development tool, not a deployed service
- **No test coverage**: out of scope for a 1–2 hour exercise; would add Jest + supertest next
- **Single endpoint**: deliberately kept the API surface minimal and easy to explain
- **Minimal UI**: prioritized LLM integration quality over visual polish

---

## What I'd Add With More Time

- **File upload support**: drag and drop a `.txt` or `.pdf` file instead of pasting
- **Batch processing**: accept multiple files and summarize all at once
- **Confidence indicator**: flag results where the model seems uncertain (e.g. sentiment near boundary)
- **Configurable output schema**: let users define custom fields via a JSON config flag
- **Rate limiting & error retry**: handle API quota limits gracefully with exponential backoff