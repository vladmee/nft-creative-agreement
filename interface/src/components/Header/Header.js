import Link from "next/link"
import Connect from "../Connect/Connect"
import styles from "./header.module.scss"

export default function Header() {
    return (
        <div className={styles.description}>
            <Link href="/">
                <h3>
                    <span className="nes-text">NFT Creative Agreement</span>
                </h3>
            </Link>
            <Connect />
        </div>
    )
}
