const cache = new Map<string, Promise<number>>();

export const getTokenUSDRate = async (tokenSymbol: string) => {
  if (cache.has(tokenSymbol)) return cache.get(tokenSymbol)!;
  else {
    cache.set(
      tokenSymbol,
      fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${tokenSymbol}`)
        .then((response) => response.json()) // Parse the JSON from the response
        .then((ratesData) => ratesData.data.rates.USD) // Extract the USD price
        .catch((error) => {
          console.error(`Error while fetching USD rate of ${tokenSymbol}:`, error);
          throw error;
        }),
    );
    return cache.get(tokenSymbol)!;
  }
};
