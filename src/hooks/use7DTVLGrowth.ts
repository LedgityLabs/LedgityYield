// import { useEffect, useState } from "react";
// import { TVLChange, execute } from "graphclient";
// import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
// import { parseUnits } from "viem";

// const secondsIn7Days = 7 * 24 * 60 * 60;
// const availableChains = [42161, 59144];

// export const useTVLGrowth7d = () => {
//   const [tvlGrowth7d, setTvlGrowth7d] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const compute7DTVLGrowth = async () => {
//     setIsLoading(true);
//     const sevenDaysAgo = Math.floor(Date.now() / 1000) - secondsIn7Days;

//     // Build query string to request TVL data for each chain
//     let queryString = "{\n";
//     for (const chainId of availableChains) {
//       queryString += `
//         c${chainId}_ltokens {
//           symbol
//           latestTVL: tvlUpdates(orderBy: timestamp, orderDirection: desc, first: 1) {
//             amount
//             timestamp
//           }
//           weekAgoTVL: tvlUpdates(where: {timestamp_gte: ${sevenDaysAgo}}, orderBy: timestamp, orderDirection: asc, first: 1) {
//             amount
//             timestamp
//           }
//         }
//       `;
//     }
//     queryString += "\n}";

//     // Request TVL data for each chain
//     await execute(queryString, {}).then(
//       async (result: {
//         data: {
//           [key: string]: [
//             {
//               symbol: string;
//               decimals: number;
//               latestTVL: TVLChange[];
//               weekAgoTVL: TVLChange[];
//             },
//           ];
//         };
//       }) => {
//         const tvlsData = result.data;

//         // Will accumulate USD TVL amounts for each chain
//         let totalUSDLatestTVL = 0n;
//         let totalUSDWeekAgoTVL = 0n;

//         // Accumulate USD TVL amounts for each chain
//         for (const chainId of availableChains) {
//           const tvlData = tvlsData[`c${chainId}_ltokens`];

//           for (const lTokenData of tvlData) {
//             // If TVL of the lToken is not available, skip it
//             if (!lTokenData.latestTVL[0]) continue;

//             // Retrieve underlying symbol and its USD rate
//             const underlyingSymbol = lTokenData.symbol.slice(1);
//             const usdRate = await getTokenUSDRate(underlyingSymbol).then((rate) => rate.toString());

//             // Retrieve underlying decimals
//             const underlyingDecimals = Number(lTokenData.decimals);

//             // Convert TVL data into USD
//             const latestTVLUSD =
//               (parseUnits(lTokenData.latestTVL[0].amount, underlyingDecimals) *
//                 parseUnits(usdRate, underlyingDecimals)) /
//               parseUnits("1", underlyingDecimals);
//             const weekAgoTVLUSD =
//               (parseUnits(lTokenData.weekAgoTVL[0].amount, underlyingDecimals) *
//                 parseUnits(usdRate, underlyingDecimals)) /
//               parseUnits("1", underlyingDecimals);

//             // Accumulate USD TVL amounts
//             totalUSDLatestTVL += latestTVLUSD;
//             totalUSDWeekAgoTVL += weekAgoTVLUSD;
//           }
//         }

//         // No growth if TVL amount has decreased
//         if (totalUSDLatestTVL > totalUSDWeekAgoTVL) {
//           // Compute new TVL growth
//           const newTVLGrowth7d =
//             Number(totalUSDLatestTVL - totalUSDWeekAgoTVL) / Number(totalUSDWeekAgoTVL);

//           // Set new TVL growth
//           setTvlGrowth7d(newTVLGrowth7d);
//         }
//       },
//     );
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     compute7DTVLGrowth();
//   }, []);

//   return { tvlGrowth7d, isLoading };
// };
