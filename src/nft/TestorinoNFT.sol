// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
pragma abicoder v2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '../utils/AccessProtected.sol';

contract TestorinoNFT is 
    ERC721('TestorinoNFT', 'TNFT'),
    AccessProtected
{
    // -----------------------------------VARIABLES-----------------------------------
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private tokenIds;

    string private __baseURI;
    uint256 private __revealUntil;

    uint256 public cap;

    mapping(uint256 => string) private _tokenURIs;
    

    // ------------------------------------EVENTS-------------------------------------
    event SetCap(uint256 _cap);

    // -----------------------------------FUNCTIONS-----------------------------------
    /// @param _cap - Maximum number of NFTs
    constructor(string memory baseURI_, uint256 _cap, uint256 _revealUntil) {
        setCap(_cap);
        setRevealUntil(_revealUntil);
        setBaseURI(baseURI_);
    }

    /// @notice - Sets cap for NFTs
    /// @param _cap - Maximum number of NFTs
    function setCap(uint256 _cap)
        public
        onlyOwner
    {
        cap = _cap;
        emit SetCap(_cap);
    }

    /// @notice - Mints NFT
    /// @param recipient - Mint to
    /// @param URI - uri of the NFT
    /// @dev - Only admins can mint new tokens
    function mint(
        address recipient,
        string memory URI
    )
        external
        onlyAdmin
        returns (uint256)
    {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        require(newTokenId <= cap, 'NFT cap exceeded');

        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, URI);
        return newTokenId;
    }

    /// @notice - Sets token URI
    /// @param tokenId - Token Id of NFT
    /// @param _tokenURI - uri to set
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    /// @notice - returns base URI for NFT
    function _baseURI()
        internal
        view
        override
        returns (string memory)
    {
        return __baseURI;
    }

    /// @notice - Set URI for token
    /// @param tokenId - Token Id of NFT
    /// @param _tokenURI - uri to set
    function setURI(
        uint256 tokenId,
        string memory _tokenURI
    )
        external
        onlyAdmin
    {
        _setTokenURI(tokenId, _tokenURI);
    }
    /// @notice - Set URI for token batch
    /// @param _tokenIds - Token Ids of NFT
    /// @param tokenURIs - URIs to set
    function setBatchURI(
        uint256[] memory _tokenIds,
        string[] memory tokenURIs
    )
        external
        onlyAdmin
    {
        require(_tokenIds.length == tokenURIs.length, 'Length mismatch');
        for(uint256 i = 0; i < _tokenIds.length; i++) {
            _setTokenURI(_tokenIds[i], tokenURIs[i]);
        }
    }

    /// @notice - Returns the base uri for NFTs
    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    /// @notice - Sets the base uri for NFTs
    /// @param baseURI_ - New base uri
    function setBaseURI(string memory baseURI_)
        public
        onlyAdmin
    {
        __baseURI = baseURI_;
    }

    /// @notice - Sets the reveal untill
    /// @param _revealUntil - new tokenId to reveal untill
    function setRevealUntil(uint256 _revealUntil)
        public
        onlyAdmin
    {
        __revealUntil = _revealUntil;
    }

    /// @notice - Returns metadata for token id
    /// @param tokenId - token ID of the NFT
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');

        if(tokenId > __revealUntil || bytes(__baseURI).length == 0) {
            return super.tokenURI(tokenId);
        } 
        
        return string(abi.encodePacked(__baseURI, tokenId.toString()));
    }
}