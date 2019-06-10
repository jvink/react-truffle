import getOdds from "./Odds"

const getPreviewOdds = async (previewBets, forecastWeather, weather, date) => {
    

    try {
      let items = [];
      if (previewBets != null) {
        for (let index = 0; index < previewBets.length; index++) {
          const result = await getOdds(forecastWeather, previewBets[index], weather, date);
          Promise.all([result]).then(function(values) {
            setTimeout(() => {
              items.push(Number(values[0]));
            });
            
          })
        }
      }
      console.log(items)

      return items;

    } catch (error) {

    }
}

export default getPreviewOdds;