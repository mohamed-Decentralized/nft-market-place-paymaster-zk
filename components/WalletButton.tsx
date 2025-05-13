'use client';
import { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import WalletModal from './WalletModal';

export default function WalletButton() {
    const { account, disconnectWallet } = useContext(WalletContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center space-x-2"
            >
                {account ? (
                    <>
                        <span>{`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </>
                ) : (
                    <span>Connect Wallet</span>
                )}
            </button>
            {isModalOpen && (
                <WalletModal
                    onClose={() => setIsModalOpen(false)}
                    onDisconnect={disconnectWallet}
                />
            )}
        </>
    );
}