import { WalletProvider } from '@/context/WalletContext';
import './globals.css';

export const metadata = {
  title: 'NFT Marketplace',
  description: 'Mint and trade NFTs with ZKSync Paymaster',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}