const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Escrow Contract Unit Tests", function () {
          let escrow, deployer, usdc, nftContract

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]

              await deployments.fixture(["mocks"])
              await deployments.fixture(["escrow"])

              const usdcContract = await deployments.get("MockUSDC")
              const escrowContract = await deployments.get("EscrowContract")

              usdc = await ethers.getContractAt(usdcContract.abi, usdcContract.address)
              escrow = await ethers.getContractAt(escrowContract.abi, escrowContract.address)
              nftContract = await deployments.get("MockNFT")
          })

          describe("Constructor", () => {
              it("Initializes the Escrow Contract Correctly.", async () => {
                  const escrowAdmin = await escrow.admin()
                  assert.equal(escrowAdmin, deployer.address)
              })
          })

          describe("Whitelist Functionality", () => {
              it("Allows the admin to whitelist an NFT contract", async () => {
                  await escrow.whitelistNFT(nftContract.address)
                  const isWhitelisted = await escrow.whitelistedNFTs(nftContract.address)
                  assert.isTrue(isWhitelisted)
              })

              it("Prevents non-admins from whitelisting an NFT contract", async () => {
                  const nonAdmin = accounts[1]
                  await expect(
                      escrow.connect(nonAdmin).whitelistNFT(nftContract.address),
                  ).to.be.revertedWith("Not the admin")
              })
          })
      })
