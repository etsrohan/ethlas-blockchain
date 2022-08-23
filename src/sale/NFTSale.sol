// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
pragma abicoder v2;

import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '../utils/AccessProtected.sol';
import '../nft/TestorinoNFT.sol';

contract NFTSale is 
    AccessProtected
{
    // -----------------------------------VARIABLES-----------------------------------
    using Address for address;
    using Counters for Counters.Counter;

    TestorinoNFT public nftContract;

    mapping(address => Counters.Counter) public userPurchases;
    uint256 public price;

    string public placeholderURI;

    // ------------------------------------EVENTS-------------------------------------
    event Sold(uint256 _nftId, address _buyer, uint256 _price);

    // -----------------------------------FUNCTIONS-----------------------------------
    constructor(
        address _nftAddress,
        uint256 _price,
        string memory _placeholderURI
    ) {
        require(_nftAddress.isContract(), 'NFT address must be a contract');
        nftContract = TestorinoNFT(_nftAddress);
        price = _price;
        placeholderURI = _placeholderURI;
    }

    /// @notice - Set price for purchasing NFT
    /// @param _price - New price for sale of NFT
    function setPrice(uint256 _price)
        public
        onlyAdmin
    {
        price = _price;
    }
    
    /// @notice - Helper function to purchase NFT
    function _purchase() 
        internal 
    {
        address buyer = _msgSender();
        uint256 _nftId = nftContract.mint(buyer, placeholderURI);
        userPurchases[buyer].increment();
        emit Sold(_nftId, buyer, price);
    }

    /// @notice - Purchase an NFT
    function purchase()
        external
        payable
    {
        require(msg.value == price, 'Insufficient or excess funds');
        _purchase();
    }

    /// @notice - withdraw native tokens from contract
    /// @dev - only owner can withdraw funds
    function withdrawETH()
        external
        onlyOwner
    {
        payable(msg.sender).transfer(address(this).balance);
    }

    /// @notice - withdraw ERC20 tokens sent to this contract
    /// @dev - only owner can withdraw tokens
    function withdrawTokens(
        address tokenAddress,
        uint256 amount,
        address wallet
    )
        external
        onlyOwner
    {
        IERC20(tokenAddress).transfer(wallet, amount);
    }
}