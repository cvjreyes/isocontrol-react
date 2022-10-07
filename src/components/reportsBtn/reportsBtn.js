import Reports from "../../assets/images/reports.png"

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

const ReportsBtn = props =>{
    if(props.currentTab === "Recycle bin"){
        secureStorage.setItem("tab", "Recycle bin")
    }
    return(
        <div>
            <input type="image" src={Reports} alt="bin" style={{width:"55px", marginTop:"22px", marginLeft:"12px", float:"left"}} onClick={() => {props.onChange("Reports")}} />
        </div>
    );
};

export default ReportsBtn;