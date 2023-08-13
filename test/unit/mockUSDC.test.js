const { expect } = require("chai")
const { ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

async function deployMockUSDCFixture() {
    const [deployer] = await ethers.getSigners()

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC")
    const usdcToken = await MockUSDCFactory.connect(deployer).deploy()

    return { usdcToken }
}

describe("MockUSDC", function () {
    it("Should successfully mint tokens", async function () {
        const [deployer, swapper] = await ethers.getSigners()

        const { usdcToken } = await loadFixture(deployMockUSDCFixture)

        const mintAmount = ethers.parseEther("1000")
        console.log(mintAmount)
        console.log(swapper.address)

        // Mint some tokens to the swapper address
        try {
            console.log("Minting...")
            await usdcToken.connect(deployer).mint(swapper.address, mintAmount)
            console.log("Minted USDC")
        } catch (error) {
            console.error("Error minting USDC", error)
        }

        // Assert the mint
        expect(await usdcToken.balanceOf(swapper.address)).to.equal(mintAmount)
    })
})
