'use client';
import { useContext, useEffect, useState } from 'react';
import Header from '@/components/Header';
import WalletButton from '@/components/WalletButton';
import NFTCard from '@/components/NFTCard';
import MintNFTModal from '@/components/MintNFTModal';
import { WalletContext } from '@/context/WalletContext';
import { ethers } from 'ethers';
import { usePaymaster } from '@/hooks/usePaymaster';
import { GREETER_CONTRACT_ABI, GREETER_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from '@/constants/contracts';

export default function Home() {
  const { provider, account, hasNFT, setHasNFT } = useContext(WalletContext);
  const [nfts, setNfts] = useState<any[]>([]);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const { paymasterParams } = usePaymaster();

  useEffect(() => {
    if (account && provider) {
      fetchNFTs();
      checkNFTBalance();
    }
  }, [account, provider]);

  const fetchNFTs = async () => {
    // Fetch minted NFTs (mock implementation; replace with actual API or contract call)
    setNfts([
      { id: 1, name: 'NFT #1', image: '/assets/images/placeholder-nft.png' },
      { id: 2, name: 'NFT #2', image: '/assets/images/placeholder-nft.png' },
    ]);
  };

  const checkNFTBalance = async () => {
    if (!provider || !account) return;
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
    console.log("NFT_CONTRACT_ADDRESS", nftContract)
    const balance = await nftContract.balanceOf(account);
    setHasNFT(balance > 0);
  };

  const mintNFT = async (name: string) => {
    if (!provider || !account) return;
    const signer = await provider.getSigner();
    const greeterContract = new ethers.Contract(GREETER_CONTRACT_ADDRESS, GREETER_CONTRACT_ABI, signer);

    try {
      let tx;
      if (hasNFT) {
        // Gasless transaction with Paymaster
        tx = await greeterContract.setGreeting(name, { customData: { paymasterParams } });
      } else {
        // Regular transaction or ERC20 token payment
        tx = await greeterContract.setGreeting(name);
      }
      await tx.wait();
      fetchNFTs();
      setIsMintModalOpen(false);
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">NFT Marketplace</h1>
          <div className="flex items-center space-x-4">
            <WalletButton />
            <button
              onClick={() => setIsMintModalOpen(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
            >
              Mint NFT
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </main>
      {isMintModalOpen && (
        <MintNFTModal
          onClose={() => setIsMintModalOpen(false)}
          onMint={mintNFT}
        />
      )}
    </div>
  );
}