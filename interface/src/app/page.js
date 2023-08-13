import Connect from "@/components/Connect/Connect"
import styles from "./page.module.scss"
import Header from "@/components/Header/Header"
import Link from "next/link"

export default function Home() {
    return (
        <main className={styles.main}>
            <Header />

            <div className={styles.center}>
                <h1 className={styles["center-title"]}>
                    <span className="nes-text">Want to make an agreement as</span>
                </h1>
                <div className={styles["two-columns"]}>
                    <Link
                        href="/creator"
                        className={`${styles["columns-container"]} nes-container with-title is-centered`}
                    >
                        <p className="title">Creator</p>
                        <p>Generate a new agreement or manage an existing agreement</p>
                        <i className="nes-ash"></i>
                    </Link>
                    <div
                        className={`${styles["columns-container"]} nes-container with-title is-centered`}
                    >
                        <p className="title">Collector</p>
                        <p>Do you have a code? Interact with an agreement here</p>
                        <i className="nes-pokeball"></i>
                    </div>
                </div>
            </div>

            <div className={styles.grid}></div>
        </main>
    )
}
