// Elements
const error = document.querySelector(".error");
const group = document.querySelectorAll(".group");
const weekContainer = document.querySelector(".week-container");
const cityName = "Middlesbrough";

// Function to populate weather data in the DOM
function populateWeatherData(weather) {
  document.querySelector("#condition").textContent = weather.condition;
  document.querySelector("#temperature").textContent = Math.round(weather.temp);
  document.querySelector("#date").textContent = weather.date;
  document.querySelector("#day").textContent = weather.day;
  document.querySelector("#city-name").textContent = weather.name;
  document.querySelector("#pressure").textContent = weather.pressure;
  document.querySelector("#wind-speed").textContent = weather.windSpeed;
  document.querySelector("#humidity").textContent = weather.humidity;
  document.querySelector("#weather-icon").innerHTML = `<i class="bi bi-cloud-sun" style="font-size: 3rem;"></i>`;
}

// Function to save past weather data to localStorage
function savePastDataToLocalStorage(data) {
  localStorage.setItem("pastWeatherData", data);
}

// Function to load past weather data from localStorage
function loadPastDataFromLocalStorage() {
  const storedData = localStorage.getItem("pastWeatherData");
  if (storedData) {
    weekContainer.innerHTML = storedData;
  }
}

// Function to fetch and save past weather data from the server
async function fetchAndSavePastWeatherData(cityName) {
  try {
    // Heading
    document.querySelector(".right h1").textContent = `${cityName} Past Weather`;

    // Fetching past weather data from your server (replace with your actual URL)
    const url = `http://localhost/xmxm/index.php`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let weekBoxHTML = ""; // Collect HTML in a variable

    data.forEach((weather) => {
      weekBoxHTML += `
        <div class="week-box">
          <div class="date">${weather.Day_and_Date}</div>
          <div class="db-info">
            <p>${weather.Day_of_Week}</p>
            <figure><i class="bi bi-${getBootstrapIconName(weather.Weather_Icon)}"></i></figure>
            <p>${weather.Temperature}°C</p>
            <p>${weather.Pressure} Pa</p>
            <p>${weather.Wind_Speed} m/s</p>
            <p>${weather.Humidity} %</p>
          </div>
        </div>
        <hr>
      `;
    });
    
    function getBootstrapIconName(weatherIcon) {
      // Map weather icon codes to Bootstrap icon names
      const iconMap = {
        // Add more mappings as needed
        "01d": "sun",
        "01n": "moon-stars",
        "02d": "cloud-sun",
        "02n": "cloud-moon",
        "03d": "cloud",
        "03n": "cloud",
        "04d": "clouds",
        "04n": "clouds",
      };
    
      // Default to "question" icon if no mapping is found
      return iconMap[weatherIcon] || "question";
    }
    

    // Set the innerHTML of the weekContainer
    weekContainer.innerHTML = weekBoxHTML;

    // Save the past weather data to localStorage
    savePastDataToLocalStorage(weekBoxHTML);
  } catch (error) {
    console.error(error);
  }
}

// Function to fetch weather data from API
async function fetchData(cityName) {
  try {
    // Fetching weather data based on the city name
    const apiKey = "e565260172023f1677c6c671ed367d35";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      // Display error message and hide weather data
      error.classList.remove("hide");
      group.forEach((node) => node.classList.add("hide"));
      throw new Error("City not found");
    }

    const data = await response.json();
    const currentDate = new Date();
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    // Create an object with weather data
    const weather = {
      name: data.name,
      day: weekdays[currentDate.getDay()],
      date: currentDate.toLocaleDateString("en-US", options),
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      temp: data.main.temp,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
    };

    // Populate the DOM with weather data
    populateWeatherData(weather);

    // Store the weather data in localStorage
    localStorage.setItem(cityName.toLowerCase(), JSON.stringify(weather));
  } catch (error) {
    console.error(error);
    // Handle errors here, such as displaying an error message to the user
  }
}

// Load weather data from localStorage or fetch if needed
function loadWeatherDataFromLocalStorage(cityName) {
  const formattedCity = cityName.toLowerCase();
  const storedData = localStorage.getItem(formattedCity);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    populateWeatherData(parsedData);
  }
}

// Initial load - Load weather data for the default city
loadWeatherDataFromLocalStorage(cityName);

// Function to search for weather by city name
const cityInput = document.querySelector("#search-box");
function searchWeather() {
  const inputCityName = cityInput.value.trim();
  if (inputCityName) {
    // Check if the city is stored in localStorage
    const formattedCity = inputCityName.toLowerCase();
    const storedData = localStorage.getItem(formattedCity);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      populateWeatherData(parsedData);
    } else {
      // If not found in localStorage, fetch and display the data
      fetchData(inputCityName);
    }
    cityInput.value = "";
  }
}

// Event listener for the "Enter" key press on the input element
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// Call the function to load past weather data from localStorage
loadPastDataFromLocalStorage();

// Call the function to fetch and save past weather data
fetchAndSavePastWeatherData(cityName);
