import { NextResponse } from "next/server";

export const revalidate = 3600;

async function fetchUSCCB(): Promise<{ reference: string; text: string } | null> {
  try {
    const res = await fetch("https://bible.usccb.org/daily-bible-reading", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseGospel(html: string): { reference: string; text: string } | null {
  // Find the Gospel section by locating a heading that contains "Gospel"
  // USCCB structure: <div class="field-label">Gospel</div> or <h2>Gospel: Mark 12:28-34</h2>
  const gospelSectionRe = /gospel[^"<]{0,80}(?:mk|mt|lk|jn|mark|matthew|luke|john)[^<]{0,60}/i;

  // Strategy: find "Gospel" heading, capture the reference from it, then grab following <p> tags
  // until we hit something that looks like nav/footer (short paragraphs, "USCCB", "Copyright", etc.)

  // 1. Find last occurrence of a heading-like element containing "Gospel"
  const headingRe = /<(?:h[1-6]|div|span)[^>]*>([^<]*(?:gospel)[^<]*)<\/(?:h[1-6]|div|span)>/gi;
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(html)) !== null) {
    lastMatch = m;
  }

  let gospelPos = -1;
  let reference = "Today's Gospel";

  if (lastMatch) {
    gospelPos = lastMatch.index;
    const raw = stripTags(lastMatch[1]);
    const ref = raw.replace(/^gospel[:\s]*/i, "").trim();
    if (ref.length > 2) reference = ref;
  }

  // Fallback: search for gospel reference pattern directly (e.g. "MK 12:28")
  if (gospelPos === -1) {
    const refRe = /(?:mk|mt|lk|jn|mark|matthew|luke|john)\s+\d+:\d+/i;
    const rm = refRe.exec(html);
    if (rm) gospelPos = rm.index;
  }

  if (gospelPos === -1) return null;

  // Extract paragraphs after the gospel heading
  const after = html.slice(gospelPos);
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const paras: string[] = [];
  const STOP_WORDS = /usccb|copyright|united states conference|all rights reserved|subscribe|newsletter|donate|home\b|search\b|menu\b|skip to/i;

  while ((m = pRe.exec(after)) !== null && paras.length < 40) {
    const text = stripTags(m[1]);
    if (text.length < 20) continue;
    if (STOP_WORDS.test(text)) break;
    paras.push(text);
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
