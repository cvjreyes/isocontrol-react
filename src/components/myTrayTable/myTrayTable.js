import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './myTrayTable.css'
import UploadPopUp from '../uploadPopUp/uploadPopUp';
import { Link } from 'react-router-dom';
import UploadProcInst from '../uploadProcInst/uploadProcInst';
import CommentPopUp from '../commentPopUp/commentPopUp';
import RevisionPopUp from '../revisionPopUp/revisionPopUp';
import ByPassPopUp from '../byPassPopUp/byPassPopUp';


const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';
    
  var secureStorage = new SecureStorage(localStorage, {
      hash: function hash(key) {
          key = CryptoJS.SHA256(key, SECRET_KEY);
  
          return key.toString();
      },
      encrypt: function encrypt(data) {
          data = CryptoJS.AES.encrypt(data, SECRET_KEY);
  
          data = data.toString();
  
          return data;
      },
      decrypt: function decrypt(data) {
          data = CryptoJS.AES.decrypt(data, SECRET_KEY);
  
          data = data.toString(CryptoJS.enc.Utf8);
  
          return data;
      }
  });

class MyTrayTable extends React.Component{
    state = {
      searchText: '',
      searchedColumn: '',
      data: [],
      displayData: [],
      filterData: ["", "", "", "", "", ""],
      role: secureStorage.getItem("role"),
      user: secureStorage.getItem("user"),
      tab: this.props.currentTab,
      selectedRows: [],
      selectedRowsKeys: [],
      updateData: this.props.updateData,
      popup: false,
      filters: []
    };

  updateData() {
    this.setState({data : []})
    this.props.updateD()
  }

  success(){
    //this.props.successAlert()
  }

  creatByPass(type, notes, id){
    this.props.createByPass(type, notes, id)
  }

