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
  timeout: number = 10000
): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { prompt, models } = body;

    // console.log("Received prompt:", prompt);
    // console.log("Received model URL:", models);

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!models) {
      return new NextResponse("Invalid model URL", { status: 400 });
    }

    const timeoutDuration = 60000; // 60 seconds

    const response = await fetchWithTimeout(
      models,
      {
        headers: {
          Authorization: `Bearer ${process.env.hf_key!}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      },
      timeoutDuration
    );
    console.log(process.env.hf_key);

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
    console.error("Image generation error:");

    return NextResponse.json({ error }, { status: 500 });
  }
}