import {Convert} from "./Convert";

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
    console.log("inzet" + bet.inzet)
    const wei = bet.inzet * 1000000000000000000; // omzetting dollaar naar ether naar wei  1 ether =1000000000000000000 wei
    console.log("stap1" + wei)
    // //placeBet(string memory _cityId, string memory _name, uint _guess, uint _weather_date, uint _date_of_now)
    await contract.methods.placeBet(bet.cityId.toString(), bet.name, parseInt(bet.dollar),
    parseInt(bet.guess), parseInt(bet.time), parseInt(bet.timeOfNow), parseInt(bet.quotering) * 100)  //plaats bet
    .send({ from: drizzleState.accounts[0], value: Math.round(wei)});
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

export const getAllBets = async (drizzle) => {    //Deze is niet meer in gebruik

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
        catch{console.log("Tries getting bets, there is none.")}

    return listBets;

    }

export const getBetsByUser = async (drizzle) => {  // Deze is nu in gebruik
        console.log("komt ie hier?")
        var listBets = [];
        try{
            const contract = drizzle.contracts.WeatherBets;
            await contract.methods.getBetsByUser().call()
            .then( async (betIds) => {
            betIds.forEach(async (betId) => { const rawBet = await contract.methods.getCityBet(betId).call();
                const readableBet = parseDataIntoReadable(rawBet);
                console.log(readableBet)
                listBets.push(readableBet);
            });
            
            }); 
        }
            catch{console.log("Tries getting bets, there is none.")}
    
        return listBets;
    
}
export const changeOutcome = async (drizzle, drizzleState, bet, outcome, correctWeather) => {
        
    try {
            const contract = drizzle.contracts.WeatherOracle;
            const convertions = await Convert();
            let ratio = convertions[0].price_usd;
            let dollar = 1 / parseFloat(ratio)
            let converted = bet.inzet * dollar
            let toWei = converted * 1000000000000000000;
            const wei = bet.quotering * toWei /100
            console.log(toWei)
            console.log(contract.address)

            if(convertions){
                await contract.methods.declareOutcome(drizzleState.accounts[0], bet.id, outcome, wei, Math.round(correctWeather)).send()
            .then(() => console.log("gelukt"), (error) => {console.log(error)});
            }
    }
    catch{
        console.log("something wrong in check date bets")
    }
}

const checkIfWon =(drizzle, contract) =>{
    console.log(contract.events)
    try{
       contract.events.BetEmitted({// Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }, (error, event) => { })
    .on('data', (event) => {
 // same results as the optional callback above
        checkIdsForWin(drizzle, event.returnValues[0]);
    })
    .on('changed', (event) => {
        // remove event from local database
    })
    .on('error', console.error);
    }
    catch{
      console.log("somethings wrong, no event yet..")
    } 
}

  const checkIdsForWin = async (drizzle, betIds) => {
     var winningBets = [];
     var losingBets = [];
    try{
        const contract = drizzle.contracts.WeatherBets;
        console.log(betIds)
        betIds.forEach(async (betId) => { const rawBet = await contract.methods.getCityBet(betId).call();
            const readableBet = parseDataIntoReadable(rawBet); console.log(readableBet)

            console.log(readableBet.name)

        });
   

    }
        catch{console.log("Tries getting bets, there is none.")
        
    }

  }

  function formatDate(date) {
       var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatDateWithHour(date) {
    var month = '' + (date.getMonth() + 1),
     day = '' + date.getDate(),
     year = date.getFullYear(),
      hour = date.getHours(),
      min = date.getMinutes();

 if (month.length < 2) month = '0' + month;
 if (day.length < 2) day = '0' + day;
 if (hour.length < 2) hour = '0' + hour;
 if (min.length < 2) min = '0' + min;

 return [year, month, day].join('-') + " " + hour + ":" + min;
}

function gethour(date) {
    const hour = date.getHours()
    console.log(hour);
    return hour;
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




