var WeatherOracle = artifacts.require("WeatherOracle");

    module.exports = function(deployer) {
        deployer.deploy(WeatherOracle);
    };