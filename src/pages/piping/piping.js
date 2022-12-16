// T: quitar console.logs y awaits de los setState

import "./piping.css";
import React, { useState, useEffect } from "react";
import NavBar from "../../components/navBar/navBar";
import RoleDropDown from "../../components/roleDropDown/roleDropDown";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import PipingEstimatedDataTable from "../../components/pipingEstimatedDataTable/pipingEstimatedDataTable";
import ModelledDataTable from "../../components/modelledDataTable/modelledDataTable";
import ProgressPlotPiping from "../../components/progressPlotPiping/progressPlotPiping";
import PipingTypesDataTable from "../../components/pipingTypesDataTable/pipingTypesDataTable";
import PipingExcel from "../../components/pipingExcel/pipingExcel";
import PipingExcelEdit from "../../components/pipingExcelEdit/pipingExcelEdit";
import IsoTrackerLogo from "../../assets/images/3DTracker.svg";
import Trash from "../../assets/images/Trash.png";
import AlertF from "../../components/alert/alert";
import Hold from "../../assets/images/Prohibit.png";

import IdleTimer from "react-idle-timer";
import { useHistory } from "react-router";
import PipingNavBtns from "../../components/pipingNavBtns/pipingNavBtns";

import PipingDataTable from "../../components/pipingDataTable/pipingDataTable";
import PipingMyTrayTable from "../../components/pipingMyTrayTable/pipingMyTrayTable";
import PipingBinTable from "../../components/pipingBinTable/pipingBinTable";

import IsoControlFullDataTable from "../../components/isoControlFullDataTable/isoControlFullDataTable";
import IsoControlGroupLineIdDataTable from "../../components/isoControlGroupLineIdDataTable/isoControlGroupLineIdDataTable";
import UploadBOMIsocontrolPopUp from "../../components/uploadBomIsocontrolPopUp/uploadBomIsocontrolPopUp";
import EstimatedPipesExcel from "../../components/estimatedPipesExcel/estimatedPipesExcel";
import IsoControlHoldsDataTable from "../../components/isoControlHoldsDataTable/isoControlHoldsDataTable";
import FeedPipesExcel from "../../components/feedPipesExcel/feedPipesExcel";
import FeedProgressPlot from "../../components/feedProgressPlot/feedProgressPlot";
import FeedForecastTable from "../../components/feedForecastTable/feedForecastTable";

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

