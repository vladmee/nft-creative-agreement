const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Escrow Contract Unit Tests", function () {
          let escrow,
              deployer,
              usdc,
              nftContract,
              code,
              ipfsLink = "QmVLwvmGehsrNEvhcCnnsw5RQNseohgEkFNN1848ZNzdng"

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

              // Whitelist the NFT contract
              await escrow.whitelistNFT(nftContract.address)
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

          it("Should allow a creator to add an IPFS link", async () => {
              const tx = await escrow.addIPFSLink(ipfsLink, ethers.parseUnits("25", 6))
              const receipt = await tx.wait()

              // Ensure that there are logs in the receipt
              assert(receipt.logs.length > 0, "No logs found in the receipt")

              // Filter out the IPFSLinkAdded event logs
              const event = receipt.logs.filter(
                  (log) => log.fragment && log.fragment.name === "IPFSLinkAdded",
              )[0]

              // Ensure that the event was found
              assert.exists(event, "Event IPFSLinkAdded should be emitted")

              // Further assertions based on the event can be done here
              const args = event.args
              assert.equal(args[2], ipfsLink, "IPFS Link not set correctly")
          })
      })
