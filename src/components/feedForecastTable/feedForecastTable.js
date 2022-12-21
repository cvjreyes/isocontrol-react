import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import "./feedForecastTable.css";

// Toni:
// - convertir a componente funcional ✔
// - testear afterChange de HotTable

// dia 15 feed + ifd
// propuesta sean:
// - funcionalidad
// - optimizar feed + ifd
// +15 días + plan con sean

export default function FeedForecastTable(props) {
  const [estimated, setEstimated] = useState({});
  const [days, setDays] = useState({});
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        //Get de los datos del feed
        const res = await fetch(
          `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/getFeedForecast`,
          options
        );
        const { forecast } = await res.json();
        let f = {}; //Diccionario dia-estimacion
        let d = []; //Array de labels
        let forecastObj = {};

        for (let i = 0; i < forecast.length; i++) {
          f["D" + forecast[i].day] = forecast[i].estimated;
          d.push("D" + forecast[i].day);
          forecastObj["D" + forecast[i].day] = forecast[i].forecast;
        }
        setEstimated(f);
        setDays(d);
        setForecast(forecastObj);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  const addDay = async () => {
    if (!estimated[days[days.length - 1]]) return;
    //Para añadir un nuevo dia al forecast
    let tempEstimated = estimated;
    tempEstimated["D" + (days.length + 1)] = ""; //Nuevo elemento en el diccionario
    setEstimated(tempEstimated);

    let tempDays = days;
    tempDays.push("D" + (days.length + 1)); //Nueva label
    setDays({ ...tempDays });
  };

  const submitChanges = async () => {
    const invalidNum1 = Object.values(estimated).some(
      (item) => !item || isNaN(item) || Number(item) > 100 || Number(item) < 0
    );
    const invalidNum2 = Object.values(forecast).some(
      (item) => isNaN(item) || Number(item) > 100 || Number(item) < 0
    );
    if (invalidNum1 || invalidNum2)
      return props.alert("Invalid number", "warning");
    const body = {
      estimated: estimated,
      forecast: forecast,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    //Post del forecast
    try {
      const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/submitFeedForecast`;
      const res = await fetch(url, options);
      const { success } = await res.json();
      if (success) {
        props.alert("Changes saved!", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const settings = {
    licenseKey: "non-commercial-and-evaluation",
    colWidths: 40,
    rowHeaderWidth: 190,
  };

  return (
    <div className="feed__forecast_container">
      <HotTable
        data={[estimated, forecast]}
        colHeaders={Object.keys(estimated)}
        rowHeaders={["Estimated (%)", "Forecast (%)"]}
        width="1550"
        height="160"
        settings={settings}
        manualColumnResize={true}
        manualRowResize={true}
        filters={true}
        className="mat1-table"
      />
      <div>
        <button
          class="btn btn-sm btn-info"
          onClick={() => addDay()}
          style={{
            marginLeft: "570px",
            marginRight: "25px",
            fontSize: "16px",
            width: "160px",
            borderRadius: "10px",
          }}
          disabled={!estimated[days[days.length - 1]]}
        >
          Add
        </button>
        <button
          class="btn btn-sm btn-success"
          onClick={() => submitChanges()}
          style={{
            marginRight: "5px",
            fontSize: "16px",
            width: "160px",
            borderRadius: "10px",
          }}
          // disabled={Object.values(estimated).some(item => Number(item) > 100 || Number(item) < 0)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
