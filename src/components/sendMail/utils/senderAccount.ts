// src/utils/senderAccount.ts

import { ethers } from 'ethers';

const SENDER_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;


interface Eip1193Provider {
    request(args: { method: string; params?: any[] }): Promise<any>;
}

class WalletEip1193Provider implements Eip1193Provider {
    private wallet: ethers.Wallet;
    private provider: ethers.providers.JsonRpcProvider;

    constructor(wallet: ethers.Wallet, provider: ethers.providers.JsonRpcProvider) {
        this.wallet = wallet;
        this.provider = provider;
    }

    async request(args: { method: string; params?: any[] }): Promise<any> {
        switch (args.method) {
            case 'eth_accounts':
                return [await this.wallet.getAddress()];
            case 'eth_chainId':
                const network = await this.provider.getNetwork();
                return ethers.utils.hexValue(network.chainId);
            case 'eth_sendTransaction':
                const tx = args.params?.[0];
                // Convert gas to gasLimit if present
                if (tx && tx.gas) {
                    tx.gasLimit = tx.gas;
                    delete tx.gas;
                }
                return this.wallet.sendTransaction(tx);
            case 'eth_sign':
                const [address, messageToSign] = args.params || [];
                return this.wallet.signMessage(ethers.utils.arrayify(messageToSign));
            case 'personal_sign':
                const [messageHex, signerAddress] = args.params || [];
                return this.wallet.signMessage(ethers.utils.arrayify(messageHex));
            case 'eth_signTypedData_v4':
                const [signerAddr, typedDataJson] = args.params || [];
                const typedData = JSON.parse(typedDataJson);
                const { domain, types, message: typedDataMessage } = typedData;
                // Remove EIP712Domain from types as it's automatically added by ethers.js
                delete types.EIP712Domain;
                return this.wallet._signTypedData(domain, types, typedDataMessage);
            default:
                return this.provider.send(args.method, args.params || []);
        }
    }
}

export function getAutomaticSigner(): WalletEip1193Provider | null {
    console.log('SENDER_PRIVATE_KEY:', SENDER_PRIVATE_KEY ? 'Set' : 'Not set');
    console.log('RPC_URL:', RPC_URL ? 'Set' : 'Not set');

    if (!SENDER_PRIVATE_KEY || !RPC_URL) {
        console.error('Sender private key or RPC URL not set in environment variables');
        return null;
    }

    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(SENDER_PRIVATE_KEY, provider);
        return new WalletEip1193Provider(wallet, provider);
    } catch (error) {
        console.error('Failed to create signer:', error);
        return null;
    }
}