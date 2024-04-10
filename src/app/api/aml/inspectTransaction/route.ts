import { NextResponse, NextRequest } from "next/server";
import { isAccountHighRisk, isAccountSanctioned } from "../common";

export const revalidate = 0;

const lusdcAddresses = [
  "0xd54d564606611A3502FE8909bBD3075dbeb77813",
  "0x4AF215DbE27fc030F37f73109B85F421FAB45B7a",
];

export const POST = async (request: NextRequest) => {
  // Retrieve Tenderly webhook data
  const body = await request.json();
  const [from, to, value] = body.logs;

  for (const account of [from, to]) {
    // If the address is not an LUSDC contract
    if (!lusdcAddresses.includes(account)) {
      // Check whether the wallet is OFAC sanctioned and/or high-risk
      if ((await isAccountSanctioned(account, true)) || (await isAccountHighRisk(account, true)))
        return NextResponse.json({ restricted: true });
    }
  }
  // If the IP and wallet address are not restricted
  return NextResponse.json({ restricted: false });
};
