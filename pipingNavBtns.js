//Botones inferiores para navegar por isoControl

import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory} from "react-router";

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

const PipingNavBtns = props =>{
    const history = useHistory();
    var myTrayButton, modelledButton, sStressButton, rStressButton, stressButton, supportsButton, sDesignButtn, isoControlFullBtn, isoControlEstimatedBtn, prodBtn
    if(props.currentTab === "PipingMyTray"){
        secureStorage.setItem("tab", "PipingMyTray")
        myTrayButton = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}}>My Tray</button>
    }else{
        myTrayButton = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingMyTray")}}>My tray</button>
        
    }
    if(props.currentTab === "PipingModelled"){
        secureStorage.setItem("tab", "PipingModelled")
        modelledButton = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Modelled</button>
    }else{
        modelledButton = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingModelled")}}>Modelled</button>
        
    }
    if(props.currentTab === "PipingSStress"){
        secureStorage.setItem("tab", "PipingSStress")
        sStressButton = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >S-Stress</button>
    }else{
        sStressButton = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingSStress")}}>S-Stress</button>    
    }
    if(props.currentTab === ""){
        secureStorage.setItem("tab", "PipingRStress")
        rStressButton = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >R-Stress</button>
    }else{
        rStressButton = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingRStress")}}>R-Stress</button>
        
    }
    if(props.currentTab === "PipingStress"){
        secureStorage.setItem("tab", "PipingStress")
        stressButton = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Stress</button>
    }else{
        stressButton = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingStress")}}>Stress</button>
        
    }
    if(props.currentTab === "PipingSupports"){
        secureStorage.setItem("tab", "PipingSupports")
        supportsButton = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Supports</button>
    }else{
        supportsButton = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingSupports")}}>Supports</button>
        
    }
    if(props.currentTab === "PipingSDesign"){
        secureStorage.setItem("tab", "PipingSDesign")
        sDesignButtn = <button  type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >S-Design</button>
    }else{
        sDesignButtn = <button  type="button" className="trays__navBtns text-left"  onClick={() => {props.onChange("PipingSDesign")}}>S-Design</button>
        
    }

    if(props.currentTab === "IsoControlFull"){
        secureStorage.setItem("tab", "IsoControlFull")
        isoControlFullBtn = <button type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Report</button>
    }else{
        isoControlFullBtn = <button type="button" className="trays__navBtns text-left"  onClick={() =>{props.onChange("IsoControlFull")}}>Report</button>
    }

    if(props.currentTab === "EstimatedPipes"){
        secureStorage.setItem("tab", "EstimatedPipes")
        isoControlEstimatedBtn = <button type="button" className="trays__navBtns text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Main</button>
    }else{
        isoControlEstimatedBtn = <button type="button" className="trays__navBtns text-left"  onClick={() =>{props.onChange("EstimatedPipes")}}>Main</button>
    }
    if(secureStorage.getItem("role") === "3D Admin"){
        if(process.env.REACT_APP_IFC === "0"){
            prodBtn = <div><p className="isotracker__table__trays__group">Reporting</p><button type="button" className="trays__navBtns text-left"  onClick={() => history.push('/'+process.env.REACT_APP_PROJECT+'/pipingProgress')}>Progress</button></div>
        }else{
            prodBtn = <div><p className="isotracker__table__trays__group">Reporting</p><button type="button" className="trays__navBtns text-left"  onClick={() => history.push('/'+process.env.REACT_APP_PROJECT+'/pipingProduction')}>Production</button></div>
        }
    }


    
    return(
        <div>                                  
            <p className="isotracker__table__trays__group">Home</p>
            {isoControlEstimatedBtn}
            {isoControlFullBtn}
            {myTrayButton}
            <p className="isotracker__table__trays__group">Trays</p>
            {modelledButton}
            {sStressButton}
            {rStressButton}
            {stressButton}
            {supportsButton}
            {sDesignButtn}
            {prodBtn}
        </div>
    );
};

export default PipingNavBtns;