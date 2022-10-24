import NavBar from '../../components/navBar/navBar';
import IsoControlButtons from '../../components/isoControlButtons/isoControlButtons';
import React, { useState , useEffect} from 'react'
import './isoCtrlButtons.css'
import GreenCircle from "../../assets/images/green_circle.png"
import BlueCircle from "../../assets/images/blue_circle.png"

import IdleTimer from 'react-idle-timer'
import {useHistory} from "react-router";

//Página de home con el menú para ir a las aplicaciones de isotracker

const IsoCtrlButtons = () =>{

    const [content, setContent] = useState();
    const [navBar, setNavBar] = useState(null);
    const [circles, setCircles] = useState(null);

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

    useEffect(() =>{
        
        setNavBar(<NavBar/>)
        setContent(<IsoControlButtons/>) 
        setCircles(<div><img src={GreenCircle} alt="greenCircle" className="greenCircle__image"/>
        <img src={BlueCircle} alt="blueCircle" className="blueCircle__image"/></div>)        
          
    }, [])

    document.title= process.env.REACT_APP_APP_NAMEPROJ
    

    function handleOnIdle(){
        const body = {
            user: secureStorage.getItem("user"),
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

    return(
        <body>
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            {circles}
            <div>
                {navBar}
            </div>
            <div>
                {content}
            </div>
        </body>
    );
};

export default IsoCtrlButtons;