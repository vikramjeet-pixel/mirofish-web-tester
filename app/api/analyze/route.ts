import { NextRequest, NextResponse } from "next/server";
import { analyzeTargetUrl } from "@/lib/crawler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid url parameter" }, { status: 400 });
    }

    const surfaceData = await analyzeTargetUrl(url);
    return NextResponse.json({ success: true, surface: surfaceData });
  } catch (error: any) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze target application" },
      { status: 500 }
    );
  }
}
