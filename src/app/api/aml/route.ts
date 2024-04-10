import { NextResponse, NextRequest } from "next/server";
import { env } from "../../../../env.mjs";
import { isAddress } from "viem";

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
    // Alert team on Slack and allow the request
    await sendSlackAlert(
      `Error while fetching IPINFO.io for IP ${ip} (message: "${ipInfoReq.statusText}")`,
    );
  }

  // Else, ensure the IP location is not in restricted countries
  else {
    const country = (await ipInfoReq.text()).replace("\n", "");
    if (restrictedCountriesCodes.includes(country)) return NextResponse.json({ restricted: true });
  }

  // Check whether the wallet address is restricted
  if (address && isAddress(address)) {
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

    // If the wallet address check fails
    if (!scoreChainReq.ok) {
      if (![422, 404].includes(scoreChainReq.status))
        // Alert team on Slack and allow the request
        await sendSlackAlert(
          `Error while requesting ScoreChain analysis for wallet ${address} (message: "${scoreChainRes.message}")`,
        );
    }

    // Else, ensure the wallet address is not restricted
    else if (scoreChainRes["lowestScore"] < 30) return NextResponse.json({ restricted: true });
  }

  // If the IP and wallet address are not restricted
  return NextResponse.json({ restricted: false });
};
