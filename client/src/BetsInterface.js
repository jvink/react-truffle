// import deploy from "./helper"   < deze in App.js
// import WeatherBetsContract from "./contracts/WeatherBets.json";  < deze in App.js
// import getBets from "./BetsInterface";  < deze in App.js

const parseDataIntoReadable = (bet, web3) => {
    const betObject = {
        id: bet.betId,
        cityId: bet.city_id,
        name: bet.name,
        outcome: bet.outcome,
        quotering: bet.quotering.toNumber(),
        winning_degree: bet.winning_degree.toNumber()
    }
    return betObject;
}

const getBets = async (Bet, web3, accounts) => {  

    const check = await Bet.methods.testOracleConnection().call().then((result) => result).catch(() => false);
    if(check){
        const calledBets = await Bet.methods.getBettableCityBets().call()
        .then( async (betIds) => {
        const listBetIds = [];
        betIds.forEach(async (betId) => { const raw = await Bet.methods.getCityBet(betId).call();
            const bet = parseDataIntoReadable(raw, web3); console.log(bet)
            listBetIds.push(bet);
        });
        return calledBets;
        }, () => console.log("Voeg TestData toe") ); 
        console.log(calledBets);
    }
    else{
        console.log("Zet eerst het address van de WeatherOracle contract in de WeatherBet contract >> setOracleAdress('address')");
        console.log("Daarna Testdata toevoegen met addTestData().");
    }

    // Plak deze lines hieronder in ComponentDidUpdate in App.js

    //const instance = await deploy(SimpleStorageContract, networkId, web3);
    //  const Bet = await deploy(WeatherBetsContract, networkId, web3);
   //   const bets = await getBets(Bet, accounts);


//ALS check false is is doe wat hieronder staan (uitcommentaren eerste, daarna weer commentaren, haal het adres op uit truffle console) 
    // await Bet.methods.setOracleAddress('Hier iets stoppen ').send({ from: accounts[0], gas: 2000000 });
 

    /// Als dit false geeft doe de volgende stappen
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
}

export default getBets;



