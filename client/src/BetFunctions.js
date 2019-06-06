import { getPastWeather } from "./Weather";

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
    await contract.methods.placeBet(bet.cityId.toString(), bet.name,parseInt(bet.dollar),
    parseInt(bet.guess), parseInt(bet.time), parseInt(bet.timeOfNow))  //plaats bet
    .send({ from: drizzleState.accounts[0], value: wei, gas: 2000000 });
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

        var listBets = [];
        try{
            const contract = drizzle.contracts.WeatherBets;
            await contract.methods.getBetsByUser().call()
            .then( async (betIds) => {
            betIds.forEach(async (betId) => { const rawBet = await contract.methods.getCityBet(betId).call();
                const readableBet = parseDataIntoReadable(rawBet);
                listBets.push(readableBet);
            });
            
            }); 
        }
            catch{console.log("Tries getting bets, there is none.")}
    
        return listBets;
    
}



export const changeOutcome = async (drizzle, drizzleState, bets) => {

    var listBetIds = [];
    try {
  
        bets.forEach(async(bet) => {
            const checkExpired = Date.now() /1000 > bet.weather_date;
            if (checkExpired) {
                if(parseInt(bet.outcome) !== 1){
                    listBetIds.push(bet.id);
                }
            }       
        });
        const contract = drizzle.contracts.WeatherBets;
        if(listBetIds.length !== 0){
             await contract.methods.setDecided(listBetIds)
            .send({ from: drizzleState.accounts[0], gas: 3000000 });
            checkIfWon(drizzle, contract);
        }
        else{
            alert("Je hebt nog lopende weddenschappen.")
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
        // const rawBet = await contract.methods.getCityBet(onlyOne).call();
        //     const readableBet = parseDataIntoReadable(rawBet); console.log(readableBet)
        //     const weather = getPastWeather(readableBet.name, '2019-06-02');
        //     // listBets.push(readableBet);
        //     console.log(weather);
        
        console.log(betIds)
        betIds.forEach(async (betId) => { const rawBet = await contract.methods.getCityBet(betId).call();
            const readableBet = parseDataIntoReadable(rawBet); console.log(readableBet)
            const weather = await getPastWeather(readableBet.name, '2019-06-02');
            // listBets.push(readableBet);


            const win = parseInt(weather.forecast.forecastday[0].hour[12].temp_c) === readableBet.guess;
            if(win){
                console.log("win, insert here smart contract functie met betaling en outcome change");
                winningBets.push(betId);  // nog functie komen om naar contract te sturen.
                alert("Je hebt gewonnen")
            }
            else{    
                console.log("You lost man, no moneys back");    
                losingBets.push(betId);
                alert("niks gewonnen helaas")
            }
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




