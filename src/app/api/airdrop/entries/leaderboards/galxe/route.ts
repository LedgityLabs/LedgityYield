import { NextResponse } from "next/server";
import { fetchGalxeLeaderboard } from "./fetchGalxeLeaderboard";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await fetchGalxeLeaderboard());
}
