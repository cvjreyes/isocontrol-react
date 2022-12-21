import React, { useState, useEffect } from "react";

import {
  buildTag,
  divideLineReference,
  prepareFeedPipesData,
} from "./feedPipesHelpers";
import FeedPipesExcelTableWrapper from "./FeedPipesExcelTableWrapper";
import "./feedPipesExcel.css";

export default function FeedPipesExcel(props) {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [updateData, setUpdateData] = useState(props.updateData);
  const [diameters, setDiameters] = useState(null);
  const [areas, setAreas] = useState(null);
  const [lineRefs, setLineRefs] = useState([]);
  const [newData, setNewData] = useState({});
  const [designers, setDesigners] = useState({});
  const [fixedRows, setFixedRows] = useState(0);

  const getOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    // promise all?
    const getAllAreas = async () => {
      try {
        const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/api/areas`;
        const res = await fetch(url, getOptions);
        const resJson = await res.json();
        const areas_options = resJson.map((item) => item.name);
        setAreas(areas_options);
      } catch (err) {
        console.error(err);
      }
    };
    const getDiameters = async () => {
      try {
        const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/api/diameters`;
        const res = await fetch(url, getOptions);
        const { diameters: resDiameters } = await res.json();
        const tempDiameters = resDiameters.map((item) => item.diameter);
        setDiameters(tempDiameters);
      } catch (err) {
        console.error(err);
      }
    };
    const getLineRefs = async () => {
      try {
        const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/api/lineRefs`;
        const res = await fetch(url, getOptions);
        const { line_refs: resLineRefs } = await res.json();
        const tempLineRefs = resLineRefs.map((item) => item.line_ref);
        setLineRefs(tempLineRefs);
      } catch (err) {
        console.error(err);
      }
    };
    const getDesigners = async () => {
      try {
        const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/api/designers`;
        const res = await fetch(url, getOptions);
        const { designers: resDesigners } = await res.json();
        const tempDesigners = resDesigners.map((item) => item.name);
        setDesigners(tempDesigners);
      } catch (err) {
        console.error(err);
      }
    };
    const getFeedPipes = async () => {
      try {
        const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/feedPipes`;
        const res = await fetch(url, getOptions);
        const { rows: resRows } = await res.json();
        const { rows } = prepareFeedPipesData(resRows);
        setData(rows);
        setDisplayData(rows);
      } catch (err) {
        console.error(err);
      }
    };
    getAllAreas();
    getDiameters();
    getLineRefs();
    getDesigners();
    getFeedPipes();
  }, []);

  // falta el component did update

  // ! falta coordinar el data y el displayData
  // en cuanto esté esto ↑ hecho, puedo pasar a probar el submit

  const filter = async (keyName, value) => {
    let resultData = [];
    if (!value) return setDisplayData(data);

    data.forEach((item) => {
      let exists = false;
      // loop through data's keys
      for (let key in item) {
        // if key not same as input, stop
        if (key !== keyName) return;
        // if value includes input, exist true
        if (item[key].toString().toLowerCase().includes(value.toLowerCase())) {
          exists = true;
          break;
        }
      }
      if (exists) {
        resultData.push(item);
      }
    });
    setDisplayData(resultData);
  };

  // para esto => otro view
  // const addRow = () => {
  //   let tempRows = [...displayData];
  //   tempRows.push({
  //     Area: "",
  //     Diameter: "",
  //     Fluid: "",
  //     Insulation: "",
  //     "Line reference": "",
  //     Owner: "",
  //     Seq: "",
  //     Spec: "",
  //     Status: "",
  //     Tag: "",
  //     Train: "",
  //     Type: "",
  //     Unit: "",
  //     id: Math.max(...displayData.map((x) => x.id)) + 1,
  //   });
  //   setDisplayData(tempRows);
  //   setFixedRows((prevState) => prevState + 1);
  // };

  const checkForAlreadyExists = () => {
    return data.some((item) => item.Tag === "Already exists");
  };

  const checkForEmptyCells = () => {
    let haveToBeFilled = [
      "Area",
      "Diameter",
      "Fluid",
      "Insulation",
      "Line reference",
      "Tag",
      "Unit",
      "Seq",
      "Spec",
      "Train",
    ];

    let empty = false;
    for (let i = 0; i < data.length; i++) {
      for (let key in data[i]) {
        if (haveToBeFilled.includes(key) && !data[i][key]) {
          empty = true;
          break;
        }
      }
    }
    return empty;
  };

  const submitChanges = async () => {
    // chequear que no haya ningún tag que ponga already exists
    const stop = checkForAlreadyExists();
    if (stop) return props.alert("Repeated pipe!", "error");
    // mover el chequeo de empty cells a otra función
    const stop2 = checkForEmptyCells();
    if (stop2) return props.alert("All cells must be filled", "warning");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rows: data }),
    };
    const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/submitFeedPipes`;
    const res = await fetch(url, options);
    const { success } = await res.json();
    if (success) {
      props.alert("Changes saved!", "success");
      // await this.props.updateData();
    }
  };

  const handleOneChange = (idx, key) => {
    let tempData = [...data];
    let changedRow = { ...data[idx] };
    // si se cambia el line reference hay que actualizar: unit, fluid, seq ↓↓↓
    if (key === "Line reference") {
      // copia el row, modifícalo y ponlo en tempData
      const { Unit, Fluid, Seq } = divideLineReference(changedRow[key]);
      changedRow = { ...changedRow, Unit, Fluid, Seq };
    }
    // cualquier cosa que haya cambiado => hacer el rebuild del tag
    const newTag = buildTag(changedRow);
    if (changedRow.Tag !== newTag) changedRow.Tag = newTag;
    // una vez con el tag cambiado => chequear que no existan 2 tags iguales
    if (data.some((x) => x.Tag === newTag)) changedRow.Tag = "Already exists";
    // si existe un tag igual ponerlo como 'already exists'
    tempData[idx] = changedRow;
    // si no existe ningún tag igual => hacer esto ↓↓↓
    setData(tempData);
  };

  const handleChange = (changes, source) => {
    if (source === "loadData") return;
    // cambiado en un solo cell ↓
    if (source === "edit") {
      const [idx, key] = changes[0];
      handleOneChange(idx, key);
      // cambiado en + de 1 cell ( copy + paste ) ↓
    } else {
      changes.forEach(([idx, key]) => handleOneChange(idx, key));
    }
  };

  // ! aqui aqui aqui aqui
  useEffect(() => {
    console.log("data: ", data);
    setDisplayData(data);
  }, [data]);

  // useEffect(() => {
  //   filter();
  //   console.log()
  // }, [displayData]);

  return (
    <FeedPipesExcelTableWrapper
      displayData={displayData}
      lineRefs={lineRefs}
      designers={designers}
      areas={areas}
      diameters={diameters}
      fixedRows={fixedRows}
      handleChange={handleChange}
      // addRow={addRow}
      submitChanges={submitChanges}
      filter={filter}
    />
  );
}
