export interface Ballot {
    id: number
    name: string
    choices: Choice[]
    end: number
}

export interface Choice {
    id: number
    name: string
    votes: number
}