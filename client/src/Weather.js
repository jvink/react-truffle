// import getWeb3 from "./utils/getWeb3";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";

const getWeather = async (city) => {
    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${city},nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57`;

    try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        return data;
        
    } catch (error) {
        
    }
    
}

export default getWeather;

    // const web3 = await getWeb3();
    // // get contract

    // var bettingArenaContract = web3.eth.contract(SimpleStorageContract.abi);

    // // get the event (check https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract, 
    // // Events section, for the parameters)
    // var event = bettingArenaContract.HTTPRequest({ fromBlock: 0, toBlock: 'latest' });
    // console.log(event);
    // //get all events from 0 block to the latest
    // event.get((error, result) => {
    //     // handle the result
    // });

    // //observe new events
    // event.watch(function (error, result) {
    //     // handle the result
    // });