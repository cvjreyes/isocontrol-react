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

  const submitChanges = async () => {
    return false;

    // chequear que no haya ningún tag que ponga already exists

    // mover el chequeo de empty cells a otra función

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
    // en newData se guarda como { 7: { ...obj } } por eso coge el value
    // yo intentaría guardar el newData directamente bien...
    const new_rows = Object.values(newData);
    // check for empty cells ↓
    for (let i = 0; i < new_rows.length; i++) {
      new_rows.map((item) => {
        for (let key in item) {
          if (haveToBeFilled.includes(key) && !item[key]) {
            new_rows.splice(i, 1);
          }
        }
      });
    }
    if (empty) return props.alert("All cells must be filled", "warning");

    const body = {
      rows: new_rows,
      // to check
      // owners,
      tag_order: process.env.REACT_APP_TAG_ORDER,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const url = `http://${process.env.REACT_APP_SERVER}:${process.env.REACT_APP_NODE_PORT}/submitFeedPipes`;
    const res = await fetch(url, options);
    const { success } = await res.json();
    if (success) {
      props.alert("Changes saved!", "success");
      setNewData([]);
      setFixedRows(0);
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
    changedRow.Tag = newTag;
    // una vez con el tag cambiado => chequear que no existan 2 tags iguales
    if (data.some((x) => x.Tag === newTag)) {
      // si existe un tag igual ponerlo como 'already exists'
      changedRow.Tag = "Already exists";
      //    ! + si se intenta guardar, comprobar que ningun tag pone 'already exists'
    }
    tempData[idx] = changedRow;
    // si no existe ningún tag igual => hacer esto ↓↓↓
    console.log(tempData);
    setData(tempData);
  };

  const handleChange = (changes, source) => {
    if (source === "loadData") return;
    // cambiado en un solo cell ↓
    if (source === "edit") {
      const [idx, key] = changes[0];
      handleOneChange(idx, key);
      // cambiado en + de 1 cell ( pegar de excel ) ↓
    } else {
      // ! me falta comprobar line ref y cambios en tag
      let tempData = [...data];
      setData(tempData);
    }
  };

  useEffect(() => {
    console.log("data: ", data);
    setDisplayData(data);
  }, [data]);

  useEffect(() => {
    filter();
  }, [displayData]);

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
