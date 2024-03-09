import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import serachIcon from "../assets/search.png";
import cloudIcon from "../assets/cloud.png";
import humditityIcon from "../assets/humidity.png";
import windIcon from "../assets/wind.png";
import clearIcon from "../assets/clear.png";
import drizzleIcon from "../assets/drizzle.png";
import rainIcon from "../assets/rain.png";
import { SAMPLE } from "./constants";
import { ToastContainer, toast } from "react-toastify";

function Weather() {
  const [location, setLocation] = useState();
  const [humidity, setHumidity] = useState("");
  const [windRate, setWindRate] = useState("");
  const [temp, setTemp] = useState("");
  const [locationTxt, setLocationTxt] = useState("");

  const [weatherIcon, setWeatherIcon] = useState(cloudIcon);
  const [loading, setLoading] = useState(false);

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

  const fetchWeatherApi = async () => {
    setLoading(true);
    console.log("location=========> ", location);
    // const options = { method: "GET", headers: { accept: "application/json" } };
    let url = "";
    if (location) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    } else if (userLocation?.longitude && userLocation?.latitude) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}&units=metric`;
    }
    if (url) {
      try {
        //   const response = await fetch(url);
        const data = SAMPLE; //await response.json();

        setHumidity(data?.main?.humidity);
        setWindRate(Math.floor(data?.wind?.speed));
        setTemp(Math.floor(data?.main?.temp));
        setLocationTxt(data?.name);
        if (data?.weather?.length > 0) {
          setWeatherIconFunction(data.weather[0]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("API error", error);
      }
    } else {
      toast.error("Please enter valid user location");
    }
  };

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

  useEffect(() => {
    if (userLocation?.longitude && userLocation?.latitude) {
      fetchWeatherApi();
    }
  }, [userLocation]);

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* <button onClick={getUserLocation}>Get User Location</button>
      {userLocation && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      )} */}
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
