// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@matterlabs/zksync-contracts/contracts/l2-contracts/L2ContractHelper.sol";
import {IPaymaster, ExecutionResult, PAYMASTER_VALIDATION_SUCCESS_MAGIC} from "@matterlabs/zksync-contracts/contracts/system-contracts/interfaces/IPaymaster.sol";
import "@matterlabs/zksync-contracts/contracts/system-contracts/interfaces/IPaymasterFlow.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Paymaster is IPaymaster, Ownable {
    address public immutable nftContract;
    address public immutable erc20Token;
    uint256 public constant GAS_FEE_IN_TOKENS = 1 * 10 ** 6; // 1 USDC (6 decimals)

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_ADDRESS, "Only bootloader can call");
        _;
    }

    constructor(
        address _nftContract,
        address _erc20Token,
        address initialOwner
    ) Ownable(initialOwner) {
        nftContract = _nftContract;
        erc20Token = _erc20Token;
    }

    function validateAndPayForPaymasterTransaction(
        bytes32,
        bytes32,
        Transaction calldata _transaction
    )
        external
        payable
        onlyBootloader
        returns (bytes4 magic, bytes memory context)
    {
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;

        address user = address(uint160(_transaction.from));
        bool hasNFT = IERC721(nftContract).balanceOf(user) > 0;

        if (hasNFT) {
            // Gasless for NFT holders
            uint256 requiredETH = _transaction.maxFeePerGas *
                _transaction.gasLimit;
            require(
                address(this).balance >= requiredETH,
                "Paymaster: insufficient ETH balance"
            );

            (bool success, ) = BOOTLOADER_ADDRESS.call{value: requiredETH}("");
            require(success, "Paymaster: ETH transfer failed");
        } else {
            // Pay with ERC20 tokens
            require(
                IERC20(erc20Token).transferFrom(
                    user,
                    address(this),
                    GAS_FEE_IN_TOKENS
                ),
                "Paymaster: ERC20 transfer failed"
            );

            uint256 requiredETH = _transaction.maxFeePerGas *
                _transaction.gasLimit;
            require(
                address(this).balance >= requiredETH,
                "Paymaster: insufficient ETH balance"
            );

            (bool success, ) = BOOTLOADER_ADDRESS.call{value: requiredETH}("");
            require(success, "Paymaster: ETH transfer failed");
        }

        return (magic, "");
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable onlyBootloader {}

    function validateAndPayForPaymasterTransaction(
        bytes32 _txHash,
        bytes32 _suggestedSignedHash,
        Transaction calldata _transaction
    ) external payable virtual returns (bytes4 magic, bytes memory context);

    receive() external payable {}
}
