import React from "react";
import "antd/dist/antd.css";
import { Table } from "antd";
import warningIT from "../../assets/images/warningIT.png";

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

class PipingMyTrayTable extends React.Component {
  //Tabla mytray de lineas
  state = {
    searchText: "",
    searchedColumn: "",
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", ""],
    role: secureStorage.getItem("role"),
    user: secureStorage.getItem("user"),
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    popup: false,
    filters: [],
    ids: [],
  };

  updateData() {
    this.setState({ data: [] });
    this.props.updateD();
  }

  success() {
    //this.props.successAlert()
  }

  async vClick(id) {
    //Click en el boton de valvulas

    const body = {
      id: id,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    //Post de valvulas
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/sendValves",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          let ids = this.state.ids;
          for (let i = 0; i < ids.length; i++) {
            if (ids[i][0] === id && ids[i][1].indexOf(1) > -1) {
              ids[i][1].splice(ids[i][1].indexOf(1), 1);
            }
          }
          this.setState({ ids: ids });
          this.props.onChange(ids);

          this.props.updateDataMethod();
          this.onSelectChange(this.selectedRowKeys, this.selectedRows);
        }
      });
  }

  async iClick(id) {
    //Click en el boton de instrumentos
    const body = {
      id: id,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    //Post de instrumentos
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/sendInstruments",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          let ids = this.state.ids;
          for (let i = 0; i < ids.length; i++) {
            if (ids[i][0] === id && ids[i][1].indexOf(1) > -1) {
              ids[i][1].splice(ids[i][1].indexOf(1), 1);
            }
          }
          this.setState({ ids: ids });
          this.props.onChange(ids);

          this.props.updateDataMethod();
          this.onSelectChange(this.selectedRowKeys, this.selectedRows);
        }
      });
  }

  async naClick(id) {
    //Click en el boton de N/A
    const body = {
      id: id,
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
        "/sendNA",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          let ids = this.state.ids;
          for (let i = 0; i < ids.length; i++) {
            if (ids[i][0] === id && ids[i][1].indexOf(1) > -1) {
              ids[i][1].splice(ids[i][1].indexOf(1), 1);
            }
          }
          this.setState({ ids: ids });
          this.props.onChange(ids);

          this.props.updateDataMethod();
          this.onSelectChange(this.selectedRowKeys, this.selectedRows);
        }
      });
  }

  //Lo mismo que los anteriores pero para cancelar
  async vCancelClick(id) {
    const body = {
      id: id,
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
        "/cancelValves",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          this.props.updateDataMethod();
          this.onSelectChange(this.selectedRowKeys, this.selectedRows);
        }
      });
  }

  async iCancelClick(id) {
    const body = {
      id: id,
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
        "/cancelInstruments",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          this.props.updateDataMethod();
          this.onSelectChange(this.selectedRowKeys, this.selectedRows);
        }
      });
  }

  async naCancelClick(id) {
    const body = {
      id: id,
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
        "/cancelNA",
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        if (json.success) {
          this.props.updateDataMethod();
          this.onSelectChange(this.selectedRowKeys, this.selectedRows);
        }
      });
  }

  async componentDidMount() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //Get de las lineas de un usuario
    await fetch(
      "http://" +
        process.env.REACT_APP_SERVER +
        ":" +
        process.env.REACT_APP_NODE_PORT +
        "/pipingMyTray/" +
        secureStorage.getItem("user"),
      options
    )
      .then((response) => response.json())
      .then(async (json) => {
        var rows = [];
        var row = null;
        let vButton, iButton, tray, nextStep, naButton, notInSDesignButton;

        for (let i = 0; i < json.rows.length; i++) {
          //Por cada linea
          if (json.rows[i].valves === 1) {
            //Comprobamos si tiene valvulas
            vButton = (
              <button
                className="btn btn-success"
                onClick={() => this.vCancelClick(json.rows[i].id)}
                style={{
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                V
              </button>
            );
          } else {
            vButton = (
              <button
                className="btn btn-warning"
                onClick={() => this.vClick(json.rows[i].id)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                V
              </button>
            );
          }

          if (json.rows[i].instruments === 1) {
            //Comprobamos si tiene instrumentos
            iButton = (
              <button
                className="btn btn-success"
                onClick={() => this.iCancelClick(json.rows[i].id)}
                style={{
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                I
              </button>
            );
          } else {
            iButton = (
              <button
                className="btn btn-warning"
                onClick={() => this.iClick(json.rows[i].id)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                I
              </button>
            );
          }

          if (json.rows[i].valves === 1 || json.rows[i].instruments === 1) {
            //Comprobamos si tiene N/A
            naButton = (
              <button
                className="btn btn-success"
                disabled
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                N/A
              </button>
            );
          } else if (
            json.rows[i].valves === 0 &&
            json.rows[i].instruments === 0
          ) {
            naButton = (
              <button
                className="btn btn-success"
                onClick={() => this.naClick(json.rows[i].id)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                N/A
              </button>
            );
          } else if (json.rows[i].valves === 2) {
            naButton = (
              <button
                className="btn btn-success"
                onClick={() => this.naCancelClick(json.rows[i].id)}
                style={{
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                N/A
              </button>
            );
            iButton = (
              <button
                className="btn btn-warning"
                disabled
                onClick={() => this.iClick(json.rows[i].id)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                I
              </button>
            );
            vButton = (
              <button
                className="btn btn-warning"
                disabled
                onClick={() => this.vClick(json.rows[i].id)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "12px",
                  borderColor: "black",
                  padding: "2px 5px 2px 5px",
                  width: "60px",
                }}
              >
                V
              </button>
            );
          }

          if (
            json.rows[i].isotracker === "In IsoTracker" &&
            json.rows[i].progress !== 100
          ) {
            //Comprobamos si esta en isotracker
            notInSDesignButton = (
              <img src={warningIT} alt="warning" className="warningIT__image" />
            );
          } else {
            notInSDesignButton = null;
          }

          switch (
            json.rows[i].next //Obtenemos cual sera la siguietne bandeja de la linea
          ) {
            case "PipingEstimated":
              nextStep = "Estimated";
              break;
            case "PipingModelled":
              nextStep = "Modelled";
              break;
            case "PipingSStress":
              nextStep = "S-Stress";
              break;
            case "PipingRStress":
              nextStep = "R-Stress";
              break;
            case "PipingStress":
              nextStep = "Stress";
              break;
            case "PipingSupports":
              nextStep = "Supports";
              break;
            default:
              nextStep = "S-Design";
          }

          switch (json.rows[i].tray) {
            case "PipingEstimated":
              tray = "Estimated";
              break;
            case "PipingModelled":
              tray = "Modelled";
              break;
            case "PipingSStress":
              tray = "S-Stress";
              break;
            case "PipingRStress":
              tray = "R-Stress";
              break;
            case "PipingStress":
              tray = "Stress";
              break;
            case "PipingSupports":
              tray = "Supports";
              break;
            default:
              tray = "S-Design";
              nextStep = null;
          }

          //Creamos la fila de la tabla
          row = {
            key: json.rows[i].id,
            id: json.rows[i].id,
            status_id: json.rows[i].status_id,
            tag: json.rows[i].tag,
            type: json.rows[i].code,
            date:
              json.rows[i].updated_at.toString().substring(0, 10) +
              " " +
              json.rows[i].updated_at.toString().substring(11, 19),
            tray: tray,
            next: nextStep,
            actions: (
              <div>
                {vButton} {iButton} {naButton} {notInSDesignButton}
              </div>
            ),
            isotracker: json.rows[i].isotracker,
            valves: json.rows[i].valves,
            instruments: json.rows[i].instruments,
          };

          if (
            (json.rows[i].valves !== 0 || json.rows[i].instruments !== 0) &&
            row.tray !== "S-Design"
          ) {
            //Obtenemos el progreso por el que va la linea
            if (row.type === "TL1") {
              row.progress =
                json.rows[i].progress +
                33 +
                "% (" +
                (json.rows[i].stage1 + 1) +
                ")";
            } else if (row.type === "TL2") {
              row.progress =
                json.rows[i].progress +
                20 +
                "% (" +
                (json.rows[i].stage1 + 1) +
                ")";
            } else {
              row.progress =
                json.rows[i].progress +
                10 +
                "% (" +
                (json.rows[i].stage1 + 1) +
                ")";
            }
          } else {
            row.progress =
              json.rows[i].progress + "% (" + json.rows[i].stage1 + ")";
          }

          if (row) {
            if (i % 2 === 0) {
              row["color"] = "#fff";
            } else {
              row["color"] = "#eee";
            }

            rows.push(row);
          }
        }
        const filterRow = [
          {
            tag: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="TAG"
                  onChange={(e) => this.filter(2, e.target.value)}
                />
              </div>
            ),
            type: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="Type"
                  onChange={(e) => this.filter(3, e.target.value)}
                />
              </div>
            ),
            date: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="Date"
                  onChange={(e) => this.filter(4, e.target.value)}
                />
              </div>
            ),
            tray: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="Current tray"
                  onChange={(e) => this.filter(5, e.target.value)}
                />
              </div>
            ),
            next: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="Next step"
                  onChange={(e) => this.filter(6, e.target.value)}
                />
              </div>
            ),
            isotracker: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="IsoTracker"
                  onChange={(e) => this.filter(8, e.target.value)}
                />
              </div>
            ),
            progress: (
              <div>
                <input
                  type="text"
                  className="filter__input"
                  placeholder="Progress"
                  onChange={(e) => this.filter(11, e.target.value)}
                />
              </div>
            ),
          },
        ];

        this.setState({ data: rows, displayData: rows });
        await this.setState({ filters: filterRow });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      await fetch(
        "http://" +
          process.env.REACT_APP_SERVER +
          ":" +
          process.env.REACT_APP_NODE_PORT +
          "/pipingMyTray/" +
          secureStorage.getItem("user"),
        options
      )
        .then((response) => response.json())
        .then(async (json) => {
          var rows = [];
          var row = null;
          let vButton, iButton, tray, nextStep, naButton, notInSDesignButton;

          for (let i = 0; i < json.rows.length; i++) {
            if (json.rows[i].valves === 1) {
              vButton = (
                <button
                  className="btn btn-success"
                  onClick={() => this.vCancelClick(json.rows[i].id)}
                  style={{
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  V
                </button>
              );
            } else {
              vButton = (
                <button
                  className="btn btn-warning"
                  onClick={() => this.vClick(json.rows[i].id)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  V
                </button>
              );
            }

            if (json.rows[i].instruments === 1) {
              iButton = (
                <button
                  className="btn btn-success"
                  onClick={() => this.iCancelClick(json.rows[i].id)}
                  style={{
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  I
                </button>
              );
            } else {
              iButton = (
                <button
                  className="btn btn-warning"
                  onClick={() => this.iClick(json.rows[i].id)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  I
                </button>
              );
            }

            if (json.rows[i].valves === 1 || json.rows[i].instruments === 1) {
              naButton = (
                <button
                  className="btn btn-success"
                  disabled
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  N/A
                </button>
              );
            } else if (
              json.rows[i].valves === 0 &&
              json.rows[i].instruments === 0
            ) {
              naButton = (
                <button
                  className="btn btn-success"
                  onClick={() => this.naClick(json.rows[i].id)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  N/A
                </button>
              );
            } else if (json.rows[i].valves === 2) {
              naButton = (
                <button
                  className="btn btn-success"
                  onClick={() => this.naCancelClick(json.rows[i].id)}
                  style={{
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  N/A
                </button>
              );
              iButton = (
                <button
                  className="btn btn-warning"
                  disabled
                  onClick={() => this.iClick(json.rows[i].id)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  I
                </button>
              );
              vButton = (
                <button
                  className="btn btn-warning"
                  disabled
                  onClick={() => this.vClick(json.rows[i].id)}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "12px",
                    borderColor: "black",
                    padding: "2px 5px 2px 5px",
                    width: "60px",
                  }}
                >
                  V
                </button>
              );
            }

            if (
              json.rows[i].isotracker === "In IsoTracker" &&
              json.rows[i].progress !== 100
            ) {
              notInSDesignButton = (
                <img
                  src={warningIT}
                  alt="warning"
                  className="warningIT__image"
                />
              );
            } else {
              notInSDesignButton = null;
            }

            switch (json.rows[i].next) {
              case "PipingEstimated":
                nextStep = "Estimated";
                break;
              case "PipingEstimated":
                nextStep = "Estimated";
                break;
              case "PipingModelled":
                nextStep = "Modelled";
                break;
              case "PipingSStress":
                nextStep = "S-Stress";
                break;
              case "PipingRStress":
                nextStep = "R-Stress";
                break;
              case "PipingStress":
                nextStep = "Stress";
                break;
              case "PipingSupports":
                nextStep = "Supports";
                break;
              default:
                nextStep = "S-Design";
            }

            switch (json.rows[i].tray) {
              case "PipingEstimated":
                tray = "Estimated";
                break;
              case "PipingModelled":
                tray = "Modelled";
                break;
              case "PipingSStress":
                tray = "S-Stress";
                break;
              case "PipingRStress":
                tray = "R-Stress";
                break;
              case "PipingStress":
                tray = "Stress";
                break;
              case "PipingSupports":
                tray = "Supports";
                break;
              default:
                tray = "S-Design";
                nextStep = null;
            }

            row = {
              key: json.rows[i].id,
              id: json.rows[i].id,
              status_id: json.rows[i].status_id,
              tag: json.rows[i].tag,
              type: json.rows[i].code,
              date:
                json.rows[i].updated_at.toString().substring(0, 10) +
                " " +
                json.rows[i].updated_at.toString().substring(11, 19),
              tray: tray,
              next: nextStep,
              actions: (
                <div>
                  {vButton} {iButton} {naButton} {notInSDesignButton}
                </div>
              ),
              isotracker: json.rows[i].isotracker,
              valves: json.rows[i].valves,
              instruments: json.rows[i].instruments,
            };

            if (
              (json.rows[i].valves !== 0 || json.rows[i].instruments !== 0) &&
              row.tray !== "S-Design"
            ) {
              if (row.type === "TL1") {
                row.progress =
                  json.rows[i].progress +
                  33 +
                  "% (" +
                  (json.rows[i].stage1 + 1) +
                  ")";
              } else if (row.type === "TL2") {
                row.progress =
                  json.rows[i].progress +
                  20 +
                  "% (" +
                  (json.rows[i].stage1 + 1) +
                  ")";
              } else {
                row.progress =
                  json.rows[i].progress +
                  10 +
                  "% (" +
                  (json.rows[i].stage1 + 1) +
                  ")";
              }
            } else {
              row.progress =
                json.rows[i].progress + "% (" + json.rows[i].stage1 + ")";
            }

            if (row) {
              if (i % 2 === 0) {
                row["color"] = "#fff";
              } else {
                row["color"] = "#eee";
              }

              rows.push(row);
            }
          }

          this.setState({ data: rows, displayData: rows });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async filter(column, value) {
    let fd = this.state.filterData;
    fd[column] = value;
    await this.setState({ filterData: fd });

    let auxDisplayData = this.state.data;
    let resultData = [];
    let fil,
      exists = null;
    for (let i = 0; i < auxDisplayData.length; i++) {
      exists = true;
      for (
        let column = 0;
        column < Object.keys(auxDisplayData[i]).length - 2;
        column++
      ) {
        fil = Object.keys(auxDisplayData[i])[column + 1];
        if (fil === "id") {
          if (
            this.state.filterData[column] !== "" &&
            this.state.filterData[column] &&
            !auxDisplayData[i][fil].props.children.includes(
              this.state.filterData[column]
            )
          ) {
            exists = false;
          }
        } else if (fil === "actions") {
          if (
            this.state.filterData[column] !== "" &&
            this.state.filterData[column] &&
            auxDisplayData[i][fil].props.children[0].type.name === "UploadPopUp"
          ) {
            let upload = "upload";
            if (
              !upload.includes(
                this.state.filterData[column].toLocaleLowerCase()
              )
            ) {
              exists = false;
            }
          } else if (
            this.state.filterData[column] !== "" &&
            this.state.filterData[column] &&
            auxDisplayData[i][fil].props.children[0].type === "button"
          ) {
            let cv = "cancel verify";
            if (
              !cv.includes(this.state.filterData[column].toLocaleLowerCase())
            ) {
              exists = false;
            }
          }
        } else {
          if (auxDisplayData[i][fil]) {
            if (
              this.state.filterData[column] !== "" &&
              this.state.filterData[column] &&
              !auxDisplayData[i][fil].includes(this.state.filterData[column])
            ) {
              exists = false;
            }
          }
        }
      }
      if (exists) {
        resultData.push(auxDisplayData[i]);
      }
    }
    await this.setState({ displayData: resultData });
  }

  getColumnSearchProps = (dataIndex) => ({
    render: (text) => text,
  });

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let ids = [];
    if (selectedRows) {
      for (let i = 0; i < selectedRows.length; i++) {
        let error = [];
        if (selectedRows[i].valves === 0 && selectedRows[i].instruments === 0) {
          switch (selectedRows[i].type) {
            case "TL1":
              if (selectedRows[i].status_id === 10) {
                error.push(1);
              }
              break;
            case "TL2":
              if (selectedRows[i].status_id === 8) {
                error.push(1);
              }
              break;
            case "TL3":
              if (selectedRows[i].status_id === 5) {
                error.push(1);
              }
              break;
            default:
              break;
          }
        }
        if (selectedRows[i].tray === "Modelled") {
          error.push(3);
        }
        if (selectedRows[i].tray === "S-Design") {
          error.push(2);
        }

        ids.push([selectedRows[i].id, error]);
      }
      this.setState({
        selectedRowsKeys: selectedRowKeys,
        selectedRows: selectedRows,
        ids: ids,
      });
      this.props.onChange(ids);
    }
  };

  render() {
    const selectedRows = this.state.selectedRows;
    const selectedRowsKeys = this.state.selectedRowsKeys;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows);
      },
    };

    const rowSelectionFilter = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: true,
        // Column configuration not to be checked
        name: record.name,
      }),
    };

    if (localStorage.getItem("update") === "true") {
      this.setState({
        selectedRows: [],
        selectedRowsKeys: [],
      });
      rowSelection.selectedRowKeys = [];
      rowSelection.selectedRows = [];
      localStorage.setItem("update", false);
    } else {
      rowSelection.selectedRowKeys = selectedRowsKeys;
      rowSelection.selectedRows = selectedRows;
    }

    let columns = [
      {
        title: <center className="dataTable__header__text">TAG</center>,
        dataIndex: "tag",
        key: "tag",
        ...this.getColumnSearchProps("tag"),
        sorter: {
          compare: (a, b) =>
            a.tag.props.children.localeCompare(b.tag.props.children),
        },
      },
      {
        title: <center className="dataTable__header__text">Type</center>,
        dataIndex: "type",
        key: "type",
        ...this.getColumnSearchProps("type"),
        width: "100px",
        sorter: {
          compare: (a, b) => {
            return a.type.localeCompare(b.type);
          },
        },
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: "date",
        key: "date",
        ...this.getColumnSearchProps("date"),
        sorter: {
          compare: (a, b) =>
            a.date.replace(/\D/g, "") - b.date.replace(/\D/g, ""),
        },
      },
      {
        title: <div className="dataTable__header__text">Current tray</div>,
        dataIndex: "tray",
        key: "tray",
        ...this.getColumnSearchProps("tray"),
        sorter: {
          compare: (a, b) => {
            return a.tray.localeCompare(b.tray);
          },
        },
        width: "150px",
      },
      {
        title: <div className="dataTable__header__text">Next step</div>,
        dataIndex: "next",
        key: "next",
        ...this.getColumnSearchProps("next"),
        sorter: {
          compare: (a, b) => {
            return a.next.localeCompare(b.next);
          },
        },
        width: "150px",
      },
      {
        title: <div className="dataTable__header__text">Progress</div>,
        dataIndex: "progress",
        key: "progress",
        ...this.getColumnSearchProps("isotracker"),
        width: "120px",
        sorter: {
          compare: (a, b) => {
            return a.progress.localeCompare(b.progress);
          },
        },
      },
      {
        title: <div className="dataTable__header__text">Isotracker</div>,
        dataIndex: "isotracker",
        key: "isotracker",
        ...this.getColumnSearchProps("isotracker"),
        sorter: {
          compare: (a, b) => {
            return a.isotracker.localeCompare(b.isotracker);
          },
        },
        width: "250px",
      },
      {
        title: <div className="dataTable__header__text">Actions</div>,
        dataIndex: "actions",
        key: "actions",
        width: "300px",
        ...this.getColumnSearchProps("actions"),
      },
    ];

    var totalElements = null;
    if (this.state.data.length === 0) {
      totalElements = null;
    } else {
      totalElements = (
        <div style={{ position: "absolute", bottom: 25, left: 0 }}>
          <b>Total elements: {this.state.data.length}</b>
        </div>
      );
    }

    return (
      <div>
        {this.state.updateData}
        <div className="dataTable__container">
          <Table
            className="customTable"
            style={{ height: "430px", marginTop: "-30px" }}
            bordered={true}
            rowSelection={{ type: "checkbox", ...rowSelection }}
            columns={columns}
            dataSource={this.state.displayData}
            scroll={{ y: 437 }}
            pagination={{ disabled: true, defaultPageSize: 5000 }}
            size="small"
            rowClassName={(record) => record.color.replace("#", "")}
          />
          <Table
            className="filter__table"
            pagination={{ disabled: true }}
            rowSelection={{ type: "checkbox", ...rowSelectionFilter }}
            scroll={{ y: 337 }}
            showHeader={false}
            bordered={true}
            columns={columns}
            dataSource={this.state.filters}
            size="small"
          />
          {totalElements}
        </div>
      </div>
    );
  }
}

export default PipingMyTrayTable;
