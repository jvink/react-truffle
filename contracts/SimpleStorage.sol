pragma solidity ^0.4.24;
contract SimpleStorage {
  uint storedData;

  function set(uint x) public {
    storedData = x;
     HTTPRequest(storedData);
  }

  function get() public view returns (uint) {
    return storedData;
  }

  event HTTPRequest(
        uint x
    );
}
