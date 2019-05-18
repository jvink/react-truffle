const Bet = artifacts.require("./Bet.sol");

contract("Bet", accounts => {
  it("initializes with two candidates", async () => {
    const BetInstance = await Bet.deployed();

    // Check two candidates
    const count = await BetInstance.usersCount(); 

    assert.equal(count, 2, "There not 2 candidates");
  });


  it("check parameters users", async () => {
    const betInstance = await Bet.deployed();
    // Check two candidates
    user1 = await betInstance.users(1);
    assert.equal(user1[0], 1, "contains the correct id");
    assert.equal(user1[1], "Candidate 1", "contains correct name");
    assert.equal(user1[2], 0, "contains correct voteCount");
    user2 = await betInstance.users(2);
    assert.equal(user2[0], 2, "contains the correct id");
    assert.equal(user2[1], "Candidate 2", "contains correct name");
    assert.equal(user2[2], 0, "contains correct voteCount");
  });
});
