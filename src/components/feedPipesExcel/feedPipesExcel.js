import React, { useRef } from 'react';
import 'antd/dist/antd.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { Table } from 'antd';
import { string } from 'prop-types';

class FeedPipesExcel extends React.Component { //Tabla del feed de isocontrol. Funciona igual que estimatedPipesExcel
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms: null,
    diameters: [],
    areas: [],
    trains: ["01", "02", "03", "04", "05"],
    line_refs: [],
    new_data: {},
    warning: false,
    empty: false,
    tags: [],
    designers: [],
    owners: [["", "", ""]],
    fixedRows: 0
  };

  async componentDidMount() {

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    }

    fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/api/areas", options)
      .then(response => response.json())
      .then(json => {
        let areas_options = []
        for (let i = 0; i < json.length; i++) {
          areas_options.push(json[i].name)
        }
        this.setState({ areas: areas_options });

      })

    await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/api/diameters", options)
      .then(response => response.json())
      .then(json => {
        let diameters = []
        for (let i = 0; i < json.diameters.length; i++) {
          diameters.push(json.diameters[i].diameter)
        }
        this.setState({ diameters: diameters });

      })

    await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/api/lineRefs", options)
      .then(response => response.json())
      .then(json => {
        let line_refs = []
        for (let i = 0; i < json.line_refs.length; i++) {
          line_refs.push(json.line_refs[i].line_ref)
        }
        this.setState({ line_refs: line_refs });

      })

    await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/api/designers", options)
      .then(response => response.json())
      .then(json => {
        let designers = []
        for (let i = 0; i < json.designers.length; i++) {
          designers.push(json.designers[i].name)
        }
        this.setState({ designers: designers });

      })

    await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/feedPipes", options)
      .then(response => response.json())
      .then(async json => {
        let rows = []
        let tags = []
        let row = {}
        let tag = ""
        for (let i = 0; i < json.rows.length; i++) {
          row = { "Line reference": json.rows[i].line_reference, "Tag": json.rows[i].tag, "Owner": json.rows[i].owner, "Unit": json.rows[i].unit, "Area": json.rows[i].area, "Fluid": json.rows[i].fluid, "Seq": json.rows[i].sequential, "Spec": json.rows[i].spec, "Type": json.rows[i].type, "Diameter": json.rows[i].diameter, "Insulation": json.rows[i].insulation, "Train": json.rows[i].train, "Status": json.rows[i].status, "id": json.rows[i].id }

          let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/)
          for (let y = 0; y < process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length; y++) {
            if(y === process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length - 1){
              tag = tag + "_" + row[tag_order[y]] 
            } else if (y === 0) {
              tag = row[tag_order[y]] 
            } else {
              tag = tag + "-" + row[tag_order[y]] 
            }
          }
          // tag = row[tag_order[0]] + "-" + row[tag_order[1]] + "-" + row[tag_order[2]] + "-" + row[tag_order[3]] + "-" + row[tag_order[4]] + "-" + row[tag_order[5]] + "-" + row[tag_order[6]] + "_" + row[tag_order[7]] + "_" + row[tag_order[8]]


          row["Tag"] = tag
          rows.push(row)
          tags.push(tag)
        }
        await this.setState({ data: rows, displayData: rows, tags: tags })
      })
  }

  async componentDidUpdate(prevProps, prevState) {

    if (prevProps !== this.props) {

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      }


      await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/FeedPipes", options)
        .then(response => response.json())
        .then(async json => {
          let rows = []
          let tags = []
          let row = {}
          let tag = ""
          for (let i = 0; i < json.rows.length; i++) {
            row = { "Line reference": json.rows[i].line_reference, "Tag": json.rows[i].tag, "Owner": json.rows[i].owner, "Unit": json.rows[i].unit, "Area": json.rows[i].area, "Fluid": json.rows[i].fluid, "Seq": json.rows[i].sequential, "Spec": json.rows[i].spec, "Type": json.rows[i].type, "Diameter": json.rows[i].diameter, "Insulation": json.rows[i].insulation, "Train": json.rows[i].train, "Status": json.rows[i].status, "id": json.rows[i].id }

            let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/)
            for (let y = 0; y < process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length; y++) {
              if(y === process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length - 1){
                tag = tag + "_" + row[tag_order[y]] 
              } else if (y === 0) {
                tag = row[tag_order[y]] 
              } else {
                tag = tag + "-" + row[tag_order[y]] 
              }
            }
            // tag = row[tag_order[0]] + "-" + row[tag_order[1]] + "-" + row[tag_order[2]] + "-" + row[tag_order[3]] + "-" + row[tag_order[4]] + "-" + row[tag_order[5]] + "-" + row[tag_order[6]] + "_" + row[tag_order[7]]

            row["Tag"] = tag
            rows.push(row)
            tags.push(tag)
          }
          await this.setState({ data: rows, tags: tags })
          let auxDisplayData = this.state.data
          let resultData = []
          let fil, exists = null
          for (let i = 0; i < auxDisplayData.length; i++) {
            exists = true
            for (let column = 0; column < Object.keys(auxDisplayData[i]).length - 1; column++) {
              fil = Object.keys(auxDisplayData[i])[column]
              if (this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])) {
                exists = false
              }
            }
            if (exists) {
              resultData.push(auxDisplayData[i])
            }
          }
          await this.setState({ displayData: resultData })
        })
    }

  }

  async filter(column, value) {
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({ filterData: fd })
    
    let auxDisplayData = this.state.data
    let tags = []
    let resultData = []
    let fil, exists = null
    for (let i = 0; i < auxDisplayData.length; i++) {
      exists = true
      for (let column = 0; column < Object.keys(auxDisplayData[i]).length; column++) {
        fil = Object.keys(auxDisplayData[i])[column]
        let auxColumn = auxDisplayData[i][fil]
        if (auxColumn === null) {
          auxColumn = ""
        }
        
        if (this.state.filterData[column] && !auxColumn.toString().includes(this.state.filterData[column])) {
          exists = false
        }
      }
      if (exists) {
        resultData.push(auxDisplayData[i])
        tags.push(auxDisplayData[i].Tag)
      }
    }
    await this.setState({ displayData: resultData, tags: tags })
  }

  addRow() {
    let rows = this.state.displayData
    let fixedRows = this.state.fixedRows + 1

    // console.log("fixedRows: " + this.state.fixedRows);
    rows.push({ "Line reference": "", "Tag": "", "Owner": "", "Unit": "", "Area": "", "Fluid": "", "Seq": "", "Spec": "", "Type": "", "Diameter": "", "Insulation": "", "Train": "", "Status": "" })
    this.setState({ displayData: rows, fixedRows: fixedRows })
    // console.log("displayData: " + JSON.stringify(this.state.displayData));
  }

  async submitChanges() {
    // console.log("Tag Order: " + process.env.REACT_APP_TAG_ORDER);
    // console.log(__filename);
    // console.log("Proccess env: " + JSON.stringify(process.env));
    this.setState({ fixedRows: 0 })
    let new_rows = []
    Object.entries(this.state.new_data)
      .map(([key, value]) => new_rows.push(value))
    for (let i = 0; i < new_rows.length; i++) {
      if (new_rows[i]["Line reference"] === "" || new_rows[i].Tag === "" || new_rows[i].Unit === "" || new_rows[i].Area === "" || new_rows[i].Fluid === "" || new_rows[i].Seq === "" || new_rows[i].Spec === "" || new_rows[i].Diameter === "" || new_rows[i].Insulation === "" || new_rows[i].Train === "" || new_rows[i]["Line reference"] === null || new_rows[i].Tag === null || new_rows[i].Unit === null || new_rows[i].Area === null || new_rows[i].Fluid === null || new_rows[i].Seq === null || new_rows[i].Spec === null || new_rows[i].Diameter === null || new_rows[i].Insulation === null || new_rows[i].Train === null) {
        await this.setState({ empty: true })
        new_rows.splice(i, 1)
      }
    }
    console.log("New Rows: " + new_rows);

    const body = {
      rows: new_rows,
      owners: this.state.owners,
      tag_order: process.env.REACT_APP_TAG_ORDER
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
    await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/submitFeedPipes", options)
      .then(response => response.json())
      .then(async json => {
        if (json.success) {
          this.props.success()

        }
        if (this.state.warning) {
          this.props.estimatedWarning()
        }
        if (this.state.empty) {
          this.props.estimatedEmpty()
        }
        this.setState({ new_data: [], warning: false, empty: false })
      })

    await this.props.updateData()
  }

  handleChange = async (changes, source) => {
    if (source !== 'loadData') {
      let data_aux = this.state.displayData
      for (let i = 0; i < changes.length; i += 4) {
        if (changes[i][1] === "Owner IFC") {
          let owners = this.state.owners
          owners.push(["IFC", this.state.displayData[changes[i][0]].Tag, changes[0][3]])
          this.setState({ owners: owners })
        } else if (changes[i][1] === "Owner IsoTracker") {
          let owners = this.state.owners
          owners.push(["ISO", this.state.displayData[changes[i][0]].Tag, changes[0][3]])
          this.setState({ owners: owners })
        } else {
          let row_id = changes[i][0]
          let row = this.state.displayData[row_id]
          if (changes[i][1] === 'Line reference') {
            const options = {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              },
            }

            await fetch("http://" + process.env.REACT_APP_SERVER + ":" + process.env.REACT_APP_NODE_PORT + "/getDataByRef/" + changes[i][3], options)
              .then(response => response.json())
              .then(async json => {
                if (json.pipe) {
                  data_aux[row_id].Unit = json.pipe[0].unit
                  data_aux[row_id].Fluid = json.pipe[0].fluid
                  data_aux[row_id].Seq = json.pipe[0].seq
                  data_aux[row_id].Spec = json.pipe[0].spec_code
                  data_aux[row_id].Insulation = json.pipe[0].insulation
                  console.log(json.pipe[0].calc_notes)
                  if (json.pipe[0].calc_notes !== "NA" && json.pipe[0].calc_notes !== "unset") {
                    data_aux[row_id].Type = "TL3"
                  } else if (process.env.REACT_APP_MMDN === "0") {
                    if (data_aux[row_id].Diameter < 2.00) {
                      data_aux[row_id].Type = "TL1"
                    } else {
                      data_aux[row_id].Type = "TL2"
                    }
                  } else {
                    if (data_aux[row_id].Diameter < 50) {
                      data_aux[row_id].Type = "TL1"
                    } else {
                      data_aux[row_id].Type = "TL2"
                    }
                  }

                  await this.setState({ data: data_aux })
                }
              })

          }
          if (row.Area && row.Diameter && row.Train && row["Line reference"]) {
            let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/)
            let tag = ""
            for (let y = 0; y < process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length; y++) {
              if(y === process.env.REACT_APP_TAG_ORDER.split(/[ -]+/).length - 1){
                tag = tag + "_" + row[tag_order[y]] 
              } else if (y === 0) {
                tag = row[tag_order[y]] 
              } else {
                tag = tag + "-" + row[tag_order[y]] 
              }
            }
            data_aux[row_id].Tag = tag
          }
          let new_data = this.state.new_data
          if (this.state.tags.indexOf(data_aux[row_id].Tag) > -1 && this.state.tags.indexOf(data_aux[row_id].Tag) !== row_id) {
            data_aux[row_id].Tag = "ALREADY EXISTS"
            data_aux[row_id].Area = ""
            data_aux[row_id].Diameter = ""
            data_aux[row_id].Train = ""
            data_aux[row_id].Status = ""
          } else {
            if (data_aux[row_id].Type !== "TL3") {
              if (process.env.REACT_APP_MMDN === "0") {
                if (data_aux[row_id].Diameter < 2.00) {
                  data_aux[row_id].Type = "TL1"
                } else {
                  data_aux[row_id].Type = "TL2"
                }
              } else {
                if (data_aux[row_id].Diameter < 50) {
                  data_aux[row_id].Type = "TL1"
                } else {
                  data_aux[row_id].Type = "TL2"
                }
              }
            }

            new_data[row_id] = row
            console.log(row)
          }


          await this.setState({ new_data: new_data })

          if (!row["Line reference"] && row.id) {
            let new_data = this.state.new_data
            new_data[row_id] = { "Line reference": "deleted", id: row.id }
            await this.setState({ new_data: new_data })
          }

        }

      }

    }
  }


  render() {

    const columns = [
      {
        title: <center className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Line reference" style={{ textAlign: "center" }} onChange={(e) => this.filter(0, e.target.value) && console.log()} /></center>,
        key: 'line_reference',
        align: "center",
        width: "151px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Tag" style={{ textAlign: "center" }} onChange={(e) => this.filter(1, e.target.value)} /></div>,
        key: 'tag',
        align: "center",
        width: "403px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Owner" style={{ textAlign: "center" }} onChange={(e) => this.filter(2, e.target.value)} /></div>,
        key: 'owner',
        align: "center",
        width: "209px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Unit" style={{ textAlign: "center" }} onChange={(e) => this.filter(3, e.target.value)} /></div>,
        key: 'unit',
        align: "center",
        width: "70px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Area" style={{ textAlign: "center" }} onChange={(e) => this.filter(4, e.target.value)} /></div>,
        key: 'area',
        align: "center",
        width: "99px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Fluid" style={{ textAlign: "center" }} onChange={(e) => this.filter(5, e.target.value)} /></div>,
        key: 'fluid',
        align: "center",
        width: "70px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Seq" style={{ textAlign: "center" }} onChange={(e) => this.filter(6, e.target.value)} /></div>,
        key: 'seq',
        align: "center",
        width: "100px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Spec" style={{ textAlign: "center" }} onChange={(e) => this.filter(7, e.target.value)} /></div>,
        key: 'spec',
        align: "center",
        width: "96px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Type" style={{ textAlign: "center" }} onChange={(e) => this.filter(8, e.target.value)} /></div>,
        key: 'type',
        align: "center",
        width: "80px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Diameter" style={{ textAlign: "center" }} onChange={(e) => this.filter(9, e.target.value)} /></div>,
        key: 'diameter',
        align: "center",
        width: "105px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Insulation" style={{ textAlign: "center" }} onChange={(e) => this.filter(10, e.target.value)} /></div>,
        key: 'insulation',
        align: "center",
        width: "110px"
      },
      {
        title: <div className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Train" style={{ textAlign: "center" }} onChange={(e) => this.filter(11, e.target.value)} /></div>,
        key: 'train',
        align: "center",
        width: "71px"
      },
      {
        title: <center className="dataTable__header__text"><input type="text" className="filter__input" placeholder="Status" style={{ textAlign: "center" }} onChange={(e) => this.filter(12, e.target.value)} /></center>,
        key: 'status',
        align: "center",
      }]

    const settings = {
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: [155, 403, 210, 70, 100, 70, 100, 95, 80, 105, 110, 70, 210],
      fontSize: 24
      //... other options
    }

    return (
      <div style={{ zoom: "0.85" }} id="exceltable">
        <div id="hot-app">
          <Table style={{ width: "1772px", marginLeft: "52px" }} className="customTable" bordered={true} columns={columns} pagination={{ disabled: true, defaultPageSize: 5000, hideOnSinglePage: true }} size="small"
            rowClassName={(record) => record.color.replace('#', '')} scroll={{ y: 0 }} />
          <HotTable
            className='feedPipesExcelSize'
            data={this.state.displayData}
            rowHeaders={true}
            rowHeights="30px"
            columnHeaderHeight={30}
            width="100.7%"
            height="470"
            settings={settings}
            manualColumnResize={true}
            manualRowResize={true}
            columns={[{ data: "Line reference", type: 'dropdown', source: this.state.line_refs, strict: true }, { data: "Tag", type: 'text' }, { data: "Owner", type: 'dropdown', source: this.state.designers, strict: true }, { data: "Unit", type: 'text' }, { data: "Area", type: 'dropdown', source: this.state.areas, strict: true }, { data: "Fluid", type: 'text' }, { data: "Seq", type: 'text' }, { data: "Spec", type: 'text' }, { data: "Type", type: 'text', readOnly: true }, { data: "Diameter", type: 'dropdown', source: this.state.diameters, strict: true }, { data: "Insulation", type: 'text' }, { data: "Train", type: 'dropdown', source: this.state.trains, strict: true }, { data: "Status", type: 'dropdown', source: ["ESTIMATED", "MODELLING(50%)", "MODELLED(100%)"] }]}
            afterChange={this.handleChange}
            fixedRowsBottom={this.state.fixedRows}
          />
          <br></br>
          <div style={{ marginLeft: "695px" }}>
            <button class="btn btn-sm btn-info" onClick={() => this.addRow()} style={{ marginRight: "25px", fontSize: "16px", width: "160px", borderRadius: "10px" }}>Add</button>
            <button class="btn btn-sm btn-success" onClick={() => this.submitChanges()} style={{ marginRight: "5px", fontSize: "16px", width: "160px", borderRadius: "10px" }}>Save</button>
          </div>
          <br></br>
        </div>
      </div>
    );
  }
}

export default FeedPipesExcel;