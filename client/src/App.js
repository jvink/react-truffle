import React, { Component } from "react";
import BetForm from "./components/BetForm";
import BetList from "./components/BetList";
import BetDetails from "./components/BetDetails";
import "./css/App.css";
import { getBetsByUser } from "./BetFunctions";
import Modal from "./components/ModalforFinish";
import moment from 'moment';


class App extends Component {
  state = { ETH: 0, loading: true, drizzleState: null, storageValue: 0, stackId: null, oracleReady: false, bets: [], detail: null, changeContent: false, betId: null,
    retrievedWeather: null, ModalOpen: false
  
    };
  inzet = React.createRef();
  city = React.createRef();
  time = React.createRef();
  componentDidMount = async () => {
    const { drizzle} = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(async () => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      //get accounts
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState }, this.readValue);
      }
    });
  };
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  readValue = async () => {

    /// Hier leest alle weddenschappen...
    // alle data die veranderbaar is
    const { drizzle } = this.props;
    try {
      const contract = drizzle.contracts.SimpleStorage;
      const contract2 = drizzle.contracts.WeatherBets;
      const contract4 = drizzle.contracts.WeatherOracle; // Dit gaat later nog naar aparte map

console.log("komt ie hier nog langs?")
      if (!this.state.oracleReady) {     
        await contract2.methods.getOracleAddress().call()
          .then(address => {
            if (parseInt(address) !== 0 && !isNaN(parseInt(address))) {
              console.log(parseInt(address))
              this.setState({ oracleReady: true });
            }
          }
          )
      }
      console.log(contract4);

      this.setState({bets: await getBetsByUser(drizzle)})
      var value = await contract.methods.get().call()
       if(value) this.setState({storageValue: value})

      if(this.state.oracleReady){
        this.listenToInfo(contract4);

        this.listenToFinishedBets(contract4);

        if(this.state.retrievedWeather){
          this.checkforWin();
        }

        const balance = await contract4.methods.getBalance().call();
        console.log(balance)
        //this.setState({balance});
      }  
     

          }
      catch{
      alert("Wait few seconds then restart browser, probably the contracts take time to deploy.")
    }
  };
  

  listenToFinishedBets =  (contract) => {
    contract.events.LogWeatherUpdate({
      // Using an array means OR: e.g. 20 or 23
         fromBlock: 0,
         to: 'latest'
     }, (error, event) => { console.log(event); })
     .on('data', async(event) => {
         console.log(event.returnValues);
         const weather = event.returnValues.weather
         const betId = event.returnValues.betId
         const retrievedWeather = {temp: weather, retrievedId: betId }
         await this.setState({retrievedWeather})
         this.checkforWin()
       
     })
     .on('changed', (event) => {
         // remove event from local database
     })
     .on('error', console.error);
  }

  listenToInfo = (contract) => {
    contract.events.LogInfo({
      // Using an array means OR: e.g. 20 or 23
         fromBlock: 0,
         to: 'latest'
     }, (error, event) => { console.log(event); })
     .on('data', (event) => {
         console.log(event.returnValues);
     })
     .on('changed', (event) => {
         // remove event from local database
     })
     .on('error', console.error);
  }


  setBetId = async (betId) => {
    this.setState({betId: betId});  
  }


  checkforWin = () => {
    const {drizzle} = this.props;
    const {drizzleState, bets, retrievedWeather} = this.state;

    const betsToCheck = bets.filter((bet) => retrievedWeather.betId !== bet.id ).slice(0,1);
    const betToCheck = betsToCheck[0];
    console.log(betToCheck.guess, Math.round(retrievedWeather.temp))
    if(betToCheck.guess === Math.round(retrievedWeather.temp)){
      console.log("you win")
    }
    else {
      console.log("you lose")
    }

  }

  render() {
    if (this.state.loading) {
      return <div>Loading Drizzle, Web3, Metamask, en Contracts...</div>;
    }
    const { drizzle } = this.props;
    const { drizzleState, storageValue, oracleReady, bets } = this.state;
    console.log(this.state.oracleReady)
    console.log(this.state.retrievedWeather)
    return (
      <div className="container">
        <div className="row">
          {
            this.state.changeContent ? <BetDetails bets={bets}  onClickDetail={(changeContent) => this.setState({ changeContent: false})} betId={this.state.betId}/>
            : <BetForm drizzle={drizzle} drizzleState={drizzleState} oracleReady={oracleReady} />

          }
          <div className="col-1">

          </div>
          <BetList drizzle={drizzle} drizzleState={drizzleState} storageValue={storageValue} bets={bets} onClickDetail={(changeContent) => this.setState({ changeContent: true })} 
          onClickSetBetId={this.setBetId} />

            {this.state.balance && this.state.balance}
 
            {this.state.retrievedWeather && 
              <ul>
                <li>{this.state.retrievedWeather.temp}</li>
                <li>{this.state.retrievedWeather.betId}</li>    
              </ul>   
              } 
        </div>
        <Modal isOpen={this.state.ModalOpen}/>
      </div>
    );
  }
}
export default App;

