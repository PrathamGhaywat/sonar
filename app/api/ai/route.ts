import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY!,
  baseURL: process.env.AI_BASE_URL!
});

export async function POST(req: Request) {
  const { query, results } = await req.json();

  const context = results
    .map(
      (r: { title: string; description: string; url: string }, i: number) =>
        `[${i + 1}] ${r.title}\n${r.description}\n${r.url}`
    )
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "google/gemini-3-pro-preview",
    messages: [
      {
        role: "system",
        content:
          "You are an AI search engine called Sonar. Answer concisely and cite sources using [number] notation.",
      },
      {
        role: "user",
        content: `Question: ${query}\n\nSources:\n${context}`,
      },
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0].message.content,
  });
}
