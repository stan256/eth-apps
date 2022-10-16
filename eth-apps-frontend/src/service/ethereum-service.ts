import {Contract, ethers} from "ethers"
import VOTING_ABI from "../ABI/Voting.json"

const VOTING_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS
const INFURA_API_URL = process.env.REACT_APP_INFURA_API_URL

const provider = new ethers.providers.JsonRpcProvider(INFURA_API_URL)
console.log(process.env.PUBLIC_URL)
console.log(process.env.INFURA_API_KEY)
const VOTING_CONTRACT = new Contract(VOTING_CONTRACT_ADDRESS!, VOTING_ABI.abi, provider)

export const ethersCreateVoting = (name: string, choices: string[], end: Date) => {
    VOTING_CONTRACT.createBallot(name, choices, end).then(() => console.log('Created successfully'), console.error)
}

export const vote = () => {

}

export const getAllVotings = () => {
    VOTING_CONTRACT.nextBallotId()
    console.log(VOTING_CONTRACT.nextBallotId())
    VOTING_CONTRACT.ballots(0).then(console.log, console.error)
    VOTING_CONTRACT.getAllBallots();
}
