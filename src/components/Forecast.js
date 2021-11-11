import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Card, Col, Row } from "antd";

import { API_KEY } from "./config";

// this is the child component
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Returns names of today thru next 5 days.
function get5Days() {
  const d = new Date();
  let currentDay = d.getDay(); // index, i.e. 4
  const days = [];
  let cnt = 0;

  while (cnt < 6) {
    if (currentDay === 7) {
      currentDay = 0;
    }

    days.push(weekDays[currentDay]);
    currentDay++;
    cnt++;
  }
  return days;
}

function Forecast() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("Arcata");
  const [city, setCity] = useState("Arcata");

  //This updates change from the city. A hook for the callback.
  const loadData = useCallback(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          //
          if (result.cod === "404") {
            setError(result);
            return;
          }
          //To get 5 days, and choosing midday to display. (May need to utililize UTC)
          const days = [
            result.list[5],
            result.list[13],
            result.list[21],
            result.list[29],
            result.list[37],
          ];

          // result.list.splice(5); // dont want all 8 days
          setItems(days);

          // console.log(result);
          setIsLoaded(true);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [city]); // <------This is a state hook, and what causes the callback to execute.

  // for initialization, loads in data on page load.
  // this is a critical hook that prevents an infinite loop if just calling loadData alone.
  // useEffect called when component mounts, and here is called one time.
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  useEffect(() => {
    loadData();
  }, [loadData]); // this works the same without the dep, but will issue a warning.

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <section>
          <Input
            className="input-city"
            placeholder="Enter City"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => setCity(e.target.value)}
          />
          <Button type="primary" onClick={(e) => setCity(input)}>
            Submit
          </Button>
        </section>
        <div
          className="site-layout-content"
          style={{ minHeight: 380, marginLeft: "15vw", paddingBottom: "15%" }}
        >
          <br />
          <Row gutter={8}>
            {items.map((item, index) => (
              <Col xs={24} lg={4} key={index}>
                <Card title={get5Days()[index]} bordered={true}>
                  <section>
                    <img
                      src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={`weather icon displayed`}
                    />
                    <h3>{item.weather[0].description}</h3>
                    <div>High | {item.main.temp_max}°</div>
                    <div>Low | {item.main.temp_min}°</div>
                    <div>Current | {item.main.temp}°</div>
                    <div>💧 Humidity {item.main.humidity}%</div>
                    <div>🌬{item.wind.speed}MPH</div>
                  </section>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  }
}

export default Forecast;
