export const getWeather = async (city) => {
    const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${city},nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57`;

    try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        return data.list.slice(16,40);

        
    } catch (error) {
        
    }
    
}
export const getWeather2 = async (city) => {
    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${city},nl&units=metric&APPID=55e3d06cfe25b54ec349eae880b98d57`;

    try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        return data;

        
    } catch (error) {
        
    }
    
}

export const getPastWeather = async (city, date) => {
    const URL = `http://api.apixu.com/v1/history.json?key=12d0f4cfd8364ab8a3d124533193105&q=${city}&dt=${date}`;

    try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        return data;
        
    } catch (error) {
        return error;
    }
    
}
