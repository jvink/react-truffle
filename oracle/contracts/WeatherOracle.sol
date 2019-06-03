pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./DateLib.sol";

/*
TEST:
- testConnection
- getAddress
- cityBetExists(0)
- cityBetExists(1)
- declareOutcome(0, 2)
- getPendingCityBets()
- getAllCityBets()
- getCityBet(0)
- getMostRecentCityBet(true)
- addTestData()
- cityBetExists(0)
- cityBetExists(1)
- declareOutcome(0, 2)
- getPendingCityBets()
- getAllCityBets()
- getCityBet(0)
- getMostRecentCityBet(true)
- getMostRecentCityBet(false)
- getCityBet(0x...)
- declareOutcome(0x..., 2)
- getMostRecentCityBet(true)
- getMostRecentCityBet(false)
- getCityBet(0x...)
- add duplicate CityBet
*/

// http://api.openweathermap.org/data/2.5/forecast?q=Rotterdam,nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57
// voor oproepen 5 dagen weersvoorspelling data voor Rotterdam
// http://api.openweathermap.org/data/2.5/weather?q=Rotterdam,nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57
// voor huidige weer van een bepaalde stad, in dit geval voor Rotterdam

contract WeatherOracle is Ownable {
  mapping(bytes32 => uint) cityIdToIndex;
    CityBet[] citybets;

     using DateLib for DateLib.DateTime;

    //defines a CityBet along with its outcome
    struct CityBet {
        address userId;
        bytes32 betId; //id van de bet
        string city_id; //id van city
        string name;  // naam van de stad
        uint inzet;
        uint guess;
        uint made_on;  // datum wanneer de bet is gemaakt
        uint weather_date; //
        BetOutcome outcome; // outcome van de weddenschap
        uint quotering;
       // WeatherData weather;
        int winning_degree; // Welke temperatuur het is geworden
    }

    // struct WeatherData {
    //   int8 humidity;  /// @param humidity is how moist the air is..
    //   int8 cloudPercentage; /// @param cloudPercentage is how much cloudiness there is 100 is max, 0 is min
    //   int8 spanIndex; ///  @param spanIndex is how long in advance the bet is made before the bet finishes.
    // }

    enum BetOutcome {
        Pending,    //day has not come yet to decision
        Decided,
        Won,
        Lost     //index of participant who is the winning_degree
    }

    /// @notice returns the array index of the CityBet with the given id
    /// @dev if the CityBet id is invalid, then the return value will be incorrect and may cause error; you must call cityBetExists(_betId) first!
    /// @param _betId the CityBet id to get
    /// @return an array index
    function _getCityBetIndex(bytes32 _betId) private view returns (uint) {
        return cityIdToIndex[_betId]-1;
    }
    /// @notice determines whether a weather forecast exists with the given id
    /// @param _betId the city id to test
    /// @return true if CityBet exists and id is valid
    function cityBetExists(bytes32 _betId) public view returns (bool) {
        if (citybets.length == 0)
            return false;
        uint index = cityIdToIndex[_betId];
        return (index > 0);
    }
    /// @notice puts a new pending CityBet into the blockchain
    /// @param _cityName descriptive name for the CityBet (e.g. Pac vs. Mayweather 2016)
    /// @param _weather_date weather_date set for the CityBet
    /// @return the unique id of the newly created CityBet
        function addCityBet(address sender, string memory _cityId, string memory _cityName, uint _inzet,
        uint _guess, uint _made_on, uint _weather_date) public returns (bytes32){

        //hash the crucial info to get a unique id
        bytes32 id = keccak256(abi.encodePacked(_cityName, _weather_date, sender));
        uint quotering = 110; // test

        //require that the CityBet be unique (not already added)
        require(!cityBetExists(id), "does exist already");

        uint newIndex = citybets.push(CityBet(sender, id, _cityId, _cityName, _inzet, _guess, _made_on, _weather_date,
        BetOutcome.Pending, quotering, -100))-1;
        cityIdToIndex[id] = newIndex+1;

        //return the unique id of the new CityBet
        return id;
    }

    /// @notice sets the outcome of a predefined CityBet, permanently on the blockchain
    /// @param _betId unique id of the CityBet to modify
    // / @param _outcome outcome of the CityBet
    function declareOutcome(bytes32 _betId) public returns (
        address userId,
        bytes32 betId,//id van de bet
        string memory name,  // naam van de stad
        uint guess,
        uint weather_date //
    ) {

        //require that it exists
        require(cityBetExists(_betId), "does not exist");

        //get the CityBet
        uint index = _getCityBetIndex(_betId);
        CityBet storage theCityBet = citybets[index];

    //    if (_outcome == BetOutcome.Decided)
         //   require(_winning_degree >= 0 && theMatch.participantCount > uint8(_winning_degree), "invalid winning_degree");

        //set the outcome
        theCityBet.outcome = BetOutcome.Decided;
        //set the winning_degree (if there is one)
        //if (_outcome == BetOutcome.Decided) theCityBet.winning_degree = _winning_degree;

         return (theCityBet.userId, theCityBet.betId, theCityBet.name, theCityBet.guess, theCityBet.weather_date);
    }

    /// @notice gets the unique ids of all pending citybets, in reverse chronological order
    /// @return an array of unique CityBet ids
    function getPendingCityBets() public view returns (bytes32[] memory) {
        uint count = 0;

        //get count of pending citybets
        for (uint i = 0; i < citybets.length; i++) {
            if (citybets[i].outcome == BetOutcome.Pending)
                count++;
        }

        //collect up all the pending citybets
        bytes32[] memory output = new bytes32[](count);

        if (count > 0) {
            uint index = 0;
            for (uint n = citybets.length; n > 0; n--) {
                if (citybets[n-1].outcome == BetOutcome.Pending)
                    output[index++] = citybets[n-1].betId;
            }
        }

        return output;
    }

    /// @notice gets the unique ids of citybets, pending and decided, in reverse chronological order
    /// @return an array of unique CityBet ids
    function getAllCityBets() public view returns (bytes32[] memory) {
        bytes32[] memory output = new bytes32[](citybets.length);

        //get all ids
        if (citybets.length > 0) {
            uint index = 0;
            for (uint n = citybets.length; n > 0; n--) {
                output[index++] = citybets[n-1].betId;
            }
        }
        return output;
    }

    /// @notice gets the specified weather
    /// @param _betId the unique id of the desired weather
    /// @return CityBet data of the specified weather
    function getCityBet(bytes32 _betId) public view returns (
        address userId,
        bytes32 betId,//id van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint inzet,
        uint guess,
        uint made_on,  // datum wanneer de bet is gemaakt
        uint weather_date, //
         BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
       // WeatherData weather;
        int winning_degree // Welke temperatuur het is geworden
     ) {
        //get the weather
        if (cityBetExists(_betId)) {
            CityBet storage theCity = citybets[_getCityBetIndex(_betId)];
            return (theCity.userId,theCity.betId, theCity.city_id, theCity.name, theCity.inzet, theCity.guess, theCity.made_on, theCity.weather_date,
            theCity.outcome, theCity.quotering, theCity.winning_degree);
        }
        else {
            return (address(0x0), _betId, "", "", 0, 0, 0, 0, BetOutcome.Pending, 0, -1);
        }
    }

    /// @notice gets the most recent CityBet or pending CityBet
    /// @param _pending if true, will return only the most recent pending CityBet; otherwise, returns the most recent CityBet either pending or completed
    /// @return CityBet data
    function getMostRecentCityBet(bool _pending) public view returns (
        address userId,
        bytes32 betId,//betId van de bet
        string memory city_id, //id van city
        string memory name,  // naam van de stad
        uint inzet,
        uint guess,
        uint made_on,  // datum wanneer de bet is gemaakt
        uint weather_date, //
         BetOutcome outcome, // outcome van de weddenschap
        uint quotering,
       // WeatherData weather;
        int winning_degree // Welke temperatuur het is geworden
        ) {

        bytes32 id = 0;
        bytes32[] memory ids;

        if (_pending) {
            ids = getPendingCityBets();
        } else {
            ids = getAllCityBets();
        }
        if (ids.length > 0) {
            id = ids[0];
        }
        //by default, return a null CityBet
        return getCityBet(id);
    }
    function testConnection() public pure returns (bool){
	return true;
    }
        /// @notice gets the address of this contract
    /// @return address
    function getAddress() public view returns (address) {
        return address(this);
    }

    /// @notice for testing  string memory _cityId, string memory _cityName, uint _weather_date
    function addTestData() external onlyOwner {
        // addCityBet(434,"2471883", "Rotterdam", 0, 0, 0, DateLib.DateTime(2018, 8, 13, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("2329929", "Amsterdam", 0, 0, 0, DateLib.DateTime(2018, 8, 15, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("4564645", "Utrecht", 0, 0, 0, DateLib.DateTime(2018, 9, 3, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("3452554", "Groningen", 0, 0, 0,  DateLib.DateTime(2018, 9, 3, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("2342555", "Maastricht",0, 0, 0,  DateLib.DateTime(2018, 9, 21, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("4564654", "Haarlem", 0, 0, 0, DateLib.DateTime(2018, 9, 29, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("3655463", "Overschie",0, 0, 0,  DateLib.DateTime(2018, 10, 10, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("3454344", "Schiedam", 0, 0, 0, DateLib.DateTime(2018, 11, 11, 0, 0, 0, 0, 0).toUnixTimestamp());
        // addCityBet("3248228", "Spangen", 0, 0, 0, DateLib.DateTime(2018, 11, 12, 0, 0, 0, 0, 0).toUnixTimestamp());
    }
}
