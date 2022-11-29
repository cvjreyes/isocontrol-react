import './isoControlButtons.css'
import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"
import { useState, useEffect } from 'react'
import styled, { keyframes } from "styled-components";

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

const IsoControlButtons = () => {
    
    const [feedEnter, setFeedEnter] = useState(false)
    const [currentRole, setCurrentRole] = useState()
    const [feedProgress, setFeedProgress] = useState(0)
    const [ifdProgress, setIfdProgress] = useState(0)
    const [ifcProgress, setIfcProgress] = useState(0)
    const [totalProgress, setTotalProgress] = useState()
    const [feedDecimals, setFeedDecimals] = useState(false)
    const [ifdDecimals, setIfdDecimals] = useState(false)
    const [ifcDecimals, setIfcDecimals] = useState(false)

    // Botones 
    const [feedBtn, setFeedBtn] = useState(<div className='container__buttons__iso__ctrl'>
                                                <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} onClick={() => setFeedEnter(true)} className='button__iso__ctrl'>
                                                    <center className='label__iso__ctrl'>
                                                        FEED
                                                    </center>
                                                    <center className='description__iso__ctrl'>
                                                        (Front end Engineering Design)
                                                    </center>
                                                    <p className={`percentage__iso__ctrl ${feedDecimals ? "" : "move__num"}`}>
                                                        {feedProgress}%
                                                    </p>
                                                </a>
                                            </div>)
    const [ifdBtn, setIfdBtn] = useState(<div className='container__buttons__iso__ctrl' >
                                            <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} onClick={() => setFeedEnter(false)} className='button__iso__ctrl'>
                                                <center className='label__iso__ctrl'>
                                                    IFD
                                                </center>
                                                <center className='description__iso__ctrl'>
                                                    (Issue for Design)
                                                </center>
                                                <p className={`percentage__iso__ctrl ${ifdDecimals ? "" : "move__num"}`}>
                                                    {ifdProgress}%
                                                </p>
                                            </a>
                                        </div>)
    const [ifcBtn, setIfcBtn] = useState(<div className='container__buttons__iso__ctrl'>
                                            <a href={"/"+process.env.REACT_APP_PROJECT+"/isotracker"} className='button__iso__ctrl'>
                                                <center className='label__iso__ctrl'>
                                                    IFC
                                                </center>
                                                <center className='description__iso__ctrl'>
                                                    (Issue for Construction)
                                                </center>
                                                <p className={`percentage__iso__ctrl ${ifcDecimals ? "" : "move__num"}`}>
                                                    {ifcProgress}%
                                                </p>
                                            </a>
                                        </div>)

    var currentUser = secureStorage.getItem('user')
    var animationProgress = keyframes`
        {
            0% { width: 0; }
            100% { width: ${totalProgress}%; }
        }
    `;

    const ProgressBar = styled.div`{
        animation: ${animationProgress} 3s normal forwards;
        box-shadow: 0 10px 40px -10px blue;
        border-radius: 100px;
        background: linear-gradient(180deg, #338DF1 -2.23%, #338DF1 -2.22%, #85BFFF 148.66%);
        height: 40px;
        width: 0;
        color: #FFFFFF;
    }`;

    useEffect(async() => {
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
        // console.log(options);
        fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/api/roles/user", options)
            .then(response => response.json())
            .then(json => {

                if(feedEnter === true){
                    if (secureStorage.getItem('role') !== null) {
                        secureStorage.setItem('role', json.roles[8])

                    } else {
                        secureStorage.setItem('role', json.roles[8])

                    }
                } else {
                    if (secureStorage.getItem('role') !== null) {
                        secureStorage.setItem('role', json.roles[0])

                    } else {
                        secureStorage.setItem('role', json.roles[0])

                    }
                }
                setCurrentRole(secureStorage.getItem('role'))

                let options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
        
                //Get del progreso del feed
                fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/getFeedProgress", options)
                    .then(response => response.json())
                    .then(json => {
                        let progreso = json.progress
                        if(isNaN(progreso)){
                            setFeedProgress(0)
                        } else {
                            if(progreso % 1 === 0){
                                setFeedProgress(Number(progreso).toFixed(0))
                            } else {
                                setFeedProgress(Number(progreso).toFixed(2))
                            }
                        }
                    })
        
                //Get del peso estimado del feed
                fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/estimatedPipingWeight", options)
                    .then(response => response.json())
                    .then(json => {
                        let progreso = json.progress
                        if(isNaN(progreso)){
                            setIfdProgress(0)
                        } else {
                            if(progreso % 1 === 0){
                                setIfdProgress(Number(progreso).toFixed(0))
                            } else {
                                setIfdProgress(Number(progreso).toFixed(2))
                            }
                        }
                    }
                    )
                    .catch(error => {
                        console.log(error);
                    })
                
                    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/currentProgressISO", options)
                    .then(response => response.json())
                    .then(async json =>{
                        let pIso = json.progressISO
                        if (isNaN(pIso)){
                            setIfcProgress(0)
                        } else {
                            if(pIso % 1 === 0){
                                setIfcProgress(Number(pIso).toFixed(0))
                            } else {
                                setIfcProgress(Number(pIso).toFixed(2))
                            }
                        }

                    })
                
                setTotalProgress(((feedProgress * 0.1) + (ifdProgress * 0.4) + (ifcProgress * 0.5)).toFixed(2))

                if(feedProgress % 1 === 0){
                    setFeedDecimals(true)
                } else {
                    setFeedDecimals(false)
                }

                if(ifdProgress % 1 === 0){
                    setIfdDecimals(true)
                } else {
                    setIfdDecimals(false)
                }

                if(ifcProgress % 1 === 0){
                    setIfcDecimals(true)
                } else {
                    setIfcDecimals(false)
                }

                setFeedBtn(<div className='container__buttons__iso__ctrl'>
                                <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} onClick={() => setFeedEnter(true)} className='button__iso__ctrl'>
                                    <center className='label__iso__ctrl'>
                                        FEED
                                    </center>
                                    <center className='description__iso__ctrl'>
                                        (Front end Engineering Design)
                                    </center>
                                    <p className={`percentage__iso__ctrl ${feedDecimals ? "" : "move__num"}`}>
                                        {feedProgress}%
                                    </p>
                                </a>
                            </div>)
                setIfdBtn(<div className='container__buttons__iso__ctrl' >
                                <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} onClick={() => setFeedEnter(false)} className='button__iso__ctrl'>
                                    <center className='label__iso__ctrl'>
                                        IFD
                                    </center>
                                    <center className='description__iso__ctrl'>
                                        (Issue for Design)
                                    </center>
                                    <p className={`percentage__iso__ctrl ${ifdDecimals ? "" : "move__num"}`}>
                                        {ifdProgress}%
                                    </p>
                                </a>
                            </div>)
                setIfcBtn(<div className='container__buttons__iso__ctrl'>
                                <a href={"/"+process.env.REACT_APP_PROJECT+"/isotracker"} className='button__iso__ctrl'>
                                    <center className='label__iso__ctrl'>
                                        IFC
                                    </center>
                                    <center className='description__iso__ctrl'>
                                        (Issue for Construction)
                                    </center>
                                    <p className={`percentage__iso__ctrl ${ifcDecimals ? "" : "move__num"}`}>
                                        {ifcProgress}%
                                    </p>
                                </a>
                            </div>)
            }
            
        )
        .catch(error => {
            console.log(error);
        })
            
    }, [currentRole, feedEnter, feedProgress, ifdProgress, totalProgress, feedDecimals, ifdDecimals, ifcDecimals]);

    return (
        <div >
            <div className="isotracker__column">
                <img src={IsoTrackerLogo} alt="isoTrackerLogo" className="isoTrackerLogo__image2"/>
            </div>
            
            <div className='all__buttons__iso__ctrl'>
                {feedBtn}
                {ifdBtn}
                {ifcBtn}
            </div>

            <div className='container__progress__iso__ctrl'>
                <label className='progress__label__iso__ctrl'>
                    Total Progress: {totalProgress}%
                </label>
                <div className='container__progress'>
                    <div className="progress__images">
                        <ProgressBar><p className='percentage__progress'>{totalProgress}%</p></ProgressBar>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IsoControlButtons;