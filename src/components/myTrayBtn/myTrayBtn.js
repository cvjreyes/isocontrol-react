import './myTrayBtn.css'

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
const MyTrayBtn = props =>{

    let btn = null
    if(props.currentTab === "My Tray"){
        secureStorage.setItem("tab", "My Tray")
        btn = <button  type="button" className="myTray__button text-left" style={{backgroundColor:"#99C6F8", color:"black", fontWeight:"bold"}} onClick={() => {props.onChange("My Tray")}}>My tray</button>
    }else{
        btn = <button  type="button" className="myTray__button text-left" onClick={() => {props.onChange("My Tray")}}>My tray</button>
    }

    return(
        <td className="myTrayBtn__container">
            {btn}
        </td>
    );
};

export default MyTrayBtn;