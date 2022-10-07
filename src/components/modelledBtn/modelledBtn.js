import ddd from "../../assets/images/3d.png"

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

const ModelledBtn = props =>{
    if(props.currentTab === "Modelled"){
        secureStorage.setItem("tab", "Modelled")
    }
    return(
        <div>
            <input type="image" src={ddd} alt="3d" style={{width:"38px", marginTop:"20px", marginLeft:"15px", float:"left"}} onClick={() => {props.onChange("Modelled")}} />
        </div>
    );
};

export default ModelledBtn;