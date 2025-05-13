import { Wallet, utils } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet("YOUR_PRIVATE_KEY"); // Replace with your wallet's private key
  const deployer = new Deployer(hre, wallet);

  // Deploy MockUSDC
  const usdcArtifact = await deployer.loadArtifact("MockUSDC");
  const usdc = await deployer.deploy(usdcArtifact, [wallet.address]);
  console.log(`MockUSDC deployed at: ${usdc.address}`);

  // Deploy NFT
  const nftArtifact = await deployer.loadArtifact("NFT");
  const nft = await deployer.deploy(nftArtifact, [wallet.address]);
  console.log(`NFT deployed at: ${nft.address}`);

  // Deploy Greeter
  const greeterArtifact = await deployer.loadArtifact("Greeter");
  const greeter = await deployer.deploy(greeterArtifact, ["Hello, ZKSync!"]);
  console.log(`Greeter deployed at: ${greeter.address}`);

  // Deploy Paymaster
  const paymasterArtifact = await deployer.loadArtifact("Paymaster");
  const paymaster = await deployer.deploy(paymasterArtifact, [
    nft.address,
    usdc.address,
    wallet.address,
  ]);
  console.log(`Paymaster deployed at: ${paymaster.address}`);

  // Fund Paymaster with ETH
  const ethAmount = ethers.parseEther("0.1");
  await wallet.sendTransaction({
    to: paymaster.address,
    value: ethAmount,
  });
  console.log(`Funded Paymaster with 0.1 ETH`);

  // Mint some USDC to wallet for testing
  const usdcContract = new ethers.Contract(
    usdc.address,
    usdcArtifact.abi,
    wallet
  );
  await usdcContract.mint(wallet.address, 1000 * 10 ** 6); // 1000 USDC
  console.log(`Minted 1000 USDC to ${wallet.address}`);
}
