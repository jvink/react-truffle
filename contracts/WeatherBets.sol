pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./OracleInterface.sol";
import "./Ownable.sol";

contract WeatherBets is Ownable {
    // mappings
    mapping(address => bytes32[]) private userToBets;
    mapping(bytes32 => Bet[]) private cityToBets;

    //boxing results oracle
    address internal weatherOracleAddr;
    OracleInterface internal weatherOracle = OracleInterface(weatherOracleAddr);

    //constants
    uint internal minimumBet = 1000000000000;   //  hier moet nog een api voor komen..

    struct Bet {
        address user;
        bytes32 betId;  // id van de bet
        uint inzet;  // inzet ether van user
        uint16 guessing_degree; // temperattur wat  de user raadt
        uint made_on;  // datum wanneer de bet is gemaakt
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
    function getOracleAddress() external view returns (address) {
        return weatherOracleAddr;
    }

    /// @notice determines whether or not the user has already bet on the given match
    /// @param _user address of a user
    /// @param _betId betId of a match
    /// @param _guessing_degree the index of the participant to bet on (to win)
    /// @return true if the given user has already placed a bet on the given match

//     function _betIsValid(address _user, bytes32 _betId, uint16 _guessing_degree) private view returns (bool) {
// // hier mist nog iets
//         return true;
//     }

    /// @notice determines whether or not bets may still be accepted for the given match
    /// @param _betId betId of a match
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

    /// @notice returns the full data of the specified match
    /// @param _betId the id of the desired match
    /// @return match data
    function getCityBet(bytes32 _betId) public view returns (
        bytes32 betId,
        string memory city_id, //betId van city
        string memory name,
        uint weather_date,
        OracleInterface.BetOutcome outcome,
       // WeatherOracle.WeatherData memory weather,
        uint quotering,
        int winning_degree) {

        return weatherOracle.getCityBet(_betId);
    }

    /// @notice returns the full data of the most recent bettable match
    /// @return match data
    function getMostRecentCityBet() public view returns (
        bytes32 betId,
        string memory city_id, //betId van city
        string memory name,
        uint weather_date,
        OracleInterface.BetOutcome outcome,
       // WeatherOracle.WeatherData memory weather,
        uint quotering,
        int winning_degree) {

        return weatherOracle.getMostRecentCityBet(true);
    }

    /// @notice places a non-rescindable bet on the given match
    /// @param _betId the betId of the match on which to bet
    /// @param _guessing_degree the index of the participant chosen as winning_degree
    function placeBet(bytes32 _betId, uint16 _guessing_degree, uint date_of_now) public payable {

        //bet must be above a certain minimum
        require(msg.value >= minimumBet, "Bet amount must be >= minimum bet");

        //make sure that weatherBet exists
        require(weatherOracle.cityBetExists(_betId), "Specified weatherbet not found");

        //require that chosen winning_degree falls within the defined number of participants for match
       //  require(_betIsValid(msg.sender, _betId, _guessing_degree), "Bet is not valid");

        //match must still be open for betting
    //    require(_matchOpenForBetting(_betId), "Match not open for betting");

        //transfer the money into the account
      //    address(this).transfer(msg.value);

        //add the new bet
        Bet[] storage bets = cityToBets[_betId];
        bets.push(Bet(msg.sender, _betId, msg.value, _guessing_degree, date_of_now))-1;

        //add the mapping
        bytes32[] storage userBets = userToBets[msg.sender];
        userBets.push(_betId);   // deze account doet een bet op deze betId
    }
     /// @notice for testing; tests that the boxing oracle is callable
    /// @return true if connection successful
    function testOracleConnection() public view returns (bool) {
        return weatherOracle.testConnection();
    }
}

