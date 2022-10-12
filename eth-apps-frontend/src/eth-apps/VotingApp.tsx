import React, {FC} from "react"
import {useForm, Controller, useFieldArray} from "react-hook-form"
import Box from "@mui/material/Box";
import {
    Card,
    CardActions,
    CardContent,
    Fab,
    FormControlLabel,
    FormGroup,
    FormLabel, Modal,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {DateTimePicker} from "@mui/x-date-pickers";
import {format} from "date-fns";
import Grid from "@mui/material/Unstable_Grid2";
import {defaultFabStyle, defaultModalStyle} from "../utils/mui-default-component-settings";
import {Add} from "@mui/icons-material";

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

    const [createVotingModalOpen, setCreateVotingModalOpen] = React.useState(false);
    const handleOpen = () => setCreateVotingModalOpen(true);
    const handleClose = () => setCreateVotingModalOpen(false);

    // not store, updated on creation of a new ballot
    const [ballots, setBallots] = React.useState<Ballot[]>([
        {
            id: 0,
            name: "Best voting ever",
            choices: [
                {
                    id: 0,
                    name: "Choice 1",
                    votes: 0
                },
                {
                    id: 1,
                    name: "Choice 2",
                    votes: 0
                },
                {
                    id: 2,
                    name: "Choice 3",
                    votes: 0
                }
            ],
            end: new Date().valueOf(),
        }
    ])
    // voting creation form
    const {
        formState: {errors, isValid, isDirty},
        handleSubmit,
        reset,
        control,
        getValues
    } = useForm()
    const {fields, append, update, prepend, remove, swap, move, insert} = useFieldArray({
        control,
        name: "choices"
    });

    const submitVote = (data: any) => {

        console.log(data)
    }
    const createVoting = (data: any) => {
        console.log(getValues())
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
                        <CardActions sx={{flexDirection: "column"}}>
                            <FormLabel id={`voting-choices-${i}`}>Choices</FormLabel>
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
        <Fab color="primary" aria-label="add voting" onClick={handleOpen} sx={defaultFabStyle}><Add/></Fab>

        <Modal open={createVotingModalOpen} onClose={handleClose}>
            <Box sx={defaultModalStyle}>
                <Typography variant='h4' component='h4'>Create new voting:</Typography>
                <form onSubmit={handleSubmit(createVoting)}>
                    <FormGroup sx={{
                        '& .MuiFormControl-root': {
                            my: 2
                        }
                    }}>
                        <Controller name='voting-name'
                                    control={control}
                                    rules={{required: true, minLength: 1}}
                                    render={({field}) => <TextField id="outlined-basic"
                                                                    label="Voting name"
                                                                    onChange={field.onChange}
                                                                    variant="outlined"/>}/>
                        <Controller name='voting-end'
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
                        <Typography variant='h5' component='h5'>Add possible choices:</Typography>
                        {
                            fields.map((choice, index) => (
                                <Box key={choice.id}>

                                    <Controller name={`choice-${index}`}
                                                rules={{required: true, minLength: 1}}
                                                render={({field}) => <TextField label={`Choice #${index + 1}`}
                                                                                onChange={f => (index)}
                                                                                variant="outlined"/>}/>
                                </Box>
                            ))

                        }
                        <Button onClick={() => {
                            append({ choice: ""})
                        }}
                                type='submit'
                                variant="contained">Add new voting choice</Button>

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
