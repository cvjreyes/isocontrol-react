import React from "react";
import AddSaveBtns from "../buttons/AddSaveBtns";
import FeedPipesExcelTable from "./FeedPipesExcelTable";
import FeedPipesExcelTableHeader from "./FeedPipesExcelTableHeader";

export default function FeedPipesExcelTableWrapper({
  displayData,
  lineRefs,
  designers,
  areas,
  diameters,
  fixedRows,
  handleChange,
  // addRow,
  submitChanges,
  filter,
}) {
  // ! (añadir paginación && opción quitar paginación || intersection observer) && lazy loading
  return (
    <div>
      <FeedPipesExcelTableHeader filter={filter} />
      <FeedPipesExcelTable
        displayData={displayData}
        lineRefs={lineRefs}
        designers={designers}
        areas={areas}
        diameters={diameters}
        fixedRows={fixedRows}
        handleChange={handleChange}
      />
      <AddSaveBtns
        margin={"40px 0 0 695px"}
        // clickAdd={addRow}
        clickSave={submitChanges}
        disableAdd={true}
      />
    </div>
  );
}
