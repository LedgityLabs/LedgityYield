import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";
// import { PreMiningLock, execute } from "../../../../../../.graphclient";
import { formatUnits, parseUnits } from "viem";

const availableChains = [42161, 59144 ,195];

export async function GET() {
  const session = await getServerSession(nextAuthOptions);

  // If not session return error
  if (!session) {
    return NextResponse.json({
      success: false,
      data: {
        totalReferred: 0,
        totalConvertedReferred: 0,
        cumulatedReferredDeposits: 0,
        averageLockDuration: 0,
      },
      error: "Twitter account not connected",
    });
  }

  // Retrieve all users referred by the connected user
  const referred = await prisma.user.findMany({
    where: {
      referrerId: session.user.id,
    },
  });

  // Retrieve lock infos for all referred users
  // - Build list of referred addresses, then stringify it
  const referredAddresses = referred.map((user) => user.walletAddress);

  // - If no referred addresses, return empty data
  if (!referredAddresses.length)
    return NextResponse.json({
      success: true,
      data: {
        totalReferred: 0,
        totalConvertedReferred: 0,
        cumulatedReferredDeposits: 0,
        averageLockDuration: 0,
      },
    });

  // - Build query string
  let queryString = "{\n";
  for (const chainId of availableChains) {
    queryString += `
        c${chainId}_preMiningLocks(where: {id_in: ${JSON.stringify(referredAddresses)}}) {
          id
          amount
          duration
        }
      `;
  }
  queryString += "\n}";

  // Execute subgraph query
  return NextResponse.json({
    success: false,
    data: {
      totalReferred: 0,
      totalConvertedReferred: 0,
      cumulatedReferredDeposits: 0,
      averageLockDuration: 0,
    },
    error: "Failed to fetch or no data",
  });
  // return await execute(queryString, {}).then(
  //   async (result: { data: Record<string, PreMiningLock[]> }) => {
  //     // If data are null, return error
  //     if (!result.data)
  //       return NextResponse.json({
  //         success: false,
  //         data: {
  //           totalReferred: 0,
  //           totalConvertedReferred: 0,
  //           cumulatedReferredDeposits: 0,
  //           averageLockDuration: 0,
  //         },
  //         error: "Failed to fetch or no data",
  //       });

  //     // Else create variable to store data
  //     const totalReferred = referred.length;
  //     let totalConvertedReferred = 0;
  //     let cumulatedReferredDeposits = 0;
  //     let averageLockDuration = 0;

  //     // Else, Loop over the chains to compute required data
  //     for (const chainId of availableChains) {
  //       // Extract and loop over the locks
  //       const locks = result.data[`c${chainId}_preMiningLocks`];
  //       for (const lock of locks) {
  //         // If the lock is gte than 6 months, add it to the totals
  //         if (lock.duration >= 6) {
  //           totalConvertedReferred++;
  //           cumulatedReferredDeposits += Number(formatUnits(lock.amount, 6));
  //           averageLockDuration += lock.duration;
  //         }
  //       }
  //     }

  //     // Compute average lock duration
  //     averageLockDuration /= totalConvertedReferred;

  //     // Return the data
  //     return NextResponse.json({
  //       success: true,
  //       data: {
  //         totalReferred,
  //         totalConvertedReferred,
  //         cumulatedReferredDeposits,
  //         averageLockDuration,
  //       },
  //     });
  //   },
  // );
}
