pragma solidity ^0.4.24;

contract OracleInterface {

    enum BetOutcome {
        Pending,    //match has not been fought to decision
        Decided,
        Won,
        Lost     //index of participant who is the winner
    }
    function getPendingCityBets() public view returns (bytes32[] memory);

    function getAllCityBets() public view returns (bytes32[] memory);

    function cityBetExists(bytes32 _betId) public view returns (bool);

    function addCityBet(address sender, string memory _cityId, string memory _cityName, uint _inzet, int _guess,
     string memory  _made_on,  string memory  _weather_date, uint _quotering) public returns (bytes32);

    function getCityBet(bytes32 _betId) public view returns (
        address userId,
        bytes32 betId,//id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint inzet,
        int guess,
        string made_on,  // datum wanneer de bet is gemaakt
        string weather_date, //
         BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
       // WeatherData weather;
        int winning_degree // Welke temperatuur het is geworden
        ); // Welke temperatuur het is geworden

    function getMostRecentCityBet(bool _pending) public view returns (
        address userId,
        bytes32 betId,//id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint inzet,
        int guess,
         string memory  made_on,  // datum wanneer de bet is gemaakt
         string memory  weather_date, //
         BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
       // WeatherData weather;
        int winning_degree // Welke temperatuur het is geworden
         );

    function declareOutcome(bytes32 _betId) public returns (
        address userId,
        bytes32 betId,//id van de bet
        string memory name,  // naam van de stad
        int guess,
         string memory  weather_date //
    );

    function testConnection() public pure returns (bool);

    function getAddress() public view returns (address);

    function addTestData() public;
}