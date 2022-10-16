pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../../src/voting/Voting.sol";
import "../utils/Utils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VotingTest is Test {
    Voting private votingContract;
    Utils private utils;
    address payable[] internal testUsers;

    uint constant testUsersSize = 5;

    function setUp() public {
        votingContract = new Voting();
        utils = new Utils();
        testUsers = utils.createUsers(testUsersSize);
    }

    function testCreateVoting() public {
        string[] memory choices = new string[](3);
        for (uint i = 0; i < 3; i++) {
            choices[i] = string.concat("choice", Strings.toString(i));
        }

        vm.expectRevert("Name can't be empty");
        console.log(block.timestamp);
        votingContract.createBallot("", choices, 100);

        string[] memory emptyChoices = new string[](0);
        vm.expectRevert("There should be at least 2 choices");
        votingContract.createBallot("Test ballot", emptyChoices, 100);

        vm.expectRevert("Can't create a voting with the date in past");
        votingContract.createBallot("Test ballot", choices, 0);
    }

    function testVotingOnlyAvailableUntilEnd() public {
        createTestBallot(3, 60);
        address voter = addVoters(1)[0];

        vm.prank(voter);
        vm.warp(100);
        vm.expectRevert("Can only vote until the end of voting");
        votingContract.vote(0, 0);
    }

    function testOnlyVotersCanVoteOnceUntilEnd() public {
        createTestBallot(3, 60);
        address[] memory voters = addVoters(2);
        address voterOne = voters[0];
        address voterTwo = voters[1];
        address notVoter = testUsers[2];

        assertTrue(votingContract.voters(voterOne));
        assertTrue(votingContract.voters(voterTwo));
        assertFalse(votingContract.voters(notVoter));

        // first voting user
        vm.startPrank(voterOne);
        votingContract.vote(0, 0);
        vm.expectRevert("Voter can vote only once");
        votingContract.vote(0, 0);
        vm.stopPrank();

        // second voting user
        vm.prank(voterTwo);
        votingContract.vote(0, 1);

        // non voting user
        vm.prank(notVoter);
        vm.expectRevert("Only defined voters can vote");
        votingContract.vote(0, 0);

        // calculation user voting results
        Voting.Choice[] memory ballotChoices = votingContract.getChoices(0);
        assertEq(ballotChoices[0].votes, 1);
        assertEq(ballotChoices[1].votes, 1);
        assertEq(ballotChoices[2].votes, 0);
    }

    function addVoters(uint votersNumber) public returns (address[] memory) {
        require(votersNumber <= testUsersSize);

        address[] memory voters = new address[](votersNumber);
        for (uint i = 0; i < votersNumber; i++) {
            voters[i] = testUsers[i];
        }

        votingContract.addVoters(voters);
        return voters;
    }

    function createTestBallot(uint8 choicesAmount, uint end) private {
        string[] memory choices = new string[](choicesAmount);
        for (uint i = 0; i < choicesAmount; i++) {
            choices[i] = string.concat("choice", Strings.toString(i));
        }
        votingContract.createBallot("Test ballot", choices, end);
    }

    function assertChoiceEq(Voting.Choice memory choice, uint id, string memory name, uint votes) private {
        assertEq(choice.id, id);
        assertEq(choice.name, name);
        assertEq(choice.votes, votes);
    }
}
