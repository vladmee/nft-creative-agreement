"use client"

import Header from "@/components/Header/Header"
import styles from "./page.module.css"
import { useContext } from "react"
import { AppContext } from "../../../context/AppContext"
import Connect from "@/components/Connect/Connect"
import CreatorManage from "@/components/CreatorManage/CreatorManage"
import CreatorCreate from "@/components/CreatorCreate/CreatorCreate"

export default function Creator() {
    const { account } = useContext(AppContext)

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.center}>
                <h1 className={styles["center-title"]}>
                    <span className="nes-text">Creator</span>
                </h1>
                {!account ? (
                    <Connect />
                ) : (
                    <div className={styles["creator-dashboard"]}>
                        <CreatorManage />
                        <hr />
                        <div>
                            <p className="nes-text">OR</p>
                        </div>
                        <hr />
                        <CreatorCreate />
                    </div>
                )}
            </div>

            <div className={styles.grid}></div>
        </main>
    )
}
