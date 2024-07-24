const url = 'https://api.openweathermap.org/data/2.5/';
const key = '6701f4e7a1678028b686fe45eaa31417';

const setQuery = (event) => {
    if (event.keyCode == '13') {
        document.querySelector("#loading").style.display = "block";
        getResult(searchBar.value)
    }
}

document.querySelector('#btnSearch').addEventListener("click", () => {
    document.querySelector("#loading").style.display = "block";
    getResult(searchBar.value);
})

const getResult = (cityName) => {
    let query = `${url}weather?q=${cityName}&appid=${key}&units=metric&lang=tr`
    fetch(query)
        .then(weather => {
            if (!weather.ok)
                throw new Error("şehir bulunamadı.");

            return weather.json();
        })
        .then(displayResult)
        .catch(err => {
            renderError(err);
        })
}

const displayResult = (result) => {
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#errors").innerHTML = "";
    let city = document.querySelector('.city');
    city.innerText = `${result.name}, ${result.sys.country}`;

    let temp = document.querySelector('.temp');
    temp.innerText = `${Math.round(result.main.temp)}°C`;

    let desc = document.querySelector('.desc');
    desc.innerText = result.weather[0].description;

    let minmax = document.querySelector('.minmax');
    minmax.innerText = `${Math.round(result.main.temp_min)}°C / ${Math.round(result.main.temp_max)}°C`

    changeBackground(result.weather[0].description);
}

const changeBackground = (weatherDescription) => {
    let body = document.querySelector('body');
    body.classList.remove('bg-default', 'bg-sunny', 'bg-rainy', 'bg-cloudy', 'bg-snowy', 'bg-partly-cloudy', 'bg-foggy', 'bg-rainfall');
    const content = document.querySelector(".content");
    const header = document.querySelector(".header h1");

    if (weatherDescription.includes('güneşli') || weatherDescription.includes('açık')) {
        content.classList.remove("cloudy");
        header.classList.remove("cloudy");
        body.classList.add('bg-sunny');
    } else if (weatherDescription.includes('yağmur') || weatherDescription.includes('yağış')) {
        content.classList.remove("sunny");
        header.classList.remove("sunny");
        content.classList.add("cloudy");
        header.classList.add("cloudy");
        body.classList.add('bg-rainy');
    } else if (weatherDescription.includes('kapalı')) {
        content.classList.remove("sunny");
        header.classList.remove("sunny");
        content.classList.add("cloudy");
        header.classList.add("cloudy");
        body.classList.add('bg-cloudy');
    } else if (weatherDescription.includes('kar')) {
        content.classList.remove("cloudy");
        header.classList.remove("cloudy");
        body.classList.add('bg-snowy');
    } else if (weatherDescription.includes('parçalı bulutlu') || weatherDescription.includes('az bulutlu')) {
        content.classList.remove("cloudy");
        header.classList.remove("cloudy");
        body.classList.add('bg-partly-cloudy');
    } else if (weatherDescription.includes('sisli')) {
        content.classList.remove("sunny");
        header.classList.remove("sunny");
        content.classList.add("cloudy");
        header.classList.add("cloudy");
        body.classList.add('bg-foggy');
    } else if (weatherDescription.includes('sağanak')) {
        content.classList.remove("cloudy");
        header.classList.remove("cloudy");
        body.classList.add('bg-rainfall');
    }
}

function renderError(err) {
    const html = `
        <div class="alert alert-danger">   
            ${err.message}
        </div>
    `;
    document.querySelector("#errors").innerHTML = html;
}

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keypress', setQuery);

document.querySelector("#btnLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
});

function onError(err) {
    console.log(err);
}

async function onSuccess(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    const api_key = "3059b24c07654dce82e42b5395dac3cf";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();

    const city = data.results[0].components.province;

    document.getElementById('searchBar').value = city;

    document.querySelector("#btnSearch").click();

    document.querySelector("#loading").style.display = "block";
}