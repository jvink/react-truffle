/// @author MartijnNieuwenhuis

const getPreviewBets = async (forecastWeather) => {
    function range(start, end, step = 1) {
        if (start > end) {
          step = -step;
        }
        
        const length = Math.floor(Math.abs((end - start) / step)) + 1;
        
        return Array.from(Array(length), (x, index) => start + index * step);
      }

    try {
        const startTemperature = forecastWeather - 2;
        const lastTemperature = forecastWeather + 2;
        let previewBets = range(startTemperature, lastTemperature);

        return previewBets;

    } catch (error) {

    }
}

export default getPreviewBets;