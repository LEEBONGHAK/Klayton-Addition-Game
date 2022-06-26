// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract AdditionGame {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function deposit() public payable {
        require(msg.sender == owner);
    }

    function transfer(uint256 _value) public returns (bool) {
        require(getBalance() >= _value);
        payable(msg.sender).transfer(_value);
        return true;
    }
}
