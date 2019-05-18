pragma solidity ^0.5.0;

contract SimpleStorage {
  uint storedData;

  function set(uint x) public {
    storedData = x;
    emit HTTPRequest("http://api.openweathermap.org/data/2.5/weather?q=Dordrecht,nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57");
  }

  function get() public view returns (uint) {
    return storedData;
  }

  event HTTPRequest(
        string url
    );
}
