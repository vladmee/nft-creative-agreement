"use client"

import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import truncateEthAddress from "truncate-eth-address"
import styles from "./connect.module.scss"

export default function Connect() {
    const { account, connectWallet, error } = useContext(AppContext)

    return (
        <div className={styles["container"]}>
            <div className="box">
                {account ? (
                    <div className={`${styles["nes-badge-width"]} nes-badge`}>
                        <span className="is-success">{truncateEthAddress(account)}</span>
                    </div>
                ) : (
                    <button type="button" className="nes-btn is-primary" onClick={connectWallet}>
                        Connect
                    </button>
                )}
            </div>
            {error && <small className={`nes-text is-error`}>{`Error: ${error}`}</small>}
        </div>
    )
}
