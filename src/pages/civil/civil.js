import "./civil.css"
import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import RoleDropDown from '../../components/roleDropDown/roleDropDown'
import EquipmentsNavBtns from "../../components/EquipmentsNavBtns/equipmentsNavBtns"
import ProgressPlotCivils from "../../components/progressPlotCivils/progressPlotCivils"
import CivilEstimatedDataTable from "../../components/civilEstimatedDataTable/civilEstimatedDataTable"
import CivilModelledDataTable from "../../components/civilModelledDataTable/civilModelledDataTable"
import CivilTypesDataTable from "../../components/civilTypesDataTable/civilTypesDataTable"
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import CivilExcel from "../../components/civilExcel/civilExcel"
import CivilExcelEdit from "../../components/civilExcelEdit/civilExcelEdit"
import IsoTrackerLogo from "../../assets/images/3DTracker.svg"
import ExportIcon from "../../assets/images/downloadicon.png"
import EditIcon from "../../assets/images/edit.png"
import AlertF from "../../components/alert/alert"

import IdleTimer from 'react-idle-timer'
import {useHistory} from "react-router";


const Civil = () => {

    const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';
    const [currentRole, setCurrentRole] = useState();
    const [roles, setRoles] = useState();
    const[weight, setWeight] = useState();
    const[progress, setProgress] = useState();
    const[successAlert, setSuccessAlert] = useState(false);

    const history = useHistory()

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
            
    },[currentRole]);

    useEffect(()=>{

        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
       

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/civils/weight", options)
            .then(response => response.json())
            .then(json => {
                setWeight(json.weight)
                setProgress(json.progress)
            }
            )
            .catch(error => {
                console.log(error);
            })  
            
            const body = {
                user: currentUser,
            }
            options = {
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
            
    },[]);

    function success(){
        setSuccessAlert(true)
        setTimeout(function () {
            setSuccessAlert(false)
        }, 1000);
    }

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

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history.push("/"+process.env.REACT_APP_PROJECT+"/");
        }
    }, [])

    var dataTableHeight = "500px"

    
    document.title= process.env.REACT_APP_APP_NAMEPROJ
    const [currentTab, setCurrentTab] = useState(secureStorage.getItem("civ_tab"))
    if(currentTab === "" || currentTab === null){
        setCurrentTab("Estimated")
    }

    var currentUser = secureStorage.getItem('user')
    var table = null

    let downloadBtn = null
    let adminBtn = null


    if(currentTab === "Estimated"){
        table = <CivilEstimatedDataTable/>
    }else if(currentTab === "Modelled"){
        downloadBtn = <button className="navBar__button" onClick={()=>downloadCivilsModelled()} style={{marginLeft:"230px", width:"115px"}}><img src={ExportIcon} alt="trash" className="navBar__icon"></img><p className="navBar__button__text">Export</p></button>
    
        table = <CivilModelledDataTable/>
    }else if(currentTab === "Progress"){
        table = <ProgressPlotCivils/>
    }else if(currentTab === "Types"){
        table = <CivilTypesDataTable/>
    }else if(currentTab === "Key parameters"){
        table = <CivilExcel success={success.bind(this)}/>
    }else if(currentTab === "Edit"){
        table = <CivilExcelEdit success={success.bind(this)}/>
    }

    
    if(currentTab === "Edit" || currentTab === "Key parameters"){
        dataTableHeight = "500px"
    }
    
    if(currentRole === "Project"){
        if(currentTab === "Estimated" || currentTab === "Edit"){
            if(currentTab === "Edit"){
                adminBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Edit")} style={{backgroundColor:"#99C6F8", marginLeft:"230px"}}><img src={EditIcon} alt="trash" className="navBar__icon"></img><p className="navBar__button__text">Edit</p></button>
            }else{
                adminBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Edit")} style={{marginLeft:"230px"}}><img src={EditIcon} alt="trash" className="navBar__icon"></img><p className="navBar__button__text">Edit</p></button>
            }        }else{
            adminBtn = null 
        }
    }

    async function downloadCivilsModelled(){

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadCivilsModelled/")
        .then(response => response.json())
        .then(json => {
            const headers = ["AREA", "TAG", "TYPE", "WEIGHT", "STATUS", "PROGRESS"]
            exportToExcel(JSON.parse(json), "Civil modelled", headers)
        })
    }

    const exportToExcel = (apiData, fileName, headers) => {
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const header_cells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'O1']
        const fileExtension = ".xlsx";

        let wscols = []
        for(let i = 0; i < headers.length; i++){
            wscols.push({width:35})
        }

        const ws = XLSX.utils.json_to_sheet(apiData);   
        ws["!cols"] = wscols
        for(let i = 0; i < headers.length; i++){
            ws[header_cells[i]].v = headers[i]
        }
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);

    }

    return(
        
        <body>
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <NavBar onChange={value => setCurrentTab(currentTab)}/>
            <div
            className={`alert alert-success ${successAlert ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => setSuccessAlert(false)}
            >
                <AlertF type="success" text="Changes saved!" margin="0px"/>
            </div>
            <div style={{position:"absolute", marginTop:"180px", marginLeft:"49%"}}>
                <i className="discipline__title" style={{fontStyle:"normal"}}>Civil</i>
            </div>
                <div className="isotracker__row">
                  <div className="isotracker__column">
                      <img src={IsoTrackerLogo} alt="isoTrackerLogo" className="isoTrackerLogo__image2"/>
                      
                      <div className="roleSelector__containerF">
                              <RoleDropDown style={{paddingLeft: "2px"}} onChange={value => setCurrentRole(value)} roles = {roles}/>
                      </div>
                      
                  </div>

                  <div className="isotracker__column">
                  
                  <table className="equipTable__table" style={{marginTop:"270px", width:"35%", marginLeft:"59%"}}>
                        <tbody className="equipable__body">
                            <tr>    
                                <td  className="equipTable__header" style={{backgroundColor:"#338DF1", borderRadius:"1em 0 0 0"}}>Estimated weight</td>
                                <td className="equipTable__header" style={{backgroundColor:"#338DF1", borderRadius:"0 1em 0 0"}}>Total progress</td>
                            </tr>
                            <tr>
                                <td className="equipTable__state" style={{borderRadius:"0 0 0 1em"}}>{weight}</td>
                                <td className="equipTable__state" style={{borderRadius:"0 0 1em 0"}}>{progress}%</td>
                            </tr>
                        </tbody>
                    </table>
                    
                  </div>               
                  
                  
              </div>
              <table className="isotracker__table__container">
                      <tr className="isotracker__table__navBar__container">
                          <th  colspan="2" className="isotracker__table__navBar">
                            {adminBtn}
                            {downloadBtn}
                          </th>
                      </tr>
                      <tr className="isotracker__table__tray__and__table__container" style={{height: dataTableHeight}}>
                          <td className="disciplines__table__trays">
                              <div className="trays__container">
                                  <p className="isotracker__table__trays__group">Options</p>
                                  <center className="equimentsNavBtns__center">              
                                    <EquipmentsNavBtns onChange={value => setCurrentTab(value)} currentTab = {currentTab} currentRole = {currentRole} discipline = "Equipment"/>               
                                    </center>
                              </div>
                          </td>
                          <td className="discplines__table__table" >
                              <div  style={{height: "540px", width: "1550px"}} className="isotracker__table__table__container">
                                  {table}
                              </div>
                          </td>
                          
                      </tr>
                  </table>
         </body>
    )
}

export default Civil;