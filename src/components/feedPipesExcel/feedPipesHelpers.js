export const prepareFeedPipesData = (rowsJson) => {
  let rows = [];
  let row = {};
  for (let i = 0; i < rowsJson.length; i++) {
    row = {
      "Line reference": rowsJson[i].line_reference,
      Owner: rowsJson[i].owner,
      Unit: rowsJson[i].unit,
      Area: rowsJson[i].area,
      Fluid: rowsJson[i].fluid,
      Seq: rowsJson[i].sequential,
      Spec: rowsJson[i].spec,
      Type: rowsJson[i].type,
      Diameter: rowsJson[i].diameter,
      Insulation: rowsJson[i].insulation,
      Train: rowsJson[i].train,
      Status: rowsJson[i].status,
      id: rowsJson[i].id,
    };

    const tag = buildTag(row);

    row["Tag"] = tag;
    rows.push(row);
  }
  return { rows };
};

export const buildTag = (row) => {
  let tag = "";

  let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/);
  for (
    let y = 0;
    y < process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length;
    y++
  ) {
    if (y === process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length - 1) {
      tag = tag + "_" + row[tag_order[y]];
    } else if (y === 0) {
      tag = row[tag_order[y]];
    } else {
      tag = tag + "-" + row[tag_order[y]];
    }
  }
  return tag;
};

export const divideLineReference = (ref) => {
  // encontrar primer guión
  const idx1 = ref.indexOf("-");

  // coger unit
  const Unit = ref.substring(0, idx1);

  // quitar primer guión
  const newStr = ref.replace("-", "");

  // encontrar segundo guión
  const idx2 = newStr.indexOf("-");

  // coger fluid
  const Fluid = newStr.substring(idx1, idx2);

  // coger seq
  const Seq = newStr.substring(idx2 + 1);

  return { Unit, Fluid, Seq };
};
