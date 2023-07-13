import { ContractId } from "../../contracts/deployments";

const cache = new Map<ContractId, Promise<number>>();

export const getTokenUSDRate = async (tokenId: ContractId) => {
  if (cache.has(tokenId)) return cache.get(tokenId)!;
  else {
    cache.set(
      tokenId,
      fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${tokenId}`)
        .then((response) => response.json()) // Parse the JSON from the response
        .then((ratesData) => ratesData.data.rates.USD) // Extract the USD price
        .catch((error) => {
          console.error(`Error while fetching USD rate of ${tokenId}:`, error);
          throw error;
        }),
    );
    return cache.get(tokenId)!;
  }
};
