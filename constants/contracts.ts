export const GREETER_CONTRACT_ADDRESS = "0xYourGreeterContractAddress"; // Replace with actual address
export const NFT_CONTRACT_ADDRESS = "0xYourNFTContractAddress"; // Replace with actual address
export const PAYMASTER_ADDRESS = "0xYourPaymasterAddress"; // Replace with actual testnet Paymaster address

export const GREETER_CONTRACT_ABI = [
  // Simplified ABI; replace with actual Greeter ABI
  "function setGreeting(string memory _greeting) public",
  "function greet() public view returns (string memory)",
];

export const NFT_CONTRACT_ABI = [
  // Simplified ABI; replace with actual ERC721 ABI
  "function balanceOf(address owner) public view returns (uint256)",
];
