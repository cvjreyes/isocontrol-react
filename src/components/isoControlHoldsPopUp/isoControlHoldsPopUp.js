import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import { HotTable } from '@handsontable/react';
import AlertF from "../../components/alert/alert"

export default class IsoControlHoldsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            content: null,
            tag: this.props.tag,
            holdsBtn: null,
            holdsIsoData: [],
            success: false,
            updateData: this.props.updateData
        }
    }

    async componentDidMount(){
        const tag = this.state.tag
        let content = []

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
    
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllHolds/"+tag, options)
        .then(response => response.json())
        .then(async json => {
            if(json.holds3d.length === 0 && json.holdsIso.length === 0){
                content.push(<text style={{fontSize: "16px", marginLeft:"20px"}}>No 3D holds.</text>)
                this.setState({holdsBtn: <button class="btn" style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"white", borderColor: "black"}} onClick={() => this.openModal()}>HOLDS</button>, holdsIsoData: [{id: null, description: ""}]})
            }else if(json.holds3d.length !== 0 && json.holdsIso.length === 0){
                this.setState({holdsBtn: <button class="btn btn-info" style={{fontSize:"12px", padding:"2px 5px 2px 5px"}} onClick={() => this.openModal()}>HOLDS</button>,  holdsIsoData: [{id: null, description: ""}]})
                let holds = [json.holds3d[0].hold1, json.holds3d[0].hold2, json.holds3d[0].hold3, json.holds3d[0].hold4, json.holds3d[0].hold5, json.holds3d[0].hold6, json.holds3d[0].hold7, json.holds3d[0].hold8, json.holds3d[0].hold9, json.holds3d[0].hold10]
                let descriptions = [json.holds3d[0].description1, json.holds3d[0].description2, json.holds3d[0].description3, json.holds3d[0].description4, json.holds3d[0].description5, json.holds3d[0].description6, json.holds3d[0].description7, json.holds3d[0].description8, json.holds3d[0].description9, json.holds3d[0].description10]  
                for(let i = 0; i < holds.length; i++){
                    if(holds[i]){
                        content.push(<tr className="holds__row">                   
                            <td style={{border: "0.28px solid #D2D2D2", width:"50px", verticalAlign:"middle", textAlign:"center"}}>
                                <p className="holds__hold__text">{holds[i]}</p>
                            </td>
                            <td style={{border: "0.28px solid #D2D2D2", width:"400px", verticalAlign:"middle"}}>
                                <p className="holds__description__text">{descriptions[i]}</p>
                            </td>              
                        </tr>)
                    }
                }
            }else if(json.holds3d.length === 0  && json.holdsIso.length !== 0){
                content.push(<text style={{fontSize: "16px", marginLeft:"20px"}}>No 3D holds.</text>)
                await this.setState({holdsBtn: <button class="btn" style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#FFCA42"}} onClick={() => this.openModal()}>HOLDS</button>})
                let holdsIsoData = []
                for(let i = 0; i < json.holdsIso.length; i++){
                    holdsIsoData.push({id: json.holdsIso[i].id, description: json.holdsIso[i].description})
                }
                await this.setState({holdsIsoData: holdsIsoData})
            }else{
                this.setState({holdsBtn: <button class="btn btn-info" style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#7BD36D"}} onClick={() => this.openModal()}>HOLDS</button>})
                let holds = [json.holds3d[0].hold1, json.holds3d[0].hold2, json.holds3d[0].hold3, json.holds3d[0].hold4, json.holds3d[0].hold5, json.holds3d[0].hold6, json.holds3d[0].hold7, json.holds3d[0].hold8, json.holds3d[0].hold9, json.holds3d[0].hold10]
                let descriptions = [json.holds3d[0].description1, json.holds3d[0].description2, json.holds3d[0].description3, json.holds3d[0].description4, json.holds3d[0].description5, json.holds3d[0].description6, json.holds3d[0].description7, json.holds3d[0].description8, json.holds3d[0].description9, json.holds3d[0].description10]  
                let holdsIsoData = []
                for(let i = 0; i < holds.length; i++){
                    if(holds[i]){
                        content.push(<tr className="holds__row">                   
                            <td style={{border: "0.28px solid #D2D2D2", width:"50px", verticalAlign:"middle", textAlign:"center"}}>
                                <p className="holds__hold__text">{holds[i]}</p>
                            </td>
                            <td style={{border: "0.28px solid #D2D2D2", width:"400px", verticalAlign:"middle"}}>
                                <p className="holds__description__text">{descriptions[i]}</p>
                            </td>              
                        </tr>)
                    }
                }
                for(let i = 0; i < json.holdsIso.length; i++){
                    holdsIsoData.push({id: json.holdsIso[i].id, description: json.holdsIso[i].description})
                }
                await this.setState({holdsIsoData: holdsIsoData})
            }
            await this.setState({
                content: content
            });
        })
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            const tag = this.state.tag
        let content = []

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
    
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAllHolds/"+tag, options)
        .then(response => response.json())
        .then(async json => {
            if(json.holds3d.length === 0 && json.holdsIso.length === 0){
                content.push(<text style={{fontSize: "16px", marginLeft:"20px"}}>No 3D holds.</text>)
                this.setState({holdsBtn: <button class="btn" style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"white", borderColor: "black"}} onClick={() => this.openModal()}>HOLDS</button>, holdsIsoData: [{id: null, description: ""}]})
            }else if(json.holds3d.length !== 0 && json.holdsIso.length === 0){
                this.setState({holdsBtn: <button class="btn btn-info" style={{fontSize:"12px", padding:"2px 5px 2px 5px"}} onClick={() => this.openModal()}>HOLDS</button>,  holdsIsoData: [{id: null, description: ""}]})
                let holds = [json.holds3d[0].hold1, json.holds3d[0].hold2, json.holds3d[0].hold3, json.holds3d[0].hold4, json.holds3d[0].hold5, json.holds3d[0].hold6, json.holds3d[0].hold7, json.holds3d[0].hold8, json.holds3d[0].hold9, json.holds3d[0].hold10]
                let descriptions = [json.holds3d[0].description1, json.holds3d[0].description2, json.holds3d[0].description3, json.holds3d[0].description4, json.holds3d[0].description5, json.holds3d[0].description6, json.holds3d[0].description7, json.holds3d[0].description8, json.holds3d[0].description9, json.holds3d[0].description10]  
                for(let i = 0; i < holds.length; i++){
                    if(holds[i]){
                        content.push(<tr className="holds__row">                   
                            <td style={{border: "0.28px solid #D2D2D2", width:"50px", verticalAlign:"middle", textAlign:"center"}}>
                                <p className="holds__hold__text">{holds[i]}</p>
                            </td>
                            <td style={{border: "0.28px solid #D2D2D2", width:"400px", verticalAlign:"middle"}}>
                                <p className="holds__description__text">{descriptions[i]}</p>
                            </td>              
                        </tr>)
                    }
                }
            }else if(json.holds3d.length === 0  && json.holdsIso.length !== 0){
                content.push(<text style={{fontSize: "16px", marginLeft:"20px"}}>No 3D holds.</text>)
                await this.setState({holdsBtn: <button class="btn" style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#FFCA42"}} onClick={() => this.openModal()}>HOLDS</button>})
                let holdsIsoData = []
                for(let i = 0; i < json.holdsIso.length; i++){
                    holdsIsoData.push({id: json.holdsIso[i].id, description: json.holdsIso[i].description})
                }
                await this.setState({holdsIsoData: holdsIsoData})
            }else{
                this.setState({holdsBtn: <button class="btn btn-info" style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#7BD36D"}} onClick={() => this.openModal()}>HOLDS</button>})
                let holds = [json.holds3d[0].hold1, json.holds3d[0].hold2, json.holds3d[0].hold3, json.holds3d[0].hold4, json.holds3d[0].hold5, json.holds3d[0].hold6, json.holds3d[0].hold7, json.holds3d[0].hold8, json.holds3d[0].hold9, json.holds3d[0].hold10]
                let descriptions = [json.holds3d[0].description1, json.holds3d[0].description2, json.holds3d[0].description3, json.holds3d[0].description4, json.holds3d[0].description5, json.holds3d[0].description6, json.holds3d[0].description7, json.holds3d[0].description8, json.holds3d[0].description9, json.holds3d[0].description10]  
                let holdsIsoData = []
                for(let i = 0; i < holds.length; i++){
                    if(holds[i]){
                        content.push(<tr className="holds__row">                   
                            <td style={{border: "0.28px solid #D2D2D2", width:"50px", verticalAlign:"middle", textAlign:"center"}}>
                                <p className="holds__hold__text">{holds[i]}</p>
                            </td>
                            <td style={{border: "0.28px solid #D2D2D2", width:"400px", verticalAlign:"middle"}}>
                                <p className="holds__description__text">{descriptions[i]}</p>
                            </td>              
                        </tr>)
                    }
                }
                for(let i = 0; i < json.holdsIso.length; i++){
                    holdsIsoData.push({id: json.holdsIso[i].id, description: json.holdsIso[i].description})
                }
                await this.setState({holdsIsoData: holdsIsoData})
            }
            await this.setState({
                content: content
            });
        })
        }
    }

    openModal() {

        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    addRow(){
        let rows = this.state.holdsIsoData
        rows.push({"id": null, "description": ""})
        this.setState({holdsIsoData: rows})
      }
    
    submitChanges(){
        const body = {
            rows: this.state.holdsIsoData,
            tag: this.state.tag
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/holdsIso", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                this.setState({success: true})
                this.props.update()
            }
        })
        
    }

    render() {

        const progressSettings = {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 400,
            //... other options
          }

        return (
            <div style={{display:"inline-block"}}>
                {this.state.holdsBtn}
                {this.state.updateData}
                <div>
                    <Modal visible={this.state.visible} width="500" height="750" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.success ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({success: false})}
                        >
                        <AlertF type="successPopUp" text="Holds saved!" popUp={true}/>
                    </div>
                    <center className="popUp__title"><h3><strong>{this.props.isoid}</strong></h3></center>
                        <table className="holds__container">
                            <center><h4 style={{fontWeight: "bold"}}>3D Holds</h4></center>
                            {this.state.content}  
                            <center><h4 style={{fontWeight: "bold", marginTop: "10px"}}>IsoControl</h4></center>
                            <div id="hot-app">
                                <HotTable
                                    data={this.state.holdsIsoData}
                                    colHeaders = {["<b>Description</b>"]}
                                    rowHeaders={true}
                                    width="465"
                                    height="300"
                                    settings={progressSettings} 
                                    manualColumnResize={true}
                                    manualRowResize={true}
                                    columns= {[{ data: "description", type:"text"}]}
                                    filters={true}
                                    dropdownMenu= {[
                                        'make_read_only',
                                        '---------',
                                        'alignment',
                                        '---------',
                                        'filter_by_condition',
                                        '---------',
                                        'filter_operators',
                                        '---------',
                                        'filter_by_condition2',
                                        '---------',
                                        'filter_by_value',
                                        '---------',
                                        'filter_action_bar',
                                    ]}
                                />
                                <br></br>
                                
                                <br></br>
                                </div>
                        </table>
                        <div style={{marginLeft:"180px", position: "absolute", bottom: "0"}}>
                            <button class="btn btn-sm btn-info" onClick={() => this.addRow()} style={{marginRight:"5px", fontSize:"16px",width:"60px", borderRadius:"10px", marginBottom: "30px"}}>Add</button>
                            <button class="btn btn-sm btn-success" onClick={() => this.submitChanges()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px", marginBottom: "30px"}}>Save</button>
                        </div>
                                
                    </Modal>
                </div>
            </div>
        );
    }
}