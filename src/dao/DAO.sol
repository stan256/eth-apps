// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;
import "forge-std/console.sol";

contract DAO {

    struct Proposal {
        uint id;
        string name;
        uint amount;
        address payable recipient;
        uint votes;
        uint end;
        bool executed;
    }

    mapping(address => bool) public investors;
    mapping(address => uint) public shares;
    mapping(address => mapping(uint => bool)) public votes;
    mapping(uint => Proposal) public proposals;
    uint public totalShares;
    uint public availableFunds;
    uint public investingEndDate;
    uint public votingDuration;
    uint public quorum;
    uint public nextProposalId;
    address admin;

    constructor(uint _investingEndDate, uint _votingDuration, uint _quorum) {
        require(_investingEndDate > block.timestamp, "Contribution end should be in future");
        require(_votingDuration > 0, "Should be positive number");
        require(_quorum > 0 && _quorum <= 100, "Quorum should be between 0 & 100");

        admin = msg.sender;
        investingEndDate = _investingEndDate;
        votingDuration = _votingDuration;
        quorum = _quorum;
    }

    function invest() external payable {
        require(msg.value > 0, "Sum should be higher than zero");
        require(block.timestamp < investingEndDate, "Is not possible to invest after DAO fundraising end date");

        investors[msg.sender] = true;
        shares[msg.sender] += msg.value;
        availableFunds += msg.value;
        totalShares += msg.value;
    }

    function transfer(uint amount, address to) external payable investorFundOperation(amount) {
        shares[msg.sender] -= amount;
        shares[to] += amount;
        if (shares[msg.sender] == 0){
            investors[msg.sender] = false;
        }
        investors[to] = true;
    }

    function withdraw(uint amount) external payable investorFundOperation(amount) {
        require(availableFunds >= amount, "Not enough DAO balance");
        shares[msg.sender] -= amount;
        availableFunds -= amount;
        payable(msg.sender).transfer(amount);
    }

    function createProposal(string memory name, uint amount, address payable recipient) external investorOnly() {
        require(availableFunds >= amount, 'amount too big');
        proposals[nextProposalId] = Proposal(nextProposalId, name, amount, recipient, 0, block.timestamp + votingDuration, false);
        availableFunds -= amount;
        nextProposalId++;
    }

    function vote(uint proposalId) external investorOnly() {
        require(proposals[proposalId].end > block.timestamp, "Voting is over");
        require(!votes[msg.sender][proposalId], "Already voted");
        proposals[proposalId].votes += shares[msg.sender];
        votes[msg.sender][proposalId] = true;
    }

    function executeProposal(uint proposalId) external onlyAdmin() {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(proposal.end < block.timestamp, "Voting is not yet over");
        require((proposal.votes / totalShares) * 100 >= quorum, 'Quorum ratio is not high enough');
        proposals[proposalId].executed = true;
        _transferEther(proposal.amount, proposal.recipient);
    }

    function _transferEther(uint amount, address payable to) internal {
        require(amount <= availableFunds, 'not enough availableFunds');
        availableFunds -= amount;
        to.transfer(amount);
    }

    modifier investorOnly() {
        require(investors[msg.sender], "non-investor call");
        _;
    }

    modifier investorFundOperation(uint amount) {
        require(investors[msg.sender], "non-investor call");
        require(shares[msg.sender] >= amount, "Insufficient shares number");
        _;
        if (shares[msg.sender] == 0) {
            investors[msg.sender] = false;
        }
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin is able to execute this function");
        _;
    }
}