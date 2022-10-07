import DataTable from "../../components/datatable/datatable"
import ReportBtns from "../../components/reportBtns/reportBtns"
import StateTable from "../../components/stateTable/stateTable"
import NavBtns from "../../components/navBtns/navBtns"
import DragAndDrop from "../../components/dragAndDrop/dragAndDrop"
import "./isoCtrlF.css"
import React, { useState , useEffect} from 'react'
import ActionButtons from "../../components/actionBtns/actionBtns"
import CheckInTable from "../../components/checkInTable/checkInTable"
import NavBar from '../../components/navBar/navBar'
import MyTrayBtn from "../../components/myTrayBtn/myTrayBtn"
import MyTrayTable from "../../components/myTrayTable/myTrayTable"
import BinTable from "../../components/binTable/binTable"
import OnHoldTable from "../../components/onHoldTable/onHoldTable"
import StatusDataTable from "../../components/statusDataTable/statusDataTable"
import HistoryDataTable from "../../components/historyDataTable/historyDataTable"
import RoleDropDown from "../../components/roleDropDown/roleDropDown"

import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse'
import ProcInstTable from "../../components/procInstTable/procInstTable"
import JSZip from 'jszip'
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ReportBoxBtns from "../../components/reportBoxBtns/reportBoxBtns"
import ProgressBtn from "../../components/progressBtn/progressBtn"
import ProgressPlot from "../../components/progressPlot/progressPlot"
import ModelledBtn from "../../components/modelledBtn/modelledBtn"
import ModelledDataTable from "../../components/modelledDataTable/modelledDataTable"
import UsersDataTable from "../../components/usersDataTable/usersDataTable"
import TimeTrackDataTable from "../../components/timeTrackDataTable/timeTrackDataTable"

import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"
import Trash from "../../assets/images/Trash.png"
import Hold from "../../assets/images/Prohibit.png"
import Issued from "../../assets/images/FolderOpen.png"
import Reports from "../../assets/images/Notepad.png"
import Modelled from "../../assets/images/Cube.png"
import ProcInst from "../../assets/images/MagnifyingGlass.png"
import Progress from "../../assets/images/ChartBar.png"
import UploadIcon from "../../assets/images/upload.png"
import UsersIcon from "../../assets/images/user.png"
import ClockIcon from "../../assets/images/clock.png"
import LoadingScreen from "../../components/loadingScreen/loadingScreen"

import AlertF from "../../components/alert/alert"
import IsoControlModelledDataTable from "../../components/isoControlModelledDataTable/isoControlModelledDataTable"
import IsoControlNotModelledDataTable from "../../components/isoControlNotModelledDataTable/isoControlNotModelledDataTable"
import IsoControlFullDataTable from "../../components/isoControlFullDataTable/isoControlFullDataTable"
import IsoControlGroupLineIdDataTable from "../../components/isoControlGroupLineIdDataTable/isoControlGroupLineIdDataTable"
import UploadBOMIsocontrolPopUp from "../../components/uploadBomIsocontrolPopUp/uploadBomIsocontrolPopUp"
import IdleTimer from 'react-idle-timer'
import {useHistory} from "react-router";
import EstimatedPipesExcel from "../../components/estimatedPipesExcel/estimatedPipesExcel"
import ByPassDataTable from "../../components/byPassDataTable/byPassDataTable"

