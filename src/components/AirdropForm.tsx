"use client"

import { InputField } from "./ui/InputField"
import { useMemo, useState } from "react"
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants"
import { useChainId, useConfig, useAccount } from "wagmi"
import { readContract } from "@wagmi/core"

export function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])

    async function getApproveAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("The chain you are connected to is not supported.")
            return 0
        }
        // read from the contract to see if we have approved enough tokens
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })
        return response as number

    }

    async function handleSubmit() {
        //1a. If already approved move to step 2
        //1b. Approve tsender contract to send our tokens
        //2. call the airdrop function on the tsender contract
        //3. wait for transaction to be mined
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApproveAmount(tSenderAddress)
        console.log(approvedAmount)


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
            <button onClick={handleSubmit}
                className="relative px-5 py-2.5 font-semibold text-white rounded-xl 
             bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 
             hover:from-cyan-500 hover:to-purple-500 
             shadow-md hover:shadow-lg transition-all duration-300"
            >
                Send Airdrop
            </button>
        </div>
    )
}