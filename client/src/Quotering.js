const getQuortering = async (forecast, bet, weather, date) => {
    try {
        if (bet === null){
            return 1.00;
        }
        let difference = null;
        let spanTimeFactor = 1.00;
        let differenceFactor = 1.00;
        let quoteringFactor = 1.01;
        
        if (forecast > bet) {
            difference = forecast - bet
        } else {
            difference = bet - forecast
        }
        
        for (let index = 0; index < weather.length; index++) {
            const element = weather[index].dt_txt;
            if (element === date) {
                if (index !== 0) {
                    spanTimeFactor =  index * Math.pow(1.03, index) / index;
                }
                console.log(spanTimeFactor);
            }
        }
        if (difference !== 0) {
            differenceFactor = difference * Math.pow(1.1, difference) / difference;
            return quoteringFactor* differenceFactor * spanTimeFactor ;
        } else {
            return quoteringFactor * spanTimeFactor;
        }

    } catch (error) {

    }

}

export default getQuortering;