// pages/index.tsx
"use client";
import { NextResponse } from "next/server";
import { useState } from "react";

interface typ {
  value: string;
  label: string;
}
export default function Image() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const modelUrl: typ = {
    value: "black-forest-labs/FLUX.1-schnell",
    label:
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, models: modelUrl.label }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
      } else {
        const data = await response.json();
        setImage(`data:image/png;base64,${data.image}`);
      }
    } catch (err) {
      setError("Something went wrong");
      NextResponse.json(err);
    }

    setLoading(false);
  };

  return (
    <div className="text-blue-950">
      <h1>Generate an Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter Prompt: </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            style={{ width: "300px", padding: "8px" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {image && (
        <div className=" mt-[500px] flex justify-center items-center object-cover w-[600px]  ">
          <h2>Generated Image:</h2>
          <img src={image} alt="Generated" />
        </div>
      )}
    </div>
  );
}
