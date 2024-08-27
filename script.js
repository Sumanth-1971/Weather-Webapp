const apiKey = "c1d5949b112974a3427e9316c694949e";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?units=metric";

const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".chart-container").style.display = "none";
    } else {
        var data = await response.json();

        const { lon, lat } = data.coord;
        const oneCallResponse = await fetch(
            `${oneCallURL}&lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const oneCallData = await oneCallResponse.json();

        updateUI(data, oneCallData);
    }
}

function updateUI(weatherData, oneCallData) {
    document.querySelector(".city").innerHTML = weatherData.name;
    document.querySelector(".temp").innerHTML = weatherData.main.temp + "&deg;C";
    document.querySelector(".humidity").innerHTML = weatherData.main.humidity + "%";
    document.querySelector(".wind").innerHTML = weatherData.wind.speed + " km/h";

    const mainWeather = weatherData.weather[0].main;
    if (mainWeather == "Clouds") weatherIcon.src = "images/clouds.png";
    else if (mainWeather == "Clear") weatherIcon.src = "images/clear.png";
    else if (mainWeather == "Rain") weatherIcon.src = "images/rain.png";
    else if (mainWeather == "Drizzle") weatherIcon.src = "images/drizzle.png";
    else if (mainWeather == "Mist" || mainWeather == "Haze")
        weatherIcon.src = "images/mist.png";

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
    document.querySelector(".chart-container").style.display = "block";

    displayChart(oneCallData.hourly);
}

function displayChart(hourlyData) {
    const ctx = document.getElementById("weatherChart").getContext("2d");

    const labels = [];
    const temps = [];

    for (let i = 0; i < 5; i++) {
        const hourData = hourlyData[i];
        const hour = new Date(hourData.dt * 1000).getHours();
        labels.push(`${hour}:00`);
        temps.push(hourData.temp);
    }

    if (window.weatherChart) {
        window.weatherChart.destroy();
    }

    window.weatherChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: temps,
                    backgroundColor: "#FF6384",
                    borderColor: "#FF6384",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    });
}

searchbtn.addEventListener("click", () => {
    checkWeather(searchbox.value);
});
