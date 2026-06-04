import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

async function fetchUSCCB(): Promise<{ reference: string; text: string } | null> {
  try {
    const res = await fetch("https://bible.usccb.org/daily-bible-reading", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return parseGospel(html);
  } catch {
    return null;
  }
}

function parseGospel(html: string): { reference: string; text: string } | null {
  // Extract gospel heading + text with regex (no DOM in Node)
  // Strategy 1: look for a Gospel heading followed by paragraphs
  const gospelHeadingRe =
    /<[^>]*>([^<]*gospel[^<]*)<\/[^>]*>/gi;
  const pTagRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const stripTagsRe = /<[^>]+>/g;

  let match: RegExpExecArray | null;
  let gospelPos = -1;
  let reference = "Today's Gospel";

  while ((match = gospelHeadingRe.exec(html)) !== null) {
    const text = match[1].replace(stripTagsRe, "").trim();
    const ref = text.replace(/^gospel[:\s]*/i, "").trim();
    if (ref) reference = ref;
    gospelPos = match.index;
  }

  if (gospelPos === -1) return null;

  // Collect paragraphs after the last gospel heading
  const afterGospel = html.slice(gospelPos);
  const paras: string[] = [];
  pTagRe.lastIndex = 0;
  while ((match = pTagRe.exec(afterGospel)) !== null && paras.length < 30) {
    const t = match[1].replace(stripTagsRe, "").trim();
    if (t.length > 30) paras.push(t);
  }

  if (paras.length === 0) return null;
  return { reference, text: paras.join("\n\n") };
}

export async function GET() {
  const gospel = await fetchUSCCB();
  if (!gospel) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  return NextResponse.json(gospel, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
