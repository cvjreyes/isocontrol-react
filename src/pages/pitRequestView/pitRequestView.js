import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import CSPTrackerLogo from "../../assets/images/3dquery.svg"
import RoleDropDown from '../../components/roleDropDown/roleDropDown'

import IdleTimer from 'react-idle-timer'
import {useHistory} from "react-router";
import QTrackerViewDataTable from '../../components/qtrackerViewDataTable/qtrackerViewDataTable'

import SaveIcon from "../../assets/images/save.svg"
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#D2D2D2', '#FFCA42', '#7BD36D', '#FF3358'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if(index === 0){
        index = "Pen"
    }else if(index === 1){
        index = "Pro"
    }else if(index === 2){
        index = "A"
    }else if(index === 3){
        index = "R"
    }
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {index}
      </text>
    );
  };
  

const PitRequestView = () => {

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


    const [currentRole, setCurrentRole] = useState();
    const [currentTab, setCurrentTab] = useState("View")
    const [roles, setRoles] = useState();
    const [saveBtn, setSaveBtn] = useState()
    const [updatedRows, setUpdatedRows] = useState([])
    const [observations, setObservations] = useState()
    const [counter, setCounter] = useState([])

    const [updateData, setUpdateData] = useState(false)    

    const history = useHistory()

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history.push("/"+process.env.REACT_APP_PROJECT+"/");
        }
        
    }, [])

    var currentUser = secureStorage.getItem('user')

    useEffect(()=>{
        const body = {
            user: currentUser,
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
       

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/roles/user", options)
            .then(response => response.json())
            .then(json => {
                setRoles(json.roles);
                if(secureStorage.getItem('role') !== null){
                    setCurrentRole(secureStorage.getItem('role'))
                }else{
                    secureStorage.setItem('role', json.roles[0])
                    setCurrentRole(secureStorage.getItem('role'))
                }
                }
            )
            .catch(error => {
                console.log(error);
            })     
            
            
        if(secureStorage.getItem("role") === "3D Admin"){
            setSaveBtn(<button className="navBar__button" onClick={()=> saveChanges()}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>)

        }else{
            setSaveBtn(null)
        }
            
    },[currentRole]);

    useEffect(async ()=>{
        const body = {
            user: currentUser,
        }
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exitEditCSP", options)
            .then(response => response.json())
            .then(async json => {

            })

        options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        } 
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/statusData", options)
            .then(response => response.json())
            .then(async json => {
                let counter = [{name: "Pending", value: json.pending}, {name: "In progress", value: json.progress}, {name: "Accepted", value: json.accepted}, {name: "Rejected", value: json.rejected}]
                
                await setCounter(counter)
            })
            

    },[updateData])

    function handleOnIdle(){
        const body = {
            user: currentUser,
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exitEditCSP", options)
            .then(response => response.json())
            .then(async json => {

            })
        secureStorage.clear()
        history.push("/" + process.env.REACT_APP_PROJECT)
    }

    async function updateDataMethod(){
        setUpdateData(!updateData)
    }

    async function downloadReport(){

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNWC", options)
        .then(response => response.json())
        .then(async json => {
          var rows = []
          var row = null
            for(let i = 0; i < json.rows.length; i++){
                row = {incidence_number: json.rows[i].incidence_number, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: json.rows[i].spref, name: null, pipe: null, items: null, scope: null, description: json.rows[i].description}
                  
                  if(json.rows[i].status === 0){
                    row.status = "Pending"
                  }else if(json.rows[i].status === 1){
                      row.status = "In progress"
                  }else if(json.rows[i].status === 2){
                      row.status = "Ready"
                  }else{
                      row.status = "Rejected"
                  }

                  if(json.rows[i].accept_reject_date){
                   
                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  
                  }
                
                
                rows.push(row)
            }
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNVN", options)
            .then(response => response.json())
            .then(async json => {
            var row = null
                for(let i = 0; i < json.rows.length; i++){
                    row = {incidence_number: json.rows[i].incidence_number, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: json.rows[i].name, pipe: null, items: null, scope: null, description: json.rows[i].description}
                    
                      if(json.rows[i].status === 0){
                        row.status = "Pending"
                      }else if(json.rows[i].status === 1){
                          row.status = "In progress"
                      }else if(json.rows[i].status === 2){
                          row.status = "Ready"
                      }else{
                          row.status = "Rejected"
                      }
                      if(json.rows[i].accept_reject_date){
                        row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                    }
                      rows.push(row)
                }
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRI", options)
                .then(response => response.json())
                .then(async json => {
                var row = null
                    for(let i = 0; i < json.rows.length; i++){
                        row = {incidence_number: json.rows[i].incidence_number, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: json.rows[i].pipe, items: null, scope: null, description: json.rows[i].description}
                                             
                        if(json.rows[i].status === 0){
                        row.status = "Pending"
                        }else if(json.rows[i].status === 1){
                            row.status = "In progress"
                        }else if(json.rows[i].status === 2){
                            row.status = "Ready"
                        }else{
                            row.status = "Rejected"
                        }
                        if(json.rows[i].accept_reject_date){
                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  }
                        
                        rows.push(row)
                    }
                    
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRB", options)
                    .then(response => response.json())
                    .then(async json => {
                    var row = null
                        for(let i = 0; i < json.rows.length; i++){
                            row = {incidence_number: json.rows[i].incidence_number, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: json.rows[i].pipe, items: null, scope: null, description: json.rows[i].description}
                            
                              if(json.rows[i].status === 0){
                                row.status = "Pending"
                              }else if(json.rows[i].status === 1){
                                  row.status = "In progress"
                              }else if(json.rows[i].status === 2){
                                  row.status = "Ready"
                              }else{
                                  row.status = "Rejected"
                              }
                            
                              if(json.rows[i].accept_reject_date){
                                row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  }
                              rows.push(row)
                        }
                        
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getNRIDS", options)
                        .then(response => response.json())
                        .then(async json => {
                        var row = null
                            for(let i = 0; i < json.rows.length; i++){
                                row = {incidence_number: json.rows[i].incidence_number, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: json.rows[i].name, pipe: null, items: null, scope: null, description: null}
                               
                                  if(json.rows[i].status === 0){
                                    row.status = "Pending"
                                  }else if(json.rows[i].status === 1){
                                      row.status = "In progress"
                                  }else if(json.rows[i].status === 2){
                                      row.status = "Ready"
                                  }else{
                                      row.status = "Rejected"
                                  }
                                
                                  if(json.rows[i].accept_reject_date){
                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  }
                                  rows.push(row)
                            }
                            
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/getRP", options)
                            .then(response => response.json())
                            .then(async json => {
                            var row = null
                                for(let i = 0; i < json.rows.length; i++){
                                    row = {incidence_number: json.rows[i].incidence_number, user: json.rows[i].user, created_at: json.rows[i].created_at.toString().substring(0,10) + " "+ json.rows[i].created_at.toString().substring(11,19), observations: json.rows[i].observations, spref: null, name: null, pipe: null, items: json.rows[i].items_to_report, scope: json.rows[i].scope, description: json.rows[i].description}
                                    
                                      if(json.rows[i].status === 0){
                                        row.status = "Pending"
                                      }else if(json.rows[i].status === 1){
                                          row.status = "In progress"
                                      }else if(json.rows[i].status === 2){
                                          row.status = "Ready"
                                      }else{
                                          row.status = "Rejected"
                                      }
                                    
                                      if(json.rows[i].accept_reject_date){
                    row.ar_date = json.rows[i].accept_reject_date.toString().substring(0,10) + " "+ json.rows[i].accept_reject_date.toString().substring(11,19)
                  }
                                    rows.push(row)
                                }

                                // Sort the array based on the second element
                                rows.sort(function(first, second) {
                                  return second.created_at.localeCompare(first.created_at);
                                });
                                
                                const headers = ["Reference", "User", "Date", "Observations", "SPREF", "Name", "Pipe", "Items", "Scope", "Description", "Status", "Accepted/Rejected date"]
                                const apiData = rows
                                const fileName = "QueryTracker report"

                                const fileType =
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                                const header_cells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1']
                                const fileExtension = ".xlsx";

                                let wscols = []
                                for(let i = 0; i < headers.length; i++){
                                    wscols.push({width:35})
                                }

                                const ws = XLSX.utils.json_to_sheet(apiData);   
                                ws["!cols"] = wscols
                                for(let i = 0; i < headers.length; i++){
                                    if(ws[header_cells[i]]){
                                        ws[header_cells[i]].v = headers[i]
                                    }
                                }
                                const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
                                const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                                const data = new Blob([excelBuffer], { type: fileType });
                                FileSaver.saveAs(data, fileName + fileExtension);

                            })

                        })

                    })

                })

            })
            
        })
    }

    async function updateStatus(updatedRow){
        let currentRows = updatedRows
        currentRows.push(updatedRow)
        await setUpdatedRows(currentRows)
    }

    async function updateObservations(observations){
        await setObservations(observations)
    }

    async function saveChanges(){
        for(let i = 0; i < updatedRows.length; i++){

            let body = {
                incidence_number: updatedRows[i][0],
                status_id: updatedRows[i][1],
                type: updatedRows[i][2],
                email: secureStorage.getItem("user")
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updateStatus", options)
              .then(response => response.json())
              .then(async json => {
                
              })
        }
        
        let observationsArray = []

        if(observations){

            Object.entries(observations)
            .map(async ([incidence_number, observation]) => 
                
                await observationsArray.push([incidence_number, observation])
            )

        }

        for(let i = 0; i < observationsArray.length; i++){
            let body = {
                incidence_number: observationsArray[i][0],
                observation: observationsArray[i][1],
              }
              let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
              }
              
              fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/qtracker/updateObservations", options)
              .then(response => response.json())
              .then(async json => {
                
              })
        }
        
        await setUpdatedRows([])
        await setUpdateData(!updateData)
        
    }

    

    var dataTableHeight = "500px"

    

    return(
        
        <body>
            {updateData}
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <NavBar onChange={value => setCurrentTab(currentTab)}/>
            
            <div className="isotracker__row">
                  <div className="isotracker__column">
                      <img src={CSPTrackerLogo} alt="CSPTrackerLogo" className="isoTrackerLogo__image2" style={{height:"110px"}}/>
                      
                      <div className="roleSelector__containerF">
                              <RoleDropDown style={{paddingLeft: "2px"}} onChange={value => setCurrentRole(value)} roles = {roles}/>
                      </div>
                      
                  </div>
                  <PieChart width={600} height={400}>
                    <Pie data={counter} dataKey="value" cx="50%" cy="60%"  outerRadius={120} fill="#8884d8" label={renderCustomizedLabel}>
                    {counter.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </div>
            <table className="isotracker__table__container">
                      <tr className="isotracker__table__navBar__container" style={{height:"65px "}}>
                          <th  className="isotracker__table__navBar">
                              <div style={{display:"flex"}}>
                                  {secureStorage.getItem("role") === "3D Admin" &&
                                  <button className="navBar__button" onClick={()=> saveChanges()}><img src={SaveIcon} alt="save" className="navBar__icon"></img><p className="navBar__button__text">Save</p></button>
                                  }
                              </div>                           
                               
                          </th>
                      </tr>
                      <tr className="isotracker__table__tray__and__table__container" style={{height: dataTableHeight}}>
                          <td className="discplines__table__table" style={{height: dataTableHeight}} >
                              <div  style={{height: dataTableHeight, width:"2200px"}} className="isotracker__table__table__container">
                                <QTrackerViewDataTable updateObservations={updateObservations.bind(this)} updateData={updateDataMethod.bind(this)} updateStatus={updateStatus.bind(this)}/>
                              </div>
                          </td>
                          
                      </tr>
                  </table>
                  <center className="actionBtns__container">   
                    <div style={{display:"flex", marginTop:"10px"}}>
                        <button className="action__btn" name="export" value="export" onClick={() => downloadReport()}>Export</button>
                    </div>
                    
                  </center>
                  <br></br>
         </body>
    )
}

export default PitRequestView;