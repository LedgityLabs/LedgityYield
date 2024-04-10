import { NextResponse, NextRequest } from "next/server";
import { env } from "../../../../env.mjs";
import { createPublicClient, http, isAddress } from "viem";
import chainalysisScreenerAbi from "./chainalysisScreenerAbi.json";
import { mainnet } from "viem/chains";

const restrictedCountriesCodes = ["US", "IR", "KP", "SY", "CU", "SD", "SO", "YE", "IQ", "LY", "VE"];

export const revalidate = 0;

function sendSlackAlert(message: string) {
  return fetch(env.AML_ALERT_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `[FRONTEND] ${message}` }),
  });
}

export const GET = async (request: NextRequest) => {
  // Retrieve IP and wallet address
  const address = request.nextUrl.searchParams.get("address");
  const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  // Check whether the IP location is restricted
  const ipInfoReq = await fetch(`https://ipinfo.io/${ip}/country?token=${env.IPINFO_TOKEN}`, {
    next: { revalidate: 3600 * 24 * 7 },
  });

  // If the IP location check fails
  if (!ipInfoReq.ok && ip !== "::1") {
    await sendSlackAlert(
      `Error while fetching IPINFO.io for IP ${ip} (message: "${ipInfoReq.statusText}")`,
    );
  }

  // Else, ensure the IP location is not in restricted countries
  else {
    const country = (await ipInfoReq.text()).replace("\n", "");
    if (restrictedCountriesCodes.includes(country)) return NextResponse.json({ restricted: true });
  }

  // If a valid address is provided
  if (address && isAddress(address)) {
    // Retrieve wallet's ScoreChain analysis
    const scoreChainReq = await fetch("https://api.scorechain.com/v1/scoringAnalysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-API-KEY": env.SCORECHAIN_API_KEY,
      },
      body: JSON.stringify({
        analysisType: "FULL",
        objectType: "WALLET",
        objectId: address,
        blockchain: "Ethereum",
        coin: "ALL",
      }),
      next: { revalidate: 3600 * 24 },
    });
    const scoreChainRes = await scoreChainReq.json();

    // If the wallet address check fails, and the error is not a 404 or 422
    if (!scoreChainReq.ok && ![422, 404].includes(scoreChainReq.status)) {
      await sendSlackAlert(
        `Error while requesting ScoreChain analysis for wallet ${address} (message: "${scoreChainRes.message}")`,
      );
    }

    // Else, ensure the wallet address is not restricted
    else if (scoreChainRes["lowestScore"] < 30) return NextResponse.json({ restricted: true });

    // Then, check whether the wallet is the subject of OFAC sanctions
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    const isSanctioned = await client.readContract({
      address: "0x40C57923924B5c5c5455c48D93317139ADDaC8fb",
      abi: chainalysisScreenerAbi,
      functionName: "isSanctioned",
      args: [address],
    });

    // If the wallet is sanctioned
    if (isSanctioned) return NextResponse.json({ restricted: true });
  }

  // If the IP and wallet address are not restricted
  return NextResponse.json({ restricted: false });
};
