// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Mock USDC", "USDC") Ownable(initialOwner) {
        _mint(initialOwner, 1_000_000 * 10 ** 6); // 1M USDC with 6 decimals
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}