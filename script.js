const apiKey = "9470f162a34d93086760b16d1426a9ed";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

async function getWeather(city) {
    if (!city.trim()) {
        alert("Please enter a valid city name.");
        return;
    }
    try {
        if (!navigator.onLine) {
            alert("You are offline. Please check your internet connection.");
            return;
        }

        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (response.status === 404) {
            handleError('Location Not Found', 'images/404_error.png', "Error! 404");
            return;
        }
        
        if (!response.ok) {
            const error = await response.json();
            alert(`Error: ${error.message}`);
            return;
        }

        const data = await response.json();
        updateWeatherUI(data);
        
    } catch (error) {
        console.error("An error occurred while fetching the weather data:", error);
        alert("Unable to fetch weather data. Please try again later.");
    }
}

function updateWeatherUI(data) {
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".name").innerHTML = `${data.name}, ${data.sys.country}`;
    document.querySelector(".mintemp").innerHTML = Math.round(data.main.temp_min) + "°C";
    document.querySelector(".maxtemp").innerHTML = Math.round(data.main.temp_max) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + " km/h";

    const img = document.querySelector("#icon");
    switch (data.weather[0].main) {
        case 'Clear':
            img.src = 'images/clear.png';
            break;
        case 'Rain':
            img.src = 'images/rain.png';
            break;
        case 'Snow':
            img.src = 'images/snow_img.png';
            break;
        case 'Clouds':
            img.src = 'images/cloud.png';
            break;
        case 'Mist':
        case 'Haze':
            img.src = 'images/mist.png';
            break;
        default:
            img.src = 'images/cloud.png';
            break;
    }
    
    document.querySelector(".detail").style.display = "flex";
    document.querySelector(".temp2").style.display = "flex";
    document.querySelector(".temp").style.fontSize = "5.2rem";
    img.style.width = "16rem";
}

function handleError(message, iconSrc, tempMessage) {
    const img = document.querySelector("#icon");
    img.style.width = "100%";
    img.style.height = "auto";
    
    document.querySelector(".detail").style.display = "none";
    document.querySelector(".temp2").style.display = "none";

    img.src = iconSrc;
    document.querySelector(".temp").innerHTML = tempMessage;
    document.querySelector(".name").innerHTML = message;
    document.querySelector(".temp").style.fontSize = "3rem";
}

searchButton.addEventListener("click", function () {
    getWeather(searchBox.value);
});

setInterval(() => {
    if (searchBox.value.trim()) {
        getWeather(searchBox.value);
    }
}, 600000);
