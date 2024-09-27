import { NextResponse } from "next/server";

interface RequestBody {
  prompt: string;
  models: string;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = 60000
): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
}

const modelUrls: { [key: string]: string } = {
  "flux-schnell": "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  "Stable-diffusion-3-M": "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
  "RealV-Mk-1": "https://api-inference.huggingface.co/models/SG161222/RealVisXL_V4.0",
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { prompt, models } = body;

    console.log("Received prompt:", prompt);
    console.log("Received model:", models);

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!models || !modelUrls[models]) {
      return new NextResponse("Invalid model", { status: 400 });
    }

    const modelUrl = modelUrls[models];
    console.log("Selected model URL:", modelUrl);

    const timeoutDuration = 60000; // 60 seconds

    const response = await fetchWithTimeout(
      modelUrl,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_KEY!}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      },
      timeoutDuration
    );

    if (!response.ok) {
      const errorDetails: ErrorResponse = await response.json();
      console.error(
        `Hugging Face API error: ${response.statusText}`,
        errorDetails
      );

      return new NextResponse("Error generating image", {
        status: response.status,
      });
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return NextResponse.json(
      { image: base64Image },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Be more specific in production
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}