import { NextRequest, NextResponse } from "next/server";
import { API_DATA } from "@/data/apiData";
import { getLiveGithubData } from "@/lib/github";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const resolvedParams = await params;
  const path = "/" + (resolvedParams.route?.join("/") || "");

  if (path === "/github") {
    const liveData = await getLiveGithubData();
    return NextResponse.json(liveData, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }

  if (API_DATA[path]) {
    return NextResponse.json(API_DATA[path], {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return NextResponse.json(
    {
      error: "not_found",
      message: `No endpoint at ${path}.`,
      hint: "GET /api lists all available routes.",
    },
    { status: 404 }
  );
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const resolvedParams = await params;
  const path = "/" + (resolvedParams.route?.join("/") || "");

  if (path === "/messages") {
    return NextResponse.json(API_DATA["/messages"], { status: 201 });
  }

  return NextResponse.json(
    { error: "method_not_allowed", message: "Only GET supported on this route." },
    { status: 405 }
  );
}
