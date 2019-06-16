pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
import "./Ownable.sol";
import "./DateLib.sol";
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";


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

contract WeatherOracle is Ownable, usingOraclize {
  mapping(bytes32 => uint) cityIdToIndex;
    CityBet[] citybets;

    mapping(bytes32 => bytes32) queryToBet;
    mapping(bytes32 => string) queryToResult;
    mapping (address => uint) pendingWithdrawals;

     using DateLib for DateLib.DateTime;

    string public weather;
    bytes32 public betId;
     
    event LogInfo(string description);
    event LogWeatherUpdate(string weather, bytes32 betId);
    event LogUpdate(address indexed _owner, uint indexed _balance);
    event LogReceivedFunds(address sender, uint amount);
    event Log(string text);
    enum oraclizeState { temp, dt }

    struct oraclizeCallback {
         oraclizeState oState;
     }
            mapping (bytes32 => oraclizeCallback) public oraclizeCallbacks;

    constructor () public payable {
        owner = msg.sender;
        emit LogUpdate(owner, address(this).balance);
        // Replace the next line with your version:
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);

        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
   }
    //defines a CityBet along with its outcome
    struct CityBet {
        address userId;
        bytes32 betId; //id van de bet
        string city_id; //id van city
        string name;  // naam van de stad
        uint inzet;
        int guess;
        uint made_on;  // datum wanneer de bet is gemaakt
        uint weather_date; //
        BetOutcome outcome; // outcome van de weddenschap
        uint quotering;
       // WeatherData weather;
        int winning_degree; // Welke temperatuur het is geworden
    }

    enum BetOutcome {
        Pending,    //day has not come yet to decision
        Decided,
        Won,
        Lost     //index of participant who is the winning_degree
    }

    function () external payable {
    emit LogReceivedFunds(msg.sender, msg.value);
    }
    function __callback(bytes32 id, string result, bytes proof) public {
        require(msg.sender == oraclize_cbAddress(), "is niet de oraclize callback address");
        weather = result;
        betId = queryToBet[id];
        emit LogWeatherUpdate(weather, betId);
    }
 
    function getBalance() public returns (uint _balance) {
        return address(this).balance;
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
    function addCityBet(address _sender, string memory _cityId, string memory _cityName, uint _inzet,
        int _guess,  uint   _made_on,  uint  _weather_date, uint _quotering) public payable returns (bytes32){
            // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {

            emit LogInfo("Oraclize query was NOT sent, please add some ETH to cover for the query fee");

        } else {
        
            emit LogInfo("Oraclize query was sent, standing by for the answer..");

            // string[] memory list;
            // list[0] = return_string(_cityName, 0);
            // list[1] = return_string(_cityName, 1);
            // Using XPath to to fetch the right element in the JSON response
            bytes32 id = keccak256(abi.encodePacked(_cityName, _weather_date, _sender));

            do_query(1560684035, _cityName, id);
           
            //hash the crucial info to get a unique id
            
            // //require that the CityBet be unique (not already added)
             require(!cityBetExists(id), "does exist already");

             uint newIndex = citybets.push(CityBet(_sender, id, _cityId, _cityName, _inzet, _guess, _made_on, _weather_date,
             BetOutcome.Pending, _quotering, -100))-1;
             cityIdToIndex[id] = newIndex+1;

            //return the unique id of the new CityBet
            return id;

            }
    }
    function do_query (uint timestamp, string _cityName, bytes32 _betId) private {
        emit Log("Oraclize query were sent, waiting for the answer for getting temp and dt");
        
        //first query for temp_c
        bytes32 queryId = oraclize_query(timestamp,"URL", return_string(_cityName));
          //oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState.temp);
        queryToBet[queryId] = _betId;

        // // second query for dt
        //   bytes32 queryId2 = oraclize_query(1560339117,"URL", return_string(_cityName, 1));
        //    oraclizeCallbacks[queryId2] = oraclizeCallback(oraclizeState.dt);
        //     queryIdToBetId[queryId2] = _betId;
        //     queries.push(queryId2);
    }
    function return_string(string _city) private returns (string ) {
        string memory one = "json(http://api.openweathermap.org/data/2.5/weather?q=";
        // string memory third = ",nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57).main.temp";
        // string memory fourth = ",nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57).dt";
        string memory extra = ",nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57).main.temp";
        // if(number == 0) {
        //     return strConcat(one, _city, third);
        // }
        // else{
        //     return strConcat(one, _city, fourth);
        // }
        return strConcat(one, _city, extra);
    }

    /// @notice sets the outcome of a predefined CityBet, permanently on the blockchain
    /// @param _betId unique id of the CityBet to modify
    // / @param _outcome outcome of the CityBet
    function declareOutcome(address _userId, bytes32 _betId, uint outcome, uint amount, int correctWeather) public   {
        //require that it exists
        require(cityBetExists(_betId), "does not exist");

        //get the CityBet
        uint index = _getCityBetIndex(_betId);
        CityBet storage theCityBet = citybets[index];
    //    if (_outcome == BetOutcome.Decided)
         //   require(_winning_degree >= 0 && theMatch.participantCount > uint8(_winning_degree), "invalid winning_degree");
        //set the outcomec
        if(outcome == 2){
            require(address(this).balance > amount, "too less balance on contract");
            msg.sender.transfer(amount);
            theCityBet.outcome = BetOutcome.Won;
            theCityBet.winning_degree = correctWeather;
        }
        if(outcome == 3){
            theCityBet.outcome = BetOutcome.Lost;
            theCityBet.winning_degree = correctWeather;
        }

        //set the winning_degree (if there is one)
        //if (_outcome == BetOutcome.Decided) theCityBet.winning_degree = _winning_degree;

    
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
        int guess,
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
        int guess,
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
