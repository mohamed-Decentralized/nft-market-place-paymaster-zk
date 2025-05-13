'use client';
import { createContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
    provider: ethers.BrowserProvider | null;
    account: string | null;
    balance: string;
    network: string;
    hasNFT: boolean;
    error: string | null;
    setProvider: (provider: ethers.BrowserProvider | null) => void;
    setAccount: (account: string | null) => void;
    setBalance: (balance: string) => void;
    setNetwork: (network: string) => void;
    setHasNFT: (hasNFT: boolean) => void;
    setError: (error: string | null) => void;
    disconnectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType>({
    provider: null,
    account: null,
    balance: '0',
    network: '',
    hasNFT: false,
    error: null,
    setProvider: () => { },
    setAccount: () => { },
    setBalance: () => { },
    setNetwork: () => { },
    setHasNFT: () => { },
    setError: () => { },
    disconnectWallet: () => { },
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>('0');
    const [network, setNetwork] = useState<string>('');
    const [hasNFT, setHasNFT] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setBalance('0');
        setNetwork('');
        setHasNFT(false);
        setError(null);
    };

    return (
        <WalletContext.Provider
            value={{
                provider,
                account,
                balance,
                network,
                hasNFT,
                error,
                setProvider,
                setAccount,
                setBalance,
                setNetwork,
                setHasNFT,
                setError,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};