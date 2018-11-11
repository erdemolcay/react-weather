import React, {Component} from 'react';
import DarkSkyApi from 'dark-sky-api';
import DocumentTitle from 'react-document-title';
import moment from 'moment';

import './App.css';

import Search from '../../components/Search/Search';
import Weather from '../../components/Weather/Weather';

class App extends Component {
  state = {
    input: {
      search: "",
      value: ""
    },
    location: {
      latitude: null,
      longitude: null
    },
    weather: {
      dataLoaded: false,
      place: null,
      units: {},
      typeOfDetails: "currently",
      typeOfHourlyData: null,
      selectedDay: null,
      selectedHour: null,
      data: {
        currently: {},
        daily: []
      }
    },
  };

  units = {
    ca: {
      temperature: "°C",
      windSpeed: "km/h",
      time: "HH:mm",
      dateTime: "dddd HH:mm",
      date: "dddd",
      dateShort: "ddd"
    },
    uk2: {
      temperature: "°C",
      windSpeed: "mph",
      time: "HH:mm",
      dateTime: "dddd HH:mm",
      date: "dddd",
      dateShort: "ddd"
    },
    us: {
      temperature: "°F",
      windSpeed: "mph",
      time: "HH:mm",
      dateTime: "dddd h:mm a",
      date: "dddd",
      dateShort: "ddd"
    },
    si: {
      temperature: "°C",
      windSpeed: "m/s",
      time: "HH:mm",
      dateTime: "dddd HH:mm",
      date: "dddd",
      dateShort: "ddd"
    }
  };

  darkSkyApi = DarkSkyApi;

  handleInputChange = event => {
    const state = {
      ...this.state,
      input: {
        ...this.state.input,
        search: event.target.value,
        value: event.target.value,
      }
    };
    this.setState(state);
  };

  handleSelectSuggest = (geocodedPrediction, originalPrediction) => {
    const location = geocodedPrediction.geometry.location;
    const formattedAddress = geocodedPrediction.formatted_address;

    const state = {
      ...this.state,
      input: {
        search: "",
        value: "",
      },
      location: {
        latitude: location.lat(),
        longitude: location.lng()
      },
      weather: {
        ...this.state.weather,
        place: formattedAddress
      }
    };

    this.setState(state);
  };

  fetchWeatherData = () => {
    this.darkSkyApi.loadItAll(null, this.state.location)
      .then(apiData => {
        this.setWeatherData(apiData);
      }).catch((error) => {
        console.log(error);
    });
  };

  setWeatherData = apiData => {
    const units = this.units[apiData.flags.units];

    const currently = this.formatWeatherData(apiData.currently, "currently", units);
    for (let i = 0; i < 24; i += 3) {
      currently.hourly.push(this.formatWeatherData(apiData.hourly.data[i], "hourly", units));
    }

    const daily = [];
    apiData.daily.data.forEach(dailyData => {
      daily.push(this.formatWeatherData(dailyData, "daily", units));
    });

    const weather = {
      ...this.state.weather,
      dataLoaded: true,
      data: {
        ...this.state.weather.data,
        units: units,
        currently: currently,
        daily: daily
      }
    };
    this.setState({
      weather: weather
    })
  };

  formatWeatherData = (data, type, units)  => {
    const formatted = {
      details: {
        summary: data.summary,
        icon: data.icon,
        precipitation: Math.round(data.precipProbability * 100).toString() + "%",
        humidity: Math.round(data.humidity * 100).toString() + "%",
        windSpeed: Math.round(data.windSpeed) + " " + units.windSpeed,
      },
      short: {
        icon: data.icon
      },
      raw: {
        precipitation: data.precipProbability,
        windSpeed: data.windSpeed,
      }
    };

    if (type === "currently" || type === "hourly") {
      formatted.time = moment.unix(data.time).format(units.dateTime);
      formatted.details.temperature = Math.round(data.temperature).toString() + " " + units.temperature;
      formatted.short.temperature = Math.round(data.temperature).toString() + " " + units.temperature;
      formatted.short.time = moment.unix(data.time).format(units.time);
      formatted.raw.temperature = data.temperature;
    } else if (type === "daily") {
      formatted.time = moment.unix(data.time).format(units.date);
      formatted.details.temperature = Math.round(data.temperatureHigh).toString() + " " + units.temperature;
      formatted.short.temperature = Math.round(data.temperatureHigh).toString() + " " + units.temperature;
      formatted.short.time = moment.unix(data.time).format(units.dateShort);
      formatted.raw.temperature = data.temperatureHigh;
    }

    if (type === "currently" || type === "daily") {
      formatted.hourly = [];
    }

    if (type === "daily" && data.icon === "partly-cloudy-night") {
      formatted.details.icon = "clear-day";
      formatted.short.icon = "clear-day";
    }

    return formatted;
  };

  fetchHourlyWeatherData = (dayIndex) => {
    const dateTime = this.state.weather.data.daily[dayIndex].dateTime;
    DarkSkyApi.loadTime(dateTime, this.state.location)
      .then(result => console.log(result));
  };

  constructor(props) {
    super(props);

    /* Google Places API */
    this.googlePlacesApiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || null;
    if (!this.googlePlacesApiKey) {
      throw new Error('Google Places API Key not defined.');
    }

    /* DarkSky API */
    this.darkSkyApiKey = process.env.REACT_APP_DARKSKY_API_KEY || null;
    if (!this.darkSkyApiKey) {
      throw new Error('DarkSky API Key not defined.');
    }
    this.darkSkyApi.apiKey = this.darkSkyApiKey;
    this.darkSkyApi.setUnits('auto');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.location !== this.state.location && this.state.location.latitude && this.state.location.longitude) {
      this.fetchWeatherData();
    }

    if (prevState.weather.selectedDay !== this.state.weather.selectedDay && this.state.weather.selectedDay) {
      // TODO: Fetch hourly data
    }
  }

  render() {
    let weather = null;
    if (this.state.weather.dataLoaded) {
      weather = <Weather {...this.state.weather}/>;
    }

    return (
      <DocumentTitle title="React Weather App">
        <div className="App">
          <Search
            search={this.state.input.search}
            value={this.state.input.value}
            inputChange={this.handleInputChange}
            selectSuggest={this.handleSelectSuggest}
            googlePlacesApiKey={this.googlePlacesApiKey}
          />
          {weather}
        </div>
      </DocumentTitle>
    );
  }
}

export default App;
