// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Points {
    address public owner;
    
    mapping(address => uint256) public userPoints;
    mapping(address => bool) public isUserRegistered;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    function registerUser(address user) external {
        require(!isUserRegistered[user], "User is already registered");
        
        isUserRegistered[user] = true;
        userPoints[user] = 0;
    }
    
    function addPoints(address user, uint256 points) external onlyOwner {
        require(isUserRegistered[user], "User is not registered");
        
        userPoints[user] += points;
    }
    
    function getUserPoints(address user) external view returns (uint256) {
        return userPoints[user];
    }
    
    function increasePointsBy20() external {
        userPoints[msg.sender] += 20;
    }
    
    function pointsGreaterThan10(address user) external view returns (bool) {
        return userPoints[user] > 10;
    }
}
