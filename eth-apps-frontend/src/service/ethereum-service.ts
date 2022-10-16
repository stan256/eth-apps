import {Contract, ethers} from "ethers"
import VOTING_ABI from "../ABI/Voting.json"
import {Ballot} from "../model/voting/entity";

const VOTING_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS
const INFURA_API_URL = process.env.REACT_APP_INFURA_API_URL

const provider = new ethers.providers.JsonRpcProvider(INFURA_API_URL)
const VOTING_CONTRACT = new Contract(VOTING_CONTRACT_ADDRESS!, VOTING_ABI.abi, provider)

export const ethersCreateVoting = (name: string, choices: string[], end: number) => {
    VOTING_CONTRACT.createBallot(name, choices, end).then(() => console.log('Created successfully'), console.error)
}

export const vote = () => {

}

export const getAllVotings = (from: number = 0, offset: number = 500): Promise<Ballot[]> => {
    return VOTING_CONTRACT.getBallots(0, 500)
}
