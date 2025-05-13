// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor(address initialOwner) ERC721("NFTVerse", "NFTV") Ownable(initialOwner) {
        _tokenIdCounter = 0;
    }

    function mint(address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        return tokenId;
    }

    // Base URI for metadata (optional, update as needed)
    function _baseURI() internal pure override returns (string memory) {
        return "https://your-metadata-api.com/nft/";
    }
}