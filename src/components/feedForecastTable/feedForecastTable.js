import React from 'react';
import { HotTable } from '@handsontable/react';
import './feedForecastTable.css'

export default class FeedForecastTable extends React.PureComponent { //Tabla del forecast del feed de isocontrol

    state = {
        estimated:{},
        days: [],
        columns: [],
        updated: false
    };

    async componentDidMount (){

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        //Get de los datos del feed
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getFeedForecast", options)
        .then(response => response.json())
        .then(async json => {
            let f = {} //Diccionario dia-estimacion
            let c = [] //Array de datos
            let d = [] //Array de labels

            for(let i = 0; i < json.forecast.length; i++){
                f["D"+json.forecast[i].day] = json.forecast[i].estimated 
                c.push({data: "D"+json.forecast[i].day, type: "numeric"})
                d.push("D" + json.forecast[i].day)
            }
            this.setState({estimated: f, columns: c, days: d})
        })
    }

    async addDay(){ //Para añadir un nuevo dia al forecast

        let estimated = this.state.estimated
        estimated["D" + (this.state.days.length+1)] = "" //Nuevo elemento en el diccionario
        await this.setState({estimated: estimated})

        let columns = this.state.columns 
        columns.push({data: "D" + (this.state.days.length+1), type: "numeric"}) //Nuevo dia para introducir el forecast
        await this.setState({columns: columns})

        let days = this.state.days
        days.push("D" + (this.state.days.length+1)) //Nueva label
        await this.setState({days: days, updated: !this.state.updated})

    }

    async submitChanges(){
        const body ={
            forecast : this.state.estimated,
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        //Post del forecast
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitFeedForecast", options)
              .then(response => response.json())
              .then(async json => {
                if(json.success){
                  this.props.success()
                }
              })
    }

    render() {

        const settings = {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 40,
            rowHeaderWidth: 190
            //... other options
        }
        return (
            <div className='feed__forecast_container'>
                {this.state.updated}
                <HotTable
                    data={this.state.estimated}
                    colHeaders={this.state.days}
                    rowHeaders={["Estimated(%)"]}
                    width="1550"
                    height="160"
                    settings={settings} 
                    manualColumnResize={true}
                    manualRowResize={true}
                    columns= {this.state.columns}
                    filters={true}
                    className="mat1-table"
                />
                <div>
                    <button class="btn btn-sm btn-info" onClick={() => this.addDay()} style={{marginLeft: "570px",marginRight:"25px", fontSize:"16px", width:"160px", borderRadius:"10px"}}>Add</button>
                    <button class="btn btn-sm btn-success" onClick={() => this.submitChanges()} style={{marginRight:"5px", fontSize:"16px", width:"160px", borderRadius:"10px"}}>Save</button>
                </div>
            </div>
        );
    }
}