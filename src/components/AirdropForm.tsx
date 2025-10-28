"use client"

import { InputField } from "./ui/InputField"
import { useMemo, useState } from "react"
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "@/utils"


export function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")


    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, writeContractAsync } = useWriteContract()




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
        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })

            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash
            })

            console.log("Approval confirmed:", approvalReceipt)

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })

        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ]
            })
        }



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