import React from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";

export default function FeedPipesExcelTable({
  displayData,
  lineRefs,
  areas,
  diameters,
  fixedRows,
  handleChange,
}) {
  const settings = {
    licenseKey: "non-commercial-and-evaluation",
    colWidths: [215, 400, 60, 80, 110, 70, 70, 70, 90, 110, 71, 150],
    fontSize: 24,
  };

  const columnsData = [
    {
      data: "Line reference",
      type: "dropdown",
      source: lineRefs,
      strict: true,
    },
    { data: "Tag", type: "text" },
    { data: "Unit", type: "text" },
    {
      data: "Area",
      type: "dropdown",
      source: areas,
      strict: true,
    },
    { data: "Fluid", type: "text" },
    { data: "Seq", type: "text" },
    { data: "Spec", type: "text" },
    { data: "Type", type: "text", readOnly: true },
    {
      data: "Diameter",
      type: "dropdown",
      source: diameters,
      strict: true,
    },
    { data: "Insulation", type: "text" },
    {
      data: "Train",
      type: "dropdown",
      source: ["01", "02", "03", "04", "05"],
      strict: true,
    },
    {
      data: "Status",
      type: "dropdown",
      source: ["ESTIMATED", "MODELLING(50%)", "TOCHECK(80%)", "MODELLED(100%)"],
    },
  ];

  // reducir tamaño números izq

  return (
    <HotTable
      className="feedPipesExcelSize"
      data={displayData}
      rowHeaders={true}
      rowHeights="20px"
      columnHeaderHeight={30}
      width="100.7%"
      height="400"
      settings={settings}
      manualColumnResize={true}
      manualRowResize={true}
      columns={columnsData}
      afterChange={handleChange}
      fixedRowsBottom={fixedRows}
    />
  );
}
