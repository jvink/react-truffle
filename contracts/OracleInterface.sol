pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract OracleInterface {

    enum BetOutcome {
        Pending,    //match has not been fought to decision
        Decided     //index of participant who is the winner
    }
    function getPendingCityBets() public view returns (bytes32[] memory);

    function getAllCityBets() public view returns (bytes32[] memory);

    function cityBetExists(bytes32 _matchId) public view returns (bool);

    function getCityBet(bytes32 _matchId) public view returns (
        bytes32 betId, //id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint weather_date, //
        BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
        int winning_degree); // Welke temperatuur het is geworden

    function getMostRecentCityBet(bool _pending) public view returns (
        bytes32 betId, //id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint weather_date, //
        BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
        int winning_degree // Welke temperatuur het is geworden
         );

    function testConnection() public pure returns (bool);

    function addTestData() public;
}