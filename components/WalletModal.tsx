'use client';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ethers } from 'ethers';

// Web3Modal configuration
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID'; // Get from WalletConnect Cloud
const sepoliaZkSync = {
    chainId: 300,
    name: 'ZKSync Sepolia Testnet',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.explorer.zksync.io',
    rpcUrl: 'https://sepolia.era.zksync.dev',
};
const metadata = {
    name: 'NFT Marketplace',
    description: 'Mint and trade NFTs with ZKSync Paymaster',
    url: 'https://your-app-url.com',
    icons: ['/favicon.ico'],
};
createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [sepoliaZkSync],
    projectId,
    themeMode: 'dark',
});

export default function WalletModal({
    onClose,
    onDisconnect,
}: {
    onClose: () => void;
    onDisconnect: () => void;
}) {
    const { account, balance, network, setProvider, setAccount, setBalance, setNetwork, setError } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    console.log("NETWORK", network)
    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            console.log("HANDLE_ACCOUNT_CHANGED")
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                fetchWalletData(accounts[0]);
            } else {
                onDisconnect();
            }
        };

        const handleChainChanged = () => {
            fetchWalletData(account);
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [account, setAccount, onDisconnect]);

    const fetchWalletData = async (address: string | null) => {
        console.log("fetchWalletData", address)

        if (!address) return;
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            console.log("PROVIDER", provider)
            setProvider(provider);
            const balance = await provider.getBalance(address);
            console.log("BALANCE:", balance)
            setBalance(ethers.formatEther(balance));
            const network = await provider.getNetwork();
            console.log("NETWORK_PROVIDER", network)
            setNetwork(network?.chainId.toString());
        } catch (error) {
            console.log("ERROR__FETCH_WALLET_DATA:", error)
            setError('Failed to fetch wallet data');
        }
    };

    const switchToZkSync = async () => {
        setLoading(true);
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x144' }], // ZKSync Sepolia chainId (324 in hex)
            });
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x144',
                                chainName: 'ZKSync Sepolia Testnet',
                                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                                rpcUrls: ['https://sepolia.era.zksync.dev'],
                                blockExplorerUrls: ['https://sepolia.explorer.zksync.io'],
                            },
                        ],
                    });
                } catch (addError) {
                    setError('Failed to add ZKSync network');
                }
            } else {
                setError('Failed to switch network');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-cyan-500/50 animate-fade-in">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Wallet Connection</h2>
                {account ? (
                    <div className="space-y-4">
                        <div className="bg-gray-700 p-4 rounded-md">
                            <p className="text-gray-300">Address: <span className="text-cyan-400">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span></p>
                            <p className="text-gray-300">Balance: <span className="text-cyan-400">{balance} ETH</span></p>
                            <p className="text-gray-300">Network: <span className="text-cyan-400">{network}</span></p>
                        </div>
                        {network != '300' && (
                            <button
                                onClick={switchToZkSync}
                                disabled={loading}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Switching...' : 'Switch to ZKSync Sepolia'}
                            </button>
                        )}
                        <button
                            onClick={onDisconnect}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Disconnect Wallet
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <w3m-button />
                        <p className="text-gray-400 text-sm text-center">Connect using MetaMask, WalletConnect, or Coinbase Wallet</p>
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
}