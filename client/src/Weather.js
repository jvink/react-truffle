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