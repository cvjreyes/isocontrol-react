import Graph from "../../assets/images/graph.png"

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

const ProgressBtn = props =>{
    if(props.currentTab === "Progress"){
        secureStorage.setItem("tab", "Progress")
    }
    return(
        <div>
            <input type="image" src={Graph} alt="graph" style={{width:"40px", marginTop:"20px", marginLeft:"12px", float:"left"}} onClick={() => {props.onChange("Progress")}} />
        </div>
    );
};

export default ProgressBtn;