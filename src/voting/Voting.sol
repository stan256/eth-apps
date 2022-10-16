// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

contract Voting {

    struct Choice {
        uint id;
        string name;
        uint votes;
    }

    struct Ballot {
        uint id;
        string name;
        Choice[] choices;
        uint end;
    }

    address public admin;

    mapping(address => bool) public voters;
    mapping(uint => Ballot) public ballots;
    mapping(address => mapping(uint => bool)) public votes;

    uint public nextBallotId;

    constructor() {
        admin = msg.sender;
    }

    function addVoters(address[] calldata _voters) external {
        for (uint i = 0; i < _voters.length; i++) {
            voters[_voters[i]] = true;
        }
    }

    function getChoices(uint i) public view returns (Choice[] memory) {
        return ballots[i].choices;
    }

    function getBallots(uint from, uint offset) public view returns(Ballot[] memory) {
        uint ballotsAmount = nextBallotId - from > offset ? offset : nextBallotId - from;
        Ballot[] memory _ballots = new Ballot[](ballotsAmount);
        for (uint i = from; i < from + ballotsAmount; i++) {
            _ballots[i] = ballots[i];
        }
        return _ballots;
    }

    function createBallot(
        string memory name,
        string[] memory choices,
        uint offset
    ) public onlyAdmin() {
        require(bytes(name).length != 0, "Name can't be empty");
        require(choices.length >= 2, "There should be at least 2 choices");
        require(block.timestamp < offset, "Can't create a voting with the date in past");

        ballots[nextBallotId].id = nextBallotId;
        ballots[nextBallotId].name = name;
        ballots[nextBallotId].end = offset;

        for (uint i = 0; i < choices.length; i++) {
            ballots[nextBallotId].choices.push(Choice(i, choices[i], 0));
        }
        nextBallotId++;
    }

    function vote(uint ballotId, uint choiceId) external {
        require(voters[msg.sender] == true, "Only defined voters can vote");
        require(votes[msg.sender][ballotId] == false, "Voter can vote only once");
        require(block.timestamp < ballots[ballotId].end, "Can only vote until the end of voting");
        ballots[ballotId].choices[choiceId].votes++;
        votes[msg.sender][ballotId] = true;
    }

    function results(uint ballotId) view external returns (Choice[] memory) {
        require(block.timestamp > ballots[ballotId].end, "Results are available only for the finished votings");
        return ballots[ballotId].choices;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin!");
        _;
    }

}
