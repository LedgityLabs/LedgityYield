import { NextResponse, NextRequest } from "next/server";
import { env } from "../../../../../env.mjs";
import { isAddress } from "viem";
import { isAccountHighRisk, isAccountSanctioned, isIPRestricted } from "../common";

export const revalidate = 0;

export const GET = async (request: NextRequest) => {
  // Retrieve IP and wallet address
  const address = request.nextUrl.searchParams.get("address");
  const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  // Check whether the IP location is restricted
  if (await isIPRestricted(ip)) return NextResponse.json({ restricted: true });

  // If a valid address is provided
  if (address && isAddress(address)) {
    // Check whether the wallet is OFAC sanctioned and/or high-risk
    if ((await isAccountSanctioned(address)) || (await isAccountHighRisk(address)))
      return NextResponse.json({ restricted: true });
  }

  // If the IP and wallet address are not restricted
  return NextResponse.json({ restricted: false });
};
