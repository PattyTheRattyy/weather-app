import "./styles.css";

console.log("default template!");

async function getWeather() {
  try {
    let response = await fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/kingston%2C%20ontario%2C%20canada/2026-06-10?unitGroup=metric&key=TDTGFJTATUERD3CJT3UAMBTMY&contentType=json",
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    let data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  let res = await getWeather();
  let currentTemp = res.days[0].temp;
  console.log(currentTemp);
}

main();
