
import { useState } from "react";

// fallback version of generateContent inline
async function generateContent(topics: string[]) {
  const response = await fetch("https://syntech-vercel-backend.vercel.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topics }),
  });
  const data = await response.json();
  return data.result;
}

export default function App() {
  const [topics, setTopics] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (topics.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const data = await generateContent(topics);
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addTopic = () => {
    if (input && !topics.includes(input)) {
      setTopics([...topics, input]);
      setInput("");
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-800">Syntech Biofuel</h1>
        <p className="text-sm text-gray-600">AI-powered Social Media Content Generator</p>
      </header>

      <main className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-xl shadow">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Add Topics</label>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a topic"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addTopic}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              +
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {topics.map(topic => (
              <span
                key={topic}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => removeTopic(topic)}
              >
                {topic} ✕
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || topics.length === 0}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>

        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

        <div className="mt-6 space-y-4">
          {result.map((item, i) => (
            <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="font-semibold text-green-900">{item.headline}</h3>
              <p className="text-sm text-gray-700">{item.subheadline}</p>
              {item.isFunny && <span className="text-yellow-500 text-xs">Humorous</span>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
