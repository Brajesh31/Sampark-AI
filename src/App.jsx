import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(event) {
    event.preventDefault();

    const prompt = question.trim();
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!prompt || generatingAnswer) return;

    if (!apiKey) {
      setAnswer(
        "Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your local .env file and restart the development server."
      );
      return;
    }

    setGeneratingAnswer(true);
    setAnswer("");

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      const generatedText =
        response.data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("\n")
          .trim();

      setAnswer(
        generatedText || "Gemini returned an empty response. Please try again."
      );
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "Unknown error";
      setAnswer(`Unable to generate a response: ${message}`);
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-violet-500">
            Sampark AI
          </h1>
          <p className="text-sm text-gray-400">
            Ask a question and get an AI-generated response.
          </p>
        </header>

        <form onSubmit={generateAnswer} className="space-y-4">
          <label htmlFor="question" className="sr-only">
            Your question
          </label>
          <textarea
            id="question"
            required
            rows={5}
            className="w-full resize-y rounded-lg border border-gray-700 bg-transparent p-4 text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask Sampark AI anything..."
            disabled={generatingAnswer}
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-3 font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={generatingAnswer || !question.trim()}
          >
            {generatingAnswer ? "Generating..." : "Generate response"}
          </button>
        </form>

        {(answer || generatingAnswer) && (
          <section
            className="mt-8 min-h-24 rounded-lg border border-gray-800 bg-gray-950 p-4"
            aria-live="polite"
            aria-busy={generatingAnswer}
          >
            {generatingAnswer ? (
              <p className="text-blue-300">Generating response...</p>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
