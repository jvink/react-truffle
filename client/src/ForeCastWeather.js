
/// @author MartijnNieuwenhuis

const getForeWeather = async (date, city) => {
    const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${city},nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57`;

    try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        const list = data.list.slice(16,40);
        for (let index = 0; index < list.length; index++) {
            const element = list[index].dt_txt;
            if (element === date) {
                return list[index].main.temp
            }
        }

    } catch (error) {

    }
}


export default getForeWeather;