const Piping = () => {
  const [currentRole, setCurrentRole] = useState();
  const [roles, setRoles] = useState();
  const [weight, setWeight] = useState();
  const [progress, setProgress] = useState();
  const [successAlert, setSuccessAlert] = useState(false);
  const [selected, setSelected] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [warningSelected, setWarningSelected] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [notVI, setNotVI] = useState(false);
  const [currentTab, setCurrentTab] = useState("");
  const [estimatedWarning, setEstimatedWarning] = useState(false);
  const [estimatedEmpty, setEstimatedEmpty] = useState(false);
  const [modelledWeight, setModelledWeight] = useState("...");
  // T: estas 2 variables se usan de forma estática. no deberían ser un state
  const [notModelledWeight, setNotModelledWeight] = useState("...");
  const [totalIsocontrolWeight, setTotalIsocontrolWeight] = useState("...");
  const [loading, setLoading] = useState(false);
  const [maxTrayWarning, setMaxTrayWarning] = useState(false);
  const [minTrayWarning, setMinTrayWarning] = useState(false);
  const [unclaimAlert, setUnclaimAlert] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [feedProgress, setFeedProgress] = useState(null);
  const [titlePiping, setTitlePiping] = useState("");
  const history = useHistory();

  useEffect(() => {
    const body = {
      user: currentUser,
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
        "/api/roles/user",
      options
    )
      .then((response) => response.json())
      .then((json) => {
        setRoles(json.roles);
        // T: esto se puede mejorar
        if (secureStorage.getItem("role") !== null) {
          setCurrentRole(secureStorage.getItem("role"));
        } else {
          secureStorage.setItem("role", json.roles[8]);
          setCurrentRole(secureStorage.getItem("role"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentRole]);

  useEffect(() => {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Get del progreso del feed
    fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getFeedProgress",
      options
    )
      .then((response) => response.json())
      .then((json) => {
        setFeedProgress(json.progress);
        // console.log("FeedProgress: " + json.progress);
      });

    //Get del peso estimado del feed
    fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/estimatedPipingWeight",
      options
    )
      .then((response) => response.json())
      .then((json) => {
        setWeight(json.weight);
        setProgress(json.progress);
        setModelledWeight(json.modelledWeight);
        // console.log("Weigth: " + json.progress);
        // console.log("progress: " + json.progress);
        // console.log("Modelled: " + json.progress);
      })
      .catch((error) => {
        console.log(error);
      });

    const body = {
      user: currentUser,
    };
    options = {
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
  }, [updateData]);

  useEffect(async () => {
    setSelected([]);
  }, [currentTab]);

  function success() {
    setSuccessAlert(true);
    setTimeout(function () {
      setSuccessAlert(false);
    }, 1000);
  }

  function handleOnIdle() {
    const body = {
      user: currentUser,
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

  useEffect(() => {
    if (!secureStorage.getItem("user")) {
      history.push("/" + process.env.REACT_APP_PROJECT + "/");
    }
  }, []);

  document.title = process.env.REACT_APP_APP_NAMEPROJ;
  if (currentTab === "" || currentTab === null) {
    // console.log("Rol supremo: " + secureStorage.getItem('role'));
    if (secureStorage.getItem("role") === "SpecialityLead") {
      // console.log("entra");
      setCurrentTab("FeedPipes");
      setTitlePiping("Feed");
    } else {
      // console.log("sale");
      setCurrentTab("EstimatedPipes");
      setTitlePiping("IFD");
    }
  }

  var currentUser = secureStorage.getItem("user");
  var table = null;
  let actionBtns = null;
  let recycleBinBtn = null;
  let holdBtn = null;
  let isocontrolWeightsComponent = null;
  let isoControllLineIdGroupBtn = null;
  let uploadBOMBtn = null;
  let feedProgressButton = null;
  let feedForecastBtn = null;

  //Dependiendo del tab se muestra un contenido u otro, tambien diferentes action buttons
  if (currentTab === "Estimated") {
    table = <PipingEstimatedDataTable />;
  } else if (currentTab === "Modelled") {
    table = <ModelledDataTable />;
  } else if (currentTab === "Progress") {
    table = <ProgressPlotPiping />;
  } else if (currentTab === "Types") {
    table = <PipingTypesDataTable />;
  } else if (currentTab === "Key parameters") {
    table = <PipingExcel success={success.bind(this)} />;
  } else if (currentTab === "Edit") {
    table = <PipingExcelEdit success={success.bind(this)} />;
  } else if (
    currentTab === "PipingModelled" ||
    currentTab === "PipingSStress" ||
    currentTab === "PipingRStress" ||
    currentTab === "PipingStress" ||
    currentTab === "PipingSupports" ||
    currentTab === "PipingSDesign"
  ) {
    actionBtns = (
      <button
        className="action__btn"
        name="claim"
        value="claim"
        onClick={() => claimClick()}
      >
        Claim
      </button>
    );
    table = (
      <PipingDataTable
        currentTab={currentTab}
        updateData={updateData}
        onChange={(value) => setSelected(value)}
        claimClick={claimClick.bind(this)}
        loading={(value) => setLoading(value)}
      />
    );
  } else if (currentTab === "PipingMyTray") {
    actionBtns = (
      <div>
        <button
          className="action__btn"
          name="claim"
          value="claim"
          onClick={() => nextClick()}
        >
          Next step
        </button>
        <button
          className="action__btn"
          name="unclaim"
          value="unclaim"
          onClick={() => unclaimClick()}
        >
          Unclaim
        </button>
        <button
          className="action__btn"
          name="claim"
          value="claim"
          onClick={() => returnClick()}
        >
          Return
        </button>
        <button
          className="action__btn"
          name="claim"
          value="claim"
          onClick={() => deleteClick()}
        >
          Delete
        </button>
      </div>
    );
    table = (
      <PipingMyTrayTable
        onChange={(value) => setSelected(value)}
        updateData={updateData}
        updateDataMethod={() => setUpdateData(!updateData)}
        loading={(value) => setLoading(value)}
      />
    );
  }

  if (currentTab === "Piping recycle bin") {
    table = (
      <PipingBinTable
        onChange={(value) => setSelected(value)}
        updateData={updateData}
        updateDataMethod={() => setUpdateData(!updateData)}
      />
    );
    actionBtns = (
      <button
        className="action__btn"
        name="restore"
        value="restore"
        onClick={() => restoreClick()}
      >
        Restore
      </button>
    );
    recycleBinBtn = (
      <button
        className="navBar__button"
        style={{ backgroundColor: "#99C6F8", marginLeft: "232px" }}
      >
        <img src={Trash} alt="trash" className="navBar__icon"></img>
        <p className="navBar__button__text">Trash</p>
      </button>
    );
  } else {
    recycleBinBtn = (
      <button
        className="navBar__button"
        onClick={() => setCurrentTab("Piping recycle bin")}
        style={{ marginLeft: "232px" }}
      >
        <img src={Trash} alt="trash" className="navBar__icon"></img>
        <p className="navBar__button__text">Trash</p>
      </button>
    );
  }

  if (currentTab === "IsocontrolHolds") {
    table = (
      <IsoControlHoldsDataTable
        updateData={updateData}
        updateDataMethod={() => setUpdateData(!updateData)}
      />
    );
    holdBtn = (
      <button className="navBar__button" style={{ backgroundColor: "#99C6F8" }}>
        <img src={Hold} alt="hold" className="navBar__icon"></img>
        <p className="navBar__button__text">Hold</p>
      </button>
    );
  } else {
    holdBtn = (
      <button
        className="navBar__button"
        onClick={() => setCurrentTab("IsocontrolHolds")}
      >
        <img src={Hold} alt="hold" className="navBar__icon"></img>
        <p className="navBar__button__text">Hold</p>
      </button>
    );
  }

  if (currentTab === "IsoControlFull") {
    secureStorage.setItem("tab", "IsoControlFull");
    table = <IsoControlFullDataTable loading={(value) => setLoading(value)} />;
    uploadBOMBtn = <UploadBOMIsocontrolPopUp success={success.bind(this)} />;
    isoControllLineIdGroupBtn = (
      <button
        className="isocontrol__lineid__group__button"
        onClick={() => {
          setCurrentTab("IsoControlLineIdGroup");
        }}
      >
        Group by line ID
      </button>
    );
  }

  if (currentTab === "EstimatedPipes") {
    secureStorage.setItem("tab", "EstimatedPipes");
    table = (
      <EstimatedPipesExcel
        success={() => setChangesSaved(true)}
        updateData={() => setUpdateData(!updateData)}
        estimatedWarning={() => setEstimatedWarning(true)}
        estimatedEmpty={() => setEstimatedEmpty(true)}
      />
    );
  }

  if (currentTab === "FeedPipes") {
    secureStorage.setItem("tab", "FeedPipes");
    table = (
      <FeedPipesExcel
        success={() => setChangesSaved(true)}
        updateData={() => setUpdateData(!updateData)}
        estimatedWarning={() => setEstimatedWarning(true)}
        estimatedEmpty={() => setEstimatedEmpty(true)}
      />
    );
    feedProgressButton = (
      <p
        className="navBar__button__text"
        style={{ float: "right", marginRight: "40px", fontWeight: "400" }}
      >
        Progress: {feedProgress}%
      </p>
    );
  }

  if (currentTab === "FeedProgress") {
    secureStorage.setItem("tab", "FeedProgress");
    table = <FeedProgressPlot />;
    feedProgressButton = (
      <p
        className="navBar__button__text"
        style={{ float: "right", marginRight: "40px", fontWeight: "400" }}
      >
        Progress: {feedProgress}%
      </p>
    );
    feedForecastBtn = (
      <button
        className="isocontrol__lineid__group__button"
        style={{ width: "120px", float: "right" }}
        onClick={() => setCurrentTab("FeedForecast")}
      >
        Edit Forecast
      </button>
    );
  }

  if (currentTab === "FeedForecast") {
    secureStorage.setItem("tab", "FeedForecast");
    table = <FeedForecastTable success={() => setChangesSaved(true)} />;
    feedProgressButton = (
      <p
        className="navBar__button__text"
        style={{ float: "right", marginRight: "40px", fontWeight: "400" }}
      >
        Progress: {feedProgress}%
      </p>
    );
    feedForecastBtn = (
      <button
        className="isocontrol__lineid__group__button"
        style={{ width: "120px", float: "right" }}
        onClick={() => setCurrentTab("FeedProgress")}
      >
        Back
      </button>
    );
  }

  if (currentTab === "IsoControlLineIdGroup") {
    secureStorage.setItem("tab", "IsoControlLineIdGroup");
    isoControllLineIdGroupBtn = (
      <button
        className="isocontrol__lineid__group__button"
        style={{ backgroundColor: "rgb(148, 220, 170)" }}
        onClick={() => {
          setCurrentTab("IsoControlFull");
        }}
      >
        Group by line ID
      </button>
    );
    table = (
      <IsoControlGroupLineIdDataTable loading={(value) => setLoading(value)} />
    );
    //editCustomBtn = <button className="isocontrol__lineid__group__button" onClick={() => {setCurrentTab("IsoControlEditCustom")}} style={{marginLeft:"20px"}}>Edit custom fields</button>
  }

  if (currentTab === "IsoControlFull") {
    isocontrolWeightsComponent = (
      <button className="isocontrol__weigths" disabled>
        Modelled: {modelledWeight} t &nbsp;&nbsp;&nbsp;&nbsp; Not modelled:{" "}
        {notModelledWeight} t &nbsp;&nbsp;&nbsp;&nbsp; Total:{" "}
        {totalIsocontrolWeight} t
      </button>
    );
  }

  // console.log("Current tab: " + currentTab);
  async function claimClick() {
    //Claim de una linea en la fase de maduracion
    if (selected.length > 0) {
      //Si hay al menos una seleccionada
      setLoading(true);
      localStorage.setItem("update", true);

      const body = {
        user: currentUser,
        pipes: selected,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      //Post del claim
      await fetch(
        "http://" +
          process.env.REACT_APP_SERVER +
          ":" +
          process.env.REACT_APP_NODE_PORT +
          "/claimPipes",
        options
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            setSuccessAlert(true);
          }
        });
      setUpdateData(!updateData);
      setSelected([]);
      setLoading(false);
    } else {
      setWarningSelected(true);
    }
  }

  async function unclaimClick() {
    //Unclaim de una linea en la fase de maduracion
    if (selected.length > 0) {
      //Si hay al menos una seleccionada
      setLoading(true);
      localStorage.setItem("update", true);
      const body = {
        pipes: selected,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      //Post del unclaim
      await fetch(
        "http://" +
          process.env.REACT_APP_SERVER +
          ":" +
          process.env.REACT_APP_NODE_PORT +
          "/unclaimPipes",
        options
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            setUnclaimAlert(true);
          }
        });
      setUpdateData(!updateData);
      setSelected([]);
      setLoading(false);
    } else {
      setWarningSelected(true);
    }
  }

  async function nextClick() {
    //Avanzar la linea a la siguiente bandeja correspondiente
    if (selected.length > 0) {
      //Si hay alguna linea seleccionada
      localStorage.setItem("update", true);
      let pipes = [];
      let notvi = false,
        maxTrayWarning = false;
      for (let i = 0; i < selected.length; i++) {
        //Las lineas pueden provocar:
        if (selected[i][1].indexOf(1) > -1) {
          //un warning de no tener v/i marcados antes de avanzar a S-Desing
          notvi = true;
        } else if (selected[i][1].indexOf(2) > -1) {
          //un warning por intentar avanzar una linea que ya esta en la bandeja final
          maxTrayWarning = true;
        } else {
          //No hay error y se guarda
          pipes.push(selected[i][0]);
        }
      }

      if (pipes.length > 0) {
        //Si hay al menos un envio correcto
        const body = {
          user: currentUser,
          pipes: pipes,
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };
        //Post del envio
        await fetch(
          "http://" +
            process.env.REACT_APP_SERVER +
            ":" +
            process.env.REACT_APP_NODE_PORT +
            "/nextStep",
          options
        )
          .then((response) => response.json())
          .then((json) => {
            if (json.success) {
              setTransactionSuccess(true);
            }
          });
      }

      if (notvi) {
        setNotVI(true);
      }

      if (maxTrayWarning) {
        setMaxTrayWarning(true);
      }

      setUpdateData(!updateData);
      setSelected([]);
    } else {
      setWarningSelected(true);
    }
  }

  async function returnClick() {
    //Lo mismo que nextclick pero hacia atras
    if (selected.length > 0) {
      localStorage.setItem("update", true);
      let minTrayWarning = false;
      let pipes = [];
      let notvi = false;
      for (let i = 0; i < selected.length; i++) {
        if (selected[i][1].indexOf(3) > -1) {
          minTrayWarning = true;
        } else {
          pipes.push(selected[i][0]);
        }
      }

      if (pipes.length > 0) {
        const body = {
          user: currentUser,
          pipes: pipes,
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };

        await fetch(
          "http://" +
            process.env.REACT_APP_SERVER +
            ":" +
            process.env.REACT_APP_NODE_PORT +
            "/returnPipes",
          options
        )
          .then((response) => response.json())
          .then((json) => {
            if (json.success) {
              setTransactionSuccess(true);
            }
          });
      }

      if (notvi) {
        setNotVI(true);
      }

      if (minTrayWarning) {
        setMinTrayWarning(true);
      }

      setUpdateData(!updateData);
      setSelected([]);
    } else {
      setWarningSelected(true);
    }
  }

  async function restoreClick() {
    //Sacar lineas de la bandeja de reciclaje
    if (selected.length > 0) {
      //Si hay al menos una linea seleccionada
      localStorage.setItem("update", true);

      const body = {
        user: currentUser,
        pipes: selected,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      //Se restauran las lineas
      await fetch(
        "http://" +
          process.env.REACT_APP_SERVER +
          ":" +
          process.env.REACT_APP_NODE_PORT +
          "/restorePipes",
        options
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            setTransactionSuccess(true);
          }
        });

      setUpdateData(!updateData);
      setSelected([]);
    } else {
      setWarningSelected(true);
    }
  }

  async function deleteClick() {
    //Enviar lineas a la papelera de reciclaje
    if (selected.length > 0) {
      //Si hay al menos una linea seleccionada
      localStorage.setItem("update", true);
      let pipes = [];
      let notvi = false;
      for (let i = 0; i < selected.length; i++) {
        pipes.push(selected[i][0]);
      }

      if (pipes.length > 0) {
        const body = {
          user: currentUser,
          pipes: pipes,
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };
        //Post del delete
        await fetch(
          "http://" +
            process.env.REACT_APP_SERVER +
            ":" +
            process.env.REACT_APP_NODE_PORT +
            "/deletePipes",
          options
        )
          .then((response) => response.json())
          .then((json) => {
            if (json.success) {
              setTransactionSuccess(true);
            }
          });
      }

      if (notvi) {
        setNotVI(true);
      }

      setUpdateData(!updateData);
      setSelected([]);
    } else {
      setWarningSelected(true);
    }
  }

  return (
    <div>
      <IdleTimer
        timeout={1000 * 60 * 15}
        onIdle={handleOnIdle}
        debounce={250}
      />
      <NavBar onChange={(value) => setCurrentTab(currentTab)} />
      <div
        className={`alert alert-success ${
          successAlert ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setSuccessAlert(false)}
      >
        <AlertF type="success" text="Pipes claimed!" margin="0px" />
      </div>
      <div
        className={`alert alert-success ${
          changesSaved ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setChangesSaved(false)}
      >
        <AlertF type="success" text="Changes saved!" margin="0px" />
      </div>
      <div
        className={`alert alert-success ${
          transactionSuccess ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setTransactionSuccess(false)}
      >
        <AlertF
          type="success"
          margin="0px"
          text="The action has been completed."
        />
      </div>
      <div
        className={`alert alert-success ${
          unclaimAlert ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setUnclaimAlert(false)}
      >
        <AlertF type="success" margin="0px" text="Pipes unclaimed!" />
      </div>
      <div
        className={`alert alert-success ${
          warningSelected ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setWarningSelected(false)}
      >
        <AlertF type="warning" text="Select at least one pipe!" margin="10px" />
      </div>
      <div
        className={`alert alert-success ${
          notVI ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setNotVI(false)}
      >
        <AlertF
          type="warning"
          text="Can't send to S-Design without valves and instruments check or N/A!"
          margin="10px"
        />
      </div>
      <div
        style={{ position: "absolute", marginTop: "180px", marginLeft: "45%" }}
      >
        <i className="discipline__title" style={{ fontStyle: "normal" }}>
          Piping {titlePiping}
        </i>
      </div>
      <div
        className={`alert alert-success ${
          estimatedWarning ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setEstimatedWarning(false)}
      >
        <AlertF
          type="warning"
          text="Changes on modelled lines can't be saved!"
          margin="0px"
        />
      </div>
      <div
        className={`alert alert-success ${
          estimatedEmpty ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setEstimatedEmpty(false)}
      >
        <AlertF
          type="warning"
          text="Pipes with empty values didn't save!"
          margin="0px"
        />
      </div>
      <div
        className={`alert alert-success ${
          minTrayWarning ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setMinTrayWarning(false)}
      >
        <AlertF
          type="warning"
          text="Pipes on Estimated can't be returned!"
          margin="0px"
        />
      </div>
      <div
        className={`alert alert-success ${
          maxTrayWarning ? "alert-shown" : "alert-hidden"
        }`}
        onTransitionEnd={() => setMaxTrayWarning(false)}
      >
        <AlertF
          type="warning"
          text="Pipes on S-Design are completed!"
          margin="0px"
        />
      </div>
      <Collapse in={loading}>
        <Alert
          style={{
            fontSize: "20px",
            position: "fixed",
            left: "50%",
            top: "10%",
            transform: "translate(-50%, -50%)",
          }}
          severity="info"
        >
          Processing...
        </Alert>
      </Collapse>
      <div className="isotracker__row">
        <div className="isotracker__column">
          <img
            src={IsoTrackerLogo}
            alt="isoTrackerLogo"
            className="isoTrackerLogo__image2"
          />

          <div className="roleSelector__containerF">
            <RoleDropDown
              style={{ paddingLeft: "2px" }}
              onChange={(value) => setCurrentRole(value)}
              roles={roles}
            />
          </div>
        </div>

        <div className="isotracker__column">
          <table
            className="equipTable__table"
            style={{ marginTop: "270px", width: "50%", marginLeft: "45%" }}
          >
            <tbody className="equipable__body">
              <tr>
                <td
                  className="equipTable__header"
                  style={{
                    backgroundColor: "#338DF1",
                    borderRadius: "1em 0 0 0",
                  }}
                >
                  Estimated weight
                </td>
                <td
                  className="equipTable__header"
                  style={{ backgroundColor: "#338DF1" }}
                >
                  Modelled weight
                </td>
                <td
                  className="equipTable__header"
                  style={{
                    backgroundColor: "#338DF1",
                    borderRadius: "0 1em 0 0",
                  }}
                >
                  Total progress
                </td>
              </tr>
              <tr>
                <td
                  className="equipTable__state"
                  style={{ borderRadius: "0 0 0 1em" }}
                >
                  {weight}
                </td>
                <td className="equipTable__state">{modelledWeight}</td>
                <td
                  className="equipTable__state"
                  style={{ borderRadius: "0 0 1em 0" }}
                >
                  {progress}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <table className="isotracker__table__container">
        <tr className="isotracker__table__navBar__container">
          <th colSpan="2" className="isotracker__table__navBar">
            {recycleBinBtn}
            {holdBtn}
            {feedProgressButton}
          </th>
        </tr>
        <tr
          className="isotracker__table__tray__and__table__container"
          style={{ height: "470px" }}
        >
          <td className="disciplines__table__trays">
            <div className="trays__container" style={{ zoom: 0.85 }}>
              <PipingNavBtns
                onChange={(value) => setCurrentTab(value)}
                currentTab={currentTab}
                currentRole={currentRole}
              />
              {/* 
                                  <p className="isotracker__table__trays__group">Options</p>
                                  <center className="equimentsNavBtns__center">              
                                    <EquipmentsNavBtns onChange={value => setCurrentTab(value)} currentTab = {currentTab} currentRole = {currentRole} discipline = "Equipment"/>               
                                    </center>
                                    */}
            </div>
          </td>
          <td className="discplines__table__table" style={{ height: "440px" }}>
            <div
              style={{ height: "430px", width: "80%" }}
              className="isotracker__table__table__container"
            >
              {isoControllLineIdGroupBtn}
              {uploadBOMBtn}
              {feedForecastBtn}
              {table}
            </div>
          </td>
        </tr>
      </table>
      <center
        className="actionBtns__container"
        style={{ marginTop: "40px", zoom: 0.9 }}
      >
        {actionBtns}
      </center>
    </div>
  );
};

export default Piping;
