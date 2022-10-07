import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import TextField from '@material-ui/core/TextField';

export default class RevisionPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            issuer_date: null,
            issuer_designation: null,
            issuer_draw: null,
            issuer_check: null,
            issuer_appr: null,
            revision: null,
            dateText: null,
            button: null
        }

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    async componentDidMount(){
        
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/revision/"+this.props.fileName, options)
        .then(response => response.json())
        .then(async json => {
            await this.setState({
                revision: json.rows.revision,
                issuer_date: json.rows.issuer_date,
                issuer_designation: json.rows.issuer_designation,
                issuer_draw: json.rows.issuer_draw,
                issuer_check: json.rows.issuer_check,
                issuer_appr: json.rows.issuer_appr
            })
            let d = null
            if(this.state.issuer_date){
                d = this.state.issuer_date
                let date = new Date(d) 
                d = date.toISOString().substr(0,10)
                await this.setState({dateText: d})
            }else{
                let today = new Date()
                today = today.getFullYear() + "-" + today.toLocaleString("en-US", { month: "2-digit" }) + "-" + today.toLocaleString("en-US", { day: "2-digit" })
                await this.setState({dateText: today})
            }
        }) 
    
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevProps.issuer_appr !== this.props.issuer_appr || prevProps.issuer_date !== this.props.issuer_date || prevProps.issuer_designation !== this.props.issuer_designation || prevProps.issuer_draw !== this.props.issuer_draw || prevProps.issuer_check !== this.props.issuer_check){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }
            
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/revision/"+this.props.fileName, options)
            .then(response => response.json())
            .then(async json => {
                await this.setState({
                    revision: json.rows.revision,
                    issuer_date: json.issuer_date,
                    issuer_designation: json.issuer_designation,
                    issuer_draw: json.issuer_draw,
                    issuer_check: json.issuer_check,
                    issuer_appr: json.issuer_appr
                })

                let d = null
                if(this.state.issuer_date){
                    d = this.state.issuer_date
                    let date = new Date(d) 
                    d = date.toISOString().substr(0,10)
                    await this.setState({dateText: d})
                }else{
                    let today = new Date()
                    today = today.getFullYear() + "-" + today.toLocaleString("en-US", { month: "2-digit" }) + "-" + today.toLocaleString("en-US", { day: "2-digit" })
                    await this.setState({dateText: today})
                }
                }) 
        }
    
    }

    async openModal() {

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/revision/"+this.props.fileName, options)
        .then(response => response.json())
        .then(async json => {
            await this.setState({
                revision: json.rows.revision,
                issuer_date: json.rows.issuer_date,
                issuer_designation: json.rows.issuer_designation,
                issuer_draw: json.rows.issuer_draw,
                issuer_check: json.rows.issuer_check,
                issuer_appr: json.rows.issuer_appr
            })

            let d = null
            if(this.state.issuer_date){
                d = this.state.issuer_date
                let date = new Date(d) 
                d = date.toISOString().substr(0,10)
                await this.setState({dateText: d})
            }else{
                let today = new Date()
                today = today.getFullYear() + "-" + today.toLocaleString("en-US", { month: "2-digit" }) + "-" + today.toLocaleString("en-US", { day: "2-digit" })
                await this.setState({dateText: today})
            }
        }) 

        await this.setState({
            visible : true,
        });
    }

    async closeModal() {
        await this.setState({
            visible : false,
        });
    }

    async request(){  

        let newdate = new Date()
        if(this.state.issuer_date){
            newdate = this.state.issuer_date
        }
        
        const body ={
            fileName: this.props.fileName,
            issuer_date: newdate,
            issuer_designation: this.state.issuer_designation,
            issuer_draw: this.state.issuer_draw,
            issuer_check: this.state.issuer_check,
            issuer_appr: this.state.issuer_appr
        }

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitRevision", options)
            .then(response => response.json())
            .then(json => {
                if(json.success){
                    this.props.successRequest()
                }
            })
        options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/revision/"+this.props.fileName, options)
        .then(response => response.json())
        .then(async json => {
            await this.setState({
                revision: json.rows.revision,
                issuer_date: json.rows.issuer_date,
                issuer_designation: json.rows.issuer_designation,
                issuer_draw: json.rows.issuer_draw,
                issuer_check: json.rows.issuer_check,
                issuer_appr: json.rows.issuer_appr
            })

            if(this.state.issuer_date && this.state.issuer_designation && this.state.issuer_draw && this.state.issuer_check && this.state.issuer_appr){
                await this.setState({button:  <input type="button"  value="REV" id="date" name="date" className="btn btn-success"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", borderColor:"#B0E0E6", width:"40px", float:"left", marginRight: "5px", marginTop:"3px"}} onClick={() => this.openModal()} /> })
            }else{
                await this.setState({button :<input type="button" id="date" name="date" value="REV" className="btn btn-danger"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", borderColor:"#B0E0E6", width:"40px", float:"left", marginRight: "5px", marginTop:"3px"}} onClick={() => this.openModal()} /> })
            }
            
        }) 
        this.closeModal()
    
    }

     async handleDateChange (event) {
        let d = event.target.value
        this.setState({issuer_date: d})
      }

    render() {      
        
        let button = this.state.button
        let datafield
        let today = new Date()
        today = today.getFullYear() + "-" + today.toLocaleString("en-US", { month: "2-digit" }) + "-" + today.toLocaleString("en-US", { day: "2-digit" })
        
        if(this.state.issuer_date && this.state.issuer_designation && this.state.issuer_draw && this.state.issuer_check && this.state.issuer_appr){
            
            button = <input type="button"  value="REV" id="date" name="date" className="btn btn-success"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", borderColor:"#B0E0E6", width:"40px", float:"left", marginRight: "5px", marginTop:"3px"}} onClick={() => this.openModal()} />  
            
            datafield = <TextField
            onChange={this.handleDateChange}
            id="date"
            type="date"
            defaultValue= {today}
            InputLabelProps={{
            shrink: true,
            }}
        />
        }else{
            datafield = <TextField
            onChange={this.handleDateChange}
            id="date"
            type="date"
            defaultValue= {today}
            InputLabelProps={{
            shrink: true,
            }}
            />
            button = <input type="button" id="date" name="date" value="REV" className="btn btn-danger"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", borderColor:"#B0E0E6", width:"40px", float:"left", marginRight: "5px", marginTop:"3px"}} onClick={() => this.openModal()} />
        }

        let def_designation, def_draw, def_check, def_aprr
        if(this.state.issuer_designation){
            def_designation = this.state.issuer_designation
        }else{
            def_designation = "IFC"
            this.setState({issuer_designation: "IFC"})
        }

        if(this.state.issuer_draw){
            def_draw = this.state.issuer_draw
        }else{
            def_draw = "ARC"
            this.setState({issuer_draw: "ARC"})
        }

        if(this.state.issuer_check){
            def_check = this.state.issuer_check
        }else{
            def_check = "GMP"
            this.setState({issuer_check: "GMP"})
        }

        if(this.state.issuer_appr){
            def_aprr = this.state.issuer_appr
        }else{
            def_aprr = "MGR"
            this.setState({issuer_appr: "MGR"})
        }
            
        
        return (
            
            <div style={{marginRight:"5px", float:"right"}}>
                {button}
                <div>
                    <Modal visible={this.state.visible} width="650" height="460" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <center className="popUp__title" style={{marginBottom: "30px"}}><h3>{this.props.fileName.split('.').slice(0, -1)} R{this.state.revision}*</h3></center>
                        <div className="request__container" style={{width: "400px"}}>   
                            <label for="date" style={{marginRight:"10px", marginLeft:"27px", marginTop:"15px"}}>Date: </label>
                            {datafield}
                            <div>
                                <label for="issuer_designation">Designation: </label>     
                                <input type="text" placeholder="Designation" id="issuer_designation" name="issuer_designation" className="popUp__input__text" ref="issuer_designation" style={{marginBottom: "20px", color:'black'}} defaultValue={def_designation} onChange={(e) => this.setState({issuer_designation: e.target.value})} ></input>
                            </div>
                            <div style={{marginLeft:"55px"}}>
                                <label for="issuer_designation">Draw: </label>    
                                <input type="text" placeholder="Draw" id="issuer_draw" className="popUp__input__text" ref="issuer_draw" style={{marginBottom: "20px", color:'black'}} defaultValue={def_draw} onChange={(e) => this.setState({issuer_draw: e.target.value})} ></input>
                            </div>
                            <div style={{marginLeft:"49px"}}>
                                <label for="issuer_designation">Check: </label>    
                                <input type="text" placeholder="Check" id="issuer_check" className="popUp__input__text" ref="issuer_check" style={{marginBottom: "20px", color:'black'}} defaultValue={def_check} onChange={(e) => this.setState({issuer_check: e.target.value})} ></input>
                            </div>
                            <div style={{marginLeft:"24px", marginBottom:"20px"}}>
                                <label for="issuer_designation">Approval: </label>    
                                <input type="text" placeholder="Approval" id="issuer_appr" className="popUp__input__text" ref="issuer_appr" style={{marginBottom: "20px", color:'black'}} defaultValue={def_aprr} onChange={(e) => this.setState({issuer_appr: e.target.value})} ></input>
                            </div>
                           <button class="btn btn-sm btn-success" onClick={() => this.request()} style={{marginRight:"5px", fontSize:"16px"}}>Submit</button>
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}