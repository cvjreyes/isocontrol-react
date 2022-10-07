import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './statusDataTable.css'
import { Link } from 'react-router-dom';


class StatusDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", ""],
    weights: [],
    role: this.props.role,
    selectedRows: [],
    selectedRowsKeys: [],
    filters: []
  };
  

  async componentDidMount(){

    if(process.env.REACT_APP_PROGRESS === "1"){
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
      }
      await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getMaxProgress", options)
      .then(response => response.json())
      .then(json =>{
        this.setState({
          weights: [json.weights[0].weight,json.weights[1].weight,json.weights[2].weight]
        })
      })

      fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/statusFiles", options)
          .then(response => response.json())
          .then(async json => {
              var rows = []
              var row = null;
              
              for(let i = 0; i < json.rows.length; i++){
                var condition = ""
                if(json.rows[i].issued === null){
                  condition = "ON GOING R" + json.rows[i].revision + "*"
                }else{
                  condition = "ISSUED R" + (json.rows[i].revision - 1)
                }
                if(json.rows[i].deleted === 1){
                  condition = "DELETED"
                }
                if(json.rows[i].onhold === 1){
                  condition = "ON HOLD"
                }
                if(json.rows[i].tpipes_id){
                  row = {key:i, status: json.rows[i].to, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, type: json.rows[i].code, condition: condition, MAXWeight: this.state.weights[json.rows[i].tpipes_id - 1],realProgress: (json.rows[i].realprogress / this.state.weights[json.rows[i].tpipes_id - 1] * 100).toFixed(2) + "% (" + json.rows[i].realprogress + ")" , progress: (json.rows[i].progress / this.state.weights[json.rows[i].tpipes_id - 1] * 100).toFixed(2) + "% (" + json.rows[i].progress + ")"}
                }else{
                  row = {key:i, status: json.rows[i].to, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>}
                }
                        
                if(row){
                  if(i % 2 === 0){
                    row["color"] = "#fff"
                  }else{
                    row["color"] = "#eee"
                  }
                   
                  rows.push(row)
                }
              }
                          
              let filterRow = [{key:0, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(0, e.target.value)}/></div>, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2,e.target.value)}/></div>, condition: <div><input type="text" className="filter__input" placeholder="Condition" onChange={(e) => this.filter(3,e.target.value)}/></div>, MAXWeight: <div><input type="text" className="filter__input" placeholder="MAX Weight" onChange={(e) => this.filter(4,e.target.value)}/></div>, progress: <div><input type="text" className="filter__input" placeholder="Progress" onChange={(e) => this.filter(5,e.target.value)}/></div>}]
             
              this.setState({data : rows, role: this.props.role, displayData: rows});
              await this.setState({filters : filterRow})
              }
          )
          .catch(error => {
              console.log(error);
          })
    }else{
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },

      }
      fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/statusFiles", options)
          .then(response => response.json())
          .then(async json => {
              var rows = []
              var row = null;
              for(let i = 0; i < json.rows.length; i++){
                var condition = ""
                if(json.rows[i].issued === null){
                  condition = "ON GOING R" + String(json.rows[i].revision) + "*"
                }else{
                  condition = "ISSUED R" + String(json.rows[i].revision - 1)
                }
                if(json.rows[i].deleted === 1){
                  condition = "DELETED"
                }
                if(json.rows[i].onhold === 1){
                  condition = "ON HOLD"
                }
                row = {key:i, status: json.rows[i].to, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link>, condition: condition}                    
                if(row){
                  if(i % 2 === 0){
                    row["color"] = "#fff"
                  }else{
                    row["color"] = "#eee"
                  }
                   
                  rows.push(row)
                }
              }

              let filterRow = [{key:0, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(0, e.target.value)}/></div>, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(1, e.target.value)}/></div>, condition: <div><input type="text" className="filter__input" placeholder="Condition" onChange={(e) => this.filter(2,e.target.value)}/></div>}]
             
              this.setState({data : rows, role: this.props.role, displayData: rows});
              await this.setState({filters : filterRow})
                          
              
              }
          
          )
          .catch(error => {
              console.log(error);
          })
    }
    
  }

  async filter(column, value){
    let fd = this.state.filterData
    fd[column] = value
    await this.setState({filterData: fd})

    let auxDisplayData = this.state.data
    let resultData = []
    let fil, exists = null
    for(let i = 0; i < auxDisplayData.length; i++){
      exists = true
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
        fil = Object.keys(auxDisplayData[i])[column+1]
        if(fil === "id"){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
            exists = false
          }
        }else{
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
            exists = false
          }
        }
        
      }
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }

  getMaster(fileName){

    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/pdf"
      }
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getMaster/"+fileName, options)
    .then(res => res.blob())
    .then(response => {
      const file = new Blob([response], {
        type: "application/pdf"
      });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      let w = window.open(fileURL);

        w.addEventListener("load", function() {
          setTimeout(()=> w.document.title = fileName
          , 300);


        });

        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;

        // it forces the name of the downloaded file
        fileLink.download = fileName;

        // triggers the click event
        fileLink.click();


    })
    .catch(error => {
      console.log(error);
    });
  }

  
  getColumnSearchProps = dataIndex => ({
    
    render:  text => 
    text != null ? (
    text.props && text.type !== "div" ? (
      <Link onClick={() => this.getMaster(text.props.children)}>{text.props.children}</Link>
    ) : this.state.searchedColumn === dataIndex ? (
      text
    ) : (
      text
    )
    ) : (
      text
    )
  });

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let ids = []
    for(let i = 0; i < selectedRows.length; i++){
      ids.push(selectedRows[i].id.props.children)
    }
    this.setState({
      selectedRowsKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
    this.props.onChange(ids);
  };


  render() {

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
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

    let columns = [      
      {
        title: <center className="dataTable__header__text">ISO ID</center>,
        dataIndex: 'id',
        key: 'id',
        width: '23%',
        ...this.getColumnSearchProps('id'),
        sorter:{
          compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
        },
      },
      {
        title: <div className="dataTable__header__text">Status</div>,
        dataIndex: 'status',
        key: 'status',
        width: '20%',
        ...this.getColumnSearchProps('status'),
        sorter: {
            compare: (a, b) => { return a.status.localeCompare(b.status)},
        },
      },
      {
        title: <div className="dataTable__header__text">Type</div>,
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        sorter: {
          compare: (a, b) => { return a.type.localeCompare(b.type)},
        },
      },
      {
        title: <div className="dataTable__header__text">Condition</div>,
        dataIndex: 'condition',
        key: 'condition',
        ...this.getColumnSearchProps('condition'),
        sorter: {
          compare: (a, b) => { return a.condition.localeCompare(b.condition)},
        },
      }
    ];

    if(process.env.REACT_APP_PROGRESS === "0"){
      columns = [
        {
          title: <center className="dataTable__header__text">ISO ID</center>,
          dataIndex: 'id',
          key: 'id',
          width: '23%',
          ...this.getColumnSearchProps('id'),
          sorter:{
            compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
          },
        },
        {
            title: <div className="dataTable__header__text">Status</div>,
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            ...this.getColumnSearchProps('status'),
            sorter: {
                compare: (a, b) => { return a.status.localeCompare(b.status)},
            },
        },
              
      {
        title: <div className="dataTable__header__text">Condition</div>,
        dataIndex: 'condition',
        key: 'condition',
        ...this.getColumnSearchProps('condition'),
        sorter: {
          compare: (a, b) => { return a.condition.localeCompare(b.condition)},
        },
      }
    ];
    }

    if(process.env.REACT_APP_PROGRESS === "1"){
      columns.push({
        title: <div className="dataTable__header__text">MAX Weight</div>,
        dataIndex: 'MAXWeight',
        key: 'MAXWeight',
        ...this.getColumnSearchProps('MAXWeight'),
        sorter: {
            compare: (a, b) => a.MAXWeight - b.MAXWeight,
        },
      })
      columns.push({
        title: <div className="dataTable__header__text">Progress</div>,
        dataIndex: 'progress',
        key: 'progress',
        ...this.getColumnSearchProps('progress'),
        sorter: {
          compare: (a, b) => a.progress - b.progress,
        },
      })
      if(this.state.role === "SpecialityLead"){
        columns.push({
          title: <div className="dataTable__header__text">Real Progress</div>,
          dataIndex: 'realProgress',
          key: 'realProgress',
          ...this.getColumnSearchProps('realProgress'),
          sorter: {
              compare: (a, b) => a.realProgress - b.realProgress,
          },
        })
      }
    } 

    return (
      <div>
        <div className="dataTable__container">
        <Table className='customTable' style={{ height: '430px' }} bordered = {true} rowSelection={{type: 'checkbox', ...rowSelection}} columns={columns} dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} rowSelection={{type: 'checkbox', ...rowSelectionFilter}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          <div style={{position: "absolute", bottom:25, left:0}}>
            <b>Total elements: {this.state.data.length}</b>
          </div>
        </div>
        
      </div>
    );
  }
}

export default StatusDataTable;