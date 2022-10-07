import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


  export default class FeedProgressPlot extends React.PureComponent { //Grafica de progreso del feed de isocontrol
	
	state = {
		data: []
	  };

	async componentDidMount (){

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}

		//Get datos del progreso del feed
		await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/gfeed", options)
		.then(response => response.json())
		.then(async json=>{
			let weeks = []
            if(json.rows){
                for(let i = 0; i < json.rows.length; i++){ //Por cada semana
					//Creamos el punto en la grafica
                    weeks.push({name: "D"+json.rows[i].id + "(" + (json.rows[i].progress/json.rows[i].max_progress*100).toFixed(2) + "%)", current_weight: json.rows[i].progress, max_weight: json.rows[i].max_progress, forecast: (json.rows[i].max_progress/100)*json.rows[i].estimated})
                }
                await this.setState({data: weeks})
            }		
		})
	}
	

	render() {
	  return (
		<ResponsiveContainer width="100%" height="90%">
		  <LineChart
			width={500}
			height={400}
			data={this.state.data}
			margin={{
			  top: 35,
			  right: 30,
			  left: 20,
			  bottom: -15,
			}}
		  >
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis label={{ value: "Weight", position: "insideLeft", angle: -90,   dy: 30}} />
			<Tooltip/>
			<Legend />
			<Line type="monotone" dataKey="current_weight" stroke="blue" activeDot={{ r: 8 }}/>
			<Line type="monotone" dataKey="max_weight" stroke="red"/>
			<Line type="monotone" dataKey="forecast" stroke="green"/>
		  </LineChart>
		</ResponsiveContainer>
	  );
	}
  }
  