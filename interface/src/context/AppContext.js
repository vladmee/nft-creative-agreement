"use client"

import React, { createContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import { escrowAbi } from "./escrowAbi"
import { usdcAbi } from "./usdcAbi"

export const AppContext = createContext()

const { ethereum } = typeof window !== "undefined" ? window : {}

const AppProvider = ({ children }) => {
    const [account, setAccount] = useState("")
    const [error, setError] = useState("")
    const [escrow, setEscrow] = useState(undefined)
    const [usdc, setUsdc] = useState(undefined)

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const checkEthereumExists = () => {
        if (!provider) {
            setError("Please Install MetaMask.")
            return false
        }
        return true
    }
    const getConnectedAccounts = async () => {
        setError("")
        try {
            const accounts = await provider.send("eth_requestAccounts", [])
            setAccount(accounts[0])

            const escrowContract = new ethers.Contract(
                "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
                escrowAbi,
                provider,
            )
            setEscrow(escrowContract)

            const usdcContract = new ethers.Contract(
                "0x5fbdb2315678afecb367f032d93f642f64180aa3",
                usdcAbi,
                provider,
            )
            setUsdc(usdcContract)
        } catch (err) {
            setError(err.message)
        }
    }
    const connectWallet = async () => {
        setError("")
        if (checkEthereumExists()) {
            try {
                const accounts = await provider.send("eth_requestAccounts", [])
                setAccount(accounts[0])

                const escrowContract = new ethers.Contract(
                    "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
                    escrowAbi,
                    provider,
                )
                setEscrow(escrowContract)

                const usdcContract = new ethers.Contract(
                    "0x5fbdb2315678afecb367f032d93f642f64180aa3",
                    usdcAbi,
                    provider,
                )
                setUsdc(usdcContract)
            } catch (err) {
                setError(err.message)
            }
        }
    }

    useEffect(() => {
        if (checkEthereumExists()) {
            ethereum.on("accountsChanged", getConnectedAccounts)
            getConnectedAccounts()
        }
        return () => {
            if (checkEthereumExists()) {
                ethereum.removeListener("accountsChanged", getConnectedAccounts)
            }
        }
    }, [])

    return (
        <AppContext.Provider value={{ account, connectWallet, error, provider, escrow, usdc }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider
