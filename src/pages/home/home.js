import React, { useEffect } from "react";
import NavBar from "../../components/navBar/navBar";
import IsoCtrlButtons from "../../components/isoControlButtons/isoControlButtons";
import "./home.css";
import GreenCircle from "../../assets/images/green_circle.png";
import BlueCircle from "../../assets/images/blue_circle.png";
import { useHistory } from "react-router";

const Home = () => {
  const history = useHistory();
  const CryptoJS = require("crypto-js");
  const SecureStorage = require("secure-web-storage");
  var SECRET_KEY = "sanud2ha8shd72h";

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
    },
  });

  useEffect(() => {
    if (!secureStorage.getItem("user")) {
      history.push("/" + process.env.REACT_APP_PROJECT + "/");
    }
  }, []);

  document.title = process.env.REACT_APP_APP_NAMEPROJ;

  return (
    <div>
      <div>
        <img
          src={GreenCircle}
          alt="greenCircle"
          className="greenCircle__image"
        />
        <img src={BlueCircle} alt="blueCircle" className="blueCircle__image" />
      </div>
      <div>
        <NavBar />
        <IsoCtrlButtons />
      </div>
    </div>
  );
};

export default Home;
