import './isoControlButtons.css'
import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"
import { useState, useEffect } from 'react'
import Piping from '../../pages/piping/piping';

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

    // Botones 
    const [feedBtn, setFeedBtn] = useState(<div className='container__buttons__iso__ctrl'>
                                                <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} onClick={() => setFeedEnter(true)} className='button__iso__ctrl'>
                                                    <center className='label__iso__ctrl'>
                                                        FEED
                                                    </center>
                                                    <center className='description__iso__ctrl'>
                                                        (Front end Engineering Design)
                                                    </center>
                                                    <p className='percentage__iso__ctrl'>
                                                        80%
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
                                                <p className='percentage__iso__ctrl'>
                                                    90%
                                                </p>
                                            </a>
                                        </div>)

    var currentUser = secureStorage.getItem('user')

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
        console.log(options);
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

                setFeedBtn(<div className='container__buttons__iso__ctrl'>
                                <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} onClick={() => setFeedEnter(true)} className='button__iso__ctrl'>
                                    <center className='label__iso__ctrl'>
                                        FEED
                                    </center>
                                    <center className='description__iso__ctrl'>
                                        (Front end Engineering Design)
                                    </center>
                                    <p className='percentage__iso__ctrl'>
                                        80%
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
                                    <p className='percentage__iso__ctrl'>
                                        90%
                                    </p>
                                </a>
                            </div>)
            }
            
        )
        .catch(error => {
            console.log(error);
        })
            
    }, [currentRole, feedEnter]);

    return (
        <div >
            <div className="isotracker__column">
                <img src={IsoTrackerLogo} alt="isoTrackerLogo" className="isoTrackerLogo__image2"/>
            </div>
            
            <div className='all__buttons__iso__ctrl'>
                {feedBtn}
                {ifdBtn}
                <div className='container__buttons__iso__ctrl'>
                    <a href={"/"+process.env.REACT_APP_PROJECT+"/isotracker"} className='button__iso__ctrl'>
                        <center className='label__iso__ctrl'>
                            IFC
                        </center>
                        <center className='description__iso__ctrl'>
                            (Issue for Construction)
                        </center>
                        <p className='percentage__iso__ctrl'>
                            85%
                        </p>
                    </a>
                </div>
            </div>

            <div className='container__progress__iso__ctrl'>
                <label className='progress__label__iso__ctrl'>
                    Total Progress: 75%
                </label>
                <div className='container__progress'>
                    <div className="progress__images">
                        <div className="progress__value__images"><p className='percentage__progress'>75%</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IsoControlButtons;