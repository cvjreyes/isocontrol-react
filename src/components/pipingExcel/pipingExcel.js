import React from 'react';
import 'antd/dist/antd.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';


class PipingExcel extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    progressData: [],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    steps: []
  };

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }


  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/gpipes", options)
    .then(response => response.json())
    .then(json => {
      var rows = []
      var row = null
      rows.push({"Week": "Week", "Estimated": "Estimated"})
      for(let i = 0; i < json.rows.length; i++){
          row = {"Week": json.rows[i].week, "Estimated": json.rows[i].estimated, id: json.rows[i].id}

          rows.push(row)
      }
      this.setState({progressData : rows, selectedRows: []});

  })
  }

  
  addRowProgress(){
    let rows = this.state.progressData
    rows.push({"Week": "", "Estimated": ""})
    this.setState({progressData: rows})
  }

  submitChangesProgress(){
    const body = {
      rows: this.state.progressData,
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submit/piping/progress", options)
    .then(response => response.json())
    .then(json =>{

    })
    this.props.success()
  }


  render() {
  
      const progressSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 195,
        //... other options
      }

      return (

          <div className="column" style={{marginLeft:"35%"}}>
            <div id="hot-app">
              <HotTable
                data={this.state.progressData}
                colHeaders={true}
                rowHeaders={true}
                width="465"
                height="500"
                settings={progressSettings} 
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Week", type:"numeric"}, {data: "Estimated", type:"numeric"}]}
                filters={true}
                dropdownMenu= {[
                    'make_read_only',
                    '---------',
                    'alignment',
                    '---------',
                    'filter_by_condition',
                    '---------',
                    'filter_operators',
                    '---------',
                    'filter_by_condition2',
                    '---------',
                    'filter_by_value',
                    '---------',
                    'filter_action_bar',
                  ]}
              />
              <br></br>
              <div style={{marginLeft:"180px"}}>
                  <button class="btn btn-sm btn-info" onClick={() => this.addRowProgress()} style={{marginRight:"5px", fontSize:"16px",width:"60px", borderRadius:"10px"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChangesProgress()} style={{marginRight:"5px", fontSize:"16px", width:"60px", borderRadius:"10px"}}>Save</button>
              </div>
              <br></br>
            </div>
          </div>
      );
  }
}

export default PipingExcel;