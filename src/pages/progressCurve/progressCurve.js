import "./progressCurve.css"
import React, { useState , useEffect} from 'react'
import NavBar from '../../components/navBar/navBar'
import ProgressPlotCurve from "../../components/progressPlotCurve/progressPlotCurve"

import IdleTimer from 'react-idle-timer'
import {useHistory} from "react-router";

const Civil = () => {

    const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';
    const [currentRole, setCurrentRole] = useState();

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
    },[])

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
        history.push("/" + process.env.REACT_APP_APP_PROJECT)
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

    var dataTableHeight = "550px"


    
    document.title= process.env.REACT_APP_PROJECT
    const [currentTab, setCurrentTab] = useState(secureStorage.getItem("civ_tab"))
    if(currentTab === "" || currentTab === null){
        setCurrentTab("Estimated")
    }

    var currentUser = secureStorage.getItem('user')
    var table = null

    table = <ProgressPlotCurve/>



    return(
        
        <body>
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <NavBar/>
            <div className="equipments__container">  
                <center>
                    <h2 className="title__container">

                        <b >      
                            <i className="iso__title">Progress curve</i>
                        </b>
                    </h2>
                    <h3 className="iso__subtitle">3D Progress</h3>
                </center>


                <div style={{height: dataTableHeight}}>
                    <br></br>
                    <br></br> 
                    <br></br> 
                    {table}
                </div>         
            </div>
         </body>
    )
}

export default Civil;