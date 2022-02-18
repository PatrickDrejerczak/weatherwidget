import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [dataFuture, setDataFuture] = useState({});
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [show, setShow] = React.useState(false)
  const [showForecast, setShowForecast] = React.useState(false)
  const [backgroundImage, setBackgroundImage] = useState("https://i.ibb.co/M6BDkJD/sunset.jpg")
  
   function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min+1)+min);
  }
  


  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;
  const backgroundUrl = `https://api.unsplash.com/search/photos?page=1&per_page=30&query=${location}&client_id=1F_fwjRlJCIgys0N8chJ_ZWZFjFRewpC7e0SL07VUEI`;
  const urlFuture = useMemo(
    () =>
      lat && lon
        ? `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&units=metric&appid=895284fb2d2c50a520ea537456963d9c`
        : null,
    [lat, lon]
  );

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        setLat(response.data.coord.lat);
        setLon(response.data.coord.lon);
        setShowForecast(true)
        setShow(false)      
        axios.get(backgroundUrl).then((response) => {
        setBackgroundImage(response.data.results[randomNumber(1, 30)].urls.regular)
        console.log(response.data.results[3].urls.regular)
      })
      });
      setLocation("");

    }
  };


  const searchFuture = useCallback(() => {
    if (!urlFuture) {
      return;
    }
    

    axios.get(urlFuture).then((response) => {
      setDataFuture(response.data);
      console.log(response.data);
      setShow(true)
    });
  }, [urlFuture]);

 

  return (
    <div className="app" 
    style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center"

      }}>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
            {data.weather ? (
              <p>
                <img
                  src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt="weather"
                />
              </p>
            ) : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">{data.main.feels_like.toFixed()}°C</p>
              ) : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? (
                <p className="bold">{data.wind.speed.toFixed()} MPH</p>
              ) : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
        <div className="searchFuture" >
        {
         showForecast?           <button type="button" onClick={searchFuture} className="forecast">
            Fetch Hourly Forecast
          </button>: null
        
        }
</div>
        <div className="future">
        {
          show? <Table bordered>
            <thead>
              <tr>
                <th>1 hour</th>
                <th>2 hours</th>
                <th>3 hours</th>
                <th>4 hours</th>
                <th>5 hours</th>
                <th>6 hours</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {dataFuture.hourly ? (
                    <p>{dataFuture.hourly[0].temp.toFixed()}°C</p>
                  ) : null}
                </td>
                <td>
                  {dataFuture.hourly ? (
                    <p>{dataFuture.hourly[1].temp.toFixed()}°C</p>
                  ) : null}
                </td>
                <td>
                  {dataFuture.hourly ? (
                    <p>{dataFuture.hourly[2].temp.toFixed()}°C</p>
                  ) : null}
                </td>
                <td>
                  {dataFuture.hourly ? (
                    <p>{dataFuture.hourly[3].temp.toFixed()}°C</p>
                  ) : null}
                </td>
                <td>
                  {dataFuture.hourly ? (
                    <p>{dataFuture.hourly[4].temp.toFixed()}°C</p>
                  ) : null}
                </td>
                <td>
                  {dataFuture.hourly ? (
                    <p>{dataFuture.hourly[5].temp.toFixed()}°C</p>
                  ) : null}
                </td>
              </tr>
            </tbody>
          </Table> :null}
        </div>
      </div>
    </div>
  );
}





export default App;
