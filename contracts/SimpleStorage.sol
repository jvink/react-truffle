pragma solidity ^0.5.0;

contract SimpleStorage {
  uint storedData;

  function set(uint x) public {
    storedData = x;
    emit HTTPRequest(storedData);
  }

  function get() public view returns (uint) {
    return storedData;
  }

  event HTTPRequest(
        uint x
    );
}
