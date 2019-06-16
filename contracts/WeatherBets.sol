pragma solidity ^0.4.24;
import "./DateLib.sol";

import "./OracleInterface.sol";
import "./Ownable.sol";

contract WeatherBets is Ownable {
    // mappings

    using DateLib for DateLib.DateTime;
    mapping(address => bytes32[]) private userToBets;
    mapping(bytes32 => Bet[]) private cityToBets;

    //boxing results oracle
    address internal weatherOracleAddr;
    OracleInterface internal weatherOracle = OracleInterface(weatherOracleAddr);

    //constants
  //  uint internal minimumBet = 1000000000000;   //  hier moet nog een api voor komen..

    struct Bet {
        address userId;
        bytes32 betId;  // id van de bet
        string city_id; //id van city
        string name;  // naam van de stad
        uint inzet;  // inzet ether van user
        int guessing_degree; // temperattur wat  de user raadt
        uint made_on;  // datum wanneer de bet is gemaakt
        uint weather_date; //
        uint quotering;
    }

    struct BetForAPI{
        address userId;
        bytes32 betId; //id van de bet
        string name;  // naam van de stad
        int guess;
        uint weather_date; //
    }
  enum BettableOutcome {
        Degree
    }
    /// @notice sets the address of the weather oracle contract to use
    /// @dev setting a wrong address may result in false return value, or error
    /// @param _oracleAddress the address of the weather oracle
    /// @return true if connection to the new oracle address was successful
    function setOracleAddress(address _oracleAddress) external onlyOwner returns (bool) {
        weatherOracleAddr = _oracleAddress;
        weatherOracle = OracleInterface(weatherOracleAddr);
        return weatherOracle.testConnection();
    }

    /// @notice gets the address of the boxing oracle being used
    /// @return the address of the currently set oracle
    function getOracleAddress() public view returns (address) {
        return weatherOracleAddr;
    }

    /// @notice determines whether or not the user has already bet on the given match
    /// @param _user address of a user
    /// @param _guess the index of the participant to bet on (to win)
    /// @return true if the given user has already placed a bet on the given match

//     function _betIsValid(address _user, bytes32 _betId, uint16 _guess) private view returns (bool) {
// // hier mist nog iets
//         return true;
//     }

    /// @notice determines whether or not bets may still be accepted for the given match
    /// @return true if the match is bettable

    // function _matchOpenForBetting(bytes32 _betId) private view returns (bool) {
    //     //Hier mist ook nog iets
    //     return true;
    // }

    /// @notice gets a list ids of all currently bettable matches
    /// @return array of city ids
    function getBettableCityBets() public view returns (bytes32[] memory) {
        return weatherOracle.getPendingCityBets();
    }

    function getBetsByUser() public returns (bytes32[] memory) {
            // mappings
        bytes32[] storage betIds = userToBets[msg.sender];
        return betIds;
    }
    /// @notice returns the full data of the specified match
    /// @param _betId the id of the desired match
    /// @return match data
    function getCityBet(bytes32 _betId) public view returns (
        address userId,
        bytes32 betId,   //id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint inzet,
        int guess,
        uint made_on,  // datum wanneer de bet is gemaakt
        uint weather_date, //
        OracleInterface.BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
       // WeatherData weather;
        int winning_degree // Welke temperatuur het is geworden
        ) {

        return weatherOracle.getCityBet(_betId);
    }

    /// @notice returns the full data of the most recent bettable match
    /// @return match data
    function getMostRecentCityBet() public view returns (
        address userId,
        bytes32 betId,  //id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint inzet,
        int guess,
        uint made_on,  // datum wanneer de bet is gemaakt
        uint weather_date, //
        OracleInterface.BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
       // WeatherData weather;
        int winning_degree // Welke temperatuur het is geworden
        ) {

        return weatherOracle.getMostRecentCityBet(true);
    }

    /// @notice places a non-rescindable bet on the given match
    /// @param _guess the index of the participant chosen as winning_degree
    function placeBet(string memory _cityId, string memory _name, uint inzet, int _guess,  uint _weather_date,
     uint _date_of_now, uint _quotering) public payable {

        //initieer functie add AddCityBet
        bytes32 _betId = weatherOracle.addCityBet(msg.sender, _cityId, _name, inzet, _guess, _date_of_now, _weather_date, _quotering);
        
        weatherOracleAddr.transfer(msg.value); // transfer inzet naar database contract WeatherOracle
        // //add the new bet
         Bet[] storage bets = cityToBets[_betId];  // maak nieuwe slot aan voor een bet
         bets.push(Bet(msg.sender, _betId, _cityId, _name, inzet, _guess, _date_of_now, _weather_date, _quotering))-1;  // sla bet op

        // //add the mapping
         bytes32[] storage userBets = userToBets[msg.sender];
         userBets.push(_betId);  // sla bet op user id
         
    }
    function setDecided(address _userId, bytes32 _betId, uint _outcome, uint _amount) public payable {
        weatherOracle.declareOutcome(_userId, _betId,_outcome, _amount);
        emit BetEmitted(_betId);
    }

     /// @notice for testing; tests that the boxing oracle is callable
    /// @return true if connection successful
    function testOracleConnection() public view returns (bool) {
        return weatherOracle.testConnection();
    }
    function getOracleOriginAddress() public view returns (address) {
        return weatherOracle.getAddress();
    }
    event BetEmitted (
        bytes32 betId//id van de bet
    );
}



