import React, {FC, useEffect} from "react"
import {Controller, useFieldArray, useForm} from "react-hook-form"
import Box from "@mui/material/Box"
import {
    Card,
    CardActions,
    CardContent,
    Fab,
    FormControlLabel,
    FormGroup,
    FormLabel,
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
import {Ballot} from "../model/voting/entity"
import VotingABI from "../ABI/Voting.json"
import {ethers} from "ethers"
import {Pagination} from "../model/common-models";

declare let window: any
const votingContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_VOTING_APP!

function convertBallots(response: any): Ballot[] {
    return response === undefined ? [] : response.map((r: any) => {
        return {
            id: r.id.toNumber(),
            name: r.name,
            choices: r.choices.map((c: any) => {
                return {
                    id: c.id.toNumber(),
                    name: c.name,
                    votes: c.votes.toNumber(),
                }
            }),
            end: r.end.toNumber(),
        }
    })
}

const VotingApp: FC = () => {
    const setOutletContext: React.Dispatch<React.SetStateAction<LayoutState>> = useOutletContext()
    const [createVotingModalOpen, setCreateVotingModalOpen] = React.useState(false)
    const [ballots, setBallots] = React.useState<Ballot[]>([])
    const [ballotsPagination, setBallotsPagination] = React.useState<Pagination>({ from: 0, to: 500 })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(votingContractAddress, VotingABI.abi, provider.getSigner())

    useEffect(() => fetchBallots(), [])

    function fetchBallots() {
        setOutletContext({backdrop: true})
        contract.getBallots(ballotsPagination.from, ballotsPagination.to)
            .then((bs: any) => setBallots(convertBallots(bs)), console.error)
            .finally((_: any) => setOutletContext({backdrop: false}))
    }

    // form
    const {formState: {isValid}, handleSubmit, reset, control, getValues} = useForm({mode: 'onChange'})
    const {fields, append, remove} = useFieldArray({control, name: "choices"})

    const createVoting = async () => {
        setOutletContext({backdrop: true})
        setCreateVotingModalOpen(false)

        let values = getValues()
        console.log(values.name, values.choices, Math.round(values.end.valueOf()))
        contract.createBallot(values.name, values.choices, Math.round(values.end.valueOf()))

        setOutletContext({backdrop: false})
        reset()
    }

    return <>
        <Grid container>
            {ballots.map((ballot, i) => {
                return <Grid key={i} xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent sx={{textAlign: "left"}}>
                            <Typography>Voting ID: {ballot.id}</Typography>
                            <Typography>Voting name: {ballot.name}</Typography>
                            <Typography>Voting finish date: {format(ballot.end, 'MM/dd/yyyy kk:mm:ss')}</Typography>
                        </CardContent>
                        {
                            ballot.end > new Date().valueOf() ?
                                <CardActions sx={{flexDirection: "column"}}>
                                    <FormLabel id={`choices.${i}`}>Choices</FormLabel>
                                    <RadioGroup>
                                        {ballot.choices.map((choice, j) => {
                                            return <FormControlLabel key={j}
                                                                     value={choice.id}
                                                                     control={<Radio/>}
                                                                     name={`voting${i}`}
                                                                     label={choice.name}/>
                                        })}
                                    </RadioGroup>
                                    <Button onClick={console.log} variant='outlined'>Submit my vote</Button>
                                </CardActions> : undefined
                        }
                    </Card>
                </Grid>
            })}
        </Grid>

        {/* create ballot */}
        <Fab color="primary" aria-label="add voting" onClick={_ => setCreateVotingModalOpen(true)} sx={defaultFabStyle}><Add/></Fab>

        <Modal open={createVotingModalOpen} onClose={_ => setCreateVotingModalOpen(false)}>
            <Box sx={defaultModalStyle}>
                <Typography variant='h4' component='h4'>Create new voting:</Typography>
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
                                    defaultValue={new Date()}
                                    render={({field}) => {
                                        return <DateTimePicker
                                            label="Select Voting end date & time"
                                            value={field.value}
                                            disablePast={false}
                                            ref={field.ref}
                                            onChange={date => field.onChange(date)}
                                            renderInput={params => <TextField {...params} />}
                                        />
                                    }}/>

                        {/* choices... todo */}
                        <Typography variant='h5' component='h5' sx={{mt: '30px'}}>Add possible choices:</Typography>
                        {
                            fields.map((choice, index) => (
                                <Box key={choice.id} sx={{display: 'flex', alignItems: 'center'}}>
                                    <Controller name={`choices.${index}`}
                                                control={control}
                                                rules={{required: true, minLength: 1}}
                                                render={({field}) => <TextField label={`Choice #${index + 1}`}
                                                                                onChange={field.onChange}
                                                                                sx={{width: '75%'}}
                                                                                variant="outlined"/>}/>
                                    <Button onClick={() => remove(index)}><DeleteIcon/></Button>
                                </Box>
                            ))
                        }
                        <Button onClick={() => {
                            append('')
                        }} variant="contained">Add new voting choice</Button>

                        <Button disabled={!isValid}
                                type='submit'
                                variant="contained">Create voting</Button>
                    </FormGroup>
                </form>
            </Box>
        </Modal>
    </>
}

export default VotingApp
