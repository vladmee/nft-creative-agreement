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
              nft,
              code,
              ipfsLink = "QmVLwvmGehsrNEvhcCnnsw5RQNseohgEkFNN1848ZNzdng",
              nftId

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]

              await deployments.fixture(["mocks"])
              await deployments.fixture(["escrow"])

              const usdcContract = await deployments.get("MockUSDC")
              const escrowContract = await deployments.get("EscrowContract")
              nftContract = await deployments.get("MockNFT")

              usdc = await ethers.getContractAt(usdcContract.abi, usdcContract.address)
              escrow = await ethers.getContractAt(escrowContract.abi, escrowContract.address)
              nft = await ethers.getContractAt(nftContract.abi, nftContract.address)

              // Mint some USDC for deployer and approve for escrow
              try {
                  await usdc.connect(deployer).mint(deployer.address, ethers.parseUnits("1000", 6))
                  await usdc
                      .connect(deployer)
                      .approve(escrowContract.address, ethers.parseUnits("1000", 6))
              } catch (error) {
                  console.error("Error during mint and approve:", error)
              }

              //Mint the NFT
              await nft.mintNft()
              const tokenCounter = await nft.getTokenCounter()
              const nftIdBN = ethers.parseUnits(tokenCounter.toString(), 6)
              const one = ethers.parseUnits("1", 6)
              nftId = (nftIdBN - one).toString()

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
              code = args[0].toString()
              assert.equal(args[2], ipfsLink, "IPFS Link not set correctly")
          })

          it("Should allow an NFT owner to initiate an escrow", async () => {
              await escrow.addIPFSLink(ipfsLink, ethers.parseUnits("25", 6))

              try {
                  await escrow.initiateEscrow(code, nftId, nftContract.address)
              } catch (error) {
                  console.error("Error during initiateEscrow:", error)
              }

              const escrowInfo = await escrow.escrows(code)

              assert.equal(
                  escrowInfo.price.toString(),
                  ethers.parseUnits("25", 6).toString(),
                  "Price not set correctly",
              )
          })

          it("Should allow the creator to mark work as completed", async () => {
              await escrow.addIPFSLink(ipfsLink, ethers.parseUnits("25", 6))
              await escrow.initiateEscrow(code, nftId, nftContract.address)

              await escrow.markWorkCompleted(code)
              const escrowInfo = await escrow.escrows(code)
              assert.isTrue(escrowInfo.workCompleted, "Work should be marked as completed")
          })

          it("Should allow NFT owner to release funds after work completion", async () => {
              await escrow.addIPFSLink(ipfsLink, ethers.parseUnits("25", 6))
              await escrow.initiateEscrow(code, nftId, nftContract.address)
              await escrow.markWorkCompleted(code)

              const initialBalance = await usdc.balanceOf(deployer.address)

              await escrow.releaseFunds(code)

              const finalBalance = await usdc.balanceOf(deployer.address)

              const difference = finalBalance - initialBalance

              assert.equal(
                  difference.toString(),
                  ethers.parseUnits("25", 6).toString(),
                  "Funds not released correctly",
              )
          })

          it("Should not allow releasing funds without work completion", async () => {
              await escrow.addIPFSLink(ipfsLink, ethers.parseUnits("25", 6))
              await escrow.initiateEscrow(code, nftId, nftContract.address)

              await expect(escrow.releaseFunds(code)).to.be.revertedWith(
                  "Work is not completed yet",
              )
          })
      })
