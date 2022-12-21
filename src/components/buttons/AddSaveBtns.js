import React from "react";

export default function AddSaveBtns({
  margin,
  clickAdd,
  clickSave,
  disableAdd,
}) {
  return (
    <div style={{ margin }}>
      <button
        class="btn btn-sm btn-info"
        onClick={clickAdd}
        style={{
          marginRight: "25px",
          fontSize: "16px",
          width: "160px",
          borderRadius: "10px",
          cursor: disableAdd && "not-allowed",
        }}
        disabled={disableAdd}
      >
        Add
      </button>
      <button
        class="btn btn-sm btn-success"
        onClick={clickSave}
        style={{
          marginRight: "5px",
          fontSize: "16px",
          width: "160px",
          borderRadius: "10px",
        }}
      >
        Save
      </button>
    </div>
  );
}
