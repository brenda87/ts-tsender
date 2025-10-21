"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, zksync, base, mainnet } from "wagmi/chains"

export default getDefaultConfig({
    appName: "TSender",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [anvil, zksync, base, mainnet],
    ssr: false
})