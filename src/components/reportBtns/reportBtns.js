//Botones de historial y status

import "./reportBtns.css"
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
const Report_btns = props => {
    var StatusButton, HistoryButton
    if(props.currentTab === "Status"){
        secureStorage.setItem("tab", "Status")
        StatusButton = <button  type="button" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}}  className="report__buttons text-left">Status</button>
    }else{
        StatusButton = <button  type="button" className="report__buttons text-left"  onClick={() => {props.onChange("Status")}}>Status</button>
    }
    if(props.currentTab === "History"){
        secureStorage.setItem("tab", "History")
        HistoryButton = <button  type="button" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}}  className="report__buttons text-left" >History</button>
    }else{
        HistoryButton = <button  type="button" className="report__buttons text-left" onClick={() => {props.onChange("History");}}>History</button>
    }
    return(

        <div className="report__btns__container">
            {StatusButton}
            {HistoryButton}
        </div>

    );
};

export default Report_btns;