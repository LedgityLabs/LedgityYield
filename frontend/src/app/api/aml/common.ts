import { createPublicClient, http } from "viem";
import { env } from "../../../../env.mjs";
import { arbitrum } from "viem/chains";
import chainalysisScreenerAbi from "./chainalysisScreenerAbi.json";

const restrictedCountriesCodes = ["US", "IR", "KP", "SY", "CU", "SD", "SO", "YE", "IQ", "LY", "VE"];
const chainName: Record<string, string> = {
  "42161": "Arbitrum",
  "59144": "Linea",
};
const chainExplorer: Record<string, string> = {
  "42161": "https://arbiscan.io/tx/",
  "59144": "https://lineascan.build/tx/",
};
export interface AlertContext {
  chainId: string;
  txHash: string;
  blockNumber: string;
}

export async function sendSlackAlert(context: string, message: string) {
  return await fetch(env.AML_ALERT_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `[${context}] ${message}` }),
  });
}

export async function isIPRestricted(ip: string) {
  // Check whether the IP location is restricted
  const ipInfoReq = await fetch(`https://ipinfo.io/${ip}/country?token=${env.IPINFO_TOKEN}`, {
    next: { revalidate: 3600 * 24 * 7 },
  });

  // Properly exit if the IP location request fails and that's not a local IP
  if (!ipInfoReq.ok && ip !== "::1") {
    await sendSlackAlert(
      "⚠️ IP Info Error ⚠️",
      `Error while fetching IPINFO.io for IP ${ip} (message: "${ipInfoReq.statusText}")`,
    );
    return false;
  }

  // Else, ensure the IP location is not in restricted countries
  else {
    const country = (await ipInfoReq.text()).replace("\n", "");
    if (restrictedCountriesCodes.includes(country)) return true;
  }
}

export async function isAccountSanctioned(
  address: string,
  alert: boolean = false,
  alertContext?: AlertContext,
) {
  const client = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  const isSanctioned = await client.readContract({
    address: "0x40C57923924B5c5c5455c48D93317139ADDaC8fb",
    abi: chainalysisScreenerAbi,
    functionName: "isSanctioned",
    args: [address],
  });

  if (isSanctioned && alert)
    await sendSlackAlert(
      "🔴 Sanctioned Wallet Alert 🔴",
      `The following account ("${address}") interacted with the LUSDC on ${chainName[alertContext!.chainId]} and is sanctioned by the OFAC. Consider freezing its address. Block: ${alertContext!.blockNumber} Transaction: ${chainExplorer[alertContext!.chainId]}${alertContext!.txHash}`,
    );

  return isSanctioned;
}

export async function isAccountHighRisk(
  address: string,
  alert: boolean = false,
  alertContext?: AlertContext,
) {
  // Temporarily disabled ScoreChain integration
  return false;
  
  /* Commented out original implementation for easy restoration later
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
  if (!scoreChainReq.ok && ![422, 404].includes(scoreChainReq.status))
    await sendSlackAlert(
      "⚠️ ScoreChain Error ⚠️",
      `Error while requesting ScoreChain analysis for wallet ${address} (message: "${scoreChainRes.message}")`,
    );

  const isHighRisk = scoreChainRes["lowestScore"] < 30;

  if (isHighRisk && alert)
    await sendSlackAlert(
      "🔴 High-Risk Wallet Alert 🔴",
      `The following account ("${address}") interacted with the LUSDC on ${chainName[alertContext!.chainId]} and is ranked "high-risk" by ScoreChain. Consider freezing its address. Block: ${alertContext!.blockNumber} Transaction: ${chainExplorer[alertContext!.chainId]}${alertContext!.txHash}`,
    );

  return isHighRisk;
  */
}
