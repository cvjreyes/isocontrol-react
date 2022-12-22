import React from "react";
import { Table } from "antd";
import "antd/dist/antd.css";

import { columnsDataHeader } from "./ColumnsData";

export default function FeedPipesExcelTableHeader({ filter }) {
  return (
    <Table
      // el width está para que no se solape el scroll
      style={{ width: "1494px", marginLeft: "52px" }}
      className="customTable"
      bordered={true}
      // me gustaría cambiar el columns pero no me deja sacarlo de ahí
      columns={columnsDataHeader.map((item) => {
        return {
          title: (
            <center className="dataTable__header__text">
              <input
                type="text"
                className="filter__input"
                style={{ textAlign: "center" }}
                placeholder={item.name}
                onChange={(e) => filter(item.name, e.target.value)}
              />
            </center>
          ),
          key: item.key,
          width: `${item.width}px`,
          align: "center",
        };
      })}
      pagination={{
        disabled: true,
        defaultPageSize: 5000,
        hideOnSinglePage: true,
      }}
      size="small"
      rowClassName={(record) => record.color.replace("#", "")}
      scroll={{ y: 0 }}
    />
  );
}
