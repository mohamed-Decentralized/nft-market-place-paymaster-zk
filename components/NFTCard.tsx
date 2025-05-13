'use client';
export default function NFTCard({ nft }: { nft: { id: number; name: string; image: string } }) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-cyan-500/50 transition">
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-semibold text-cyan-400">{nft.name}</h2>
            <p className="text-gray-400">ID: {nft.id}</p>
        </div>
    );
}