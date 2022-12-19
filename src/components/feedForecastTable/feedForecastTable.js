import React from "react";
import { HotTable } from "@handsontable/react";
import "./feedForecastTable.css";

// - convertir a componente funcional
// - añadir state disabled
// - añadir un useeffect que escuche cambios en state disabled
// - 

export default class FeedForecastTable extends React.PureComponent {
  //Tabla del forecast del feed de isocontrol

  state = {
    estimated: {},
    days: [],
    updated: false,
  };

  async componentDidMount() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Get de los datos del feed
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getFeedForecast",
      options
    )
      .then((response) => response.json())
      .then(async ({ forecast }) => {
        let f = {}; //Diccionario dia-estimacion
        let c = []; //Array de datos
        let d = []; //Array de labels
        let forecastObj = {};

        for (let i = 0; i < forecast.length; i++) {
          f["D" + forecast[i].day] = forecast[i].estimated;
          c.push({ data: "D" + forecast[i].day, type: "numeric" });
          d.push("D" + forecast[i].day);
          forecastObj["D" + forecast[i].day] = forecast[i].forecast;
        }
        const temp = {
          estimated: f,
          days: d,
          forecast: forecastObj,
        };
        this.setState({ ...temp });
      });
  }

  async addDay() {
    console.log(
      "this: ",
      this.state.estimated[this.state.days[this.state.days.length - 1]]
    );
    if (!this.state.estimated[this.state.days[this.state.days.length - 1]])
      return;
    //Para añadir un nuevo dia al forecast
    let estimated = this.state.estimated;
    estimated["D" + (this.state.days.length + 1)] = ""; //Nuevo elemento en el diccionario
    this.setState({ estimated: estimated });

    let days = this.state.days;
    days.push("D" + (this.state.days.length + 1)); //Nueva label
    this.setState({ days: days, updated: !this.state.updated });
  }

  async submitChanges() {
    const invalidNum = Object.values(this.state.estimated).some(item => Number(item) > 100 || Number(item) < 0)
    if (invalidNum) return
    const body = {
      estimated: this.state.estimated,
      forecast: this.state.forecast,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    //Post del forecast
    fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/submitFeedForecast",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          this.props.success();
        }
      })
      .catch((err) => console.error(err));
  }

  render() {
    const settings = {
      licenseKey: "non-commercial-and-evaluation",
      colWidths: 40,
      rowHeaderWidth: 190,
      //... other options
    };
    return (
      <div className="feed__forecast_container">
        {this.state.updated}
        <HotTable
          data={[this.state.estimated, this.state.forecast]}
          colHeaders={this.state.days}
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
            onClick={() => this.addDay()}
            style={{
              marginLeft: "570px",
              marginRight: "25px",
              fontSize: "16px",
              width: "160px",
              borderRadius: "10px",
            }}
            disabled={
              !this.state.estimated[this.state.days[this.state.days.length - 1]]
            }
          >
            Add
          </button>
          <button
            class="btn btn-sm btn-success"
            onClick={() => this.submitChanges()}
            style={{
              marginRight: "5px",
              fontSize: "16px",
              width: "160px",
              borderRadius: "10px",
            }}
            // disabled={Object.values(this.state.estimated).some(item => Number(item) > 100 || Number(item) < 0)}
          >
            Save
          </button>
        </div>
      </div>
    );
  }
}
