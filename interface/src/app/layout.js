import "./globals.scss"
import { Press_Start_2P } from "next/font/google"

const press_start_2p = Press_Start_2P({ subsets: ["latin"], weight: ["400"] })

export const metadata = {
    title: "NFT Creative Agreement",
    description: "by PixelFame",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={press_start_2p.className}>{children}</body>
        </html>
    )
}
