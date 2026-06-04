import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();
  const url = `https://bible.usccb.org/sites/default/files/flipbooks/readings/${yyyy}/${mm}-${dd}-${yyyy}.mp3`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://bible.usccb.org/",
      },
    });
    if (!res.ok) return new NextResponse(null, { status: 503 });

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
