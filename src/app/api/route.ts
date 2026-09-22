import { NextResponse } from "next/server";
import { API_DATA } from "@/data/apiData";

export async function GET() {
  return NextResponse.json(API_DATA["/"], {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
