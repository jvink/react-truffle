
const parseDataIntoReadable = (bet) => {
    const betObject = {
        id: bet.betId,
        cityId: bet.city_id,
        name: bet.name,
        inzet: bet.inzet,
        guess: bet.guess,
        made_on: bet.made_on,
        weather_date: bet.weather_date,
        outcome: bet.outcome,
        quotering: bet.quotering,
        winning_degree: bet.winning_degree
    }
    return betObject;
}

export const placeBet = async (drizzle, drizzleState, bet) => {
  
    const contract = drizzle.contracts.WeatherBets;
    console.log(drizzleState.accounts[0])
    const wei = parseInt(bet.inzet) * 0.0039 * 1000000000000000000; // omzetting dollaar naar ether naar wei  1 ether =1000000000000000000 wei
    console.log("stap1")
    // //placeBet(string memory _cityId, string memory _name, uint _guess, uint _weather_date, uint _date_of_now)
    await contract.methods.placeBet(bet.cityId.toString(), bet.name,parseInt(bet.inzet),
    parseInt(bet.guess), parseInt(bet.time), parseInt(bet.timeOfNow))  //plaats bet
    .send({ from: drizzleState.accounts[0], value: wei, gas: 3000000 });
    console.log("stap3")
  
}

export const placeAddress = async (drizzle, drizzleState, address) => {
    
    // doe volgende command bij de ganache console van de oracle map: WeatherOracle.deployed().then(function(i) {app=i})
    // dan typ app.getAddress() , kopieer het adres wat hieruitkomt.
    // stop hier na elke oracle migrate, het contract addres opnieuw in
    try{
        const contract = drizzle.contracts.WeatherBets;
        await contract.methods.setOracleAddress(address) 
        .send({ from: drizzleState.accounts[0], gas: 3000000 });
        return true;
    }
    catch {
        return false;
    }
}

export const getAllBets = async (drizzle) => {  

    var listBets = [];
    try{
        const contract = drizzle.contracts.WeatherBets;
        await contract.methods.getBettableCityBets().call()
        .then( async (betIds) => {
        betIds.forEach(async (betId) => { const rawBet = await contract.methods.getCityBet(betId).call();
            const readableBet = parseDataIntoReadable(rawBet); console.log(readableBet)
            listBets.push(readableBet);
        });
        console.log(listBets)
        
        }); 
}
catch{alert("Lijst met weddenschappen is nog leeg, maak weddenschappen :)")}

    return listBets;

}


    // zet ganache open
    // dan.. je moet 3 consoles open zetten.. 
    // eentje voor root/client doe daar command npm run start
    // eentje op root/oracle/   doe daar command truffle console
    // eentje voor root    doe daar command truffle console
    // migrate --reset in allebeide  truffle ganache consoles
    // check in ganache onder tab 'contracts' of de contracts WeatherBets en WeatherOracle sowieso deployed staan na de migrate. 
    // zo ja, doe dan volgende command bij de ganache console van de oracle map: WeatherOracle.deployed().then(function(i) {app=i})
    // dan typ app.getAddress() , kopieer het adres wat hieruitkomt.
    // en ga naar de andere ganache console van de root map  typ daar: WeatherBets.deployed().then(function(i) {app=i})
    // dan app.setOracleAddress(gekopieerde adres hierin plakken met single quotes)
    // dan app.testOracleConnection()   < als dit true teruggeeft dan 
    // kan de WeatherBets contract nu de WeatherOracle contract functies lezen via de interface.  




