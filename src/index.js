import "./styles.css";
const key = "TDTGFJTATUERD3CJT3UAMBTMY"; // I know it's here :)

import clearDayIcon from "../assets/sun.png";
import partlyCloudyDay from "../assets/partly-cloudy.png";
import cloudyIcon from "../assets/cloudy.png";
import rainIcon from "../assets/rain.png";
import thunderIcon from "../assets/thunder.png";
import snowIcon from "../assets/snowy.png";

async function getWeather(location) {
  try {
    if (location == undefined) {
      console.error("Address not valid");
    }
    const today = new Date().toISOString();
    const unitGroup = toggle.textContent === "C" ? "metric" : "us";

    let response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${today}?unitGroup=${unitGroup}&key=${key}&contentType=json`,
    );
    console.log(response.status);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    if (response.ok) {
      let data = await response.json();
      return data;
    }
  } catch (e) {
    console.error(e);
  }
}

const locationDiv = document.querySelector(".location");
const iconImg = document.querySelector(".iconImg");
const tempDiv = document.querySelector(".temp");
const conditionDiv = document.querySelector(".condition");
const minTempDiv = document.querySelector(".min-temp");
const maxTempDiv = document.querySelector(".max-temp");
const input = document.querySelector("#searchInput");
let weatherIcons = {
  "clear-day": clearDayIcon,
  "partly-cloudy-day": partlyCloudyDay,
  cloudy: cloudyIcon,
  rain: rainIcon,
  thunder: thunderIcon,
  snow: snowIcon,
};

async function displayData(weatherData) {
  let res = weatherData;
  console.log(res);
  let location = res.address;
  // capitalize first letter of each word cause lower case looks weird displayed
  let words = location.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }
  location = words.join();

  let tempMax = `${Math.ceil(res.days[0].tempmax)} °${toggle.textContent}`;
  let tempMin = `${Math.ceil(res.days[0].tempmin)} °${toggle.textContent}`;
  let temp = `${Math.ceil(res.days[0].temp)} °${toggle.textContent}`;
  let conditions = res.days[0].conditions;
  let icon = res.days[0].icon;

  console.log(location, tempMax, tempMin, temp, conditions, icon);

  locationDiv.textContent = location;
  iconImg.src = `${weatherIcons[icon]}`;
  tempDiv.textContent = temp;
  conditionDiv.textContent = conditions;
  minTempDiv.textContent = tempMin;
  maxTempDiv.textContent = tempMax;
}

const searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener("click", async () => {
  let location = input.value;
  try {
    let weatherData = await getWeather(location);
    console.log(weatherData);
    if (weatherData != undefined) {
      displayData(weatherData);
    } else {
      showError();
    }
  } catch (e) {
    console.error(e);
  }
});

// validation
const form = document.querySelector("form");
const inputError = document.querySelector("#searchInput + span.error");

input.addEventListener("input", (event) => {
  if (input.validity.valid) {
    inputError.textContent = ""; // Remove the message content
    inputError.className = "error"; // Removes the `active` class
  } else {
    // If there is still an error, show the correct error
    showError();
  }
});

form.addEventListener("submit", (event) => {
  // if the email field is invalid
  if (!input.validity.valid) {
    // display an appropriate error message
    showError();
    // prevent form submission
  } else {
    inputError.className = "";
  }
  event.preventDefault();
});

function showError() {
  if (input.validity.valueMissing) {
    // If empty
    inputError.textContent = "Please enter a location.";
  } else {
    inputError.textContent = "Please enter a valid location.";
  } // Add the `active` class
  inputError.className = "error active";
}

// temp changer

function CelsiustoFahrenheit(C) {
  C = C.split(" ")[0];
  let F = Math.ceil(C * (9 / 5) + 32);
  return `${F} °F`;
}
function FahrenheittoCelsius(F) {
  F = F.split(" ")[0];
  let C = Math.ceil((F - 32) * (5 / 9));
  return `${C} °C`;
}

const toggle = document.querySelector(".temp-changer");
toggle.addEventListener("click", async () => {
  if (toggle.textContent === "C") {
    toggle.textContent = "F";
    tempDiv.textContent = CelsiustoFahrenheit(tempDiv.textContent);
    minTempDiv.textContent = CelsiustoFahrenheit(minTempDiv.textContent);
    maxTempDiv.textContent = CelsiustoFahrenheit(maxTempDiv.textContent);
  } else {
    toggle.textContent = "C";
    tempDiv.textContent = FahrenheittoCelsius(tempDiv.textContent);
    minTempDiv.textContent = FahrenheittoCelsius(minTempDiv.textContent);
    maxTempDiv.textContent = FahrenheittoCelsius(maxTempDiv.textContent);
  }
});
