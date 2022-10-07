//Botones inferiores para navegar por isoControl

import "./navBtns.css"
import 'bootstrap/dist/css/bootstrap.min.css';

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

const NavBtns = props =>{
    var designButton, stressButton, supportsButton, materialsButton, issuerButton, ldeIsocontrolButton
    if(props.currentTab === "Design"){
        secureStorage.setItem("tab", "Design")
        designButton = <button  type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}}>Design</button>
    }else{
        designButton = <button  type="button" className="nav__button text-left"  onClick={() => {props.onChange("Design")}}>Design</button>
        
    }
    if(props.currentTab === "Stress"){
        secureStorage.setItem("tab", "Stress")
        stressButton = <button  type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Stress</button>
    }else{
        stressButton = <button  type="button" className="nav__button text-left"  onClick={() => {props.onChange("Stress")}}>Stress</button>
        
    }
    if(props.currentTab === "Supports"){
        secureStorage.setItem("tab", "Supports")
        supportsButton = <button  type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Support</button>
    }else{
        supportsButton = <button  type="button" className="nav__button text-left"  onClick={() => {props.onChange("Supports")}}>Support</button>
        
    }
    if(props.currentTab === "Materials"){
        secureStorage.setItem("tab", "Materials")
        materialsButton = <button  type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Materials</button>
    }else{
        materialsButton = <button  type="button" className="nav__button text-left"  onClick={() => {props.onChange("Materials")}}>Materials</button>
        
    }
    if(props.currentTab === "Issuer"){
        secureStorage.setItem("tab", "Issuer")
        issuerButton = <button  type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >Issuer</button>
    }else{
        issuerButton = <button  type="button" className="nav__button text-left"  onClick={() => {props.onChange("Issuer")}}>Issuer</button>
        
    }
    if(props.currentTab === "LDE/IsoControl"){
        secureStorage.setItem("tab", "LDE/IsoControl")
        ldeIsocontrolButton = <button  type="button" className="nav__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} >LOS/Isocontrol</button>
    }else{
        ldeIsocontrolButton = <button  type="button" className="nav__button text-left"  onClick={() => {props.onChange("LDE/IsoControl")}}>LOS/Isocontrol</button>
    }if(props.currentTab === "My Tray"){
        switch(props.currentRole){
            case "Design":
                designButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Design")}}>Design</button>
                break;
            case "DesignLead":
                designButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Design")}}>Design</button>
                break;
            case "Stress":
                stressButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Stress")}}>Stress</button>
                break;
            case "StressLead":
                stressButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Stress")}}>Stress</button>
                break;
            case "Supports":
                supportsButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Supports")}}>Supports</button>
                break;
            case "SupportsLead":
                supportsButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Supports")}}>Supports</button>
                break;
            case "Materials":
                materialsButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Materials")}}>Materials</button>
                break;
            case "Issuer":
                issuerButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("Issuer")}}>Issuer</button>
                break;
            case "SpecialityLead":
                ldeIsocontrolButton = <button  type="button" className="nav__button text-left" style={{backgroundColor: "#D1EBF7", color: "black"}} onClick={() => {props.onChange("LDE/IsoControl")}}>LOS/Isocontrol</button>
                break;
            default:
                break;
        }
    }
    
    return(
        <div>
            {designButton}
            {stressButton}
            {supportsButton}
            {materialsButton}
            {issuerButton}
            {ldeIsocontrolButton}
        </div>
    );
};

export default NavBtns;