const IsoCtrlF = () => {
   
    
    document.title= process.env.REACT_APP_APP_NAMEPROJ
    const [currentRole, setCurrentRole] = useState();
    const [roles, setRoles] = useState();
    const [selected, setSelected] = useState([]);
    const [updateData, setUpdateData] = useState();
    const [comment, setComment] = useState(" ");
    const [downloadZip, setDownloadzip] = useState(new JSZip());
    const [loading, setLoading] = useState(false);
    const [errorUnclaim, setErrorUnclaim] = useState(false);
    const [errorPI, setErrorPI] = useState(false);
    const [errorCL, setErrorCL] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [errorReports, setErrorReports] = useState(false);
    const [errorUnclaimR, setErrorUnclaimR] = useState(false);
    const [warningSelected, setWarningSelected] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [errorReportD, setErrorReportD] = useState(false)
    const [errorDeleteUser, setErrorDeleteUser] = useState(false);
    const [content, setContent] = useState();
    const [navBar, setNavBar] = useState(null)
    const [alreadyOnRev, setAlreadyOnRev] = useState(false)
    const [errorREV, setErrorREV] = useState(false)
    const [estimatedWarning, setEstimatedWarning] = useState(false)
    const [estimatedEmpty, setEstimatedEmpty] = useState(false)

    const [modelledWeight, setModelledWeight] = useState("...")
    const [notModelledWeight, setNotModelledWeight] = useState("...")
    const [totalIsocontrolWeight, setTotalIsocontrolWeight] = useState("...")

    const history = useHistory()

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

    useEffect(()=>{
        if(!secureStorage.getItem("user")){
            history.push("/"+process.env.REACT_APP_PROJECT+"/");
        }
    }, [])

    const [currentTab, setCurrentTab] = useState("Status") 

    var dataTableHeight = "470px"

    //Componentes de la pagina que varian en funcion del estado
    var uploadButton, actionButtons, tableContent, progressBtn, modelledBtn, myTrayBtn, usersButton, ttButton
    var currentTabText = currentTab
    if(currentTabText === "LDE/IsoControl"){
        currentTabText = "LOS/IsoControl"
    }
    tableContent = <DataTable forceUnclaim = {forceUnclaim.bind(this)} onChange={value=> setSelected(value)} selected = {selected} currentTab = {currentTab} currentRole={currentRole} updateData = {updateData} rename = {rename.bind(this)} sendHold = {sendHold.bind(this)} returnToLOS = {returnToLOS.bind(this)} cancelRev = {cancelRev.bind(this)}/>
    var currentUser = secureStorage.getItem('user')

    useEffect(() =>{

        if(process.env.REACT_APP_PROGRESS === "0"){

            setContent(<div className="content">
            <LoadingScreen progress={"25"}/>
            </div>)
            setTimeout(() => {
                setContent(<div className="content">
                <LoadingScreen progress={"75"}/>
                </div>)
            }, 1000)
            setTimeout(() => {
                setContent(<div className="content">
                <LoadingScreen progress={"100"}/>
                </div>)
            }, 2000)
            setTimeout(() => {
                setNavBar(<NavBar onChange={value => setCurrentTab(value)}/>)
                setContent(null)            
            }, 2300);
        }else{
            setNavBar(<NavBar onChange={value => setCurrentTab(value)}/>)
            setContent(null)   
        }

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isocontrolWeights", options)
            .then(response => response.json())
            .then(async json => {
                await setModelledWeight((json.modelledWeight/1000).toFixed(2))
                await setNotModelledWeight((json.notModelledWeight/1000).toFixed(2))
                await setTotalIsocontrolWeight(((json.modelledWeight/1000) + (json.notModelledWeight/1000)).toFixed(2))
            })
          
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exitEditCSP", options)
            .then(response => response.json())
            .then(async json => {

            })
    }, [])
    
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
            setErrorPI(false)
            setErrorUnclaimR(false)
            setErrorCL(false)
            setUpdateData(!updateData)
            setTransactionSuccess(false);
            setErrorUnclaim(false)
            setErrorReports(false)
            setLoading(false)
            setWarningSelected(false)
            setBlocked(false)
            setErrorReportD(false)
            setErrorDeleteUser(false)
            
    },[currentRole]);

    useEffect(()=>{
        setErrorUnclaimR(false)
        setErrorPI(false);
        setErrorCL(false)
        setTransactionSuccess(false)
        setErrorUnclaim(false)
        setLoading(false)
        setErrorReports(false)
        setSelected([])
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)

        
    }, [currentTab])

    const successAlert = () =>{
        setTransactionSuccess(true)
        setTimeout(function () {
            setTransactionSuccess(false)
        }, 3000);     
    }

    const getProgress = () =>{
        setUpdateData(!updateData)

    }

    const claim = async(event) => {
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorCL(false)
        setErrorUnclaim(false)
        setTransactionSuccess(false);
        setWarningSelected(false)
        setErrorPI(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            if(currentTab === "Process"){
                for (let i = 0; i < selected.length; i++){
                
                    const body ={
                        user : currentUser,
                        file: selected[i],
                        role: currentRole
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/claimProc", options)
                }
            }else if(currentTab === "Instrument"){
                for (let i = 0; i < selected.length; i++){
                
                    const body ={
                        user : currentUser,
                        file: selected[i],
                        role: currentRole
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/claimInst", options)
                }
            }else{
                for (let i = 0; i < selected.length; i++){
                
                    const body ={
                        user : currentUser,
                        file: selected[i],
                        role: currentRole
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/claim", options)
                }
            
            }
            setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
            
        }else{
            setWarningSelected(true)
        }
     
    }   
    
    const forceClaim = async(username) =>{
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorCL(false)
        setErrorUnclaim(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                
                const body ={
                    user : username,
                    file: selected[i],
                    los: currentUser
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/forceClaim", options)
            }
            setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
        }
    }

    const unclaim = async (event) =>{
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorCL(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            if (currentRole === "Process"){
                for (let i = 0; i < selected.length; i++){
                    const body ={
                        user : currentUser,
                        file: selected[i],
                        role: currentRole
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/unclaimProc", options)
                }
            }else if(currentRole === "Instrument"){
                for (let i = 0; i < selected.length; i++){
                    const body ={
                        user : currentUser,
                        file: selected[i],
                        role: currentRole
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/unclaimInst", options)
                }
            }else{
                for (let i = 0; i < selected.length; i++){
                    const body ={
                        user : currentUser,
                        file: selected[i],
                        role: currentRole
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/unclaim", options)
                    .then(response => response.json())
                    .then(json=>{
                        if(json.error === "forced"){
                            setErrorUnclaim(true)
                        }else if(json.error === "returned"){
                            setErrorUnclaimR(true)
                        }
                    })
                    .catch(err => {
                    });
                }
            }
            await setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
        }else{
            setWarningSelected(true)
        }
        
    }

    async function forceUnclaim(fileName){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorCL(false)
        setErrorUnclaim(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setLoading(true)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)
        const body ={
            user : currentUser,
            file: fileName,
            role: currentRole
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/forceUnclaim", options)
        await setUpdateData(!updateData)
        setLoading(false)
        setSelected([])
    }


    const verifyClick = async(event) =>{
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorCL(false)
        setErrorUnclaim(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                
                const body ={
                    user : currentUser,
                    file: selected[i],
                    role: currentRole
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/verify", options)
            }
            await setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }

    async function cancelVerifyClick(filename){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorUnclaim(false)
        setTransactionSuccess(false);
        setLoading(true)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)
            
            const body ={
                user : currentUser,
                file: filename,
                role: currentRole
            }
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/cancelVerify", options)
        
        await setUpdateData(!updateData)
        setLoading(false)
        setSelected([])
    }

    async function transaction(destiny, comments){
        
        if(selected.length > 0){
            setErrorUnclaimR(false)
            setWarningSelected(false)
            setErrorReports(false)
            setErrorCL(false)
            setErrorUnclaim(false)
            setErrorPI(false);
            setTransactionSuccess(false);
            setLoading(true)
            setErrorReportD(false)
            setBlocked(false)
            setErrorDeleteUser(false)
            
            if(destiny === "Design"){
                if(comment.length > 1){
                    setComment(" ")
                    localStorage.setItem("update", true)
                    for (let i = 0; i < selected.length; i++){
                        const body ={
                            user : currentUser,
                            fileName: selected[i],
                            to: destiny,
                            role: secureStorage.getItem("role"),
                            comment: comment,
                            deleted: 0,
                            onhold: 0
                        }
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(body)
                        }
                        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/transaction", options)
                        .then(response => response.json())
                        .then(json =>{
                            if(json.blocked){
                                setBlocked(true)
                            }else{
                                successAlert()
                            }
                        })
                        
                    }
                }else{
                }
            }else if (destiny === "LDE/Isocontrol"){
                for (let i = 0; i < selected.length; i++){
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/piStatus/"+selected[i], options)
                    .then(response => response.json())
                    .then(async json =>{
                        if(json.sit === 1 || json.sit === 3 || json.sit === 4 || json.sit === 5|| json.spo === 1 || json.spo === 3 || json.spo === 4 || json.spo === 5){
                            localStorage.setItem("update", true)
                            setErrorPI(true);
                            setTransactionSuccess(false);
                        }else{
                            localStorage.setItem("update", true)
                            let deleted, hold = 0
                    
                            const body ={
                                user : currentUser,
                                fileName: selected[i],
                                to: destiny,
                                role: secureStorage.getItem("role"),
                                comment: null,
                                deleted: deleted,
                                onhold: hold
                            }
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(body)
                            }
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/transaction", options)
                            .then(response => response.json())
                            .then(async json=>{
                                if(json.error === "error"){
                                    await setErrorCL(true) 
                                }else if(json.error === "rev"){
                                    await setErrorREV(true) 
                                }else if(json.blocked){
                                    setBlocked(true)
                                }
                            })
                            if(!errorCL && !blocked){
                                successAlert()
                            }
                            
                        }
                    })
                }
                await setUpdateData(!updateData)
                setLoading(false)
            }else if(destiny === "On hold"){
                localStorage.setItem("update", true)
                let deleted, hold = 0

                if(destiny === "Recycle bin"){
                    deleted = 1
                }

                if(destiny === "On hold"){
                    hold = 1
                }
                for (let i = 0; i < selected.length; i++){
                    
                    const body ={
                        user : currentUser,
                        fileName: selected[i],
                        to: destiny,
                        role: secureStorage.getItem("role"),
                        comment: comments,
                        deleted: deleted,
                        onhold: hold
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/transaction", options)
                    .then(response => response.json())
                        .then(json =>{
                            if(json.blocked){
                                setBlocked(true)
                            }else{
                                successAlert()
                            }
                        })
                }
            }else{
                localStorage.setItem("update", true)
                let deleted, hold = 0

                if(destiny === "Recycle bin"){
                    deleted = 1
                }

                if(destiny === "On hold"){
                    hold = 1
                }
                for (let i = 0; i < selected.length; i++){
                    
                    const body ={
                        user : currentUser,
                        fileName: selected[i],
                        to: destiny,
                        role: secureStorage.getItem("role"),
                        comment: null,
                        deleted: deleted,
                        onhold: hold
                    }
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/transaction", options)
                    .then(response => response.json())
                        .then(json =>{
                            if(json.blocked){
                                setBlocked(true)
                            }else{
                                successAlert()
                            }
                        })
                }
            }
            await setUpdateData(!updateData)
            setLoading(false)
            await getProgress()
            setSelected([])
        }else{
            setWarningSelected(true)
        }    
    }

    async function returnLead(destiny){
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorCL(false)
        setWarningSelected(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setErrorUnclaimR(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                setLoading(true)
                const body ={
                    user : currentUser,
                    fileName: selected[i],
                    to: destiny,
                    from: currentTab
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/returnLead", options)
                .then(response => response.json())
                        .then(json =>{
                            if(json.blocked){
                                setBlocked(true)
                            }else{
                                successAlert()
                            }
                        })
            }
            await setUpdateData(!updateData)
            setLoading(false)
            await getProgress()
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }
    
    async function returnLeadStress(){
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorCL(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setErrorUnclaimR(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                        
                const body ={
                    user : currentUser,
                    file: selected[i],
                    comments: comment
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/returnLeadStress", options)
                .then(response => response.json())
                .then(json =>{
                    if(json.blocked){
                        setBlocked(true)
                    }else{
                        successAlert()
                    }
                })
            }
            await setUpdateData(!updateData)
            setLoading(false)
            await getProgress()
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }

    async function restore(){
        setErrorReports(false)
        setErrorUnclaimR(false)
        setErrorReportD(false)
        setErrorUnclaim(false)
        setErrorCL(false)
        setTransactionSuccess(false);
        setErrorPI(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                const body ={
                    fileName: selected[i],
                    user: currentUser,
                    role: currentRole,
                    deleted: 0,
                    onhold: 0
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/restore", options)
                successAlert()
            }
            await setUpdateData(!updateData)
            setLoading(false)
            await getProgress()
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }

    async function sendProcessClick(fileName){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorCL(false)
        setTransactionSuccess(false);
        setLoading(true)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)
            
            const body ={
                user : currentUser,
                file: fileName,
                role: currentRole
            }
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/process", options)
        
        await setUpdateData(!updateData)
        setLoading(false)
        setSelected([])
    }

    async function sendInstrumentClick(fileName){
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorUnclaimR(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setLoading(true)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)
            
            const body ={
                user : currentUser,
                file: fileName,
                role: currentRole
            }
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrument", options)
        
        await setUpdateData(!updateData)
        setLoading(false)
        setSelected([])
    }

    async function sendCancelProcessClick(fileName){
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorUnclaimR(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setLoading(true)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)

        const body ={
            file: fileName,
            user: currentUser,
            role: currentRole,
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/cancelProc", options)
    
        await setUpdateData(!updateData)
        await setLoading(false)
        setSelected([])
    }

    async function sendCancelInstrumentClick(fileName){
        setErrorReports(false)
        setErrorUnclaim(false)
        setErrorUnclaimR(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setWarningSelected(false)
        setLoading(true)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)
        const body ={
            file: fileName,
            user: currentUser,
            role: currentRole
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/cancelInst", options)
    
        await setUpdateData(!updateData)
        setLoading(false)
        setSelected([])
    }

    async function updateD(){
        await setUpdateData(!updateData)
    }

    async function downloadFiles(){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorCL(false)
        setTransactionSuccess(false);
        setErrorUnclaim(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)    
    
            for (let i = 0; i < selected.length; i++){

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/pdf"
                    }
                }
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getAttach/"+selected[i], options)
                .then(response => response.json())
                .then(async json => {
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/download/"+selected[i], options)
                    .then(res => res.blob())
                    .then( async response =>{
                        setDownloadzip(downloadZip.file(selected[i], new Blob([response]),{binary:true}))   
                        for(let i = 0; i < json.length; i++){
                            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/download/"+json[i], options)
                            .then(res => res.blob())
                            .then(response =>{
                                setDownloadzip(downloadZip.file(json[i], new Blob([response]),{binary:true}))   
                            })
                        }
                        
                    })
                })
            

                
        
            }
            const zipname = String(Date().toLocaleString().replace(/\s/g, '-').split('-G').slice(0, -1))
            downloadZip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
                saveAs(blob,  zipname)
            })  
            
            await setDownloadzip(new JSZip())   
            //await setAttachFiles(null)
            await setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }

    async function downloadMaster(){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setErrorCL(false)
        setTransactionSuccess(false);
        setErrorUnclaim(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if(selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)    
    
            for (let i = 0; i < selected.length; i++){

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/pdf"
                    }
                }
                
                
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/download/"+selected[i], options)
                .then(res => res.blob())
                .then( async response =>{
                    setDownloadzip(downloadZip.file(selected[i], new Blob([response]),{binary:true}))   
                    
                })
        
            }
            const zipname = String(Date().toLocaleString().replace(/\s/g, '-').split('-G').slice(0, -1))
            downloadZip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
                saveAs(blob,  zipname)
            })  
            
            await setDownloadzip(new JSZip())   
            //await setAttachFiles(null)
            await setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }

    async function downloadHistory(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadHistory/")
        .then(response => response.json())
        .then(json => {
            json = JSON.parse(json)
            const headers = ["ISO_ID", "FROM", "TO", "DATE", "COMMENT", "USER"]
            for (let i=0; i<json.length; i++){
                json[i].created_at = json[i].created_at.substring(8,10) + "/" + json[i].created_at.substring(5,7) + "/" + json[i].created_at.substring(0,4);
            } 
            exportToExcel(json, "Comments", headers)
        })
    }

    async function downloadStatus(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadStatus/")
        .then(response => response.json())
        .then(json => {
            let headers = ["ISO_ID", "START_DATE", "CURRENT_DATE", "CONDITION", "TRAY", "CLAIMED"]

            if(process.env.REACT_APP_PROGRESS === "1"){
                headers = ["ISO_ID", "START_DATE", "CURRENT_DATE", "LINE TYPE", "CONDITION", "TRAY", "CLAIMED"]
            }
            
            json = JSON.parse(json);
            for (let i=0; i<json.length; i++){
                json[i].created_at = json[i].created_at.substring(3,5) + "/" + json[i].created_at.substring(0,2) + "/" + json[i].created_at.substring(6,10);
                json[i].updated_at = json[i].updated_at.substring(3,5) + "/" + json[i].updated_at.substring(0,2) + "/" + json[i].updated_at.substring(6,10);
            } 

            exportToExcel(json, "Status", headers)
        })
    }

    async function downloadPI(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadPI/")
        .then(response => response.json())
        .then(json => {
            json = JSON.parse(json);
            for (let i=0; i<json.length; i++){
                json[i].updated_at = json[i].updated_at.substring(0,10);
            } 
            const headers = ["ISO_ID", "PROCESS", "INSTRUMENTATION", "DATE"]
            exportToExcel(json, "IsoStatusSIT-SPO", headers)
        })
    }

    async function downloadIssued(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadIssued/")
        .then(response => response.json())
        .then(json => {
            const headers = ["ISO_ID", "REV0", "REV1", "REV2", "REV3", "REV4"]
            exportToExcel(JSON.parse(json), "IsoStatusIssued", headers)
        })
    }

    async function downloadStatus3D(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadStatus3D/")
        .then(response => response.json())
        .then(json => {
            let output = JSON.stringify(json.log)
            output = output.substring(1,output.length-1)
            output = output.replaceAll(",", "\n")
            output = output.replaceAll(/['"]+/g, "")


            const data = new Blob([output], { type: 'txt' });
            FileSaver.saveAs(data, "fromIsoTrackerTo3d.mac");
        })
    }

    async function downloadModelled(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadModelled/")
        .then(response => response.json())
        .then(json => {
            const headers = ["TAG", "ISO_ID", "TYPE"]
            exportToExcel(JSON.parse(json), "Modelled", headers)
        })
    }

    async function downloadUsers(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadUsers")
        .then(response => response.json())
        .then(json => {
            const headers = ["USERNAME", "EMAIL", "ROLE"]
            exportToExcel(json, "Users", headers)
        })
    }

    const exportToExcel = (apiData, fileName, headers) => {

        setErrorReports(false)
        const fileType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const header_cells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1', 'N1', 'O1', 'P1', 'Q1', 'R1', 'S1', 'T1', 'U1', 'V1', 'W1']
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

    async function setUploading(active){
        setErrorReports(false)
        setErrorReportD(false)
        setLoading(active)
        if(!active){
            successAlert()
        }
    }

    async function setErrorReport(){
        setErrorReports(true)
    }

    async function issue(transmittal, date){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if (selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                const body ={
                    user : currentUser,
                    file: selected[i],
                    role: currentRole,
                    transmittal: transmittal,
                    date: date
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/toIssue", options)
                .then(response => response.json())
                .then(json =>{
                    if(json.blocked){
                        setBlocked(true)
                    }else{
                        successAlert()
                    }
                })
            }
            await setUpdateData(!updateData)
            setLoading(false)
            await getProgress()
            setSelected([])
        }
    }

    async function newRev(comments) {
        setErrorReports(false)
        setErrorUnclaimR(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        if (selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                const body ={
                    user : currentUser,
                    file: selected[i],
                    role: currentRole,
                    comments: comments
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/newRev", options)
                .then(response => response.json())
                .then(json =>{
                    
                    if(json.blocked){
                        setBlocked(true)
                    }else if(json.already){
                        setAlreadyOnRev(true)
                    }else{
                        successAlert()
                    }
                })
            }
            setUpdateData(!updateData)
            setLoading(false)
            await getProgress()
            setSelected([])
        }
    }

    async function request() {
        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        if (selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            for (let i = 0; i < selected.length; i++){
                const body ={
                    user : currentUser,
                    file: selected[i],
                    role: currentRole,
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/request", options)
                
            }
            setUpdateData(!updateData)
            setLoading(false)
            setSelected([])
        }

    }

    async function returnIso(destiny, comments){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        if (selected.length > 0){
            setLoading(true)
            localStorage.setItem("update", true)
            if(comments.length < 1){
                comments = comment
            }
            for (let i = 0; i < selected.length; i++){
                const body ={
                    user : currentUser,
                    file: selected[i],
                    role: currentRole,
                    from: currentTab,
                    destiny: destiny,
                    comments: comments
                }
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/returnIso", options)
                .then(response => response.json())
                .then(json =>{
                    if(json.blocked){
                        setBlocked(true)
                    }else{
                        successAlert()
                    }
                })
                
            }
            setUpdateData(!updateData)
            setLoading(false)
            setComment("")
            setSelected([])
        }else{
            setWarningSelected(true)
        }
    }

    async function success(){
        successAlert()
    }

    async function unlock(isoid){

        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setBlocked(false)
        setErrorReportD(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)

        const body = {
            isoid: isoid
          }
      
          const options = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
          }
      
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/unlock", options)
          .then(response => {
            setTransactionSuccess(true)
          })

          setUpdateData(!updateData)
    }

    async function rename(newName, oldName){

        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)

        const body = {
            oldName: oldName,
            newName: newName
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/rename", options)
        .then(response => console.log("Cambiado"))

        successAlert()
        
        setUpdateData(!updateData)
    }

    async function cancelRev(filename){

        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)

        const body = {
            filename: filename,
            user: currentUser
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/cancelRev", options)
        .then(response => successAlert())

        
        setUpdateData(!updateData)
    }

    async function setErrorReportData(index){
        setErrorReportD(true)
    }

    async function addUser(username, email, roles){

        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)

        const body = {
            username: username,
            email: email,
            roles: roles
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/createUser", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)
        
    }

    async function deleteUser(id){

        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)


        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/user/"+id, options)
        .then(response => response.json())
        .then(json =>{
            if(json.error){
                setErrorDeleteUser(true)
            }else{
                successAlert()
            }
        })

       setUpdateData(!updateData)

    }

    async function submitRoles(id, roles){
        setErrorUnclaimR(false)
        setErrorReports(false)
        setTransactionSuccess(false);
        setErrorCL(false)
        setErrorUnclaim(false)
        setWarningSelected(false)
        setErrorReportD(false)
        setBlocked(false)
        setErrorDeleteUser(false)
        
        localStorage.setItem("update", true)

        const body = {
            id: id,
            roles: roles
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/users/manageRoles", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)
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
    async function exportModelled(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportModelled/")
        .then(response => response.json())
        .then(json => {
            const headers = ["UNIT", "AREA", "LINE", "TRAIN Nº", "FLUID", "SEQUENTIAL", "LINE ID", "ISO ID", "SPEC CODE", "DIAMETER", "P&ID", "STRESS LEVEL", "CALCULATION NOTES", "INSULATION", "TOTAL WEIGHT"]
            exportToExcel(JSON.parse(json), "Isocontrol modelled", headers)
        })
    }

    async function exportNotModelled(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportNotModelled/")
        .then(response => response.json())
        .then(json => {
            
            const headers = ["UNIT", "AREA", "LINE", "TRAIN Nº", "LINE ID", "ISO ID", "SPEC CODE", "TOTAL WEIGHT", "LDL", "BOM"]
            exportToExcel(JSON.parse(json), "Isocontrol not modelled", headers)
        })
    }

    async function exportFull(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportFull/")
        .then(response => response.json())
        .then(json => {           
            const headers = ["LINE ID", "UNIT", "AREA", "LINE", "TRAIN Nº", "FLUID", "SEQUENTIAL", "SPEC CODE", "DIAMETER", "P&ID", "STRESS LEVEL", "CALCULATION NOTES", "INSULATION", "TOTAL WEIGHT", "MODELLED", "TRAY", "PROGRESS", "HOLDS", "LDL", "BOM"]
            exportToExcel(JSON.parse(json), "Isocontrol", headers)
        })
    }

    async function exportLineIdGroup(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportLineIdGroup/")
        .then(response => response.json())
        .then(json => {
            
            const headers = ["LINE ID", "ITEMS", "TOTAL WEIGHT"]
            exportToExcel(JSON.parse(json), "Isocontrol line id group", headers)
        })
    }

    async function exportHolds(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportHolds/")
        .then(response => response.json())
        .then(json => {
            
            const headers = ["TAG", "HOLD1", "DESCRIPTION1", "HOLD2", "DESCRIPTION2", "HOLD3", "DESCRIPTION3", "HOLD4", "DESCRIPTION4", "HOLD5", "DESCRIPTION5", "HOLD6", "DESCRIPTION6", "HOLD7", "DESCRIPTION7", "HOLD8", "DESCRIPTION8", "HOLD9", "DESCRIPTION9", "HOLD10", "DESCRIPTION10"]
            exportToExcel(JSON.parse(json), "Holds", headers)
        })
    }

    async function exportHoldsNoProgress(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportHoldsNoProgress/")
        .then(response => response.json())
        .then(json => {
            json = JSON.parse(json);
            for (let i=0; i<json.length; i++){
                json[i].updated_at = json[i].updated_at.substring(0,10);
            } 
            const headers = ["ISO ID", "REVISION", "DATE", "FROM", "USER", "COMMENTS"]
            exportToExcel(json, "Holds", headers)
        })
    }

    async function downloadBOM(){
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/downloadBOM/")
        .then(res => res.blob())
        .then(response => {
        const file = new Blob([response], {
            type: "application/pdf"
        });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);

            var fileLink = document.createElement('a');
            fileLink.href = fileURL;

            // it forces the name of the downloaded file
            fileLink.download = "BOM.xlsx";

            // triggers the click event
            fileLink.click();


        })
        .catch(error => {
        console.log(error);
        });
  }

    async function exportTimeTrack(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportTimeTrack")
        .then(response => response.json())
        .then(json => {
            
            const headers = ["ISO ID", "Revision", "Design", "Stress", "Supports", "Materials", "Issuer", "LOS/IsoControl"]
            exportToExcel(JSON.parse(json), "TimeTrack", headers)
        })
    }

    async function exportByPass(){
        setErrorReports(false)

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exportByPass")
        .then(response => response.json())
        .then(json => {
            json = JSON.parse(json);
            for (let i=0; i<json.length; i++){
                json[i].date = json[i].date.substring(8,10) + "/" + json[i].date.substring(5,7) + "/" + json[i].date.substring(0,4);
            } 
            const headers = ["TAG", "ISO ID", "Type", "Date", "User", "Notes", "Comments", "Status"]
            exportToExcel(json, "ByPass", headers)
        })
    }

    async function sendHold(fileName){
        const body ={
            fileName : fileName
          }
      
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/sendHold", options)
          await setUpdateData(!updateData)
          await setTransactionSuccess(true)
    }

    async function excludeHold(fileName){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf"
            }
          }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/excludeHold/"+fileName, options)
          await setUpdateData(!updateData)
          await setTransactionSuccess(true)
          tableContent = <OnHoldTable onChange={value=> setSelected(value)} selected = {selected} currentTab = {currentTab} currentRole = {currentRole} updateData = {updateData} excludeHold = {excludeHold.bind(this)}/>
    }
        
    async function returnToLOS(fileName){
        const body = {
            fileName: fileName,
            email: currentUser,
            role: currentRole
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/returnToLOS", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)
    }

    async function unlockAll(){
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/unlockAll", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)

    }

    async function createByPass(type, notes, id){
        const body = {
            type: type,
            notes: notes,
            username: currentUser,
            id: id
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/createByPass", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)
    }

    async function editByPass(type, notes, id){
        const body = {
            type: type,
            notes: notes,
            id: id
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/editByPass", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)
    }

    async function deleteByPass(id){
        const body = {
            id: id
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/deleteByPass", options)
        .then(response => response.json())
        .then(json =>{
            if(json.success){
                successAlert()
            }
        })
        setUpdateData(!updateData)
    }

    if(currentTab === "Upload IsoFiles"){
        secureStorage.setItem("tab", "Upload IsoFiles")
        tableContent = <DragAndDrop mode={"upload"} role={currentRole} user={currentUser}  uploaded={getProgress.bind(this)}/>
    }if(currentTab === "CheckBy"){
        tableContent = <CheckInTable/>
    }if(currentTab === "My Tray"){
        tableContent = <MyTrayTable  updateData = {updateData} onChange={value=> setSelected(value)} cancelVerifyClick={cancelVerifyClick.bind(this)} sendProcessClick={sendProcessClick.bind(this)} success={success.bind(this)} sendInstrumentClick = {sendInstrumentClick.bind(this)} sendCancelProcessClick={sendCancelProcessClick.bind(this)} sendCancelInstrumentClick={sendCancelInstrumentClick.bind(this)} updateD = {updateD.bind(this)} createByPass = {(type, notes, id) => createByPass(type, notes, id)} currentRole = {currentRole} currentUser = {currentUser} selected={selected} />
    }if(currentTab === "Recycle bin"){
        tableContent = <BinTable onChange={value=> setSelected(value)} selected = {selected} currentTab = {currentTab} updateData = {updateData}/>
    }if(currentTab === "On hold"){
        tableContent = <OnHoldTable onChange={value=> setSelected(value)} selected = {selected} currentTab = {currentTab} currentRole = {currentRole} updateData = {updateData} excludeHold = {excludeHold.bind(this)}/>
    }if(currentTab === "Status"){
        tableContent = <StatusDataTable onChange={value=> setSelected(value)} role = {currentRole}/>
    }if(currentTab === "History"){
        tableContent = <HistoryDataTable/>   
    }if(currentTab === "Process" || currentTab === "Instrument"){
        tableContent = <ProcInstTable onChange={value=> setSelected(value)} selected = {selected} currentTab = {currentTab} updateData = {updateData} />
    }if(currentTab === "Reports"){
        tableContent = <ReportBoxBtns user={currentUser} role={currentRole} downloadHistory={downloadHistory.bind(this)} downloadStatus={downloadStatus.bind(this)} downloadPI={downloadPI.bind(this)} downloadIssued={downloadIssued.bind(this)} setErrorReport={setErrorReport.bind(this)} setUploading={setUploading.bind(this)} downloadStatus3D={downloadStatus3D.bind(this)} downloadModelled={downloadModelled.bind(this)} downloadUsers={downloadUsers.bind(this)} setErrorReportData={setErrorReportData.bind(this)}/>
    }if(process.env.REACT_APP_PROGRESS === "1"){
        progressBtn = <ProgressBtn onChange={value => setCurrentTab("Progress")} currentTab = {currentTab}></ProgressBtn>
        modelledBtn = <ModelledBtn onChange={value => setCurrentTab("Modelled")} currentTab = {currentTab}></ModelledBtn>
    }if(currentTab === "Progress"){
        tableContent = <ProgressPlot></ProgressPlot>
        dataTableHeight = "500px"
    }if(currentTab === "Modelled"){
        tableContent = <ModelledDataTable role={currentRole} unlock = {unlock.bind(this)}></ModelledDataTable>
    }if(currentRole !== "Review"){
        myTrayBtn = <MyTrayBtn onChange={value => setCurrentTab(value)} currentTab = {currentTab}/>
    }if(currentRole === "SpecialityLead"){
        if (currentTab === "Users"){
            usersButton = <button className="navBar__button" onClick={()=>setCurrentTab("Users")} style={{width:"100px"}}><img src={UsersIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Users</p></button>
            secureStorage.setItem("tab", "Users")
        }else{
            usersButton = <button className="navBar__button" onClick={()=>setCurrentTab("Users")} style={{width:"100px"}}><img src={UsersIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Users</p></button>
        }
        if (currentTab === "TimeTrack"){
            ttButton = <button className="navBar__button" onClick={()=>setCurrentTab("TimeTrack")} style={{width:"135px"}}><img src={ClockIcon} alt="tt" className="navBar__icon" style={{marginRight:"0px", height:"28px", marginTop:"8px"}}></img><p className="navBar__button__text">TimeTrack</p></button>
            secureStorage.setItem("tab", "TimeTrack")
        }else{
            ttButton = <button className="navBar__button" onClick={()=>setCurrentTab("TimeTrack")} style={{width:"135px"}}><img src={ClockIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px", height:"28px", marginTop:"8px"}}></img><p className="navBar__button__text">TimeTrack</p></button>
        }
    }if(currentTab === "Users"){
 
        tableContent = <UsersDataTable updateData={updateData} deleteUser={deleteUser.bind(this)} submitRoles={submitRoles.bind(this)}/>

    }if(currentTab === "TimeTrack"){
 
        tableContent = <TimeTrackDataTable/>

    }if(currentTab === "ByPass"){
 
        tableContent = <ByPassDataTable success={success.bind(this)} updateData={updateData} editByPass = {editByPass.bind(this)} deleteByPass={deleteByPass.bind(this)}/>

    }

    if(((currentRole === "Design" || currentRole === "DesignLead") && currentTab === "Design") || 
    ((currentRole === "Stress" || currentRole === "StressLead") && currentTab === "Stress") ||
    ((currentRole === "Supports" || currentRole === "SupportsLead") && currentTab === "Supports") ||
    ((currentRole === "Materials") && currentTab === "Materials") ||
    ((currentRole === "Issuer") && currentTab === "Issuer") ||
    ((currentRole === "SpecialityLead" && currentTab ==="SpecialityLead") ||
    (currentTab=== "My Tray")) || (((currentTab === "Recycle bin" || currentTab === "On hold") && currentRole === "DesignLead") || 
    currentRole === "SpecialityLead" && currentTab !== "Progress") || (currentTab === "Process" && currentRole === "Process") ||
    (currentRole === "Instrument" && currentTab === "Instrument") ||
    (currentRole === "Design" || currentRole === "DesignLead") && currentTab === "Issued"){
        actionButtons = <ActionButtons claimClick={claim.bind(this)} verifyClick={verifyClick.bind(this)} unclaimClick={unclaim.bind(this)} transaction={transaction.bind(this)} restoreClick={restore.bind(this)} returnLead={returnLead.bind(this)} returnLeadStress={returnLeadStress.bind(this)} downloadFiles={downloadFiles.bind(this)} forceClaim={forceClaim.bind(this)} issue={issue.bind(this)} newRev={newRev.bind(this)} request={request.bind(this)} returnIso={returnIso.bind(this)} addUser={addUser.bind(this)} success={success.bind(this)} onlyDownload = {false} currentTab = {currentTab} user={currentUser} role = {currentRole} exportModelled={exportModelled.bind(this)} exportNotModelled={exportNotModelled.bind(this)} exportFull={exportFull.bind(this)} exportLineIdGroup={exportLineIdGroup.bind(this)} exportHolds={exportHolds.bind(this)} exportHoldsNoProgress={exportHoldsNoProgress.bind(this)} downloadBOM={downloadBOM.bind(this)} exportTimeTrack={exportTimeTrack.bind(this)} exportByPass={exportByPass.bind(this)} downloadMaster={downloadMaster.bind(this)}/>
    }else if(currentTab !== "History" && currentTab !== "Upload IsoFiles" && currentTab !== "Recycle bin" && currentTab !== "Reports" && currentTab !== "Progress" && currentTab !== "Modelled"){
        actionButtons = <ActionButtons claimClick={claim.bind(this)} verifyClick={verifyClick.bind(this)} unclaimClick={unclaim.bind(this)} transaction={transaction.bind(this)} restoreClick={restore.bind(this)} returnLead={returnLead.bind(this)} returnLeadStress={returnLeadStress.bind(this)} downloadFiles={downloadFiles.bind(this)} forceClaim={forceClaim.bind(this)} issue={issue.bind(this)} newRev={newRev.bind(this)} request={request.bind(this)} returnIso={returnIso.bind(this)} addUser={addUser.bind(this)} success={success.bind(this)} onlyDownload = {true} currentTab = {currentTab} user={currentUser} role = {currentRole} exportModelled={exportModelled.bind(this)} exportNotModelled={exportNotModelled.bind(this)} exportFull={exportFull.bind(this)} exportLineIdGroup={exportLineIdGroup.bind(this)} exportHolds={exportHolds.bind(this)} exportHoldsNoProgress={exportHoldsNoProgress.bind(this)} downloadBOM={downloadBOM.bind(this)} exportTimeTrack={exportTimeTrack.bind(this)} exportByPass={exportByPass.bind(this)} downloadMaster={downloadMaster.bind(this)}/>
    }
    if(currentTab === "Modelled"){
        actionButtons = <div style={{zoom:0.8}}><button className="action__btn" onClick={()=>downloadModelled()}>Export</button><button className="action__btn" onClick={()=>unlockAll()}>Unlock all</button></div>
    }

    if(currentRole === "Project"){
        actionButtons = null
    }

    let recycleBinBtn, onHoldBtn, issuedBtn, reportsBtn, processBtn, instrumentationBtn, byPassBtn = null

    if(currentTab === "Recycle bin"){
        recycleBinBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Recycle bin")} style={{backgroundColor:"#99C6F8", marginLeft:"232px"}}><img src={Trash} alt="trash" className="navBar__icon"></img><p className="navBar__button__text">Trash</p></button>
    }else{
        recycleBinBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Recycle bin")} style={{marginLeft:"232px"}}><img src={Trash} alt="trash" className="navBar__icon"></img><p className="navBar__button__text">Trash</p></button>
    }

    if(currentTab === "On hold"){
        onHoldBtn = <button className="navBar__button" onClick={()=>setCurrentTab("On hold")} style={{backgroundColor:"#99C6F8"}}><img src={Hold} alt="hold" className="navBar__icon"></img><p className="navBar__button__text">Hold</p></button>

    }else{
        onHoldBtn = <button className="navBar__button" onClick={()=>setCurrentTab("On hold")}><img src={Hold} alt="hold" className="navBar__icon"></img><p className="navBar__button__text">Hold</p></button>
    }

    if(currentTab === "Issued"){
        issuedBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Issued")} style={{backgroundColor:"#99C6F8"}}><img src={Issued} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Issued</p></button>

    }else{
        issuedBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Issued")}><img src={Issued} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text" >Issued</p></button>
    }

    if(currentTab === "Reports"){
        reportsBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Reports")} style={{backgroundColor:"#99C6F8", width:"120px"}}><img src={Reports} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Reports</p></button>
    }else{
        reportsBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Reports")} style={{width:"120px"}}><img src={Reports} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Reports</p></button>
    }

    if(currentTab === "Progress"){
        progressBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Progress")} style={{backgroundColor:"#99C6F8", width:"120px"}}><img src={Progress} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Progress</p></button>
    }else if(process.env.REACT_APP_PROGRESS === "1"){
        progressBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Progress")} style={{width:"120px"}}><img src={Progress} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Progress</p></button>
    }

    if(currentTab === "Modelled"){
        modelledBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Modelled")} style={{backgroundColor:"#99C6F8", width:"120px"}}><img src={Modelled} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Modelled</p></button>

    }else if(process.env.REACT_APP_PROGRESS === "1"){
        modelledBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Modelled")} style={{width:"120px"}}><img src={Modelled} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Modelled</p></button>
    }
    if(currentRole === "Process"){
        if(currentTab === "Process"){
            processBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Process")} style={{backgroundColor:"#99C6F8", width:"120px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Process</p></button>
    
        }else{
            processBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Process")} style={{width:"120px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Process</p></button>
        }
    }else if(currentRole === "Instrument"){
        if(currentTab === "Instrument"){
            instrumentationBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Instrument")} style={{backgroundColor:"#99C6F8", width:"170px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Instrumentation</p></button>
    
        }else{
            instrumentationBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Instrument")} style={{width:"170px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Instrumentation</p></button>
        }
    }else if(currentRole === "SpecialityLead"){
        if(currentTab === "Process"){
            processBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Process")} style={{backgroundColor:"#99C6F8", width:"120px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Process</p></button>
    
        }else{
            processBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Process")} style={{width:"120px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Process</p></button>
        }
        if(currentTab === "Instrument"){
            instrumentationBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Instrument")} style={{backgroundColor:"#99C6F8", width:"170px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Instrumentation</p></button>
    
        }else{
            instrumentationBtn = <button className="navBar__button" onClick={()=>setCurrentTab("Instrument")} style={{width:"170px"}}><img src={ProcInst} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Instrumentation</p></button>
        }
    }else{
        processBtn = null
        instrumentationBtn = null
    }
    if(currentTab === "ByPass"){
        byPassBtn = <button className="navBar__button" onClick={()=>setCurrentTab("ByPass")} style={{backgroundColor:"#99C6F8", width:"120px"}}><img src={Reports} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">ByPass</p></button>
    }else{
        byPassBtn = <button className="navBar__button" onClick={()=>setCurrentTab("ByPass")} style={{width:"120px"}}><img src={Reports} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">ByPass</p></button>
    }

    if(currentTab === "History"){
        actionButtons = null
    }
    

    let isoControlBtn = null
    let isoControlNotModBtn = null
    let isoControlFullBtn = null
    let isoControlEstimatedBtn = null
    let isocontrolWeightsComponent = null
    let isoControllLineIdGroupBtn = null
    let editCustomBtn = null
    let uploadBOMBtn = null

    if(process.env.REACT_APP_ISOCONTROL === "1" && currentRole === "SpecialityLead"){
        
        if(currentTab === "IsoControl"){
            secureStorage.setItem("tab", "IsoControl")
            isoControlBtn = <button type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Modelled</button>
            tableContent = <IsoControlModelledDataTable/>
        }else{
            isoControlBtn = <button type="button" className="nav__button text-left"  onClick={() => {setCurrentTab("IsoControl")}}>Modelled</button>
            
        }
        if(currentTab === "IsoControlNotMod"){
            secureStorage.setItem("tab", "IsoControlNotMod")
            isoControlNotModBtn = <button type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Not modelled</button>
            tableContent = <IsoControlNotModelledDataTable/>
        }else{
            isoControlNotModBtn = <button type="button" className="nav__button text-left"  onClick={() => {setCurrentTab("IsoControlNotMod")}}>Not modelled</button>
            
        }
        if(currentTab === "IsoControlFull"){
            secureStorage.setItem("tab", "IsoControlFull")
            isoControlFullBtn = <div><p className="isotracker__table__trays__group">IsoControl</p><button type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Report</button></div>
            tableContent = <IsoControlFullDataTable/>
            isoControllLineIdGroupBtn = <button className="isocontrol__lineid__group__button" onClick={() => {setCurrentTab("IsoControlLineIdGroup")}}>Group by line ID</button>
            uploadBOMBtn = <UploadBOMIsocontrolPopUp success={successAlert.bind(this)} />
            //editCustomBtn = <button className="isocontrol__lineid__group__button" onClick={() => {setCurrentTab("IsoControlEditCustom")}} style={{marginLeft:"20px"}}>Edit custom fields</button>
        }else{
            isoControlFullBtn = <div><p className="isotracker__table__trays__group">IsoControl</p><button type="button" className="nav__button text-left"  onClick={() => {setCurrentTab("IsoControlFull")}}>Report</button></div>
            
        }

        if(currentTab === "EstimatedPipes"){
            secureStorage.setItem("tab", "EstimatedPipes")
            isoControlEstimatedBtn = <button type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Estimated</button>
            tableContent = <EstimatedPipesExcel success={success.bind(this)} estimatedWarning={() => setEstimatedWarning(true)} estimatedEmpty={() => setEstimatedEmpty(true)}/>
            //editCustomBtn = <button className="isocontrol__lineid__group__button" onClick={() => {setCurrentTab("IsoControlEditCustom")}} style={{marginLeft:"20px"}}>Edit custom fields</button>
        }else{
            isoControlEstimatedBtn = <button type="button" className="nav__button text-left"  onClick={() => {setCurrentTab("EstimatedPipes")}}>Estimated</button>
            
        }

        if(currentTab === "IsoControlLineIdGroup"){
            secureStorage.setItem("tab", "IsoControlLineIdGroup")
            isoControllLineIdGroupBtn = <button className="isocontrol__lineid__group__button" style={{backgroundColor: "rgb(148, 220, 170)"}} onClick={() => {setCurrentTab("IsoControlFull")}}>Group by line ID</button>
            tableContent = <IsoControlGroupLineIdDataTable/>
            //editCustomBtn = <button className="isocontrol__lineid__group__button" onClick={() => {setCurrentTab("IsoControlEditCustom")}} style={{marginLeft:"20px"}}>Edit custom fields</button>

        }
        
        if(currentTab === "IsoControlEditCustom"){
            secureStorage.setItem("tab", "IsoControlEditCustom")
            //editCustomBtn = <button className="isocontrol__lineid__group__button" style={{backgroundColor: "rgb(148, 220, 170)", marginLeft:"20px"}} onClick={() => {setCurrentTab("IsoControlFull")}}>Edit custom fields</button>
            tableContent = <IsoControlGroupLineIdDataTable />
            isoControllLineIdGroupBtn = <button className="isocontrol__lineid__group__button" onClick={() => {setCurrentTab("IsoControlLineIdGroup")}}>Group by line ID</button>

        }
        
        if(currentTab === "IsoControlFull"){
            isocontrolWeightsComponent = 
                <center><button className="isocontrol__weigths__2" disabled>Modelled: {modelledWeight} t &nbsp;&nbsp;&nbsp;&nbsp;   Not modelled: {notModelledWeight} t  &nbsp;&nbsp;&nbsp;&nbsp; Total: {totalIsocontrolWeight} t</button></center>
    
        }


    }

    if(currentRole === "Design"){
        if(currentTab === "Upload IsoFiles"){
            uploadButton = <button className="navBar__button" onClick={()=>setCurrentTab("Upload IsoFiles")} style={{width:"120px"}}><img src={UploadIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p className="navBar__button__text">Upload</p></button>
        }else{
            uploadButton = <button className="navBar__button" onClick={()=>setCurrentTab("Upload IsoFiles")} style={{width:"120px"}}><img src={UploadIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px"}}></img><p  className="navBar__button__text">Upload</p></button>
        }
    }else{
        uploadButton = null
    }


    return (       
        <body>
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            {content}
            
            <div>
              <center>
                      <Collapse in={loading}>
                          <Alert style={{fontSize:"22px",position: "fixed", left: "50%", top:"10%", transform: "translate(-50%, -50%)",zIndex:"3"}} severity="info"
                              >
                              Processing...
                          </Alert>
                      </Collapse>
                      <div
                        className={`alert alert-success ${errorPI ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorPI(false)}
                        >
                            <AlertF type="error" subtext="At least one isometric was on revision and wasn't sent to LDE/Isocontrol" margin="-5px"/>                            
                      </div>
 
                      <div
                        className={`alert alert-success ${transactionSuccess ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setTransactionSuccess(false)}
                        >
                          <AlertF type="success" margin="-30px" text="The action has been completed."/>
                      </div>
                      <div
                        className={`alert alert-success ${errorUnclaim ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorUnclaim(false)}
                        >
                        <AlertF type="error" subtext="Can't unclaim an iso forced by LOS" margin="-105px"/>                            
                      </div>
                      <div
                        className={`alert alert-success ${errorUnclaimR ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorUnclaimR(false)}
                        >
                        <AlertF type="error" subtext="Can't unclaim a returned ISO!" margin="-118px"/>   
                      </div>

                      <div
                        className={`alert alert-success ${errorReports ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorReports(false)}
                        >
                         <AlertF type="error" subtext="Missing columns!" margin="-155px"/>   
                      </div>
  
                      <div
                        className={`alert alert-success ${errorCL ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorCL(false)}
                        >
                        <AlertF type="error" subtext="Missing clean!" margin="-150px"/>  
                      </div>
                      <div
                        className={`alert alert-success ${warningSelected ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setWarningSelected(false)}
                        >
                          <AlertF type="warning" text="Select at least one isometric!" margin="-40px"/>   
                      </div>
                      <div
                        className={`alert alert-success ${alreadyOnRev ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setAlreadyOnRev(false)}
                        >
                          <AlertF type="warning" text="Already on a new revision!" margin="-40px"/>   
                      </div>
                      <div
                        className={`alert alert-success ${blocked ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setBlocked(false)}
                        >
                         <AlertF type="error" subtext="The isometric has been locked! Contact the administrator." margin="-45px"/>          
                      </div>
                      <div
                        className={`alert alert-success ${errorReportD ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorReportD(false)}
                        >
                          <AlertF type="error" subtext="There is a line of the report has an invalid type or progress!" margin="-35px"/>          
                      </div>
                      <div
                        className={`alert alert-success ${errorDeleteUser ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorDeleteUser(false)}
                        >
                          <AlertF type="error" subtext="This user has claimed isometrics and can't be deleted!" margin="-40px"/>          
                      </div>
                      <div
                        className={`alert alert-success ${errorREV ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setErrorREV(false)}
                        >
                        <AlertF type="warning" text="Complete the revision parameters!" margin="-20px"/>   
                      </div>
                      <div
                        className={`alert alert-success ${estimatedWarning ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setEstimatedWarning(false)}
                        >
                        <AlertF type="warning" text="Changes on modelled can't be saved!" margin="-10px"/>   
                      </div>
                      <div
                        className={`alert alert-success ${estimatedEmpty ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => setEstimatedEmpty(false)}
                        >
                        <AlertF type="warning" text="Pipes with empty values didn't save!" margin="-10px"/>   
                      </div>
                  </center>
              {navBar}
              <div className="isotracker__row">
                  <div className="isotracker__column">
                      <img src={IsoTrackerLogo} alt="isoTrackerLogo" className="isoTrackerLogo__image2"/>
                      
                      <div className="roleSelector__containerF">
                              <RoleDropDown style={{paddingLeft: "2px"}} onChange={value => setCurrentRole(value)} roles = {roles}/>
                      </div>
                  </div>
                  <div className="column1">
                      <div className="stateTable__containerF">
                                  
                          <StateTable updateData={updateData} currentRole = {currentRole}/>
                                 
                      </div>  
                  </div>
                  
              </div>
              <table className="isotracker__table__container" >
                      <tr className="isotracker__table__navBar__container">
                          <th  colspan="2" className="isotracker__table__navBar">
                              {recycleBinBtn}
                              {onHoldBtn}
                              {issuedBtn}
                              {byPassBtn}
                              {reportsBtn}
                              {progressBtn}
                              {modelledBtn}
                              {processBtn}
                              {instrumentationBtn}
                              {usersButton}
                              {ttButton}
                              {uploadButton}
                              
                          </th>
                      </tr>
                      <tr className="isotracker__table__tray__and__table__container" style={{height: dataTableHeight}}>
                          <td className="isotracker__table__trays">
                              <div className="trays__container">
                                  
                                  <p className="isotracker__table__trays__group">Home</p>
                                  
                                  {myTrayBtn}
                                  <ReportBtns onChange={value => setCurrentTab(value)} currentTab = {currentTab}/>
                                  <p className="isotracker__table__trays__group">Trays</p>
                                  <NavBtns onChange={value => setCurrentTab(value)} currentTab = {currentTab} currentRole = {currentRole}/>        
                              </div>
                          </td>
                          
                          <td className="isotracker__table__table" style={{height: dataTableHeight}} >
                              <div style={{height: dataTableHeight, width:"1560px"}} className="isotracker__table__table__container">
                                  {/*
                                  {isoControllLineIdGroupBtn}
                                  {uploadBOMBtn}
                                  {editCustomBtn}
                                  */}
                                  {tableContent}
                                  
                              </div>
                          </td>
                      </tr>
                  </table>
                     
                    <center className="actionBtns__container">   
                       
                      {actionButtons}
                    </center>
                  
                  <br></br>
                  </div>
        </body> 
        
    );
};

export default IsoCtrlF;
