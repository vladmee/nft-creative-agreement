"use client"

import { useState } from "react"
import styles from "./creator-manage.module.scss"

export default function CreatorManage() {
    const [code, setCode] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
    }

    const handleCodeChange = (event) => {
        setCode(event.target.value)
    }

    return (
        <div className={styles["creator-manage"]}>
            <form onSubmit={handleSubmit} className="nes-field">
                <label htmlFor="creator_code">Do you have a code?</label>
                <input
                    type="text"
                    id="creator_code"
                    className="nes-input"
                    placeholder="enter your code"
                    value={code}
                    onChange={handleCodeChange}
                />
                <button type="submit" className="nes-btn is-warning">
                    View Job
                </button>
            </form>
        </div>
    )
}
