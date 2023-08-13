// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract EscrowContract {
    address public admin;
    IERC20 public usdc;

    struct EscrowInfo {
        address creator;
        address nftOwner;
        uint256 price;
        bool workCompleted;
    }

    mapping(address => bool) public whitelistedNFTs;
    mapping(uint256 => string) public ipfsLinks; // code to IPFS link
    mapping(uint256 => EscrowInfo) public escrows; // code to escrow info

    event IPFSLinkAdded(uint256 code, address creator, string ipfsLink, uint256 price);

    constructor(address _usdcAddress) {
        admin = msg.sender;
        usdc = IERC20(_usdcAddress);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    modifier onlyCreator(uint256 _code) {
        require(msg.sender == escrows[_code].creator, "Not the creator");
        _;
    }

    modifier onlyNFTOwner(uint256 _code) {
        require(msg.sender == escrows[_code].nftOwner, "Not the NFT owner");
        _;
    }

    function whitelistNFT(address _nftAddress) external onlyAdmin {
        whitelistedNFTs[_nftAddress] = true;
    }

    function revokeWhitelistNFT(address _nftAddress) external onlyAdmin {
        whitelistedNFTs[_nftAddress] = false;
    }

    function addIPFSLink(string memory _ipfsLink, uint256 _price) external returns (uint256) {
        uint256 code = uint256(keccak256(abi.encodePacked(msg.sender, _ipfsLink, block.timestamp))) % 1000000;
        ipfsLinks[code] = _ipfsLink;
        escrows[code] = EscrowInfo({
            creator: msg.sender,
            nftOwner: address(0),
            price: _price,
            workCompleted: false
        });

        emit IPFSLinkAdded(code, msg.sender, _ipfsLink, _price);

        return code;
    }
}
