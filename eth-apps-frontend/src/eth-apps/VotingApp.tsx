import React, {FC, useEffect} from "react"
import {Controller, useFieldArray, useForm} from "react-hook-form"
import Box from "@mui/material/Box"
import {
    Card,
    CardActions,
    CardContent, Container, Fab,
    FormControlLabel,
    FormGroup,
    FormLabel, LinearProgress,
    Modal,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import {DateTimePicker} from "@mui/x-date-pickers"
import {format} from "date-fns"
import Grid from "@mui/material/Unstable_Grid2"
import {defaultFabStyle, defaultModalStyle} from "../utils/mui-default-component-settings"
import {Add} from "@mui/icons-material"
import {useOutletContext} from "react-router-dom"
import {LayoutState} from "../layout/Layout"
import DeleteIcon from '@mui/icons-material/Delete'
import {Ballot, Choice} from "../model/voting/entity"
import VotingABI from "../ABI/Voting.json"
import {ethers} from "ethers"
import {Pagination} from "../model/common-models"
import {roundNextHour} from "../utils/time"

declare let window: any
const votingContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_VOTING_APP!

function convertBallots(response: any): Ballot[] {
    return response === undefined ? [] : response.map(r => {
        return {
            id: r.id.toNumber(),
            name: r.name,
            choices: convertChoices(r.choices),
            end: r.end.toNumber(),
        }
    })
}

function convertChoices(response: any): Choice[] {
    return response === undefined ? [] : response.map((r) => {
        return {
            id: r.id.toNumber(),
            name: r.name,
            votes: r.votes.toNumber()
        }
    })
}

const VotingApp: FC = () => {
    const setOutletContext: React.Dispatch<React.SetStateAction<LayoutState>> = useOutletContext()
    const [createVotingModalOpen, setCreateVotingModalOpen] = React.useState(false)
    const [ballots, setBallots] = React.useState<Ballot[]>([])
    const [alreadyVotedBallots, setAlreadyVotedBallots] = React.useState<boolean[]>([])
    const [selectedChoices, setSelectedChoices] = React.useState<SelectedBallotChoice[]>([])
    const [ballotsPagination, setBallotsPagination] = React.useState<Pagination>({from: 0, to: 30})
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(votingContractAddress, VotingABI.abi, provider.getSigner())

    // form
    const {formState: {isValid, errors}, handleSubmit, reset, control, getValues} = useForm({mode: 'onChange'})
    const {fields, append, remove} = useFieldArray({control, name: "choices"})

    useEffect(() => fetchBallots(), [])
    useEffect(() => {
        updateAlreadyVotedBallots()
    }, [ballots])

    function updateAlreadyVotedBallots() {
        return contract.fetchAlreadyVotedBallots(ballots.map(b => b.id))
            .then(a => setAlreadyVotedBallots(a), console.error)
            .finally(_ => setOutletContext({backdrop: false}))
    }

    function fetchBallots() {
        setOutletContext({backdrop: true})
        contract.getBallots(ballotsPagination.from, ballotsPagination.to)
            .then(bs => setBallots(convertBallots(bs)), console.error)
            .finally(_ => setOutletContext({backdrop: false}))
    }

    function vote(ballotId: number, choiceId: number) {
        contract.vote(ballotId, choiceId).then(updateAlreadyVotedBallots)
    }

    function createVoting() {
        setOutletContext({backdrop: true})
        setCreateVotingModalOpen(false)
        let values = getValues()
        contract.createBallot(values.name, values.choices, Math.round(values.end.valueOf()))
            .finally(x => {
                setOutletContext({backdrop: false})
                reset()
                // this won't work, at this time it will not yet be created in SC. Need to be replaced on the listening of the event
                fetchBallots()
            })
    }

    return <>
        <Grid container sx={{alignItems: 'center'}}>
            {ballots.map((ballot, i) => {
                return <Grid key={i} xs={12} sm={6} md={4}>
                    <Card sx={{padding: 3, margin: 1}}>
                        <CardContent sx={{textAlign: "left"}}>
                            <Typography>Voting ID: {ballot.id}</Typography>
                            <Typography>Voting name: {ballot.name}</Typography>
                            <Typography>Voting finish date: {format(ballot.end, 'MM/dd/yyyy kk:mm:ss')}</Typography>
                        </CardContent>
                        {
                                <CardActions sx={{flexDirection: "column", alignItems: "flex-start"}}>
                                    <FormLabel id={`choices.${i}`}>Choices</FormLabel>
                                    <RadioGroup sx={{textAlign: 'left', width: "100%"}}>
                                        {ballot.choices.map((choice, j) => {
                                            let totalVotes = ballot.choices.map(c => c.votes).reduce((a, b) => a + b, 0)
                                            let value = totalVotes === 0 ? 0 : choice.votes / totalVotes
                                            return <React.Fragment key={j}>
                                                {
                                                    alreadyVotedBallots[i] ? <Typography>{`${choice.name} (${choice.votes})`}</Typography> :
                                                        <FormControlLabel value={choice.id}
                                                                          control={<Radio/>}
                                                                          name={`voting${i}`}
                                                                          onClick={_ => {
                                                                              const index = selectedChoices.findIndex(c => c.ballotId === ballot.id)
                                                                              if (index >= 0) {
                                                                                  selectedChoices.splice(index, 1)
                                                                              }
                                                                              setSelectedChoices([...selectedChoices, {
                                                                                  ballotId: ballot.id,
                                                                                  choiceId: choice.id
                                                                              }])
                                                                          }}
                                                                          label={choice.name}/>
                                                }
                                                <LinearProgress variant="determinate" value={value * 100}/>
                                            </React.Fragment>
                                        })}
                                    </RadioGroup>
                                </CardActions>
                        }
                        {
                            alreadyVotedBallots[i] ?
                                <Typography>Already voted</Typography> :
                                <Container sx={{alignItems: 'center'}}>
                                    {
                                        ballot.end < new Date().valueOf() ? <Typography>Voting is ended</Typography> :
                                            <Button
                                                onClick={_ => vote(ballot.id, selectedChoices.find(c => c.ballotId === ballot.id)!.choiceId)}
                                                disabled={!selectedChoices.find(c => c.ballotId === ballot.id) || alreadyVotedBallots[i]}
                                                variant='outlined'>Submit my vote</Button>
                                    }
                                </Container>
                        }
                    </Card>
                </Grid>
            })}
        </Grid>

        {/* create ballot */}
        <Fab color="primary" aria-label="add voting"
             onClick={_ => setCreateVotingModalOpen(true)} sx={defaultFabStyle}><Add/></Fab>

        <Modal open={createVotingModalOpen} onClose={_ => setCreateVotingModalOpen(false)}>
            <Box sx={defaultModalStyle}>
                <Typography variant='h4' component='h4'>Create new voting:</Typography>
                <Typography component='p'>(let's imagine, you've a permission to create
                    ballots)</Typography>
                <form onSubmit={handleSubmit(createVoting)}>
                    <FormGroup sx={{'& > *:not(:last-child)': {mb: '10px'}}}>
                        <Controller name='name'
                                    control={control}
                                    rules={{required: true, minLength: 1}}
                                    render={({field}) => <TextField id="outlined-basic"
                                                                    label="Voting name"
                                                                    onChange={field.onChange}
                                                                    variant="outlined"/>}/>
                        <Controller name='end'
                                    control={control}
                                    rules={{required: true}}
                                    defaultValue={roundNextHour(new Date())}
                                    render={({field}) => {
                                        return <DateTimePicker
                                            label="Select Voting end date & time"
                                            value={field.value}
                                            disablePast={true}
                                            ref={field.ref}
                                            onChange={date => field.onChange(date)}
                                            renderInput={params =>
                                                <TextField {...params} />}
                                        />
                                    }}/>

                        {/* choices... todo */}
                        <Typography variant='h5' component='h5' sx={{mt: '30px'}}>Add
                            possible choices:</Typography>
                        {
                            fields.map((choice, index) => (
                                <Box key={choice.id}
                                     sx={{display: 'flex', alignItems: 'center'}}>
                                    <Controller name={`choices.${index}`}
                                                control={control}
                                                rules={{required: true, minLength: 1}}
                                                render={({field}) => <TextField
                                                    label={`Choice #${index + 1}`}
                                                    onChange={field.onChange}
                                                    sx={{width: '75%'}}
                                                    variant="outlined"/>}/>
                                    <Button
                                        onClick={() => remove(index)}><DeleteIcon/></Button>
                                </Box>
                            ))
                        }
                        {/* ADD VOTERS */}
                        {/* let's imagine that you've a vote power */}
                        <Button onClick={() => append('1')} variant="contained">Add new voting choice</Button>
                        <Button disabled={!isValid}
                                type='submit'
                                variant="contained">Create voting</Button>
                    </FormGroup>
                </form>
            </Box>
        </Modal>
    </>
}

interface SelectedBallotChoice {
    ballotId: number
    choiceId: number
}

export default VotingApp
