import Image from "next/image"
import styles from "./page.module.css"

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <h3>
                    <span className="nes-text">NFT Creative Agreement</span>
                </h3>
                <h3>
                    By <span className="nes-text">PixelFame</span>
                </h3>
            </div>

            <div className={styles.center}>
                <h1 className={styles["center-title"]}>
                    <span className="nes-text">Want to make an agreement as</span>
                </h1>
                <div className={styles["two-columns"]}>
                    <div
                        className={`${styles["columns-container"]} nes-container with-title is-centered`}
                    >
                        <p className="title">Creator</p>
                        <p>Generate a new agreement or manage an existing agreement</p>
                        <i className="nes-ash"></i>
                    </div>
                    <div
                        className={`${styles["columns-container"]} nes-container with-title is-centered`}
                    >
                        <p className="title">NFT owner</p>
                        <p>Do you have a code? Interact with an agreement here</p>
                        <i className="nes-pokeball"></i>
                    </div>
                </div>
            </div>

            <div className={styles.grid}></div>
        </main>
    )
}
