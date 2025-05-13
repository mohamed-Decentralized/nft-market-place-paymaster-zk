'use client';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-800 shadow-lg">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-cyan-400">
                    NFTVerse
                </Link>
                <nav className="space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-cyan-400 transition">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition">
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
}