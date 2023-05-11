import { NextResponse, NextRequest } from 'next/server';
import z from "zod";
import { ethers } from 'ethers';

const ethAddressSchema = z.custom(ethers.isAddress, "Invalid Ethereum address provided.");

export const GET = async (request: NextRequest) => {

  // Retrieve wallet address
  const { searchParams } = new URL(request.url);
  const validation = ethAddressSchema.safeParse(searchParams.get('address'));
  if (!validation.success) return NextResponse.json({ allowed: false });

  // Figure whether it is allowed or not
  let allowed: boolean = true;
  try {
    const res = await fetch("https://score-chain-url.here/v1/user/scan/address", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.SCORECHAIN_API_KEY || "",
      },
      body: JSON.stringify({
        network: "ETH",
        address: validation.data
      }),
    });
    const data = await res.json();
    if (data.riskScore && data.riskScore < 30) allowed = true;
  } catch (e) {}
  return NextResponse.json({ allowed: allowed });
};