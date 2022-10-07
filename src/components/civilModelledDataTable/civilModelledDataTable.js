import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';

class CivilModelledDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", ""],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    steps: [],
    filters: []
  };

  async componentDidMount(){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/civils/modelled", options)
      .then(response => response.json())
      .then(async json => {
        var rows = []
        var row = null
        
        for(let i = 0; i < json.rows.length; i++){

            if(i % 2 === 0){
              row = {area: json.rows[i].area, tag: json.rows[i].tag, type: json.rows[i].type, weight: json.rows[i].weight, status: json.rows[i].status, progress: json.rows[i].progress, color: "#fff"}
            }else{
              row = {area: json.rows[i].area, tag: json.rows[i].tag, type: json.rows[i].type, weight: json.rows[i].weight, status: json.rows[i].status, progress: json.rows[i].progress, color: "#eee"}
            }

            rows.push(row)
        }
        let filterRow = [{key:0, area: <div><input type="text" className="filter__input" placeholder="Area" onChange={(e) => this.filter(0, e.target.value)}/></div>, tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2,e.target.value)}/></div>, weight: <div><input type="text" className="filter__input" placeholder="Weight" onChange={(e) => this.filter(3,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(4,e.target.value)}/></div>, progress: <div><input type="text" className="filter__input" placeholder="Progress" onChange={(e) => this.filter(5,e.target.value)}/></div>}]
             
        this.setState({data : rows, displayData: rows});
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
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
        title: <center className="dataTable__header__text">Area</center>,
        dataIndex: 'area',
        key: 'area',
        ...this.getColumnSearchProps('area'),
        sorter:{
          compare: (a, b) => a.area.localeCompare(b.area),
        },
      },
      {
        title: <center className="dataTable__header__text">Tag</center>,
        dataIndex: 'tag',
        key: 'tag',
        ...this.getColumnSearchProps('tag'),
        sorter:{
          compare: (a, b) => a.tag.localeCompare(b.tag),
        },
      },
      {
        title: <center className="dataTable__header__text">Type</center>,
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        sorter:{
          compare: (a, b) => a.type.localeCompare(b.type),
        },
      },
      {
        title: <div className="dataTable__header__text">Weight</div>,
        dataIndex: 'weight',
        key: 'weight',
        ...this.getColumnSearchProps('weight'),
        sorter: {
          compare: (a, b) => a.weight-b.weight,
        },
      },
      {
        title: <center className="dataTable__header__text">Status</center>,
        dataIndex: 'status',
        key: 'status',
        ...this.getColumnSearchProps('status'),
        sorter:{
          compare: (a, b) => a.status.localeCompare(b.status),
        },
      },
      {
        title: <center className="dataTable__header__text">Progress</center>,
        dataIndex: 'progress',
        key: 'progress',
        ...this.getColumnSearchProps('progress'),
        sorter:{
          compare: (a, b) => a.progress - b.progress,
        },
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
        <div className="estimatedDataTable__container">
        <Table className="customTable" bordered = {true} columns={columns} style={{ height: '500px' }} dataSource={this.state.displayData} scroll={{y:400}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small"
         rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default CivilModelledDataTable;