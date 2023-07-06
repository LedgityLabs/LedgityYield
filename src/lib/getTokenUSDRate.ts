import { ContractId } from "../../hardhat/deployments";

const cache = new Map<ContractId, number>();

export const getTokenUSDRate = async (tokenId: ContractId) => {
  console.log("PRICE FETCH");
  if (cache.has(tokenId)) return cache.get(tokenId) as number;
  else {
    console.log("UNCACHED PRICE FETCH");
    const usdRate = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${tokenId}`)
      .then((response) => response.json()) // Parse the JSON from the response
      .then((ratesData) => ratesData.data.rates.USD) // Extract the USD price
      .catch((error) => {
        console.error(`Error while fetching USD rate of ${tokenId}:`, error);
        throw error;
      });
    // Cache and return rate
    cache.set(tokenId, usdRate as number);
    return Number(usdRate);
  }
};
