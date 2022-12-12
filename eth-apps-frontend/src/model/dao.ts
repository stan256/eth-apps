import {BigNumber} from "ethers";

export interface Proposal {
    id: number
    name: string
    amount: BigNumber
    recipient: string
    votes: number
    end: number
    executed: boolean
    alreadyVoted: boolean
}