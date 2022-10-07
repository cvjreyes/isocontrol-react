import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import { Link } from 'react-router-dom';


class TimeTrackDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", ""],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    filters: []
  };

  

  componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/timeTrack", options)
      .then(response => response.json())
      .then(async json => {
        var rows = []
        var row = null
        for(let i = 0; i < json.rows.length; i++){
            row = {id: json.rows[i].filename.substring(0, json.rows[i].filename.length - 4), revision: "*R"+json.rows[i].revision, design: json.rows[i].design, stress: json.rows[i].stress, supports: json.rows[i].supports, materials: json.rows[i].materials, issuer: json.rows[i].issuer, isocontrol: json.rows[i].isocontrol}
            
            if(row){
              if(i % 2 === 0){
                row["color"] = "#fff"
              }else{
                row["color"] = "#eee"
              }
            }

            rows.push(row)
            
        }
    
        let filterRow = [{id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(0, e.target.value)}/></div>, revision: <div><input type="text" className="filter__input" placeholder="Revision" onChange={(e) => this.filter(1, e.target.value)}/></div>}]
            
        this.setState({data : rows, role: this.props.role, displayData: rows});
        await this.setState({filters : filterRow})

    }) 
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-7; column ++){
        fil = Object.keys(auxDisplayData[i])[column]
        if(auxDisplayData[i][fil]){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
            exists = false
          }
        }else{
          
          exists = false
        }
          
        
      }
      if(exists){
        resultData.push(auxDisplayData[i])
      }
    }
    await this.setState({displayData: resultData})
  }
  
  getColumnSearchProps = dataIndex => ({
    
    render: text => 
      
      text
    
      
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
    //this.setState({ selectedRows: selectedRows });
    this.props.onChange(ids);
    
  };
  

  render() {

    const columns = [
      {
        title: <center className="dataTable__header__text">ISO ID</center>,
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
        sorter:{
            compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
        },
      },
      {
        title: <center className="dataTable__header__text">Revision</center>,
        dataIndex: 'revision',
        key: 'revision',
        ...this.getColumnSearchProps('revision'),
        sorter:{
            compare: (a, b) => a.revision.localeCompare(b.revision),
        },
        width: "160px",
      },
      {
        title: <center className="dataTable__header__text">Design</center>,
        dataIndex: 'design',
        key: 'design',
        ...this.getColumnSearchProps('design'),
        sorter:{
          compare: (a, b) => a.design - b.design,
        },
        width: "160px",

      },
      {
        title: <center className="dataTable__header__text">Stress</center>,
        dataIndex: 'stress',
        key: 'stress',
        ...this.getColumnSearchProps('stress'),
        sorter:{
          compare: (a, b) => a.stress - b.stress,
        },
        width: "160px",

      },
      {
        title: <center className="dataTable__header__text">Supports</center>,
        dataIndex: 'supports',
        key: 'supports',
        ...this.getColumnSearchProps('supports'),
        sorter:{
          compare: (a, b) => a.supports - b.supports,
        },
        width: "160px",

      },
      {
        title: <center className="dataTable__header__text">Materials</center>,
        dataIndex: 'materials',
        key: 'materials',
        ...this.getColumnSearchProps('materials'),
        sorter:{
          compare: (a, b) => a.materials - b.materials,
        },
        width: "160px",

      },
      {
        title: <center className="dataTable__header__text">Issuer</center>,
        dataIndex: 'issuer',
        key: 'issuer',
        ...this.getColumnSearchProps('issuer'),
        sorter:{
          compare: (a, b) => a.issuer - b.issuer,
        },
        width: "160px",

      },
      {
        title: <center className="dataTable__header__text">LOS/IsoControl</center>,
        dataIndex: 'isocontrol',
        key: 'isocontrol',
        ...this.getColumnSearchProps('isocontrol'),
        sorter:{
          compare: (a, b) => a.isocontrol - b.isocontrol,
        },
        width: "160px",

      },
    ];

    var totalElements = null;
    if (this.state.data.length === 0){
      totalElements = null;
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 25, left:0}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }


    return (
      <div>
        {this.state.updateData}
        <div className="dataTable__container" style={{float:"top", position:"relative"}}>
        <Table className="customTable" style={{ height: '430px' }} bordered = {true}  columns={columns} dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default TimeTrackDataTable;