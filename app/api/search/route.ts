import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const count = searchParams.get("count") || "10";

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://search.hackclub.com/res/v1/web/search?q=${encodeURIComponent(
      query
    )}&count=${count}`,
    {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${process.env.BRAVESEARCH_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Search API Error:", res.status, errorText);
    return NextResponse.json({ 
      error: "Search failed", 
      details: `Status ${res.status}: ${errorText}` 
    }, { status: 500 });
  }

  const data = await res.json();

  type BraveResult = {
    title: string;
    url: string;
    description?: string | null;
  };

  const results =
    data.web?.results?.map((r: BraveResult) => ({
      title: r.title,
      url: r.url,
      description: r.description,
    })) ?? [];

  return NextResponse.json({ results });
}
