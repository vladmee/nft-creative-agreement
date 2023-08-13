const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    let mockUSDC
    try {
        mockUSDC = await get("MockUSDC")
    } catch (error) {
        log("MockUSDC not found. Deploying now...")
        const mockUSDCDeployment = await deploy("MockUSDC", {
            from: deployer,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        mockUSDC = await get("MockUSDC")
    }

    let mockNFT
    try {
        mockNFT = await get("MockNFT")
    } catch (error) {
        log("MockNFT not found. Deploying now...")
        const mockNFTDeployment = await deploy("MockNFT", {
            from: deployer,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        mockNFT = await get("MockNFT")
    }

    const mockUSDCAddress = mockUSDC.address
    const arguments = [mockUSDCAddress]
    const escrow = await deploy("EscrowContract", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(escrow.address, arguments)
    }
}

module.exports.tags = ["all", "escrow", "main"]
