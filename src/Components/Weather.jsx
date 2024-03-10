import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import cloudIcon from "../assets/cloud.png";
import humditityIcon from "../assets/humidity.png";
import windIcon from "../assets/wind.png";
import clearIcon from "../assets/clear.png";
import drizzleIcon from "../assets/drizzle.png";
import rainIcon from "../assets/rain.png";
import { ToastContainer, toast } from "react-toastify";

function Weather() {
  const [location, setLocation] = useState();
  const [humidity, setHumidity] = useState("");
  const [windRate, setWindRate] = useState("");
  const [temp, setTemp] = useState("");
  const [locationTxt, setLocationTxt] = useState("");

  const [weatherIcon, setWeatherIcon] = useState(cloudIcon);
  const [loading, setLoading] = useState(false);
// api key of open weather map
  const apiKey = "af68d200fb55816225a7854a76698c7a";

  const [userLocation, setUserLocation] = useState(null);

  // define the function that finds the users geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error("Error getting your current location");
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      toast.error("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // define the function that finds weather info based on location/ longitude & latitude
  const fetchWeatherApi = async () => {
    // show loading
    setLoading(true);

    // define url based on location/ longitude & latitude
    let url = "";
    if (location) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    } else if (userLocation?.longitude && userLocation?.latitude) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}&units=metric`;
    }
    if (url) {
      try {
        const response = await fetch(url);
        const data = await response.json();

        // showing toast suppose if user given city name is invalid
        if (data?.cod && data?.message) {
          toast.error(data?.message);
        }

        // Update the UI with weather API response data
        if (data?.id) {
          setHumidity(data?.main?.humidity);
          setWindRate(Math.floor(data?.wind?.speed));
          setTemp(Math.floor(data?.main?.temp));
          setLocationTxt(data?.name);
          if (data?.weather?.length > 0) {
            setWeatherIconFunction(data.weather[0]);
          }
        }
        // hide loading
        setLoading(false);
      } catch (error) {
        // hide loading
        setLoading(false);
        console.log("API error", error);

        // showing toast if something went wrong while API fail
        toast.error("Something went wrong");
      }
    } else {
      // showing toast if user given empty location
      toast.error("Please enter valid user location");
    }
  };

  // update weathr icon based on the value return from the API
  const setWeatherIconFunction = (weatherObj) => {
    if (weatherObj.icon === "01d" || weatherObj.icon === "01n") {
      setWeatherIcon(clearIcon);
    } else if (weatherObj.icon === "02d" || weatherObj.icon === "02n") {
      setWeatherIcon(cloudIcon);
    } else if (weatherObj.icon === "03d" || weatherObj.icon === "03n") {
      setWeatherIcon(drizzleIcon);
    } else if (weatherObj.icon === "04d" || weatherObj.icon === "04n") {
      setWeatherIcon(drizzleIcon);
    } else if (weatherObj.icon === "09d" || weatherObj.icon === "09n") {
      setWeatherIcon(rainIcon);
    } else if (weatherObj.icon === "10d" || weatherObj.icon === "10n") {
      setWeatherIcon(rainIcon);
    } else if (weatherObj.icon === "13d" || weatherObj.icon === "13n") {
      setWeatherIcon(snowIcon);
    } else {
      setWeatherIcon(clearIcon);
    }
  };

  // based on geo location finding weather info
  useEffect(() => {
    if (userLocation?.longitude && userLocation?.latitude) {
      fetchWeatherApi();
    }
  }, [userLocation]);

  //to retrieves the users location
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />

      <div className="container">
        <div className="serach-bar d-flex justify-content-center">
          <div className="col-8 d-flex gap-2">
            <input
              type="text"
              placeholder="Search"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div
              className="serach-icon-div d-flex align-items-center justify-content-center"
              onClick={() => fetchWeatherApi()}
            >
              <CiSearch />
              {/* <img src={serachIcon} alt="search" /> */}
            </div>
          </div>
          {loading && (
            <div class="spinner-border text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <div className="weather-img d-flex justify-content-center mt-3">
          <img src={weatherIcon} alt="image" className="weather-icon" />
        </div>
        <div className="weather-temp">{temp}*C</div>
        <div className="weather-location">{locationTxt}</div>
        <div className="data-container">
          <div className="element">
            <img src={humditityIcon} alt="image" className="icon" />
            <div className="data">
              <div className="humiditity">{humidity}% </div>
              <div className="text">Humditity</div>
            </div>
          </div>
          <div className="element">
            <img src={windIcon} alt="image" className="icon" />
            <div className="data">
              <div className="humiditity">{windRate} Km/h</div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Weather;
