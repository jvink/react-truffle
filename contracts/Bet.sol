pragma solidity ^0.5.0;

contract Bet{
    // Model a Candidate
    // Store Candidates
    // Fetch Candidate

    struct User {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => User) public users;  // Write to the blockchain (data layers) gonna cost gas
     // Store Candidates Count
    uint public usersCount;

    constructor () public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        usersCount ++;
        users[usersCount] = User(usersCount, _name, 0);
    }
}
