"use client"
import React, { useState } from 'react';
import { NextResponse } from "next/server";

interface GeneratedImage {
  url: string;
  metadata: string;
}

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState("");

  const negative_prompt = "Don't put hands"

  const modelUrl = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, models: modelUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
      } else {
        const data = await response.json();
        const newImages: GeneratedImage[] = Array(6).fill(null).map((_, index) => ({
          url: `data:image/png;base64,${data.image}`,
          metadata: `Valentina classic class: 10d ago, took ${(index + 1) * 0.5}m`
        }));
        setImages(newImages);
      }
    } catch (err) {
      setError("Something went wrong");
      NextResponse.json(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-black backdrop-blur-sm text-white min-h-screen px-4 py-10">
      <div className="mx-auto grid grid-cols-3 gap-10">
        <div>
          <div className="mb-4">
            <p className=' m-4'>PROMPT</p>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here"
              className="w-full px-2 pt-2 pb-40 bg-gray-800 border border-gray-700 rounded-xl mb-10"
            />
            <p className='m-4'>NEGATIVE PROMPT</p>
            <input
              type="text"
              value={negative_prompt}
              readOnly
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-full disabled:bg-blue-400"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 col-span-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.url} alt={`Generated ${index + 1}`} className="w-full h-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}