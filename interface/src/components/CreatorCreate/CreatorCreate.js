"use client"

import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { useState } from "react"
import styles from "./creator-create.module.scss"
import { ethers } from "ethers"

export default function CreatorCreate() {
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const { account, provider, escrow, usdc } = useContext(AppContext)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const signer = provider.getSigner()
        const escrowWithSigner = escrow.connect(signer)
        const usdcWithSigner = usdc.connect(signer)

        console.log(escrowWithSigner.address)
        console.log(escrowWithSigner.interface.format())

        const priceUsdc = ethers.utils.parseUnits(price, 18)

        // await usdcWithSigner.mint(account, priceUsdc)
        await usdcWithSigner.approve(escrow.address, priceUsdc)

        const tx = escrowWithSigner.addIPFSLink(
            "QmVLwvmGehsrNEvhcCnnsw5RQNseohgEkFNN1848ZNzdng",
            priceUsdc,
        )
        console.log({ tx })
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value)
    }

    return (
        <div className={styles["creator-manage"]}>
            <form onSubmit={handleSubmit} className="nes-field">
                <label htmlFor="textarea_field">Create a new job</label>
                <textarea
                    id="textarea_field"
                    className="nes-textarea"
                    value={description}
                    onChange={handleDescriptionChange}
                ></textarea>
                <label htmlFor="price">How much do you charge per NFT?</label>
                <input
                    type="text"
                    id="price"
                    className="nes-input"
                    placeholder="USDC"
                    value={price}
                    onChange={handlePriceChange}
                />
                <button type="submit" className="nes-btn is-warning">
                    Create Job
                </button>
            </form>
        </div>
    )
}
