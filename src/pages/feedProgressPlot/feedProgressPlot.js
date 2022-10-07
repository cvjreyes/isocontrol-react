import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  export default class FeedProgressPlot extends React.PureComponent {
	
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

		await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/gfeed", options)
		.then(response => response.json())
		.then(async json=>{
			let weeks = []
            if(json.rows){
                for(let i = 0; i < json.rows.length; i++){
                    weeks.push({name: "D"+json.rows[i].id, weight: json.rows[i].progress, max_weight: json.rows[i].max_progress})
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
			<Tooltip />
			<Legend />
			<Line type="monotone" dataKey="weight" stroke="blue" activeDot={{ r: 8 }} />
			<Line type="monotone" dataKey="max_weight" stroke="red" />
		  </LineChart>
		</ResponsiveContainer>
	  );
	}
  }
  