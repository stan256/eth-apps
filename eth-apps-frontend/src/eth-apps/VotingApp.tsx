import React, {FC} from "react"
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
import {ethersCreateVoting, getAllVotings} from "../service/ethereum-service"
import {Ballot} from "../model/voting/entity";

const VotingApp: FC = (props) => {
    const setOutletContext: React.Dispatch<React.SetStateAction<LayoutState>> = useOutletContext()
    const [createVotingModalOpen, setCreateVotingModalOpen] = React.useState(false)

    const [ballots, setBallots] = React.useState<Ballot[]>([])
    getAllVotings().then(b => {
        console.log(b)
        setBallots(b)
    }, console.error)

    const {
        formState: {errors, isValid},
        handleSubmit,
        reset,
        control,
        getValues
    } = useForm({mode: 'onChange'})
    const {fields, append, remove} = useFieldArray({
        control,
        name: "choices"
    })

    const submitVote = (data: any) => {
        // call here
    }

    const createVoting = () => {
        setOutletContext({backdrop: true})
        const values = getValues()
        ethersCreateVoting(values.name, values.choices, Math.round(values.end.valueOf() / 1000))
        setOutletContext({backdrop: false})
        reset()
        setCreateVotingModalOpen(false)
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
                            <Button onClick={submitVote} variant='outlined'>Submit my vote</Button>
                        </CardActions>
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
                        <Button onClick={createVoting}
                                disabled={!isValid}
                                type='submit'
                                variant="contained">Create voting</Button>
                    </FormGroup>
                </form>
            </Box>
        </Modal>
    </>
}

export default VotingApp
