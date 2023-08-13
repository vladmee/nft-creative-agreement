"use client"

import "./globals.scss"
import { Press_Start_2P } from "next/font/google"
import AppProvider from "../context/AppContext"

const press_start_2p = Press_Start_2P({ subsets: ["latin"], weight: ["400"] })

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <AppProvider>
                <body className={press_start_2p.className}>{children}</body>
            </AppProvider>
        </html>
    )
}
