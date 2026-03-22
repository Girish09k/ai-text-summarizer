import { useState } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "http://localhost:3001/api/summarize";

const EXAMPLE_TEXT = `NASA's James Webb Space Telescope has captured unprecedented images of distant galaxies, revealing details about the early universe never seen before. Scientists are particularly excited about observations showing galaxy formation just 300 million years after the Big Bang. The telescope's infrared capabilities allow it to peer through cosmic dust clouds that previously blocked our view. Researchers believe these findings will fundamentally reshape our understanding of how stars and galaxies form.`;

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setResult(null);

    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, { text });
      setResult(response.data);
    } catch (err) {
      const message =
        err.response?.data?.error || "Something went wrong. Is the server running?";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>🧠 AI Text Summarizer</h1>
      <p className="subtitle">
        Paste any block of text and get a structured summary powered by Groq + Llama.
      </p>

      <textarea
        rows={8}
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="button-row">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing…" : "Summarize"}
        </button>
        <button
          className="btn-secondary"
          onClick={() => setText(EXAMPLE_TEXT)}
          disabled={loading}
        >
          Load Example
        </button>
        <button
          className="btn-secondary"
          onClick={() => { setText(""); setResult(null); setError(""); }}
          disabled={loading}
        >
          Clear
        </button>
      </div>

      {loading && <p className="loading">Sending to Llama, please wait…</p>}
      {error && <div className="error">⚠️ {error}</div>}

      {result && (
        <div className="results">
          <div className="card">
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </div>

          <div className="card">
            <h3>Key Points</h3>
            <ul>
              {result.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Sentiment</h3>
            <span className={`sentiment-badge sentiment-${result.sentiment}`}>
              {result.sentiment === "positive" ? "😊" : result.sentiment === "negative" ? "😟" : "😐"}{" "}
              {result.sentiment}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}