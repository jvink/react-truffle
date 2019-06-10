/// @author MartijnNieuwenhuis
    
const getOdds = async (forecast, bet, weather, date) => {
    try {
        console.log(forecast)
        console.log(bet)
        console.log(weather)
        console.log(date)
        if (bet === null){
            return 1.00;
        }
        let difference = null;
        let spanTimeFactor = 1.00;
        let differenceFactor = 1.00;
        let oddFactor = 1.01;
        
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
            }
        }
        if (difference !== 0) {
            differenceFactor = difference * Math.pow(1.1, difference) / difference;
            const diff = oddFactor * differenceFactor * spanTimeFactor
            return diff.toFixed(2);
        } else {
            const diff = oddFactor * spanTimeFactor
            return diff.toFixed(2);
        }

    } catch (error) {

    }

}

export default getOdds;
