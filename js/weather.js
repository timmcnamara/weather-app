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
    );
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
        let degree = "degrees";
        let colors = ['#c4d3ed','#b1c8ef', '#a4c4f9', '#9bc0ff'];
        if (temp === 1) {
          degree = "degree";
        }
        cityWeather.innerText = `It's currently ${temp} ${degree} in ${city} & the time is ${time}`;
        console.log(temp)
        if (temp > 25) {
          app.style.background = colors[3];
          vector.innerHTML = '<img class="background-vector" src="images/sun.png" height="150px"/>';
        } else if (temp > 15) {
          app.style.background = colors[2];
          vector.innerHTML = '<img class="background-vector" src="images/suncloud.png" height="150px"/>';
        } else if (temp >= 0) {
          app.style.background = colors[1];
          vector.innerHTML = '<img class="background-vector" src="images/clouds.png" height="150px"/>';
        } else {
          app.style.background = colors[0];
          vector.innerHTML = '<img class="background-vector" src="images/snow.png" height="150px"/>';
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
