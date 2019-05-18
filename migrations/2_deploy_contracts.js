var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Bets = artifacts.require("./WeatherBets.sol");


// const address= 0xc63C1039b521e67768D938FfA9E1A3Bfe139285c;

module.exports = function(deployer) {
  deployer.then(async () => {
    await deployer.deploy(SimpleStorage);
    await deployer.deploy(Bets);
  })
};
