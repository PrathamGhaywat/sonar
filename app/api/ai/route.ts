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

  const stream = await openai.chat.completions.create({
    model: "google/gemini-3-pro-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly but straight to the point AI search engine. Answer concisely and cite sources using [number] notation. If the user asks which model you are, state your model name ",
      },
      {
        role: "user",
        content: `Question: ${query}\n\nSources:\n${context}`,
      },
    ],
    stream: true,
  });

  let answer = "";

  type StreamChunk = {
    choices?: Array<{
      delta?: { content?: string; text?: string; role?: string };
      message?: { content?: string };
    }>;
  };

  try {
    for await (const chunk of stream as AsyncIterable<StreamChunk>) {
      const choices = chunk.choices ?? [];
      for (const c of choices) {
        const content = c.delta?.content ?? c.delta?.text ?? c.message?.content;
        if (content) answer += content;
      }
    }
  } catch (err) {
    console.error("Error while reading completion stream:", err);
    return NextResponse.json({ error: "Failed to read completion stream" }, { status: 500 });
  }

  return NextResponse.json({ answer });
}
