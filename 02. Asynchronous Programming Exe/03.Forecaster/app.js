function attachEvents() {
    document.getElementById('submit').addEventListener('click', getWeather);
}

async function getWeather() {

    const availableDivCurrent = document.querySelector('.forecasts');
    const availableDivUpcoming = document.querySelector('.forecast-info');


    if (availableDivCurrent) {
        availableDivCurrent.remove();
    }

    if (availableDivUpcoming) {
        availableDivUpcoming.remove();
    }

    const input = document.getElementById('location');
   
    const cityName = input.value;
    let code = '';
    try {
        code = await getCode(cityName);
    } catch (error) {
       alert('Error');
       document.querySelector('#upcoming').style.display = 'block';
       document.getElementById('current').style.display = 'block';
       input.value = '';
    }
    const [current, upcoming] = await Promise.all([getCurrent(code), getUpcoming(code)]);
    
    let symbol = '&#x2600;';
    if (current.forecast.condition == 'Partly sunny') {
        symbol = '&#x26C5;';
    } else if (current.forecast.condition == 'Overcast') {
        symbol = '&#x2601;';
    } else if (current.forecast.condition == 'Rain') {
        symbol = '&#x2614;';
    }
    
    document.querySelector('#forecast').style.display = 'block';

    const divForecasts = createEl('div', 'forecasts');
    const spanSymbol = createEl('span', 'condition symbol', symbol);
    const spanCondition = createEl('span', 'condition');

    const spanFirstData = createEl('span', 'forecast-data', current.name);
    const spanSecondData = createEl('span', 'forecast-data', `${current.forecast.low}&#176;/${current.forecast.high}&#176;`);
    const spanThirdData = createEl('span', 'forecast-data', current.forecast.condition);

    divForecasts.appendChild(spanSymbol);
    divForecasts.appendChild(spanCondition);
    spanCondition.appendChild(spanFirstData);
    spanCondition.appendChild(spanSecondData);
    spanCondition.appendChild(spanThirdData);
    document.querySelector('#current').appendChild(divForecasts);

    const divForecastUpcoming = createEl('div', 'forecast-info');
    document.querySelector('#upcoming').appendChild(divForecastUpcoming);

    upcoming.forecast.map(d => {

        let symbol = '&#x2600;';
        if (d.condition == 'Partly sunny') {
            symbol = '&#x26C5;';
        } else if (d.condition == 'Overcast') {
            symbol = '&#x2601;';
        } else if (d.condition == 'Rain') {
            symbol = '&#x2614;';
        }

        const spanUpcoming = createEl('span', 'upcoming');
        const spanSymbol = createEl('span', 'symbol', symbol);
        const spanFirstData = createEl('span', 'forecast-data', `${d.low}&#176;/${d.high}&#176;`);
        const spanSecondData = createEl('span', 'forecast-data', d.condition);

        divForecastUpcoming.appendChild(spanUpcoming);
        spanUpcoming.appendChild(spanSymbol);
        spanUpcoming.appendChild(spanFirstData);
        spanUpcoming.appendChild(spanSecondData);
        input.value = '';
    });

}

function createEl(type, className, text) {
    const el = document.createElement(type);
    if (className) {
        el.className = className;
    }
    if (text) {
        el.innerHTML = text;
    }
    return el;
}

async function getCode(cityName) {
    const url = 'http://localhost:3030/jsonstore/forecaster/locations';
    const response = await fetch(url);
    const data = await response.json();
    return data.find(x => x.name.toLowerCase() === cityName.toLowerCase()).code;
}

async function getCurrent(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getUpcoming(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

attachEvents();

attachEvents();