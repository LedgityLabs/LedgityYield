# Deploying a new L-Token

1. Copy / paste `hardhat/scripts/deploy-LGENERIC.ts` into `hardhat/scripts/deploy-L{tokenSymbol}.ts`
2. Replace any occurence of `GENERIC` with by underlying token symbol
3. Add new L-Token into `hardhat/scripts/initial-deploy-all.ts` (in case this new token is later part of the initial deployment on a new network)
4. Add underlying token addresses into `hardhat/deployments.ts` (else deployment will fail)
5. Run `hardhat run --network {network} hardhat/scripts/deploy-L{tokenSymbol}.ts`
