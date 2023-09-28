import { NextResponse } from "next/server";
import { fetchZealyLeaderboard } from "./fetchZealyLeaderboard";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await fetchZealyLeaderboard());
}
