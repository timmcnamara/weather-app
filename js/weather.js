{
  let DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  let DARKSKY_API_KEY = '8798e32504aae0bd572907191ae2cf80';
  let CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  let GOOGLE_MAPS_API_KEY = 'AIzaSyAksTkTUfx_-o7yKnzWOP_kqe2jwAsfMI4';
  let GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';


  let getCurrentWeather = function(coords) {
    let url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => {
        data.currently.timezone = data.timezone;
        return data.currently;
      })
    );
  }

  let getCoordinatesForCity = function(cityName) {
    let url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.results[0].geometry.location)
    )
  }

  let app = document.querySelector('#app');
  let cityForm = app.querySelector('.city-form');
  let cityInput = cityForm.querySelector('.city-input');
  let getWeatherButton = cityForm.querySelector('.get-weather-button');
  let cityWeather = app.querySelector('.city-weather');
  let cityTime = app.querySelector('.city-time');
  let vector = app.querySelector('.vector');


  cityForm.addEventListener('submit', function(event) {
      event.preventDefault(); // prevent the form from submitting

      let city = cityInput.value;
      cityInput.value = '';

      getCoordinatesForCity(city)
      .then(getCurrentWeather)
      .then((location) => {
        let temp = Math.floor(location.temperature);
        let time = moment.tz(location.time * 1000, location.timezone).format('h:mm a');
        let colors = ['rgb(229, 238, 255)','rgb(221, 254, 255)', 'rgb(221, 255, 237)', 'rgb(255, 218, 145)', 'rgb(255, 189, 135)'];
        if (temp === 1) {
          degree = "degree";
        }
        cityWeather.innerHTML = `${time} &bull; ${temp} &deg;C `;
        console.log(temp)
        if (temp > 30) {
          app.style.background = colors[4];
        } else if (temp > 20) {
          app.style.background = colors[3];
        } else if (temp > 10) {
          app.style.background = colors[2];
        } else if (temp > 0) {
          app.style.background = colors[1];
        } else {
          app.style.background = colors[0];
        }
      })
      .catch( err => {
        if (!navigator.onLine) {
        cityWeather.innerText = 'Check your internet connection. You seem to be offline';
      }
      else {
        cityWeather.innerText = 'Something went wrong. Please try again later';
      }

    });
  })

  // Initialize the Auto Complete
  function initialize() {
       var input = document.getElementById('searchTextField');
       var autocomplete = new google.maps.places.Autocomplete(input);
   }
  google.maps.event.addDomListener(window, 'load', initialize);
}
