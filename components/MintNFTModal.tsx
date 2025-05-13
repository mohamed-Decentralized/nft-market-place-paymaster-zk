'use client';
import { useState } from 'react';

export default function MintNFTModal({
    onClose,
    onMint,
}: {
    onClose: () => void;
    onMint: (name: string) => void;
}) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onMint(name);
        setName('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Mint New NFT</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="name">
                            NFT Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 py-2 px-4 rounded-lg transition"
                        >
                            Mint
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}