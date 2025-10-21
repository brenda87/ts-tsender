"use client"

import { InputField } from "./ui/InputField"
import { useState } from "react"

export function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")

    async function handleSubmit() {
        console.log(tokenAddress)
        console.log(recipients)
        console.log(amounts)


    }

    return (
        <div>
            <InputField
                label="Token Address"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />
            <InputField
                label="Recipients"
                placeholder="0x1234, 0x5678, 0x9abc..."
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                large={true}
            />
            <InputField
                label="Amount"
                placeholder="100,200,300..."
                value={amounts}
                onChange={(e) => setAmounts(e.target.value)}
                large={true}
            />
            <button onClick={handleSubmit}>
                Send Airdrop
            </button>
        </div>
    )
}