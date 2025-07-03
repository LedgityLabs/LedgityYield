#!/usr/bin/env node --env-file=.env

// SPDX-License-Identifier: Apache-2.0

const {
    Hbar,
    Client,
    PrivateKey,
    TokenCreateTransaction,
    CustomFixedFee,
    CustomFractionalFee,
    FeeAssessmentMethod,
    // @ts-expect-error https://github.com/hashgraph/hedera-sdk-js/issues/2722
} = require('@hashgraph/sdk');

async function main() {
    // Grab your Hedera testnet account ID and private key from the .env file
    const { ACCOUNT_ID: accountId, PRIVATE_KEY: privateKey } = process.env;

    if (!accountId || !privateKey)
        throw new Error('Environment variables ACCOUNT_ID and PRIVATE_KEY must be present');

    // Create your Hedera Testnet client and set the operator
    const client = Client.forTestnet();
    // Uncomment the following to create the token in a Local Network
    // const client = Client.forNetwork({
    //   '127.0.0.1:50211': new AccountId(3),
    // });

    client
        .setOperator(accountId, PrivateKey.fromStringDer(privateKey))
        .setDefaultMaxTransactionFee(new Hbar(100)) // Set default max transaction fee
        .setDefaultMaxQueryPayment(new Hbar(50)); // Set max payment for queries
    console.log('Client setup complete.');

    // Create a new token with specified properties
    const transaction = new TokenCreateTransaction()
        .setTokenName('Crypto Token with Custom Fees')
        .setTokenSymbol('CTCF')
        .setTreasuryAccountId(accountId)
        .setInitialSupply(15000)
        .setAdminKey(PrivateKey.fromStringDer(privateKey))
        .setCustomFees([
            // https://docs.hedera.com/hedera/sdks-and-apis/deprecated/sdks/token-service/custom-token-fees#fixed-fee
            new CustomFixedFee({ amount: 1, feeCollectorAccountId: '0.0.2669675' }),
            new CustomFixedFee({
                amount: 2,
                feeCollectorAccountId: '0.0.3465',
                denominatingTokenId: '0.0.429274',
            }),
            new CustomFixedFee({
                amount: 3,
                feeCollectorAccountId: '0.0.2669675',
            }).setDenominatingTokenToSameToken(),

            // https://docs.hedera.com/hedera/sdks-and-apis/deprecated/sdks/token-service/custom-token-fees#fractional-fee
            new CustomFractionalFee({
                feeCollectorAccountId: '0.0.2669675',
                numerator: 1,
                denominator: 100,
                min: 3,
                max: 4,
            }).setAssessmentMethod(FeeAssessmentMethod.Inclusive),
            new CustomFractionalFee({
                feeCollectorAccountId: '0.0.2669675',
                numerator: 5,
                denominator: 100,
                min: 3,
                max: 4,
            }).setAssessmentMethod(FeeAssessmentMethod.Exclusive),
        ])
        .freezeWith(client); // Freeze the transaction for signing

    const response = await (
        await transaction.sign(PrivateKey.fromStringDer(privateKey))
    ).execute(client);
    const receipt = await response.getReceipt(client);

    const tokenId = receipt.tokenId;
    console.log(`The new token ID is ${tokenId}`);
    console.log(`https://hashscan.io/testnet/token/${tokenId}`);

    client.close();
}

main().catch(console.error);
