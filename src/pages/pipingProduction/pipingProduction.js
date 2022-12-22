import React, { useState, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import IdleTimer from "react-idle-timer";
import { useHistory } from "react-router";
import GraphImage from "../../assets/images/ChartBarGraph.svg";
import ExportImage from "../../assets/images/ShareNetwork.svg";
import IsometricsImage from "../../assets/images/CodesandboxLogo.svg";
import WeightImage from "../../assets/images/Barbell.svg";
import ArrowImage from "../../assets/images/ArrowLeft.svg";
import AlertF from "../../components/alert/alert";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx-js-style";
import SaveIcon2 from "../../assets/images/SaveIcon2.svg";
import "./pipingProduction.css";
import SaveIcon from "../../assets/images/save.svg";
import { Line } from "react-chartjs-2";
import NavBar from "../../components/navBar/navBar";
import ProductionUserTabs from "../../components/productionUserTabs/productionUserTabs";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PITRequests = () => {
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

  const [tab, setTab] = useState("prod");
  const [tabBtns, setTabBtns] = useState(null);
  const [usersType, setUsersType] = useState("iso");
  const [usersData, setUsersData] = useState(null);
  const [userEffTitle, setUserEffTitle] = useState(
    <center
      style={{
        fontSize: "22px",
        fontWeight: "bold",
        color: "gray",
        marginTop: "-10px",
        marginLeft: "-200px",
      }}
    >
      USER ISOMETRICS EFFICIENCY
    </center>
  );

  const [updateData, setUpdateData] = useState(false);
  const [updateRows, setUpdateRows] = useState(false);
  const [tables, setTables] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [materialsIDList, setMaterialsIDList] = useState([]);
  const [piping, setPiping] = useState([]);
  const [management, setManagement] = useState([]);

  const [estimatedData, setEstimatedData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [realData, setRealData] = useState({});
  const [estimatedProgressData, setEstimatedProgressData] = useState({});
  const [realProgressData, setRealProgressData] = useState({});
  const [estimatedMaterialData, setEstimatedMaterialData] = useState({});
  const [overallTable, setOverallTable] = useState();

  const [estimatedWeightData, setEstimatedWeightData] = useState({});
  const [forecastWeightData, setForecastWeightData] = useState({});
  const [realWeightData, setRealWeightData] = useState({});
  const [estimatedProgressWeightData, setEstimatedProgressWeightData] =
    useState({});
  const [realProgressWeightData, setRealProgressWeightData] = useState({});

  const [realWeightMatData, setRealWeightMatData] = useState({});
  const [realProgressWeightMatData, setRealProgressWeightMatData] = useState(
    {}
  );

  const [success, setSuccess] = useState(false);
  const [spanAlert, setSpanAlert] = useState(false);
  const [pipingAlert, setPipingAlert] = useState(false);
  const [materialsAlert, setMaterialsAlert] = useState(false);

  const [weeksYDiff, setWeeksYDiff] = useState();

  const [lineChart, setLineChart] = useState();

  const [loading, setLoading] = useState(false);

  const [estimatedOverall, setEstimatedOverall] = useState([]);
  const [realOverall, setRealOverall] = useState([]);
  const [estimatedProgressOverall, setEstimatedProgressOverall] = useState([]);
  const [realProgressOverall, setRealProgressOverall] = useState([]);

  //Array de colores que corresponderan a cada material
  const colors = [
    "#4169E1",
    "#B0E0E6",
    "#00BFFF",
    "#008000",
    "#7CFC00",
    "#98FB98",
    "#FF8C00",
    "#FFD700",
    "#FF0000",
    "#FF1493",
    "#FF69B4",
    "#FFC0CB",
    "#708090",
    "#A9A9A9",
    "#DCDCDC",
    "#20B2AA",
    "#00CED1",
    "#AFEEEE",
  ];

  document.body.style.zoom = 1;

  //menu desplegable
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  //menu desplegable users
  const [menuUsers, setMenuUsers] = useState(false);
  const toggleMenuUsers = () => {
    setMenuUsers(!menuUsers);
  };

  //menu desplegable production
  const [menuProduction, setMenuProduction] = useState(false);
  const toggleMenuProduction = () => {
    setMenuProduction(!menuProduction);
  };

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

  useEffect(async () => {
    const table_class = [
      "mat1-table",
      "mat2-table",
      "mat3-table",
      "mat4-table",
      "mat5-table",
      "mat6-table",
    ]; //Array de clases de css de materiales
    const weight_table_class = [
      "wmat1-table",
      "wmat2-table",
      "wmat3-table",
      "wmat4-table",
      "wmat5-table",
      "wmat6-table",
    ]; //Array de clases de css de materiales por peso

    await setLoading(true);

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Get de las piping class
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getMaterialsPipingClass",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        const materials = json.materials;
        let piping = [];
        for (let i = 0; i < materials.length; i++) {
          piping.push({
            id: materials[i].piping_id,
            PipingClass: materials[i].piping,
            Material: materials[i].material,
          });
        }

        await setPiping(piping);
      });

    //Get del project span del proyecto
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getProjectSpan",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        const span = json.span;
        if (span.length > 0) {
          await setManagement({
            "Starting date":
              span[0].starting_date.toString().substring(8, 10) +
              "/" +
              span[0].starting_date.toString().substring(5, 7) +
              "/" +
              span[0].starting_date.toString().substring(0, 4),
            "Finishing date":
              span[0].finishing_date.toString().substring(8, 10) +
              "/" +
              span[0].finishing_date.toString().substring(5, 7) +
              "/" +
              span[0].finishing_date.toString().substring(0, 4),
          });
        } else {
          await setManagement({ "Starting date": "", "Finishing date": "" });
        }
      });

    //Get de las estimaciones por material
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getEstimatedByMaterial",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        let est = estimatedMaterialData;
        for (let i = 0; i < json.estimated.length; i++) {
          est[json.estimated[i].id] = json.estimated[i].estimated;
        }
        await setEstimatedMaterialData(est);
      });

    //Get de los materiales
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/getMaterials",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        const materials = json.materials;
        let mat = []; //Lista de objetos id-material
        let matList = []; //Lista con los nombres de los materiales
        let matIDList = []; //List de ids de los materiales
        for (let i = 0; i < materials.length; i++) {
          //Por cada material guardamos sus datos en estos arrays
          mat.push({ id: materials[i].id, Material: materials[i].name });
          matList.push(materials[i].name);
          matIDList.push(materials[i].id);
        }

        await setMaterialsIDList(matIDList);
        await setMaterials(mat);
        await setMaterialsList(matList);

        if (tab === "prod") {
          //Si estamos en la tab de produccion
          setTabBtns(
            <div style={{ width: "140px" }}>
              <button
                className="reporting__tab__button"
                style={{ backgroundColor: "#338DF1" }}
              >
                P
              </button>
              <button
                className="reporting__tab__button"
                style={{ marginTop: "10px" }}
                onClick={async () => await setTab("weight")}
              >
                W
              </button>
              <button
                className="reporting__tab__button"
                style={{ marginTop: "10px" }}
                onClick={async () => await setTab("users")}
              >
                U
              </button>
            </div>
          );
          //Get de las emisiones por semana
          await fetch(
            "http://" +
              process.env.REACT_APP_SERVER +
              ":" +
              process.env.REACT_APP_NODE_PORT +
              "/getIssuedByMatWeek",
            options
          )
            .then((response) => response.json())
            .then(async (json) => {
              const issued = json.issued;
              //Get de las estimadas por semana
              await fetch(
                "http://" +
                  process.env.REACT_APP_SERVER +
                  ":" +
                  process.env.REACT_APP_NODE_PORT +
                  "/getEstimatedMatWeek",
                options
              )
                .then((response) => response.json())
                .then(async (json) => {
                  const estimated = json.estimated;
                  await setWeeksYDiff(estimated[0].weekY - 1);
                  const weekYdiff = estimated[0].weekY - 1;
                  if (estimated.length > 0) {
                    //Get del forecast por semana
                    fetch(
                      "http://" +
                        process.env.REACT_APP_SERVER +
                        ":" +
                        process.env.REACT_APP_NODE_PORT +
                        "/getForecastMatWeek",
                      options
                    )
                      .then((response) => response.json())
                      .then(async (json) => {
                        const forecast = json.forecast;
                        let tables = [];
                        let material = estimated[0].material_id;
                        const settings = {
                          licenseKey: "non-commercial-and-evaluation",
                          colWidths: 40,
                          rowHeaderWidth: 190,
                          //... other options
                        };

                        //Diccionarios y arrays para ir guardando los datos y crear despues las tablas y graficas
                        let weeks = [];
                        let graphData = [];
                        let est = {};
                        let sumEst = {};
                        let sumReal = {};
                        let sumForc = {};
                        let sumEstGraph = [];
                        let sumRealGraph = [];
                        let sumForcGraph = [];
                        let countEst = 0;
                        let countReal = 0;
                        let countForc = 0;
                        let forc = {};
                        let col = [];
                        let sumEstCells = [];

                        //Por cada estimacion
                        for (let i = 0; i < estimated.length; i++) {
                          if (estimated[i].material_id === material) {
                            //Si el material al que corresponde la estimacion es igual al de la estimacion anterior
                            weeks.push(estimated[i].week.toString()); //Creamos la semana
                            est[estimated[i].week.toString()] =
                              estimated[i].estimated; //Guardamos el valor de la estimacion
                            forc[forecast[i].week.toString()] =
                              forecast[i].estimated; //Guardamos el valor del forecast
                            countForc += forecast[i].estimated; //Sumamos al contador
                            countEst += estimated[i].estimated; //Sumamos al contador
                            sumEst[estimated[i].week.toString()] = countEst; //Creamos el progreso de la estimacion de esa semana
                            if (issued[material]) {
                              //Si hay alguna emitida de este material esta semana
                              if (issued[material][estimated[i].week]) {
                                //Creamos la emision
                                countReal +=
                                  issued[material][estimated[i].week]; //Sumamos al contador
                              }
                            }
                            sumReal[estimated[i].week.toString()] = countReal; //Guardamos el valor real total hasta esta semana
                            sumForc[estimated[i].week.toString()] = countForc; //Guardamos el valor del forecast total hasta esta semana
                            col.push({
                              data: estimated[i].week.toString(),
                              type: "numeric",
                            }); //Guardamos la columna de la semana para crear mas tarde la tabla
                            //Las filas 1, 3 y 4 no son editables (corresponde a la fila Real, Estimated Progress y Real Progress)
                            sumEstCells.push({
                              row: 1,
                              col: i,
                              readOnly: true,
                            });
                            sumEstCells.push({
                              row: 3,
                              col: i,
                              readOnly: true,
                            });
                            sumEstCells.push({
                              row: 4,
                              col: i,
                              readOnly: true,
                            });
                          } else {
                            //Si es un material nuevo
                            //Guardamos todos los arrays con la info del material
                            let estData = estimatedData;
                            estData[material] = est;
                            await setEstimatedData(estData);
                            let forcData = forecastData;
                            forcData[material] = forc;
                            await setForecastData(forcData);
                            let rData = realData;
                            rData[material] = issued[material];
                            await setRealData(rData);
                            let sumEstData = estimatedProgressData;
                            sumEstData[material] = sumEst;
                            await setEstimatedProgressData(sumEstData);
                            let sumRealData = realProgressData;
                            sumRealData[material] = sumReal;
                            await setRealProgressData(sumRealData);
                            let totalEst =
                              estimatedMaterialData[
                                estimated[i - 1].material_id
                              ];
                            if (!totalEst) {
                              totalEst = 0;
                            }
                            //Si hay mas estimadas que lineas creadas en la tabla de estimacion
                            let diff = countEst - totalEst;
                            let warning = null;
                            if (totalEst < countEst) {
                              warning = (
                                <p className="warning__text">
                                  *Estimated exceeded by {diff}!
                                </p>
                              ); //Mensaje de warning
                            }
                            if (!totalEst) {
                              totalEst = "(0 estimated)";
                            } else {
                              totalEst =
                                "(" + totalEst.toString() + " estimated)";
                            }

                            let t_class =
                              table_class[matIDList.indexOf(material)]; //Le pasamos a la tabla que vamos a crear una clase(depende del orden)
                            //Creamos la tabla like excel de este material
                            await tables.push(
                              <div
                                id="hot-app"
                                style={{
                                  borderBottom: "1px solid lightgray",
                                  width: "1750px",
                                  paddingBottom: "30px",
                                  marginTop: "20px",
                                }}
                              >
                                <div style={{ display: "flex" }}>
                                  <p className="materials__title">
                                    {estimated[i - 1].name.toUpperCase()}{" "}
                                    Isometrics{" "}
                                    <p style={{ fontSize: "17px" }}>
                                      {totalEst}
                                    </p>{" "}
                                    {warning}
                                  </p>
                                  <button
                                    className="save__button"
                                    onClick={() =>
                                      submitEstimatedForecast(
                                        estimated[i - 1].material_id
                                      )
                                    }
                                  >
                                    <img
                                      src={SaveIcon}
                                      alt="save"
                                      className="save__icon"
                                    ></img>
                                  </button>
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                  <HotTable
                                    data={[
                                      est,
                                      issued[material],
                                      forc,
                                      sumEst,
                                      sumReal,
                                    ]}
                                    colHeaders={weeks}
                                    rowHeaders={[
                                      "Estimated",
                                      "Real",
                                      "Forecast",
                                      "Estimated progress",
                                      "Real progress",
                                    ]}
                                    width="1750"
                                    height="160"
                                    settings={settings}
                                    manualColumnResize={true}
                                    manualRowResize={true}
                                    columns={col}
                                    filters={true}
                                    cell={sumEstCells}
                                    className={t_class}
                                  />
                                </div>
                              </div>
                            );

                            //Guardamos en un array las estimaciones, emitidas y forecast
                            Object.keys(sumEst).map(function (key, index) {
                              sumEstGraph.push(sumEst[key]);
                            });

                            Object.keys(sumReal).map(function (key, index) {
                              sumRealGraph.push(sumReal[key]);
                            });

                            Object.keys(sumForc).map(function (key, index) {
                              sumForcGraph.push(sumForc[key]);
                            });

                            let color_index = matIDList.indexOf(material) * 3; //El material recibe un color en funcion de su id

                            //Guardamos las lineas de la grafica en un array para luego pasarlos a la grafica
                            graphData.push({
                              label: "Estimated " + estimated[i - 1].name,
                              fill: false,
                              lineTension: 0.2,
                              backgroundColor: colors[color_index],
                              borderColor: colors[color_index],
                              borderWidth: 1,
                              data: sumEstGraph,
                            });

                            graphData.push({
                              label: "Forecast " + estimated[i - 1].name,
                              fill: false,
                              lineTension: 0.2,
                              backgroundColor: colors[color_index + 2],
                              borderColor: colors[color_index + 2],
                              borderWidth: 1,
                              data: sumForcGraph,
                            });

                            graphData.push({
                              label: "Real " + estimated[i - 1].name,
                              fill: false,
                              lineTension: 0.2,
                              backgroundColor: colors[color_index + 1],
                              borderColor: colors[color_index + 1],
                              borderWidth: 1,
                              data: sumRealGraph,
                            });

                            //Cuando hemos acabado y hemos guardado la tabla y las lineas de la grafica lo inicializamos todo a 0 de nuevo
                            weeks = [estimated[i].week.toString()];
                            est = {};
                            forc = {};
                            sumEst = {};
                            sumReal = {};
                            sumForc = {};
                            sumEstGraph = [];
                            sumRealGraph = [];
                            sumForcGraph = [];
                            est[estimated[i].week.toString()] =
                              estimated[i].estimated;
                            forc[forecast[i].week.toString()] =
                              forecast[i].estimated;
                            if (issued[estimated[i].material_id]) {
                              if (issued[estimated[i].material_id]["1"]) {
                                countReal =
                                  issued[estimated[i].material_id][
                                    estimated[i].week
                                  ];
                              } else {
                                countReal = 0;
                              }
                            } else {
                              countReal = 0;
                            }
                            sumReal[estimated[i].week.toString()] = countReal;

                            if (estimated[i].estimated) {
                              countEst = estimated[i].estimated;
                            } else {
                              countEst = 0;
                            }

                            if (forecast[i].estimated) {
                              countForc = forecast[i].estimated;
                            } else {
                              countForc = 0;
                            }
                            sumForc[forecast[i].week.toString()] = countForc;
                            sumEst[estimated[i].week.toString()] = countEst;

                            col = [
                              {
                                data: estimated[i].week.toString(),
                                type: "numeric",
                              },
                            ];
                            material = estimated[i].material_id;
                          }
                        }
                        //Cuando salimos del bucle quiere decir que solo nos falta por crear la tabla y la grafica del ultimo material, asi que hacemos lo mismo que antes pero para este ultimo material
                        let estData = estimatedData;
                        estData[material] = est;
                        await setEstimatedData(estData);
                        let forcData = forecastData;
                        forcData[material] = forc;
                        await setForecastData(forcData);
                        let rData = realData;
                        rData[material] = issued[material];
                        await setRealData(rData);
                        let sumEstData = estimatedProgressData;
                        sumEstData[material] = sumEst;
                        await setEstimatedProgressData(sumEstData);
                        let sumRealData = realProgressData;
                        sumRealData[material] = sumReal;
                        await setRealProgressData(sumRealData);
                        let totalEst = estimatedMaterialData[material];
                        if (!totalEst) {
                          totalEst = 0;
                        }
                        let diff = countEst - totalEst;
                        let warning = null;
                        if (totalEst < countEst) {
                          warning = (
                            <p className="warning__text">
                              *Estimated exceeded by {diff}!
                            </p>
                          );
                        }
                        if (!totalEst) {
                          totalEst = "(0 estimated)";
                        } else {
                          totalEst = "(" + totalEst.toString() + " estimated)";
                        }

                        let t_class = table_class[matIDList.indexOf(material)];

                        await tables.push(
                          <div
                            id="hot-app"
                            style={{
                              width: "1750px",
                              paddingBottom: "30px",
                              marginTop: "20px",
                            }}
                          >
                            <div style={{ display: "flex" }}>
                              <p className="materials__title">
                                {estimated[
                                  estimated.length - 1
                                ].name.toUpperCase()}{" "}
                                Isometrics{" "}
                                <p style={{ fontSize: "17px" }}>{totalEst}</p>{" "}
                                {warning}
                              </p>
                              <button
                                className="save__button"
                                onClick={() =>
                                  submitEstimatedForecast(material)
                                }
                              >
                                <img
                                  src={SaveIcon}
                                  alt="save"
                                  className="save__icon"
                                ></img>
                              </button>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                              <HotTable
                                data={[
                                  est,
                                  issued[material],
                                  forc,
                                  sumEst,
                                  sumReal,
                                ]}
                                colHeaders={weeks}
                                rowHeaders={[
                                  "Estimated",
                                  "Real",
                                  "Forecast",
                                  "Estimated progress",
                                  "Real progress",
                                ]}
                                width="1750"
                                height="160"
                                settings={settings}
                                manualColumnResize={true}
                                manualRowResize={true}
                                columns={col}
                                filters={true}
                                cell={sumEstCells}
                                className={t_class}
                              />
                            </div>
                          </div>
                        );

                        await setTables([]);
                        await setTables(tables);

                        Object.keys(sumEst).map(function (key, index) {
                          sumEstGraph.push(sumEst[key]);
                        });

                        Object.keys(sumReal).map(function (key, index) {
                          sumRealGraph.push(sumReal[key]);
                        });
                        Object.keys(sumForc).map(function (key, index) {
                          sumForcGraph.push(sumForc[key]);
                        });

                        let color_index = matIDList.indexOf(material) * 3;

                        graphData.push({
                          label:
                            "Estimated " + estimated[estimated.length - 1].name,
                          fill: false,
                          lineTension: 0.2,
                          backgroundColor: colors[color_index],
                          borderColor: colors[color_index],
                          borderWidth: 1,
                          data: sumEstGraph,
                        });

                        graphData.push({
                          label:
                            "Forecast " + estimated[estimated.length - 1].name,
                          fill: false,
                          lineTension: 0.2,
                          backgroundColor: colors[color_index + 2],
                          borderColor: colors[color_index + 2],
                          borderWidth: 1,
                          data: sumForcGraph,
                        });

                        graphData.push({
                          label: "Real " + estimated[estimated.length - 1].name,
                          fill: false,
                          lineTension: 0.2,
                          backgroundColor: colors[color_index + 1],
                          borderColor: colors[color_index + 1],
                          borderWidth: 1,
                          data: sumRealGraph,
                        });

                        //Una vez guardado el ultimo material pasamos a crear la tabla y grafica del overall (la suma de todos los materiales)

                        let overallTable = [];
                        let totalEstimated = 0;

                        let estimatedOverall = {};
                        let esimatedOverallSum = {};
                        let estimatedOverallCount = 0;
                        let estimatedOverallGraph = [];

                        let realOverall = {};
                        let realOverallSum = {};
                        let realOverallCount = 0;
                        let realOverallGraph = [];

                        Object.keys(estimatedMaterialData).map(function (
                          key,
                          index
                        ) {
                          totalEstimated += estimatedMaterialData[key];
                        });

                        Object.keys(issued).map(function (key, index) {
                          //Calculamos el valor real overall
                          Object.keys(issued[key]).map(function (k, index) {
                            if (realOverall[k]) {
                              realOverall[k] += issued[key][k];
                            } else {
                              realOverall[k] = issued[key][k];
                            }
                          });
                        });

                        Object.keys(estimated).map(function (key, index) {
                          //Calculamos el valor estimado overall
                          if (estimatedOverall[estimated[key].week]) {
                            estimatedOverall[estimated[key].week] +=
                              estimated[key].estimated;
                          } else {
                            estimatedOverall[estimated[key].week] =
                              estimated[key].estimated;
                          }
                        });

                        let labels = [];
                        let overallCells = [];
                        console.log(estimatedOverall);
                        await Object.keys(estimatedOverall).map(function (
                          key,
                          index
                        ) {
                          //Por cada valor del overall
                          if (realOverall[key]) {
                            realOverallCount += realOverall[key];
                          }
                          //Guardamos el real estimado, progreso estimado, estimado y real
                          realOverallSum[key] = realOverallCount;
                          estimatedOverallCount += estimatedOverall[key];
                          esimatedOverallSum[key] = estimatedOverallCount;
                          estimatedOverallGraph.push(estimatedOverallCount);
                          realOverallGraph.push(realOverallCount);

                          overallCells.push({
                            row: 2,
                            col: index,
                            className: "overallCell__estSum",
                          }); //Las celdas de las filas estimated y real tienen sus estilos
                          overallCells.push({
                            row: 3,
                            col: index,
                            className: "overallCell__realSum",
                          });

                          labels.push(
                            "w" +
                              key.toString() +
                              " / w" +
                              (parseInt(key) + weekYdiff)
                          );
                        });

                        //lineas de estimated overall y real overall de la grafica
                        graphData.push({
                          label: "Estimated Overall",
                          fill: false,
                          lineTension: 0.2,
                          backgroundColor: "rgb(147,112,219)",
                          borderColor: "rgb(147,112,219)",
                          borderWidth: 1,
                          data: estimatedOverallGraph,
                        });

                        graphData.push({
                          label: "Real Overall",
                          fill: false,
                          lineTension: 0.2,
                          backgroundColor: "rgb(255,80,80)",
                          borderColor: "rgb(255,80,80)",
                          borderWidth: 1,
                          data: realOverallGraph,
                        });

                        warning = null;
                        if (totalEstimated < estimatedOverallCount) {
                          warning = (
                            <p className="warning__text">
                              *Estimated exceeded by{" "}
                              {estimatedOverallCount - totalEstimated}!
                            </p>
                          );
                        }

                        //Creamos la tabla excel del overall
                        await overallTable.push(
                          <div
                            id="hot-app"
                            style={{
                              borderBottom: "1px solid lightgray",
                              borderTop: "1px solid lightgray",
                              width: "1750px",
                              paddingBottom: "30px",
                              paddingTop: "30px",
                              marginTop: "20px",
                            }}
                          >
                            <p className="materials__title">
                              OVERALL Isometrics{" "}
                              <p style={{ fontSize: "17px" }}>
                                ({totalEstimated} estimated)
                              </p>{" "}
                              {warning}
                            </p>
                            <div style={{ marginTop: "10px" }}>
                              <HotTable
                                data={[
                                  estimatedOverall,
                                  realOverall,
                                  esimatedOverallSum,
                                  realOverallSum,
                                ]}
                                colHeaders={weeks}
                                rowHeaders={[
                                  "Estimated",
                                  "Real",
                                  "Estimated progress",
                                  "Real progress",
                                ]}
                                width="1750"
                                height="138"
                                settings={settings}
                                manualColumnResize={true}
                                manualRowResize={true}
                                columns={col}
                                filters={true}
                                readOnly={true}
                                className="overall-table"
                              />
                            </div>
                          </div>
                        );

                        //Finalmente creamos la grafica con todas las lineas (materiales y overall)
                        await setEstimatedOverall(estimatedOverall);
                        await setRealOverall(realOverall);
                        await setEstimatedProgressOverall(esimatedOverallSum);
                        await setRealProgressOverall(realOverallSum);
                        await setOverallTable();
                        await setOverallTable(overallTable);
                        await setLineChart(
                          <Line
                            data={{
                              labels: labels,
                              datasets: graphData,
                            }}
                            options={{
                              hover: {
                                mode: "new mode",
                              },
                              maintainAspectRatio: false,
                              plugins: {
                                title: {
                                  display: true,
                                  text: "PRODUCTION CURVES",
                                  font: { size: "22px", family: "Quicksand" },
                                },
                                legend: {
                                  display: true,
                                  position: "left",
                                  labels: {
                                    filter: function (legendItem, chartData) {
                                      chartData.datasets[
                                        legendItem.datasetIndex
                                      ].hidden = true;
                                      return true;
                                    },
                                  },
                                },
                              },
                            }}
                          />
                        );
                      });
                  }
                });
            });
        } else if (tab === "weight") {
          //Lo mismo que prod pero en vez de por unidades se ve por peso
          setTabBtns(
            <div style={{ width: "140px" }}>
              <button
                className="reporting__tab__button"
                onClick={() => setTab("prod")}
              >
                P
              </button>
              <button
                className="reporting__tab__button"
                style={{ marginTop: "10px", backgroundColor: "#338DF1" }}
              >
                W
              </button>
              <button
                className="reporting__tab__button"
                style={{ marginTop: "10px" }}
                onClick={async () => await setTab("users")}
              >
                U
              </button>
            </div>
          );
          await fetch(
            "http://" +
              process.env.REACT_APP_SERVER +
              ":" +
              process.env.REACT_APP_NODE_PORT +
              "/getIssuedWeightByMatWeek",
            options
          )
            .then((response) => response.json())
            .then(async (json) => {
              const issued = json.issued;
              await setRealWeightMatData(issued);
              await fetch(
                "http://" +
                  process.env.REACT_APP_SERVER +
                  ":" +
                  process.env.REACT_APP_NODE_PORT +
                  "/getEstimatedForecastWeight",
                options
              )
                .then((response) => response.json())
                .then(async (json) => {
                  const estimated = json.estimated;
                  if (estimated.length > 0) {
                    let tables = [];
                    const weightSettings = {
                      licenseKey: "non-commercial-and-evaluation",
                      colWidths: 55,
                      rowHeaderWidth: 190,
                      //... other options
                    };

                    let weeks = [];
                    let graphData = [];
                    let est = {};
                    let forc = {};
                    let sumEst = {};

                    let sumForc = {};
                    let countEst = 0;
                    let countForc = 0;
                    let col = [];
                    let sumEstCells = [];

                    let realOverallCount = 0;
                    let realOverallSum = {};
                    let realOverallGraph = [];
                    let realOverall = {};

                    for (let i = 0; i < estimated.length; i++) {
                      weeks.push(estimated[i].week.toString());
                      est[estimated[i].week] = estimated[i].estimated;
                      forc[estimated[i].week] = estimated[i].forecast;
                      countEst += estimated[i].estimated;
                      countForc += estimated[i].forecast;
                      sumEst[estimated[i].week] = countEst;
                      sumForc[estimated[i].week] = countForc;

                      col.push({
                        data: estimated[i].week.toString(),
                        type: "numeric",
                      });
                    }
                    Object.keys(issued).map(async function (key, index) {
                      let countReal = 0;
                      let sumReal = {};
                      let sumRealGraph = [];
                      Object.keys(est).map(async function (w, index) {
                        if (issued[key][w]) {
                          countReal += issued[key][w];
                          sumReal[w] = countReal;
                        } else {
                          sumReal[w] = countReal;
                        }
                        if (realOverall[w]) {
                          realOverall[w] += issued[key][w];
                        } else {
                          realOverall[w] = issued[key][w];
                        }
                      });

                      let t_class =
                        weight_table_class[matIDList.indexOf(parseInt(key))];
                      await tables.push(
                        <div
                          id="hot-app"
                          style={{
                            borderBottom: "1px solid lightgray",
                            width: "1750px",
                            paddingBottom: "30px",
                            marginTop: "20px",
                          }}
                        >
                          <p className="materials__title">
                            {materialsList[
                              matIDList.indexOf(parseInt(key))
                            ].toUpperCase()}{" "}
                            Weight (kg)
                          </p>
                          <div style={{ marginTop: "10px" }}>
                            <HotTable
                              data={[issued[key], sumReal]}
                              colHeaders={weeks}
                              rowHeaders={["Real", "Real progress"]}
                              width="1750"
                              height="95"
                              settings={weightSettings}
                              manualColumnResize={true}
                              manualRowResize={true}
                              columns={col}
                              filters={true}
                              readOnly={true}
                              cell={sumEstCells}
                              className={t_class}
                            />
                          </div>
                        </div>
                      );

                      Object.keys(sumReal).map(function (key, index) {
                        sumRealGraph.push(sumReal[key]);
                      });

                      let color_index = matIDList.indexOf(parseInt(key)) * 3;

                      graphData.push({
                        label:
                          "Real " +
                          materialsList[matIDList.indexOf(parseInt(key))],
                        fill: false,
                        lineTension: 0.2,
                        backgroundColor: colors[color_index + 1],
                        borderColor: colors[color_index + 1],
                        borderWidth: 1,
                        data: sumRealGraph,
                      });

                      let realProgressWeight = realProgressWeightMatData;
                      realProgressWeight[key] = sumReal;
                      await setRealProgressWeightMatData(realProgressWeight);
                    });

                    await setTables([]);
                    await setTables(tables);

                    let overallTable = [];
                    let totalEstimated = 0;

                    let estimatedOverall = {};
                    let esimatedOverallSum = {};
                    let estimatedOverallCount = 0;
                    let estimatedOverallGraph = [];

                    let forecastOverall = {};
                    let forecastOverallSum = {};
                    let forecastOverallCount = 0;
                    let forecastOverallGraph = [];

                    for (let i = 0; i < estimated.length; i++) {
                      totalEstimated += estimated[i]["estimated"];
                    }

                    Object.keys(est).map(function (key, index) {
                      if (estimatedOverall[key]) {
                        estimatedOverall[key] += est[key];
                      } else {
                        estimatedOverall[key] = est[key];
                      }
                    });

                    Object.keys(forc).map(function (key, index) {
                      if (forecastOverall[key]) {
                        forecastOverall[key] += forc[key];
                      } else {
                        forecastOverall[key] = forc[key];
                      }
                    });

                    await setEstimatedWeightData(estimatedOverall);
                    await setForecastWeightData(forecastOverall);

                    let labels = [];
                    let overallCells = [];
                    await Object.keys(estimatedOverall).map(function (
                      key,
                      index
                    ) {
                      if (realOverall[key]) {
                        realOverallCount += realOverall[key];
                      }
                      realOverallSum[key] = realOverallCount;
                      estimatedOverallCount += estimatedOverall[key];
                      esimatedOverallSum[key] = estimatedOverallCount;
                      estimatedOverallGraph.push(estimatedOverallCount);
                      realOverallGraph.push(realOverallCount);

                      forecastOverallCount += forecastOverall[key];
                      forecastOverallSum[key] = forecastOverallCount;
                      forecastOverallGraph.push(forecastOverallCount);

                      overallCells.push({ row: 1, col: index, readOnly: true });
                      overallCells.push({
                        row: 3,
                        col: index,
                        className: "overallCell__estSum",
                        readOnly: true,
                      });
                      overallCells.push({
                        row: 4,
                        col: index,
                        className: "overallCell__realSum",
                        readOnly: true,
                      });

                      labels.push(
                        "w" +
                          key.toString() +
                          " / w" +
                          (parseInt(key) + weeksYDiff)
                      );
                    });

                    graphData.push({
                      label: "Estimated Overall",
                      fill: false,
                      lineTension: 0.2,
                      backgroundColor: "rgb(147,112,219)",
                      borderColor: "rgb(147,112,219)",
                      borderWidth: 1,
                      data: estimatedOverallGraph,
                    });

                    graphData.push({
                      label: "Forecast Overall",
                      fill: false,
                      lineTension: 0.2,
                      backgroundColor: "rgb(60,179,113)",
                      borderColor: "rgb(60,179,113)",
                      borderWidth: 1,
                      data: forecastOverallGraph,
                    });

                    graphData.push({
                      label: "Real Overall",
                      fill: false,
                      lineTension: 0.2,
                      backgroundColor: "rgb(255,80,80)",
                      borderColor: "rgb(255,80,80)",
                      borderWidth: 1,
                      data: realOverallGraph,
                    });

                    await overallTable.push(
                      <div
                        id="hot-app"
                        style={{
                          borderBottom: "1px solid lightgray",
                          borderTop: "1px solid lightgray",
                          width: "1750px",
                          paddingBottom: "30px",
                          paddingTop: "30px",
                          marginTop: "20px",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <p className="materials__title">
                            OVERALL Weight (kg){" "}
                            <p style={{ fontSize: "17px" }}></p>
                          </p>
                          <button
                            className="save__button"
                            onClick={() =>
                              submitWeight(estimatedOverall, forecastOverall)
                            }
                          >
                            <img
                              src={SaveIcon}
                              alt="save"
                              className="save__icon"
                            ></img>
                          </button>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          <HotTable
                            data={[
                              estimatedOverall,
                              realOverall,
                              forecastOverall,
                              esimatedOverallSum,
                              realOverallSum,
                            ]}
                            colHeaders={weeks}
                            rowHeaders={[
                              "Estimated",
                              "Real",
                              "Forecast",
                              "Estimated progress",
                              "Real progress",
                            ]}
                            width="1750"
                            height="165"
                            settings={weightSettings}
                            manualColumnResize={true}
                            manualRowResize={true}
                            columns={col}
                            filters={true}
                            className="overallWeight-table"
                            cell={overallCells}
                          />
                        </div>
                      </div>
                    );

                    await setEstimatedWeightData(estimatedOverall);
                    await setRealWeightData(realOverall);
                    await setForecastWeightData(forecastOverall);
                    await setEstimatedProgressWeightData(esimatedOverallSum);
                    await setRealProgressWeightData(realOverallSum);
                    await setOverallTable();
                    await setOverallTable(overallTable);
                    await setLineChart(
                      <Line
                        data={{
                          labels: labels,
                          datasets: graphData,
                        }}
                        options={{
                          hover: {
                            mode: "new mode",
                          },
                          plugins: {
                            title: {
                              display: true,
                              text: "WEIGHT CURVES",
                              font: { size: "22px", family: "Quicksand" },
                            },
                            legend: {
                              display: true,
                              position: "left",
                              labels: {
                                filter: function (legendItem, chartData) {
                                  chartData.datasets[
                                    legendItem.datasetIndex
                                  ].hidden = true;
                                  return true;
                                },
                              },
                            },
                          },
                        }}
                      />
                    );
                  }
                });
            });
        } else if (tab === "users") {
          //Si estamos en la tab de users
          if (usersType === "iso") {
            //Dentro de useres tab de iso
            await setUserEffTitle(
              <center
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "gray",
                  marginTop: "-10px",
                  marginLeft: "-200px",
                }}
              >
                USER ISOMETRICS EFFICIENCY
              </center>
            );
            await setTabBtns(
              <div style={{ width: "90px" }}>
                <button
                  className="reporting__tab__button"
                  onClick={() => setTab("prod")}
                >
                  P
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px" }}
                  onClick={async () => await setTab("weight")}
                >
                  W
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px", backgroundColor: "#338DF1" }}
                >
                  U
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px", backgroundColor: "#338DF1" }}
                >
                  I
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px" }}
                  onClick={async () => await setUsersType("weight")}
                >
                  W
                </button>
              </div>
            );
          } else if (usersType === "weight") {
            //Dentro de useres tab de peso
            await setUserEffTitle(
              <center
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "gray",
                  marginTop: "-10px",
                  marginLeft: "-200px",
                }}
              >
                USER WEIGHT EFFICIENCY
              </center>
            );
            await setTabBtns(
              <div style={{ width: "90px" }}>
                <button
                  className="reporting__tab__button"
                  onClick={() => setTab("prod")}
                >
                  P
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px" }}
                  onClick={async () => await setTab("weight")}
                >
                  W
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px", backgroundColor: "#338DF1" }}
                >
                  U
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px" }}
                  onClick={async () => await setUsersType("iso")}
                >
                  I
                </button>
                <button
                  className="reporting__tab__button"
                  style={{ marginTop: "10px", backgroundColor: "#338DF1" }}
                >
                  W
                </button>
              </div>
            );
          }

          await setTables([]);
          await setLineChart(null);
          await setOverallTable([]);
          //get de estimacion y forecast para conseguir las semanas
          await fetch(
            "http://" +
              process.env.REACT_APP_SERVER +
              ":" +
              process.env.REACT_APP_NODE_PORT +
              "/getEstimatedForecastWeight",
            options
          )
            .then((response) => response.json())
            .then(async (json) => {
              const estimated = json.estimated;
              const usersSettings = {
                licenseKey: "non-commercial-and-evaluation",
                colWidths: 40,
                rowHeaderWidth: 190,
                //... other options
              };
              let weeks = [];
              let col = [];
              if (estimated.length > 0) {
                for (let i = 0; i < estimated.length; i++) {
                  weeks.push(estimated[i].week.toString()); //Creamos la semana
                  col.push({
                    data: estimated[i].week.toString(),
                    type: "numeric",
                  }); //Creamos la columna en la tabla
                }
                if (usersType === "iso") {
                  //Si estamos en la vista de isometricas
                  //Get de cuantas isos libres hay por bandeja
                  await fetch(
                    "http://" +
                      process.env.REACT_APP_SERVER +
                      ":" +
                      process.env.REACT_APP_NODE_PORT +
                      "/trayCount",
                    options
                  )
                    .then((response) => response.json())
                    .then(async (json) => {
                      const trayCount = json.isoCount;
                      //Get de las isos por semana de los diseñadores
                      await fetch(
                        "http://" +
                          process.env.REACT_APP_SERVER +
                          ":" +
                          process.env.REACT_APP_NODE_PORT +
                          "/getIsosByUserWeekDesign",
                        options
                      )
                        .then((response) => response.json())
                        .then(async (json) => {
                          const design_isos = json.design_isos; //Lo guardamos aqui
                          await setUsersData(design_isos);
                          //Get de las isos por semana del resto de roles
                          await fetch(
                            "http://" +
                              process.env.REACT_APP_SERVER +
                              ":" +
                              process.env.REACT_APP_NODE_PORT +
                              "/getIsosByUserWeek",
                            options
                          )
                            .then((response) => response.json())
                            .then(async (json) => {
                              const user_isos = json.user_isos;
                              //arrays de cada rol
                              let design = [];
                              let designLead = [];
                              let stress = [];
                              let stressLead = [];
                              let supports = [];
                              let supportsLead = [];
                              let materials = [];
                              let issuer = [];

                              if (design_isos) {
                                //Si hay diseñadores
                                Object.keys(design_isos).map(async function (
                                  user,
                                  index
                                ) {
                                  //Creamos una tabla para cada diseñador
                                  await design.push(
                                    <div
                                      id="hot-app"
                                      style={{
                                        borderBottom: "1px solid lightgray",
                                        width: "1590px",
                                        paddingBottom: "10px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <div style={{ display: "flex" }}>
                                        <p className="materials__title">
                                          {user.toUpperCase()}
                                          <p style={{ fontSize: "17px" }}></p>
                                        </p>
                                      </div>
                                      <div style={{ marginTop: "10px" }}>
                                        <HotTable
                                          data={[
                                            design_isos[user]["assigned"],
                                            design_isos[user]["sent"],
                                            design_isos[user]["returned"],
                                            design_isos[user]["remaining"],
                                          ]}
                                          colHeaders={weeks}
                                          rowHeaders={[
                                            "Assigned",
                                            "Sent",
                                            "Returned",
                                            "Remaining",
                                          ]}
                                          width="1590"
                                          height="145"
                                          settings={usersSettings}
                                          manualColumnResize={true}
                                          manualRowResize={true}
                                          columns={col}
                                          filters={true}
                                          className="users-table"
                                          readOnly={true}
                                        />
                                      </div>
                                    </div>
                                  );
                                });
                              }
                              //Lo mismo para todos los roles
                              if (user_isos["DesignLead"]) {
                                Object.keys(user_isos["DesignLead"]).map(
                                  async function (user, index) {
                                    await designLead.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["DesignLead"][user][
                                                "claimed"
                                              ],
                                              user_isos["DesignLead"][user][
                                                "sent"
                                              ],
                                              user_isos["DesignLead"][user][
                                                "returned"
                                              ],
                                              user_isos["DesignLead"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }
                              if (user_isos["Stress"]) {
                                Object.keys(user_isos["Stress"]).map(
                                  async function (user, index) {
                                    await stress.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["Stress"][user][
                                                "claimed"
                                              ],
                                              user_isos["Stress"][user]["sent"],
                                              user_isos["Stress"][user][
                                                "returned"
                                              ],
                                              user_isos["Stress"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }
                              if (user_isos["StressLead"]) {
                                Object.keys(user_isos["StressLead"]).map(
                                  async function (user, index) {
                                    await stressLead.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["StressLead"][user][
                                                "claimed"
                                              ],
                                              user_isos["StressLead"][user][
                                                "sent"
                                              ],
                                              user_isos["StressLead"][user][
                                                "returned"
                                              ],
                                              user_isos["StressLead"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }
                              if (user_isos["Supports"]) {
                                Object.keys(user_isos["Supports"]).map(
                                  async function (user, index) {
                                    await supports.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["Supports"][user][
                                                "claimed"
                                              ],
                                              user_isos["Supports"][user][
                                                "sent"
                                              ],
                                              user_isos["Supports"][user][
                                                "returned"
                                              ],
                                              user_isos["Supports"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }
                              if (user_isos["SupportsLead"]) {
                                Object.keys(user_isos["SupportsLead"]).map(
                                  async function (user, index) {
                                    await supportsLead.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["SupportsLead"][user][
                                                "claimed"
                                              ],
                                              user_isos["SupportsLead"][user][
                                                "sent"
                                              ],
                                              user_isos["SupportsLead"][user][
                                                "returned"
                                              ],
                                              user_isos["SupportsLead"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }
                              if (user_isos["Materials"]) {
                                Object.keys(user_isos["Materials"]).map(
                                  async function (user, index) {
                                    await materials.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["Materials"][user][
                                                "claimed"
                                              ],
                                              user_isos["Materials"][user][
                                                "sent"
                                              ],
                                              user_isos["Materials"][user][
                                                "returned"
                                              ],
                                              user_isos["Materials"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }
                              if (user_isos["Issuer"]) {
                                Object.keys(user_isos["Issuer"]).map(
                                  async function (user, index) {
                                    await issuer.push(
                                      <div
                                        id="hot-app"
                                        style={{
                                          borderBottom: "1px solid lightgray",
                                          width: "1590px",
                                          paddingBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          <p className="materials__title">
                                            {user.toUpperCase()}
                                            <p style={{ fontSize: "17px" }}></p>
                                          </p>
                                        </div>
                                        <div style={{ marginTop: "10px" }}>
                                          <HotTable
                                            data={[
                                              user_isos["Issuer"][user][
                                                "claimed"
                                              ],
                                              user_isos["Issuer"][user]["sent"],
                                              user_isos["Issuer"][user][
                                                "returned"
                                              ],
                                              user_isos["Issuer"][user][
                                                "remaining"
                                              ],
                                            ]}
                                            colHeaders={weeks}
                                            rowHeaders={[
                                              "Claimed",
                                              "Sent",
                                              "Returned",
                                              "Remaining",
                                            ]}
                                            width="1590"
                                            height="145"
                                            settings={usersSettings}
                                            manualColumnResize={true}
                                            manualRowResize={true}
                                            columns={col}
                                            filters={true}
                                            className="users-table"
                                            readOnly={true}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                );
                              }

                              //Creamos los componentes con las tabs y las isos restantes
                              await setTables(
                                <div>
                                  <ProductionUserTabs>
                                    <div label="Design">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos: {trayCount[0].Design}
                                        </p>
                                        {design}
                                      </div>
                                    </div>
                                    <div label="DesignLead">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos:{" "}
                                          {trayCount[0].DesignLead}
                                        </p>
                                        {designLead}
                                      </div>
                                    </div>
                                    <div label="Stress">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos: {trayCount[0].Stress}
                                        </p>
                                        {stress}
                                      </div>
                                    </div>
                                    <div label="StressLead">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos:{" "}
                                          {trayCount[0].StressLead}
                                        </p>
                                        {stressLead}
                                      </div>
                                    </div>
                                    <div label="Supports">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos:{" "}
                                          {trayCount[0].Supports}
                                        </p>
                                        {supports}
                                      </div>
                                    </div>
                                    <div label="SupportsLead">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos:{" "}
                                          {trayCount[0].SupportsLead}
                                        </p>
                                        {supportsLead}
                                      </div>
                                    </div>
                                    <div label="Materials">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos:{" "}
                                          {trayCount[0].Materials}
                                        </p>
                                        {materials}
                                      </div>
                                    </div>
                                    <div label="Issuer">
                                      <div className="user__productivity__tables__container">
                                        <p className="isoCount__text">
                                          Unclaimed isos: {trayCount[0].Issuer}
                                        </p>
                                        {issuer}
                                      </div>
                                    </div>
                                  </ProductionUserTabs>
                                </div>
                              );
                            });
                        });
                    });
                } else if (usersType === "weight") {
                  //Si estamos en la vista por peso es lo mismo pero multiplicando las unidades por su peso
                  await fetch(
                    "http://" +
                      process.env.REACT_APP_SERVER +
                      ":" +
                      process.env.REACT_APP_NODE_PORT +
                      "/getWeightByUserWeekDesign",
                    options
                  )
                    .then((response) => response.json())
                    .then(async (json) => {
                      const design_isos = json.design_isos;
                      console.log(design_isos);
                      let design = [];
                      let designLead = [];
                      let stress = [];
                      let stressLead = [];
                      let supports = [];
                      let supportsLead = [];
                      let materials = [];
                      let issuer = [];
                      await fetch(
                        "http://" +
                          process.env.REACT_APP_SERVER +
                          ":" +
                          process.env.REACT_APP_NODE_PORT +
                          "/getWeightByUserWeek",
                        options
                      )
                        .then((response) => response.json())
                        .then(async (json) => {
                          let user_isos = json.user_isos;
                          if (design_isos) {
                            Object.keys(design_isos).map(async function (
                              user,
                              index
                            ) {
                              await design.push(
                                <div
                                  id="hot-app"
                                  style={{
                                    borderBottom: "1px solid lightgray",
                                    width: "1590px",
                                    paddingBottom: "10px",
                                    marginTop: "10px",
                                  }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <p className="materials__title">
                                      {user.toUpperCase()}
                                      <p style={{ fontSize: "17px" }}></p>
                                    </p>
                                  </div>
                                  <div style={{ marginTop: "10px" }}>
                                    <HotTable
                                      data={[
                                        design_isos[user]["assigned"],
                                        design_isos[user]["sent"],
                                        design_isos[user]["returned"],
                                        design_isos[user]["remaining"],
                                      ]}
                                      colHeaders={weeks}
                                      rowHeaders={[
                                        "Assigned",
                                        "Sent",
                                        "Returned",
                                        "Remaining",
                                      ]}
                                      width="1590"
                                      height="145"
                                      settings={usersSettings}
                                      manualColumnResize={true}
                                      manualRowResize={true}
                                      columns={col}
                                      filters={true}
                                      className="users-table"
                                      readOnly={true}
                                    />
                                  </div>
                                </div>
                              );
                            });
                          }
                          if (user_isos["DesignLead"]) {
                            Object.keys(user_isos["DesignLead"]).map(
                              async function (user, index) {
                                await designLead.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["DesignLead"][user][
                                            "claimed"
                                          ],
                                          user_isos["DesignLead"][user]["sent"],
                                          user_isos["DesignLead"][user][
                                            "returned"
                                          ],
                                          user_isos["DesignLead"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }
                          if (user_isos["Stress"]) {
                            Object.keys(user_isos["Stress"]).map(
                              async function (user, index) {
                                await stress.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["Stress"][user]["claimed"],
                                          user_isos["Stress"][user]["sent"],
                                          user_isos["Stress"][user]["returned"],
                                          user_isos["Stress"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }
                          if (user_isos["StressLead"]) {
                            Object.keys(user_isos["StressLead"]).map(
                              async function (user, index) {
                                await stressLead.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["StressLead"][user][
                                            "claimed"
                                          ],
                                          user_isos["StressLead"][user]["sent"],
                                          user_isos["StressLead"][user][
                                            "returned"
                                          ],
                                          user_isos["StressLead"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }
                          if (user_isos["Supports"]) {
                            Object.keys(user_isos["Supports"]).map(
                              async function (user, index) {
                                await supports.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["Supports"][user][
                                            "claimed"
                                          ],
                                          user_isos["Supports"][user]["sent"],
                                          user_isos["Supports"][user][
                                            "returned"
                                          ],
                                          user_isos["Supports"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }
                          if (user_isos["SupportsLead"]) {
                            Object.keys(user_isos["SupportsLead"]).map(
                              async function (user, index) {
                                await supportsLead.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["SupportsLead"][user][
                                            "claimed"
                                          ],
                                          user_isos["SupportsLead"][user][
                                            "sent"
                                          ],
                                          user_isos["SupportsLead"][user][
                                            "returned"
                                          ],
                                          user_isos["SupportsLead"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }
                          if (user_isos["Materials"]) {
                            Object.keys(user_isos["Materials"]).map(
                              async function (user, index) {
                                await materials.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["Materials"][user][
                                            "claimed"
                                          ],
                                          user_isos["Materials"][user]["sent"],
                                          user_isos["Materials"][user][
                                            "returned"
                                          ],
                                          user_isos["Materials"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }
                          if (user_isos["Issuer"]) {
                            Object.keys(user_isos["Issuer"]).map(
                              async function (user, index) {
                                await issuer.push(
                                  <div
                                    id="hot-app"
                                    style={{
                                      borderBottom: "1px solid lightgray",
                                      width: "1590px",
                                      paddingBottom: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <p className="materials__title">
                                        {user.toUpperCase()}
                                        <p style={{ fontSize: "17px" }}></p>
                                      </p>
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                      <HotTable
                                        data={[
                                          user_isos["Issuer"][user]["claimed"],
                                          user_isos["Issuer"][user]["sent"],
                                          user_isos["Issuer"][user]["returned"],
                                          user_isos["Issuer"][user][
                                            "remaining"
                                          ],
                                        ]}
                                        colHeaders={weeks}
                                        rowHeaders={[
                                          "Claimed",
                                          "Sent",
                                          "Returned",
                                          "Remaining",
                                        ]}
                                        width="1590"
                                        height="145"
                                        settings={usersSettings}
                                        manualColumnResize={true}
                                        manualRowResize={true}
                                        columns={col}
                                        filters={true}
                                        className="users-table"
                                        readOnly={true}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          }

                          await setTables(
                            <div>
                              <ProductionUserTabs>
                                <div label="Design">
                                  <div className="user__productivity__tables__container">
                                    {design}
                                  </div>
                                </div>
                                <div label="DesignLead">
                                  <div className="user__productivity__tables__container">
                                    {designLead}
                                  </div>
                                </div>
                                <div label="Stress">
                                  <div className="user__productivity__tables__container">
                                    {stress}
                                  </div>
                                </div>
                                <div label="StressLead">
                                  <div className="user__productivity__tables__container">
                                    {stressLead}
                                  </div>
                                </div>
                                <div label="Supports">
                                  <div className="user__productivity__tables__container">
                                    {supports}
                                  </div>
                                </div>
                                <div label="SupportsLead">
                                  <div className="user__productivity__tables__container">
                                    {supportsLead}
                                  </div>
                                </div>
                                <div label="Materials">
                                  <div className="user__productivity__tables__container">
                                    {materials}
                                  </div>
                                </div>
                                <div label="Issuer">
                                  <div className="user__productivity__tables__container">
                                    {issuer}
                                  </div>
                                </div>
                              </ProductionUserTabs>
                            </div>
                          );
                        });
                    });
                }
              }
            });
        }
      });
    await setLoading(false);
  }, [updateData, tab, usersType]);

  async function printDocument() {
    //Descarga de una imagen de las graficas
    const input = document.getElementById("graph");
    if (tab === "prod") {
      html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", [340, 177]);
        pdf.addImage(imgData, "JPEG", 5, 5);
        // pdf.output('dataurlnewwindow');
        pdf.save("Production.pdf");
      });
    } else if (tab === "weight") {
      html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", [340, 177]);
        pdf.addImage(imgData, "JPEG", 5, 5);
        // pdf.output('dataurlnewwindow');
        pdf.save("Weight.pdf");
      });
    }
  }

  //Metodos para crear nuevas filas
  async function addRowMaterials() {
    let m = materials;
    m.push({ id: "", Material: "" });
    await setMaterials(m);
    await setUpdateRows(!updateRows);
  }

  async function addRowPiping() {
    let p = piping;
    p.push({ id: "", Material: "" });
    await setPiping(p);
    await setUpdateRows(!updateRows);
  }

  async function submitChangesMaterials() {
    //Submit de los materiales
    const body = {
      materials: materials,
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
        "/submitMaterials",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          await setMaterialsAlert(true);
          await setUpdateData(!updateData);
        }
      });
  }

  async function submitChangesPiping() {
    //Submit de las piping class
    const body = {
      piping: piping,
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
        "/submitPipingClass",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          await setPipingAlert(true);
          await setUpdateData(!updateData);
        }
      });
  }

  async function submitManagement() {
    //Submit del project span
    const body = {
      span: management,
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
        "/submitProjectSpan",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          await setSpanAlert(true);
          await setUpdateData(!updateData);
        }
      });
  }

  async function submitEstimatedForecast(material_id) {
    //Submit de los cambios en la estimacion y forecast de un material
    const body = {
      material_id: material_id,
      estimated: estimatedData[material_id],
      forecast: forecastData[material_id],
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    //Post
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/submitEstimatedForecast",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          await setSuccess(true);
          await setUpdateData(!updateData);
        }
      });
  }

  async function submitWeight(estimatedOverall, forecastOverall) {
    //Submit de los cambios en el peso de la estimacion y forecast overall
    const body = {
      estimated: estimatedOverall,
      forecast: forecastOverall,
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
        "/submitEstimatedForecastWeight",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          await setSuccess(true);
          await setUpdateData(!updateData);
        }
      });
  }

  async function exportPiping() {
    //reportes

    if (tab === "prod") {
      //Produccion en cuanto a isos
      let weeks = { 0: "WEEK" };
      let estAll = estimatedOverall;
      let realAll = realOverall;
      let estProgressAll = estimatedProgressOverall;
      let realProgressAll = realProgressOverall;

      Object.keys(estAll).map(function (key, index) {
        //Columnas con las semanas
        weeks[key] = "W" + key;
        if (!estAll[key]) {
          estAll[key] = " ";
        }
        if (!realAll[key]) {
          realAll[key] = " ";
        }
      });

      //Nombres de las filas
      estAll[0] = "Estimated";
      realAll[0] = "Real";
      estProgressAll[0] = "Estimated Progress";
      realProgressAll[0] = "Real Progress";
      weeks[0] = "Week";

      //Datos de la tabla overall
      let apiData = [
        {},
        { 0: "Piping production curves" },
        {},
        {},
        { 0: "OVERALL Isometrics" },
        weeks,
        estAll,
        realAll,
        estProgressAll,
        realProgressAll,
      ];

      for (let i = 0; i < materials.length; i++) {
        //Datos divididos por materiales
        apiData.push({});
        apiData.push({});
        apiData.push({ 0: materials[i].Material });

        let est = estimatedData[materialsIDList[i]];
        let real = realData[materialsIDList[i]];
        let forecast = forecastData[materialsIDList[i]];
        let sumEst = estimatedProgressData[materialsIDList[i]];
        let sumReal = realProgressData[materialsIDList[i]];
        if (!est) {
          est = {};
        }
        if (!real) {
          real = {};
        }
        if (!forecast) {
          forecast = {};
        }

        Object.keys(est).map(function (key, index) {
          if (!est[key]) {
            est[key] = " ";
          }
          if (!real[key]) {
            real[key] = " ";
          }
          if (!forecast[key]) {
            forecast[key] = " ";
          }
        });

        est[0] = "Estimated";
        real[0] = "Real";
        forecast[0] = "Forecast";
        sumEst[0] = "Estimated progress";
        sumReal[0] = "Real progress";

        apiData.push(weeks);
        apiData.push(est);
        apiData.push(real);
        apiData.push(forecast);
        apiData.push(sumEst);
        apiData.push(sumReal);
      }

      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let ws = XLSX.utils.json_to_sheet(apiData, { skipHeader: 1 });

      Object.keys(ws).map(function (i, index) {
        //Formateo del excel para agreagarle colores y bordes

        if (typeof ws[i] != "string") {
          if (index === 0) {
            ws[i].s = {
              font: {
                name: "arial",
                weight: "bold",
                sz: 15,
                color: { rgb: "4169E1" },
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
                wrapText: "3",
              },
            };
          } else if (colors[materialsList.indexOf(ws[i].v) * 3]) {
            let fill = colors[materialsList.indexOf(ws[i].v) * 3].replace(
              "#",
              ""
            );
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: fill } },
            };
          } else if (ws[i].v === "OVERALL Isometrics") {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "9370DB" } },
            };
          } else if (ws[i].v.toString().includes("W")) {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "C0C0C0" } },
            };
          } else {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "DCDCDC" } },
            };
          }
        }
      });

      var wscols = [
        { wch: 30 }, // "characters"
      ];

      ws["!cols"] = wscols;

      const wb = { Sheets: { Production: ws }, SheetNames: ["Production"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "Production.xlsx");
    } else if (tab === "weight") {
      let weeks = { 0: "WEEK" };
      let estAll = estimatedWeightData;
      let forcAll = forecastWeightData;
      let realAll = realWeightData;
      let estProgressAll = estimatedProgressWeightData;
      let realProgressAll = realProgressWeightData;

      Object.keys(estAll).map(function (key, index) {
        weeks[key] = "W" + key;
        if (!estAll[key]) {
          estAll[key] = " ";
        }
        if (!realAll[key]) {
          realAll[key] = " ";
        }
        if (!forcAll[key]) {
          forcAll[key] = " ";
        }
      });

      estAll[0] = "Estimated";
      forcAll[0] = "Forecast";
      realAll[0] = "Real";
      estProgressAll[0] = "Estimated Progress";
      realProgressAll[0] = "Real Progress";
      weeks[0] = "Week";

      let apiData = [
        {},
        { 0: "Piping weight curves" },
        {},
        {},
        { 0: "OVERALL Weight" },
        weeks,
        estAll,
        realAll,
        forcAll,
        estProgressAll,
        realProgressAll,
      ];

      for (let i = 0; i < materials.length; i++) {
        if (realProgressWeightMatData[materialsIDList[i]]) {
          apiData.push({});
          apiData.push({});
          apiData.push({ 0: materials[i].Material });
          let real = realWeightMatData[materialsIDList[i]];
          let sumReal = realProgressWeightMatData[materialsIDList[i]];
          if (!real) {
            real = {};
          }

          Object.keys(estAll).map(function (key, index) {
            if (!real[key]) {
              real[key] = " ";
            }
          });

          real[0] = "Real";
          sumReal[0] = "Real progress";

          apiData.push(weeks);
          apiData.push(real);
          apiData.push(sumReal);
        }
      }

      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let ws = XLSX.utils.json_to_sheet(apiData, { skipHeader: 1 });

      Object.keys(ws).map(function (i, index) {
        if (typeof ws[i] != "string") {
          if (index === 0) {
            ws[i].s = {
              font: {
                name: "arial",
                weight: "bold",
                sz: 15,
                color: { rgb: "4169E1" },
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
                wrapText: "3",
              },
            };
          } else if (colors[materialsList.indexOf(ws[i].v) * 3]) {
            let fill = colors[materialsList.indexOf(ws[i].v) * 3].replace(
              "#",
              ""
            );
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: fill } },
            };
          } else if (ws[i].v === "OVERALL Weight") {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "9370DB" } },
            };
          } else if (ws[i].v.toString().includes("W")) {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "C0C0C0" } },
            };
          } else {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "DCDCDC" } },
            };
          }
        }
      });

      var wscols = [
        { wch: 30 }, // "characters"
      ];

      ws["!cols"] = wscols;

      const wb = { Sheets: { Production: ws }, SheetNames: ["Production"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "Weights.xlsx");
    } else if (tab === "users") {
      let apiData = [];
      let type = "";
      if (usersType === "iso") {
        apiData = [{}, { 0: "User efficiency" }];
        type = "User efficiency";
      } else if (usersType === "weight") {
        apiData = [{}, { 0: "User efficiency" }];
        type = "User efficiency";
      }

      Object.keys(usersData).map(function (user, index) {
        apiData.push({});
        apiData.push({});
        apiData.push({ 0: user });

        let assigned = {},
          sent = {},
          returned = {},
          remaining = {},
          weeks = { 0: "WEEK" };

        assigned[0] = "Assigned";
        sent[0] = "Sent";
        returned[0] = "Returned";
        remaining[0] = "Remaining";
        Object.keys(usersData[user]["remaining"]).map(function (key, index) {
          weeks[key] = "W" + key;
          if (usersData[user]["assigned"]) {
            if (usersData[user]["assigned"][key]) {
              assigned[key] = usersData[user]["assigned"][key];
            } else {
              assigned[key] = "";
            }
          } else {
            assigned[key] = "";
          }

          if (usersData[user]["sent"]) {
            if (usersData[user]["sent"][key]) {
              sent[key] = usersData[user]["sent"][key];
            } else {
              sent[key] = "";
            }
          } else {
            sent[key] = "";
          }

          if (usersData[user]["returned"]) {
            if (usersData[user]["returned"][key]) {
              returned[key] = usersData[user]["returned"][key];
            } else {
              returned[key] = "";
            }
          } else {
            returned[key] = "";
          }

          if (usersData[user]["remaining"]) {
            if (usersData[user]["remaining"][key]) {
              remaining[key] = usersData[user]["remaining"][key];
            } else {
              remaining[key] = 0;
            }
          } else {
            remaining[key] = "";
          }
        });
        apiData.push(weeks);
        apiData.push(assigned);
        apiData.push(sent);
        apiData.push(returned);
        apiData.push(remaining);
      });
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let ws = XLSX.utils.json_to_sheet(apiData, { skipHeader: 1 });

      Object.keys(ws).map(function (i, index) {
        if (typeof ws[i] != "string") {
          if (index === 0) {
            ws[i].s = {
              font: {
                name: "arial",
                weight: "bold",
                sz: 12,
                color: { rgb: "4169E1" },
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
                wrapText: "3",
              },
            };
          } else if (ws[i].v === type) {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "9370DB" } },
            };
          } else if (ws[i].v.toString().includes("W")) {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
                horizontal: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "C0C0C0" } },
            };
          } else {
            ws[i].s = {
              font: {
                name: "arial",
              },
              alignment: {
                vertical: "center",
              },
              border: {
                right: {
                  style: "thin",
                  color: "000000",
                },
                left: {
                  style: "thin",
                  color: "000000",
                },
                bottom: {
                  style: "thin",
                  color: "000000",
                },
                top: {
                  style: "thin",
                  color: "000000",
                },
              },
              fill: { fgColor: { rgb: "DCDCDC" } },
            };
          }
        }
      });

      var wscols = [
        { wch: 30 }, // "characters"
      ];

      ws["!cols"] = wscols;

      const wb = { Sheets: { Production: ws }, SheetNames: ["Production"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      let name = "";
      if (usersType === "iso") {
        name = "Users efficiency.xlsx";
      } else if (usersType === "weight") {
        name = "Users efficiency.xlsx";
      }
      FileSaver.saveAs(data, name);
    }
  }

  const matSettings = {
    licenseKey: "non-commercial-and-evaluation",
    colWidths: 430,
    //... other options
  };

  const pipingSettings = {
    licenseKey: "non-commercial-and-evaluation",
    colWidths: 215,
    //... other options
  };

  const spanSettings = {
    licenseKey: "non-commercial-and-evaluation",
    colWidths: 215,
    //... other options
  };

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
    if (index === 1) {
      setUsersType("iso");
    } else {
      setUsersType("weight");
    }
  };

  if (tab === "users") {
    return (
      <body style={{ overflow: "hidden", height: "100vh" }}>
        {updateData}
        {updateRows}
        <IdleTimer
          timeout={1000 * 60 * 15}
          onIdle={handleOnIdle}
          debounce={250}
        />
        <NavBar />
        <div
          className={`alert alert-success ${
            spanAlert ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setSpanAlert(false)}
        >
          <AlertF type="success" text="Project week span saved!" margin="0px" />
        </div>
        <div
          className={`alert alert-success ${
            pipingAlert ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setPipingAlert(false)}
        >
          <AlertF type="success" text="Piping classes saved!" margin="0px" />
        </div>
        <div
          className={`alert alert-success ${
            materialsAlert ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setMaterialsAlert(false)}
        >
          <AlertF type="success" text="Materials saved!" margin="0px" />
        </div>
        <div
          className={`alert alert-success ${
            success ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setSuccess(false)}
        >
          <AlertF type="success" text="Changes saved!" margin="0px" />
        </div>
        <Collapse in={loading}>
          <Alert
            style={{
              fontSize: "16px",
              position: "fixed",
              left: "50%",
              top: "10%",
              transform: "translate(-50%, -50%)",
              zIndex: "0",
            }}
            severity="info"
          >
            Processing...
          </Alert>
        </Collapse>
        <div id="pdf">
          <div
            style={{ display: "flex", marginLeft: "70px", marginTop: "80px" }}
          >
            {/*{tabBtns}*/}
            <div className="users__tables__container">
              <div className="container-tabs">
                <div className="bloc-tabs">
                  <button
                    className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(1)}
                  >
                    Isometrics
                  </button>
                  <button
                    className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(2)}
                  >
                    Weight
                  </button>
                </div>

                <div className="content-tabs">
                  <div
                    className={
                      toggleState === 1 ? "content active-content" : "content"
                    }
                  >
                    {userEffTitle}
                    {tables}
                  </div>

                  <div
                    className={
                      toggleState === 2 ? "content active-content" : "content"
                    }
                  >
                    {userEffTitle}

                    {tables}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginBottom: "0px",
                marginLeft: "30px",
                position: "absolute",
              }}
            >
              <button
                className="back__button"
                onClick={() =>
                  history.push("/" + process.env.REACT_APP_PROJECT + "/piping")
                }
                style={{ width: "180px" }}
              >
                <img
                  src={ArrowImage}
                  alt="hold"
                  className="navBar__icon"
                  style={{ marginRight: "0px", height: "30px" }}
                ></img>
                <p className="back__button__text">Back to menu</p>
              </button>
              <button
                onClick={async () => await setTab("prod")}
                className="production__button"
              >
                Production
              </button>
              <button className="users__button__inUsers">Users</button>

              <button
                className="right__button"
                onClick={() => exportPiping()}
                style={{ width: "110px", marginLeft: "1200px" }}
              >
                <img
                  src={ExportImage}
                  alt="report"
                  className="navBar__icon"
                  style={{ marginRight: "0px", height: "23px" }}
                ></img>
                <p className="right__button__text">Export</p>
              </button>
            </div>
          </div>
        </div>
      </body>
    );
  } else {
    return (
      <body style={{ overflow: "hidden", height: "100vh" }}>
        {updateData}
        {updateRows}
        <IdleTimer
          timeout={1000 * 60 * 15}
          onIdle={handleOnIdle}
          debounce={250}
        />
        <NavBar />
        <div
          className={`alert alert-success ${
            spanAlert ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setSpanAlert(false)}
        >
          <AlertF type="success" text="Project week span saved!" margin="0px" />
        </div>
        <div
          className={`alert alert-success ${
            pipingAlert ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setPipingAlert(false)}
        >
          <AlertF type="success" text="Piping classes saved!" margin="0px" />
        </div>
        <div
          className={`alert alert-success ${
            materialsAlert ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setMaterialsAlert(false)}
        >
          <AlertF type="success" text="Materials saved!" margin="0px" />
        </div>
        <div
          className={`alert alert-success ${
            success ? "alert-shown" : "alert-hidden"
          }`}
          onTransitionEnd={() => setSuccess(false)}
        >
          <AlertF type="success" text="Changes saved!" margin="0px" />
        </div>
        <Collapse in={loading}>
          <Alert
            style={{
              fontSize: "16px",
              position: "fixed",
              left: "50%",
              top: "10%",
              transform: "translate(-50%, -50%)",
              zIndex: "0",
            }}
            severity="info"
          >
            Processing...
          </Alert>
        </Collapse>
        <div id="pdf">
          <div style={{ marginLeft: "100px", marginBottom: "-120px" }}>
            <button
              className="back__button"
              onClick={() =>
                history.push("/" + process.env.REACT_APP_PROJECT + "/piping")
              }
              style={{ width: "180px", marginTop: "80px" }}
            >
              <img
                src={ArrowImage}
                alt="hold"
                className="navBar__icon"
                style={{ marginRight: "0px", height: "30px" }}
              ></img>
              <p className="back__button__text">Back to menu</p>
            </button>
            <button className="production__button__inProduction">
              Production
            </button>
            <button
              onClick={async () => await setTab("users")}
              className="users__button"
            >
              Users
            </button>
          </div>
          <div className="top__container">
            {/*{tabBtns}*/}
            <div className={`Cabecera ${menu ? "isActive" : ""}`}>
              <button onClick={toggleMenu} className="Cabecera__button">
                <svg
                  className="Cabecera__svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </button>
              <nav className={`Cabecera__nav ${menu ? "isActive" : ""}`}>
                {/* Menu Production */}

                {/*<button className={`Cabecera__titulo ${ menuProduction ? 'isActiveProduction' : '' }` } onClick={ toggleMenuProduction }>
                                        <img src={ArrowDownImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "10px"}}></img>
                                        Production 
                                    </button>*/}
                <ul className={`Cabecera__ul ${menu ? "isActive" : ""}`}>
                  <li className="Cabecera__li">
                    <img
                      src={IsometricsImage}
                      alt="hold"
                      className="Cabecera__navBar__icon"
                      style={{ marginRight: "5px", height: "22px" }}
                    ></img>
                    <a
                      onClick={async () => await setTab("prod")}
                      className="Cabecera__a"
                    >
                      By Isometrics
                    </a>
                  </li>
                  <li className="Cabecera__li">
                    <img
                      src={WeightImage}
                      alt="hold"
                      className="Cabecera__navBar__icon"
                      style={{ marginRight: "5px", height: "22px" }}
                    ></img>
                    <a
                      onClick={async () => await setTab("weight")}
                      className="Cabecera__a"
                    >
                      By Weight
                    </a>
                  </li>
                </ul>

                {/* Menu Users */}

                {/*<button className={`Cabecera__titulo ${ menuUsers ? 'isActiveUsers' : '' }` } onClick={ toggleMenuUsers }>
                                        <img src={ArrowDownImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "10px"}}></img>
                                        Users 
                                    </button>
                                    <ul className={`Cabecera__ul ${ menuUsers ? 'isActiveUsers' : '' }` }>
                                        <li className="Cabecera__li">
                                            <img src={WeightImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "22px"}}></img>
                                            <a onClick={async() => await setTab("weight")} className="Cabecera__a">By Weights</a>
                                        </li>
                                        <li className="Cabecera__li">
                                            <img src={IsometricsImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "22px"}}></img>
                                            <a onClick={async() => await setTab("prod")} className="Cabecera__a">By Isometrics</a>
                                        </li>
                                    </ul>*/}
              </nav>
            </div>
            <div
              id="graph"
              className={`graph__container ${menu ? "isActive" : ""}`}
            >
              {lineChart}
            </div>
            <div className="materials__pc__container">
              <div style={{ marginBottom: "30px" }}>
                {/*<button className="back__button" onClick={()=>history.push('/'+process.env.REACT_APP_PROJECT+'/piping')} style={{width:"110px", marginTop: "80px"}}><img src={BackIcon} alt="hold" className="navBar__icon" style={{marginRight:"0px", height: "30px"}}></img><p className="back__button__text">Back</p></button>*/}
                <button
                  className="right__button"
                  onClick={() => printDocument()}
                  style={{
                    width: "110px",
                    marginLeft: "10px",
                    marginTop: "80px",
                  }}
                >
                  <img
                    src={GraphImage}
                    alt="report"
                    className="navBar__icon"
                    style={{ marginRight: "0px", height: "25px" }}
                  ></img>
                  <p className="right__button__text">Graph</p>
                </button>
                <button
                  className="right__button"
                  onClick={() => exportPiping()}
                  style={{
                    width: "110px",
                    marginLeft: "10px",
                    marginTop: "80px",
                  }}
                >
                  <img
                    src={ExportImage}
                    alt="report"
                    className="navBar__icon"
                    style={{ marginRight: "0px", height: "23px" }}
                  ></img>
                  <p className="right__button__text">Export</p>
                </button>
              </div>
              <div style={{ display: "flex" }}>
                <p className="materials__title">Project Management</p>
                <button
                  className="save__button"
                  onClick={() => submitManagement()}
                >
                  <img src={SaveIcon} alt="save" className="save__icon"></img>
                </button>
              </div>
              <div style={{ marginBottom: "20px", marginTop: "10px" }}>
                <HotTable
                  data={management}
                  colHeaders={["<b>Starting date</b>", "<b>Finishing date</b>"]}
                  width="500"
                  height="60"
                  settings={spanSettings}
                  manualColumnResize={true}
                  manualRowResize={true}
                  columns={[
                    { data: "Starting date", type: "date" },
                    { data: "Finishing date", type: "date" },
                  ]}
                  className="project__management"
                />
              </div>
              <div id="hot-app" style={{ marginBottom: "20px" }}>
                <HotTable
                  data={materials}
                  colHeaders={["<b>Materials</b>"]}
                  width="452"
                  height="130"
                  settings={matSettings}
                  manualColumnResize={true}
                  manualRowResize={true}
                  columns={[{ data: "Material" }]}
                  className="materials__management"
                />
              </div>
              <button
                className="projects__add__button"
                onClick={() => addRowMaterials()}
              >
                <p className="projects__add__button__text">+ Add</p>
              </button>
              <button
                className="projects__button__save"
                onClick={() => submitChangesMaterials()}
              >
                <img
                  src={SaveIcon2}
                  alt="hold"
                  className="navBar__icon__save"
                  style={{ marginRight: "-20px" }}
                ></img>
                <p className="projects__button__text">Save</p>
              </button>
              <div
                id="hot-app"
                style={{ marginBottom: "20px", marginTop: "40px" }}
              >
                <HotTable
                  data={piping}
                  colHeaders={["<b>Piping class</b>", "<b>Material</b>"]}
                  width="450"
                  height="130"
                  settings={pipingSettings}
                  manualColumnResize={true}
                  manualRowResize={true}
                  columns={[
                    { data: "PipingClass" },
                    {
                      data: "Material",
                      type: "dropdown",
                      strict: "true",
                      source: materialsList,
                    },
                  ]}
                  className="pipingclass__management"
                />
              </div>
              <button
                className="projects__add__button"
                onClick={() => addRowPiping()}
              >
                <p className="projects__add__button__text">+ Add</p>
              </button>
              <button
                className="projects__button__save"
                onClick={() => submitChangesPiping()}
              >
                <img
                  src={SaveIcon2}
                  alt="hold"
                  className="navBar__icon__save"
                  style={{ marginRight: "-20px" }}
                ></img>
                <p className="projects__button__text">Save</p>
              </button>
            </div>
          </div>
          <div className="materials__tables__container">
            {overallTable}
            {tables}
          </div>
        </div>
      </body>
    );
  }
};

export default PITRequests;
