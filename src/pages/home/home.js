import NavBar from "../../components/navBar/navBar";
import MenuList from "../../components/menuList/menuList";
import IsoCtrlButtons from "../isoCtrlButtons/isoCtrlButtons";
import React, { useState, useEffect } from "react";
import "./home.css";
import LoadingScreen3D from "../../components/loadingScreen3D/loadingScreen3D";
import GreenCircle from "../../assets/images/green_circle.png";
import BlueCircle from "../../assets/images/blue_circle.png";

import IdleTimer from "react-idle-timer";
import { useHistory } from "react-router";

const Home = () => {
  const [navBar, setNavBar] = useState(null);
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

  useEffect(() => {
    setNavBar(<NavBar />);
  }, []);

  document.title = process.env.REACT_APP_APP_NAMEPROJ;

  function handleOnIdle() {
    const body = {
      user: secureStorage.getItem("user"),
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/exitEditCSP",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {});
    secureStorage.clear();
    history.push("/" + process.env.REACT_APP_PROJECT);
  }

  return (
    <div>
      <IdleTimer
        timeout={1000 * 60 * 15}
        onIdle={handleOnIdle}
        debounce={250}
      />
      <div>
        <img
          src={GreenCircle}
          alt="greenCircle"
          className="greenCircle__image"
        />
        <img src={BlueCircle} alt="blueCircle" className="blueCircle__image" />
      </div>
      <div>
        {navBar}
        <IsoCtrlButtons />
      </div>
    </div>
  );
};

export default Home;
