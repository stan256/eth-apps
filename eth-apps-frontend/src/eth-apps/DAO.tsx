import React, {FC, useEffect} from "react"
import {BigNumber, ethers} from "ethers"
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Fab,
    FormGroup,
    Grid,
    Modal, Paper,
    TextField,
    Typography
} from "@mui/material"
import DAO from "../ABI/DAO.json"
import {Controller, useForm} from "react-hook-form"
import {defaultFabStyle, defaultModalStyle} from "../utils/mui-default-component-settings"
import {Add} from "@mui/icons-material"
import {Proposal} from "../model/dao"
import {LayoutState} from "../layout/Layout"
import {useOutletContext} from "react-router-dom"
import {formatToSimpleDateTime, roundNextHour} from "../utils/time"
import {DateTimePicker} from "@mui/x-date-pickers"

declare let window: any


const DAOApp: FC = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS_DAO!, DAO.abi, provider.getSigner())

    const [investAmount, setInvestAmount] = React.useState<number>(0)
    const [isInvestor, setIsInvestor] = React.useState<boolean>(false)
    const [createProposalModalOpen, setCreateProposalModalOpen] = React.useState<boolean>(false)
    const [proposals, setProposals] = React.useState<Proposal[]>([])
    const [availableFunds, setAvailableFunds] = React.useState<BigNumber>(BigNumber.from(0))
    const [daoFundraiseEnd, setDaoFundraiseEnd] = React.useState<Date>()
    const [daoTotalFunds, setDaoTotalFunds] = React.useState<BigNumber>()
    const [nextProposalId, setNextProposalId] = React.useState<number>(0)

    function addressCallback(callback: (n: string) => any): void {
        provider.getSigner().getAddress().then(callback)
    }


    useEffect(() => {
        addressCallback(address => contract.investors(address).then(a => setIsInvestor(a)))
        contract.investingEndDate().then(d => setDaoFundraiseEnd(new Date(d.toNumber())))
        contract.totalShares().then(t => setDaoTotalFunds(t))
        contract.nextProposalId().then(t => setNextProposalId(t.toNumber()))
        contract.availableFunds().then(t => setAvailableFunds(t))
    }, [])

    useEffect(() => {
        for (let i = 0; i < nextProposalId; i++) {
            contract.proposals(i).then(p => {
                console.log(p)

                setProposals(prevState => [...prevState, {
                    id: /*p.id.toNumber()*/ 0,
                    name: p.name,
                    amount: p.amount,
                    recipient: p.recipient,
                    votes: /*p.votes.toNumber()*/ 0,
                    // 10k - duration of voting on Smart Contract
                    end: /*(p.end.toNumber() - 10000) * 1000 + 10000*/ 0,
                    executed: p.executed,
                }])
            })
        }
    }, [nextProposalId])

    function invest() {
        contract.invest({value: ethers.utils.parseEther(String(investAmount))}).then(x => {
            if (!isInvestor) setIsInvestor(true)
            setInvestAmount(0)
        }, console.error)
    }

    function vote(proposalId: number) {
        contract.vote(proposalId).then(x => {
            console.log()
        }, console.error)
        // todo ui window - voted successfully
    }

    function isAlreadyVoted(proposalId: number): boolean {
        addressCallback(address => {
            contract.votes(address, proposalId).then(b => {
                console.log(b)
            })
        })
        return false
    }

    const setOutletContext: React.Dispatch<React.SetStateAction<LayoutState>> = useOutletContext()
    const {formState: {isValid}, handleSubmit, reset, control, getValues} = useForm({mode: 'onChange'})


    function createProposal() {
        setOutletContext({backdrop: true})
        setCreateProposalModalOpen(false)
        let value = getValues()
        let amount = ethers.utils.parseEther(value.amount)
        contract.createProposal(value.name, amount, value.recipient)
            .finally(_ => {
                setOutletContext({backdrop: false})
                reset()
            })
    }

    return <Box>
        {

            daoFundraiseEnd && daoFundraiseEnd.valueOf() >= Date.now() ?
                <>
                    <Typography variant='h4' component='h4'
                                textAlign="center" mb={2}>Investing stage will be finished on <Paper elevation={3} sx={{
                        display: "inline-block",
                        p: 1
                    }}>{formatToSimpleDateTime(daoFundraiseEnd)}</Paper></Typography>
                    {daoTotalFunds &&
                        <Typography variant='h4' component='h4' textAlign="center">Currently allocated: <Paper
                            elevation={3} sx={{
                            display: "inline-block",
                            p: 1
                        }}>{ethers.utils.formatEther(daoTotalFunds)} ETH</Paper></Typography>
                    }

                    <TextField label={isInvestor ? "Add more funds (in ETH)" : "Invest (in ETH)"}
                               onChange={x => setInvestAmount(+x.target.value)}
                               type={"number"}
                               inputProps={{
                                   step: 'any',
                                   min: 0
                               }}

                               variant="outlined"/>
                    <Button onClick={invest}
                            disabled={investAmount <= 0}>{isInvestor ? "Add more funds" : "Invest"}</Button>
                </>
                :
                <>
                    <Typography>{daoFundraiseEnd ? `DAO fundraising was finished on the ${formatToSimpleDateTime(daoFundraiseEnd)}` : undefined}</Typography>
                    <Typography>{daoTotalFunds ? `${ethers.utils.formatEther(daoTotalFunds)} was gathered` : undefined}</Typography>
                </>
        }

        <Typography variant='h4' component='h4' textAlign="center">Active Proposals:</Typography>
        <Grid container sx={{alignItems: 'center'}}>
            {
                proposals.map((proposal, i) => {
                    function defineBtnValue() {
                        if (proposal.end <= Date.now()) return "Voting is over"
                        else if (isAlreadyVoted(proposal.id)) return "Already voted"
                        else return "Vote"
                    }

                    return <Card key={i}>
                        <CardContent sx={{textAlign: "left"}}>
                            <Typography>Id: {proposal.id}</Typography>
                            <Typography>Name: {proposal.name}</Typography>
                            <Typography>Amount: {proposal.amount.toString()}</Typography>
                            <Typography>Recipient: {proposal.recipient}</Typography>
                            <Typography>Votes: {proposal.votes}</Typography>
                            <Typography>End: {formatToSimpleDateTime(proposal.end)}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={_ => vote(proposal.id)}
                                    disabled={isAlreadyVoted(proposal.id) || Date.now() >= proposal.end}>{defineBtnValue()}</Button>
                        </CardActions>
                    </Card>
                })
            }
        </Grid>

        {
            isInvestor &&
            <Fab color="primary" aria-label="Create proposal" onClick={_ => setCreateProposalModalOpen(true)}
                 sx={defaultFabStyle}><Add/></Fab>
        }


        <Modal open={createProposalModalOpen} onClose={_ => setCreateProposalModalOpen(false)}>
            <Box sx={defaultModalStyle}>
                <Typography variant='h4' component='h4'>Create new proposal:</Typography>
                <form onSubmit={handleSubmit(createProposal)}>
                    <FormGroup sx={{'& > *:not(:last-child)': {mb: '10px'}}}>
                        <Controller name='name'
                                    control={control}
                                    rules={{required: true, minLength: 1}}
                                    render={({field}) => <TextField id="outlined-basic"
                                                                    label="Proposal name"
                                                                    onChange={field.onChange}
                                                                    variant="outlined"/>}/>

                        <Controller name='amount'
                                    control={control}
                                    rules={{required: true, minLength: 1,}}
                                    render={({field}) => <TextField id="outlined-basic"
                                                                    label="ETH Transfer amount"
                                                                    type={"number"}
                                                                    inputProps={{
                                                                        step: 'any',
                                                                        min: 0
                                                                    }}
                                                                    onChange={field.onChange}
                                                                    variant="outlined"/>}/>
                        <Controller name='recipient'
                                    control={control}
                                    rules={{
                                        required: true,
                                        minLength: 1
                                    }} // todo custom address rule, or even better custom address input
                                    render={({field}) => <TextField id="outlined-basic"
                                                                    label="Recipient address"
                                                                    onChange={field.onChange}
                                                                    variant="outlined"/>}/>

                        <Button disabled={!isValid}
                                type='submit'
                                variant="contained">Create proposal</Button>
                    </FormGroup>
                </form>
            </Box>
        </Modal>
    </Box>
}

export default DAOApp