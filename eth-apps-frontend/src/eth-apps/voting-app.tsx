import React, {FC} from "react"
import {useForm} from "react-hook-form"

interface Ballot {
    id: number
    name: string
    choices: Choice[]
    end: number
}

interface Choice {
    id: number
    name: string
    votes: number
}

type FormValues = {
    ballots: Ballot[]
}

const VotingApp: FC = (props) => {
    const [ballots, setBallots] = React.useState<Ballot[]>([])
    const {
        register,
        formState: {errors, isValid},
        handleSubmit,
        reset
    } = useForm()

    const submitVote = (data: any) => {
        console.log(data)
    }

    const createVoting = (data: any) => {
        console.log(data)
        reset()
    }

    return <div>

        {ballots.map((ballot, i) => {
            return <div key={i}>
                <p>{`Voting ID: ${ballot.id}`}</p>
                <p>{`Voting name: ${ballot.name}`}</p>
                <p>{`Voting finish date: ${ballot.end}`}</p>
                <div>
                    <p>Choices:</p>
                    <div>
                        {ballot.choices.map((choice, j) => {
                            return <fieldset key={j}>
                                <label htmlFor={`voting-choice-${j}`}>{choice.name}</label>
                                <input id={`voting-choice-${j}`} type="radio" name={`voting${i}`} value={choice.id}/>
                            </fieldset>
                        })}
                    </div>
                </div>
                <button onClick={submitVote}>Submit my vote</button>
            </div>
        })}

        {/* create ballot */}
        <div>
            <p>Create my new ballot:</p>
            <form onSubmit={handleSubmit(createVoting)}>
                <label>
                    Voting name
                    <input {...register('name', {required: true})} type="text"/>
                </label>
                <label>
                    Voting end time (in seconds after now)
                    <input {...register('end', {required: true})} type="number"/>
                </label>


                <input disabled={!isValid} type="submit" value='Create voting'/>
            </form>
        </div>
    </div>
}

export default VotingApp
