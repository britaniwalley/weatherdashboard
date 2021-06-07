const cityNameEl = document.querySelector("#cityName");

const citySubmit = document.querySelector("#city");

const weatherDash = document.getElementById("weather-dash");

const localHistory = JSON.parse(localStorage.getItem("history")) ?? null;

const historyUl = document.getElementById("weather-history");

let cityForm = document.querySelector("#user-form");

const noenter = () => {
  return !(window.event && window.event.keyCode == 13);
};

//this function determines validity
const submitClick = (event, val) => {
  event.preventDefault();
  let cityID = citySubmit.value;

  if (cityID !== "") {
    let historyList = document.createElement("li");
    let historyLink = document.createElement("button");

    historyList.setAttribute("class", "list-group-item");
    historyList.setAttribute(`id`, `${cityID}`);

    historyLink.setAttribute(`onclick`, `cityGetter("${cityID}")`);
    historyLink.setAttribute(`class`, `btn btn-link`);
    historyLink.innerHTML = `${cityID}`;

    historyList.appendChild(historyLink);
    historyUl.appendChild(historyList);

    return cityGetter(cityID);
  } else {
    alert("You shall not pass");
    cityNameEl.value = "";
    cityForm = "";
    return;
  }
};

const cityGetter = async (cityID) => {
  try {
    if (cityID === "") return;
    const weatherApiKey = "aac7a25ab14d5f437c627c978531f784";
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityID}&appid=${weatherApiKey}&units=imperial`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let data = result.list;

        if (data !== undefined) {
          if (weatherDash.hasChildNodes()) {
            let i = 0;
            while (i < 5) {
              weatherDash.removeChild(document.querySelector("#weatherCard"));
              i++;
            }
          }

          let forecastAlign = [];

          cityNameEl.innerHTML = cityID;

          forecastAlign.push(data[0], data[7], data[15], data[23], data[31]);

          forecastAlign.forEach((index) => {
            let weatherCard = document.createElement("div");
            let weatherCol = document.createElement("div");

            weatherCol.setAttribute("class", "col-2");
            weatherCol.setAttribute("id", "weatherCard");
            weatherCard.setAttribute("class", "card border-0");

            let format = (i) =>
              new Date(i).toLocaleDateString("en-us", { weekday: "long" });

            weatherCard.innerHTML = `
          <div class="card-header bg-transparent border-0">${format(
            index.dt_txt
          )} <img src="assets/images/${index.weather[0].icon}.png" alt="${
              index.weather.description
            }"/></div>
            <ul class="list-group list-group-flush"><li class="list-group-item"><strong>Low: </strong>${Math.floor(
              index.main.temp_min
            )}</li><li class="list-group-item"> <strong>High: </strong>${Math.round(
              index.main.temp_max
            )}</li></ul>`;

            forecastAlign = [];

            weatherCol.appendChild(weatherCard);

            return weatherDash.appendChild(weatherCol);
          });
        }
      });
  } catch (error) {
    console.error(error);
  }
};

cityForm.addEventListener("submit", submitClick);
