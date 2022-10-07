import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  export default class ProgressPlotCivils extends React.PureComponent {
	static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';
	
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

		await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/gcivils", options)
		.then(response => response.json())
		.then(async json=>{
			let weeks = []
			for(let i = 0; i < json.rows.length; i++){
				weeks.push({name: "W"+json.rows[i].week, estimated: json.rows[i].estimated, progress: json.rows[i].progress})
			}
			await this.setState({data: weeks})
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
			<YAxis label={{ value: "Progress(%)", position: "insideLeft", angle: -90,   dy: 30}} />
			<Tooltip />
			<Legend />
			<Line type="monotone" dataKey="progress" stroke="blue" activeDot={{ r: 8 }} />
			<Line type="monotone" dataKey="estimated" stroke="red" />
		  </LineChart>
		</ResponsiveContainer>
	  );
	}
  }
  