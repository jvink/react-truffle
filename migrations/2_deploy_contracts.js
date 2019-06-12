var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Bets = artifacts.require("./WeatherBets.sol");
var WeatherOracle = artifacts.require("./WeatherOracle.sol");


// Deploys the OraclizeTest contract and funds it with 0.5 ETH
// The contract needs a balance > 0 to communicate with Oraclize

// const address= 0xc63C1039b521e67768D938FfA9E1A3Bfe139285c;

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(SimpleStorage);
    await deployer.deploy(Bets);
    await deployer.deploy(WeatherOracle,
      { from: accounts[9], gas:6721975, value: 500000000000000000 });
  })
};
