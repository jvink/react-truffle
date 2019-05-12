const Bet = artifacts.require("./Bet.sol");

contract("Bet", accounts => {
  it("initializes with two candidates", async () => {
    const BetInstance = await Bet.deployed();

    // Check two candidates
    const count = await BetInstance.usersCount(); 

    assert.equal(count, 2, "There not 2 candidates");
  });
});
