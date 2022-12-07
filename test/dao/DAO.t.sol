pragma solidity ^0.8.17;

import "forge-std/console.sol";
import "forge-std/Test.sol";
import "../../src/dao/DAO.sol";
import "../utils/Utils.sol";

contract DAOTest is Test {
    DAO private daoContract;
    Utils private utils;
    address payable[] internal testUsers;

    uint constant testUsersSize = 5;
    uint constant one_gwei = 1000000000;
    uint constant one_ether = 1000000000000000000;

    function setUp() public {
        daoContract = new DAO(block.timestamp + 1000, 24*60*60*1000, 50);
        utils = new Utils();
        testUsers = utils.createUsers(testUsersSize);
    }

    function testNoFundsInvestScenario() public {
        vm.startPrank(testUsers[0]);
        vm.expectRevert("Sum should be higher than zero");
        daoContract.invest();
        vm.stopPrank();
    }

    function testInvestSuccessfulScenario() public {
        assertEq(daoContract.investors(testUsers[1]), false);
        assertEq(daoContract.shares(testUsers[1]), 0);
        assertEq(daoContract.totalShares(), 0);
        assertEq(daoContract.availableFunds(), 0);

        vm.prank(testUsers[1]);
        daoContract.invest{value: 10 gwei}();

        assertEq(daoContract.investors(testUsers[1]), true);
        assertEq(daoContract.shares(testUsers[1]), 10 * one_gwei);
        assertEq(daoContract.totalShares(), 10 * one_gwei);
        assertEq(daoContract.availableFunds(), 10 * one_gwei);
    }

    function testTransfer() public {
        address userOne = testUsers[0];
        address userTwo = testUsers[1];

        uint userTwoShares = daoContract.shares(userTwo);
        assertEq(daoContract.investors(userTwo), false);

        vm.startPrank(userOne);
        daoContract.invest{value: 10 ether}();
        daoContract.transfer(2 * one_ether, userTwo);
        vm.stopPrank();

        assertEq(daoContract.shares(userTwo) - userTwoShares, 2 * one_ether);
        assertEq(daoContract.investors(userTwo), true);
    }
}
