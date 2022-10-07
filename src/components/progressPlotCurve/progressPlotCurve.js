import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  export default class ProgressPlotCurve extends React.PureComponent {
	static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';
	
	state = {
		data: [],
        pipesWeight: 0,
        instsWeight: 0,
        equisWeight: 0,
        civilsWeight: 0,
        elecsWeight: 0,
        pipesPercentage: 0,
        instsPercentage: 0,
        equisPercentage: 0,
        civilsPercentage: 0,
        elecsPercentage: 0
	  };


	async componentDidMount (){

		const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/currentProgress", options)
            .then(response => response.json())
            .then(async json => {
                await this.setState({pipesWeight: json.weight})
            }
            )
            .catch(error => {
                console.log(error);
            })   

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/equipments/weight", options)
            .then(response => response.json())
            .then(async json => {
                await this.setState({equisWeight: json.weight})
            }
            )
            .catch(error => {
                console.log(error);
            }) 
            
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/civils/weight", options)
            .then(response => response.json())
            .then(async json => {
                await this.setState({civilsWeight: json.weight})
            }
            )
            .catch(error => {
                console.log(error);
            }) 
            
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrumentation/weight", options)
            .then(response => response.json())
            .then(async json => {
                await this.setState({instsWeight: json.weight})
            }
            )
            .catch(error => {
                console.log(error);
            })   

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/electrical/weight", options)
            .then(response => response.json())
            .then(async json => {
                await this.setState({elecsWeight: json.weight})
            }
            )
            .catch(error => {
                console.log(error);
            })    

        await this.setState({
            pipesPercentage: (this.state.pipesWeight/(this.state.pipesWeight + this.state.equisWeight + this.state.instsWeight + this.state.civilsWeight + this.state.elecsWeight)*100),
            equisPercentage: (this.state.equisWeight/(this.state.pipesWeight + this.state.equisWeight + this.state.instsWeight + this.state.civilsWeight + this.state.elecsWeight)*100),
            instsPercentage: (this.state.instsWeight/(this.state.pipesWeight + this.state.equisWeight + this.state.instsWeight + this.state.civilsWeight + this.state.elecsWeight)*100),
            civilsPercentage: (this.state.civilsWeight/(this.state.pipesWeight + this.state.equisWeight + this.state.instsWeight + this.state.civilsWeight + this.state.elecsWeight)*100),
            elecsPercentage: (this.state.elecsWeight/(this.state.pipesWeight + this.state.equisWeight + this.state.instsWeight + this.state.civilsWeight + this.state.elecsWeight)*100)
        })

		await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/gcurve", options)
		.then(response => response.json())
		.then(async json=>{
			let weeks = []
			for(let i = 0; i < json.rows.length; i++){
                
				let progress = (json.rows[i].progress_pipes*(this.state.pipesPercentage/100) + json.rows[i].progress_equis*(this.state.equisPercentage/100) + json.rows[i].progress_insts*(this.state.instsPercentage/100) + json.rows[i].progress_civils*(this.state.civilsPercentage/100) + json.rows[i].progress_elecs*(this.state.elecsPercentage/100)).toFixed(2)
				let estimated = (json.rows[i].estimated_pipes*(this.state.pipesPercentage/100) + json.rows[i].estimated_equis*(this.state.equisPercentage/100) + json.rows[i].estimated_insts*(this.state.instsPercentage/100) + json.rows[i].estimated_civils*(this.state.civilsPercentage/100) + json.rows[i].estimated_elecs*(this.state.elecsPercentage/100)).toFixed(2)
                if(progress <= 0){
                    progress= null
                }
				weeks.push({name: "W"+json.rows[i].week, estimated: estimated, progress: progress})
            }

			await this.setState({data: weeks})
		})
	}
	

	render() {
	  return (
		<ResponsiveContainer width="100%" height="100%">
		  <LineChart
			width={500}
			height={300}
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
  