  getMaster(fileName){
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/pdf"
      }
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getMaster/"+fileName, options)
    .then(res => res.blob())
    .then(response => {
      const file = new Blob([response], {
        type: "application/pdf"
      });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      let w = window.open(fileURL);

        w.addEventListener("load", function() {
          setTimeout(()=> w.document.title = fileName
          , 300);


        });

        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;

        // it forces the name of the downloaded file
        fileLink.download = fileName;

        // triggers the click event
        fileLink.click();


    })
    .catch(error => {
      console.log(error);
    });
  }

  async componentDidMount(){

    const bodyUsername = {
      email: secureStorage.getItem("user")
    }
    const optionsUsername = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyUsername)
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/findByEmail", optionsUsername)
    .then(response => response.json())
    .then(json => {
      this.setState({
        username: json.name
      })
    })
    

    const body ={
      currentRole : this.state.role,
      currentUser: this.state.user
    }
    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/myTrayFiles/myFiles", options)
        .then(response => response.json())
        .then(async json => {
            var rows = []
            var row = null;
            let pButton, iButton, fButton, rButton, bButton, cButton, revButton = null;

            for(let i = 0; i < json.rows.length; i++){
              if(this.state.role === "Design" || this.state.role === "DesignLead" || this.state.role === "Issuer" || this.state.role === "SpecialityLead"){
                switch(json.rows[i].spo){
                  case 0:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 1:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 2:
                    pButton = <button className="btn btn-success" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break; 
                  case 3:
                    pButton = <button className="btn btn-danger" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 4:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 5:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  default:  
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>      
                }
                switch(json.rows[i].sit){
                  case 0:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 1:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 2:
                    iButton = <button className="btn btn-success" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break; 
                  case 3:
                    iButton = <button className="btn btn-danger" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 4:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 5:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  default:  
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>      
                }
              }else{
                switch(json.rows[i].spo){
                  case 0:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 1:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 2:
                    pButton = <button className="btn btn-success" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break; 
                  case 3:
                    pButton = <button className="btn btn-danger" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 4:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  case 5:
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                    break;
                  default:  
                    pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>      
                }
                switch(json.rows[i].sit){
                  case 0:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 1:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 2:
                    iButton = <button className="btn btn-success" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break; 
                  case 3:
                    iButton = <button className="btn btn-danger" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 4:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  case 5:
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                    break;
                  default:  
                    iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>      
                }
              }
              if(this.state.role !== "SpecialityLead"){
              switch(json.rows[i].forced){
                case 1:
                  fButton = <button className="btn btn-danger" disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>F</button>
                  break;
                default:
                  fButton = null
                  break;
              }
              if(json.rows[i].returned === 1){
                rButton = <button className="btn btn-danger" disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>R</button>
              }else{
                rButton = null
              }
           }

              if(json.rows[i].blocked === 1){
                pButton = null
                iButton = null
                bButton = <button className="btn btn-danger" disabled style={{backgroundColor:"red", fontSize:"12px", borderColor:"red", padding:"2px 5px 2px 5px", marginRight:"5px"}}>LOCKED</button>
              }else{
                bButton = null
              }

              if(json.rows[i].comments){
                cButton = <CommentPopUp comments={json.rows[i].comments} filename={json.rows[i].filename} updated={json.rows[i].updated_at}/>
              }else{
                cButton = null
              }

              if(this.state.role === "Issuer" && process.env.REACT_APP_PROGRESS === "1" && process.env.REACT_APP_ISSUER === "1"){
                revButton = <RevisionPopUp fileName={json.rows[i].filename}  successRequest={this.success}/>
              }

              if(process.env.REACT_APP_IFC === "1"){
                if(!json.rows[i].updated_at){
                  row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: "None", revision: "R" + json.rows[i].revision + "*", date: "None", from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} currentUser = {this.state.user} role={this.state.role} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                }else{
                if(secureStorage.getItem("role") === "Process" ||secureStorage.getItem("role") === "Instrument"){
                  row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} currentUser = {this.state.user} role={this.state.role} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                }else{
                  if(json.rows[i].verifydesign === 1 && json.rows[i].role === secureStorage.getItem("role")){
                    if (secureStorage.getItem("role") === "Design" || secureStorage.getItem("role") === "DesignLead" || secureStorage.getItem("role") === "Issuer"){
                      row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><button className="btn btn-warning" onClick={() => this.props.cancelVerifyClick(json.rows[i].filename)} style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"120px", marginRight: "5px"}}>CANCEL VERIFY</button> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>} 
                    }else{
                      row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><button className="btn btn-warning" onClick={() => this.props.cancelVerifyClick(json.rows[i].filename)} style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"120px", marginRight: "5px"}}>CANCEL VERIFY</button> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                    }
                  }else{
                    row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadPopUp id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} role={this.state.role}  currentUser = {this.state.user}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                  } 
                }
              }
                              
              }else{
                if(!json.rows[i].updated_at){
                  row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: "None", revision: "R" + json.rows[i].revision + "*", date: "None", from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} currentUser = {this.state.user} role={this.state.role} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                }else{
                if(secureStorage.getItem("role") === "Process" ||secureStorage.getItem("role") === "Instrument"){
                  row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}> <UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} role={this.state.role}  currentUser = {this.state.user} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                }else{
                  if(json.rows[i].verifydesign === 1 && json.rows[i].role === secureStorage.getItem("role")){
                    row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><button className="btn btn-warning" onClick={() => this.props.cancelVerifyClick(json.rows[i].filename)} style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"120px", marginRight: "5px"}}>CANCEL VERIFY</button> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                  }else{  
                    row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadPopUp id = {json.rows[i].filename.split('.').slice(0, -1)}  role={this.state.role} currentUser = {this.state.user} /> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                  }
                }
                
              }
            }

              
              
              if(row){
                if(i % 2 === 0){
                  row["color"] = "#fff"
                }else{
                  row["color"] = "#eee"
                }
                 
                rows.push(row)
              }
            }
            const filterRow = [{key:0, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(0, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, revision: <div><input type="text" className="filter__input" placeholder="Revision" onChange={(e) => this.filter(2,e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, from: <div><input type="text" className="filter__input" placeholder="From" onChange={(e) => this.filter(4,e.target.value)}/></div>, to: <div><input type="text" className="filter__input" placeholder="To" onChange={(e) => this.filter(5,e.target.value)}/></div>, actions: <div><input type="text" className="filter__input" placeholder="Actions" onChange={(e) => this.filter(6,e.target.value)}/></div>}]
                
            this.setState({data : rows, displayData: rows});
            await this.setState({filters : filterRow})

            }
        )
        .catch(error => {
            console.log(error);
        })
  }
  

  async componentDidUpdate(prevProps, prevState){

    if(prevProps !== this.props){
      const bodyUsername = {
        email: secureStorage.getItem("user")
      }
      const optionsUsername = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyUsername)
      }
  
      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/findByEmail", optionsUsername)
      .then(response => response.json())
      .then(json => {
        this.setState({
          username: json.name
        })
      })
      
  
      const body ={
        currentRole : secureStorage.getItem("role"),
        currentUser: this.state.user
      }
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/myTrayFiles/myFiles", options)
    .then(response => response.json())
    .then(async json => {
        var rows = []
        var row = null;
        let pButton, iButton, fButton, rButton, bButton, cButton, revButton, uploadButton = null;
        await this.setState({data : [], displayData: []});
        for(let i = 0; i < json.rows.length; i++){
            uploadButton = <UploadPopUp id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} role={this.state.role}  currentUser = {this.state.user}/>
            console.log(uploadButton)
            if(this.state.role === "Design" || this.state.role === "DesignLead" || this.state.role === "Issuer" || this.state.role === "SpecialityLead"){
              switch(json.rows[i].spo){
                case 0:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 1:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 2:
                  pButton = <button className="btn btn-success" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break; 
                case 3:
                  pButton = <button className="btn btn-danger" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 4:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 5:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                default:  
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>      
              }
              switch(json.rows[i].sit){
                case 0:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 1:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 2:
                  iButton = <button className="btn btn-success" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break; 
                case 3:
                  iButton = <button className="btn btn-danger" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 4:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 5:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                default:  
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>      
              }
            }else{
              switch(json.rows[i].spo){
                case 0:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 1:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 2:
                  pButton = <button className="btn btn-success" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break; 
                case 3:
                  pButton = <button className="btn btn-danger" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 4:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                case 5:
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>
                  break;
                default:  
                  pButton = <button className="btn btn-warning" onClick={() => this.props.sendProcessClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>P</button>      
              }
              switch(json.rows[i].sit){
                case 0:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 1:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"yellow", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 2:
                  iButton = <button className="btn btn-success" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break; 
                case 3:
                  iButton = <button className="btn btn-danger" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 4:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"orange", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                case 5:
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendCancelInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"	#696969",color:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>
                  break;
                default:  
                  iButton = <button className="btn btn-warning" onClick={() => this.props.sendInstrumentClick(json.rows[i].filename)} disabled style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>I</button>      
              }
            }
            if(this.state.role !== "SpecialityLead"){
            switch(json.rows[i].forced){
              case 1:
                fButton = <button className="btn btn-danger" disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>F</button>
                break;
              default:
                fButton = null
                break;
            }
            if(json.rows[i].returned === 1){
              rButton = <button className="btn btn-danger" disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"30px", marginRight:"5px"}}>R</button>
            }else{
              rButton = null
            }
         }

          if(json.rows[i].blocked === 1){
            pButton = null
            iButton = null
            bButton = <button className="btn btn-danger" disabled style={{backgroundColor:"red", fontSize:"12px", borderColor:"red", padding:"2px 5px 2px 5px", marginRight:"5px"}}>LOCKED</button>
          }else{
            bButton = null
          }

          if(json.rows[i].comments){
            cButton = <CommentPopUp comments={json.rows[i].comments} filename={json.rows[i].filename} updated={json.rows[i].updated_at}/>
          }else{
            cButton = null
          }

          if(this.state.role === "Issuer" && process.env.REACT_APP_PROGRESS === "1" && process.env.REACT_APP_ISSUER === "1"){
            revButton = <RevisionPopUp fileName={json.rows[i].filename}  successRequest={this.success}/>
          }

          if(process.env.REACT_APP_IFC === "1"){
            if(!json.rows[i].updated_at){
              row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: "None", revision: "R" + json.rows[i].revision + "*", date: "None", from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} currentUser = {this.state.user} role={this.state.role} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
            }else{
            if(secureStorage.getItem("role") === "Process" ||secureStorage.getItem("role") === "Instrument"){
              row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} currentUser = {this.state.user} role={this.state.role} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
            }else{
              if(json.rows[i].verifydesign === 1 && json.rows[i].role === secureStorage.getItem("role")){
                if (secureStorage.getItem("role") === "Design" || secureStorage.getItem("role") === "DesignLead" || secureStorage.getItem("role") === "Issuer"){
                  row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><button className="btn btn-warning" onClick={() => this.props.cancelVerifyClick(json.rows[i].filename)} style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"120px", marginRight: "5px"}}>CANCEL VERIFY</button> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>} 
                }else{
                  row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><button className="btn btn-warning" onClick={() => this.props.cancelVerifyClick(json.rows[i].filename)} style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"120px", marginRight: "5px"}}>CANCEL VERIFY</button> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
                }
              }else{
                row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}>{uploadButton} <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
              } 
            }
          }
                          
          }else{
            if(!json.rows[i].updated_at){
              row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: "None", revision: "R" + json.rows[i].revision + "*", date: "None", from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} currentUser = {this.state.user} role={this.state.role} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
            }else{
            if(secureStorage.getItem("role") === "Process" ||secureStorage.getItem("role") === "Instrument"){
              row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}> <UploadProcInst id = {json.rows[i].filename.split('.').slice(0, -1)} success={this.success.bind(this)} role={this.state.role}  currentUser = {this.state.user} update={this.updateData.bind(this)}/> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
            }else{
              if(json.rows[i].verifydesign === 1 && json.rows[i].role === secureStorage.getItem("role")){
                row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}><button className="btn btn-warning" onClick={() => this.props.cancelVerifyClick(json.rows[i].filename)} style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"120px", marginRight: "5px"}}>CANCEL VERIFY</button> <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/>  {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
              }else{  
                row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "R" + json.rows[i].revision + "*", date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from.toString(), to: json.rows[i].to, actions:<div style={{display:"flex"}}>{uploadButton} <ByPassPopUp creatByPass={(type, notes) => this.creatByPass(type, notes, json.rows[i].iso_id)}/> {pButton} {iButton} {fButton} {rButton} {bButton} {cButton} {revButton}</div>}
              }
            }
            
          }
        }
          
          if(row){
            if(i % 2 === 0){
              row["color"] = "#fff"
            }else{
              row["color"] = "#eee"
            }
             
            rows.push(row)
          }
        }
                
        await this.setState({data : rows});

        let auxDisplayData = this.state.data
        let resultData = []
        let fil, exists = null
        for(let i = 0; i < auxDisplayData.length; i++){
          exists = true
          for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
            fil = Object.keys(auxDisplayData[i])[column+1]
            if(fil === "id"){
              if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
                exists = false
              }
            }else if(fil === "actions"){
              if(this.state.filterData[column] !== "" && this.state.filterData[column] && auxDisplayData[i][fil].props.children[0].type.name === "UploadPopUp"){
                let upload = "upload"
                if(!upload.includes(this.state.filterData[column].toLocaleLowerCase())){
                  exists = false
                }
              }else if(this.state.filterData[column] !== "" && this.state.filterData[column] && auxDisplayData[i][fil].props.children[0].type === "button"){
                let cv = "cancel verify"
                if(!cv.includes(this.state.filterData[column].toLocaleLowerCase())){
                  exists = false
                }
              }
            }else{
              if(auxDisplayData[i][fil]){
                if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
                  exists = false
                }
              }
              
            }
            
          }
          if(exists){
            resultData.push(auxDisplayData[i])
          }
        }
        await this.setState({displayData: resultData})


        }
    )
    .catch(error => {
        console.log(error);
    })
  }
  }

  async filter(column, value){
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({filterData: fd})

    let auxDisplayData = this.state.data
    let resultData = []
    let fil, exists = null
    for(let i = 0; i < auxDisplayData.length; i++){
      exists = true
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
        fil = Object.keys(auxDisplayData[i])[column+1]
        if(fil === "id"){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
            exists = false
          }
        }else if(fil === "actions"){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && auxDisplayData[i][fil].props.children[0].type.name === "UploadPopUp"){
            let upload = "upload"
            if(!upload.includes(this.state.filterData[column].toLocaleLowerCase())){
              exists = false
            }
          }else if(this.state.filterData[column] !== "" && this.state.filterData[column] && auxDisplayData[i][fil].props.children[0].type === "button"){
            let cv = "cancel verify"
            if(!cv.includes(this.state.filterData[column].toLocaleLowerCase())){
              exists = false
            }
          }
        }else{
          if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
              exists = false
            }
          }
          
        }
        
      }
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }

  getColumnSearchProps = dataIndex => ({
    
    render: text => 
      text
      
  });

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

    onSelectChange = (selectedRowKeys, selectedRows) => {
      let ids = []
      for(let i = 0; i < selectedRows.length; i++){
        ids.push(selectedRows[i].id.props.children)
      }
      this.setState({
        selectedRowsKeys: selectedRowKeys,
        selectedRows: selectedRows
      })
      this.props.onChange(ids);
    };


  render() {

    const selectedRows = this.state.selectedRows;
    const selectedRowsKeys = this.state.selectedRowsKeys;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: (record) => 
      this.state.role !== "Instrument" && this.state.role !== "Process" ? (
      ( 
        {
        
        disabled: record.actions.props.children[0].props.children === 'CANCEL VERIFY' || record.actions.props.children[12],
        // Column configuration not to be checked
        name: record.name,
      })
      ) : (
        {
          name: record.name,
        }),
      
      
    };

    const rowSelectionFilter = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: true,
        // Column configuration not to be checked
        name: record.name,
      }),
    };

    if(localStorage.getItem("update") === "true"){
      this.setState({
        selectedRows: [],
        selectedRowsKeys: []
      })
      rowSelection.selectedRowKeys = []
      rowSelection.selectedRows = []
      localStorage.setItem("update", false)
    }else{
      rowSelection.selectedRowKeys = selectedRowsKeys 
      rowSelection.selectedRows = selectedRows;
    }

    let columns = [
      {
        title: <center className="dataTable__header__text">ISO ID</center>,
        dataIndex: 'id',
        key: 'id',
        width: '15%',
        ...this.getColumnSearchProps('id'),
        sorter:{
          compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
        },
      },
      {
        title: <div className="dataTable__header__text">Type</div>,
        dataIndex: 'type',
        key: 'type',
        width: '5%',
        ...this.getColumnSearchProps('type'),
        sorter: {
          compare: (a, b) => { return a.type.localeCompare(b.type)},
        },
      },
      {
        title: <center className="dataTable__header__text">Revision</center>,
        dataIndex: 'revision',
        key: 'revision',
        width: '8%',
        ...this.getColumnSearchProps('revision'),
        sorter:{
          compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
        },
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'date',
        key: 'date',
        width: '10%',
        ...this.getColumnSearchProps('date'),
        sorter: {
          compare: (a, b) => a.date.replace(/\D/g,'') - b.date.replace(/\D/g,''),
        },
      },
      {
        title: <div className="dataTable__header__text">From</div>,
        dataIndex: 'from',
        key: 'from',
        ...this.getColumnSearchProps('from'),
        sorter: {
          compare: (a, b) => { return a.from.localeCompare(b.from)},
        },
      },
      {
        title: <div className="dataTable__header__text">To</div>,
        dataIndex: 'to',
        key: 'to',
        ...this.getColumnSearchProps('to'),
        sorter: {
          compare: (a, b) => { return a.to.localeCompare(b.to)},
        },
      },
      
      {
        title: <div className="dataTable__header__text">Actions</div>,
        dataIndex: 'actions',
        key: 'actions',
        width:'25%',
        ...this.getColumnSearchProps('actions'),
        sorter: {
          compare: (a, b) => a.actions.props.type - b.actions.props.type,
        },
      },
    ];

    if(process.env.REACT_APP_PROGRESS === "0"){
      columns = [
        {
          title: <center className="dataTable__header__text">ISO ID</center>,
          dataIndex: 'id',
          key: 'id',
          width: '23%',
          ...this.getColumnSearchProps('id'),
          sorter:{
            compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
          },
        },
        {
          title: <center className="dataTable__header__text">Revision</center>,
          dataIndex: 'revision',
          key: 'revision',
          width: '8%',
          ...this.getColumnSearchProps('revision'),
          sorter:{
            compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
          },
        },
        {
          title: <div className="dataTable__header__text">Date</div>,
          dataIndex: 'date',
          key: 'date',
          width: '20%',
          ...this.getColumnSearchProps('date'),
          sorter: {
            compare: (a, b) => a.date.replace(/\D/g,'') - b.date.replace(/\D/g,''),
          },
        },
        {
          title: <div className="dataTable__header__text">From</div>,
          dataIndex: 'from',
          key: 'from',
          ...this.getColumnSearchProps('from'),
          sorter: {
            compare: (a, b) => { return a.from.localeCompare(b.from)},
          },
        },
        {
          title: <div className="dataTable__header__text">To</div>,
          dataIndex: 'to',
          key: 'to',
          ...this.getColumnSearchProps('to'),
          sorter: {
            compare: (a, b) => { return a.to.localeCompare(b.to)},
          },
        },
        
        {
          title: <div className="dataTable__header__text">Actions</div>,
          dataIndex: 'actions',
          key: 'actions',
          width:'20%',
          ...this.getColumnSearchProps('actions'),
          sorter: {
            compare: (a, b) => a.actions.props.type - b.actions.props.type,
          },
        },
      ];
    }

    var totalElements = null;
    if (this.state.data.length === 0){
      totalElements = null;
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 25, left:0}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }
  


    return (
      <div>
        <div className="dataTable__container">
        <Table className="customTable" style={{ height: '430px', width: "1540px"}} bordered = {true} rowSelection={{type: 'checkbox', ...rowSelection}} columns={columns} dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} rowSelection={{type: 'checkbox', ...rowSelectionFilter}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          {totalElements}
        </div>
      </div>
    );
  }
}

export default MyTrayTable;