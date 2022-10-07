import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';

class ElecTypesDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", ""],
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

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/electrical/types", options)
      .then(response => response.json())
      .then(async json => {
        var rows = []
        var row = null
        
        for(let i = 0; i < json.rows.length; i++){

            if(i % 2 === 0){
              row = {code: json.rows[i].code, name: json.rows[i].name, weight: json.rows[i].weight, color: "#fff"}
            }else{
              row = {code: json.rows[i].code, name: json.rows[i].name, weight: json.rows[i].weight, color: "#eee"}
            }

            rows.push(row)
        }
        let filterRow = [{key:0, code: <div><input type="text" className="filter__input" placeholder="Code" onChange={(e) => this.filter(0, e.target.value)}/></div>, name: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, weight: <div><input type="text" className="filter__input" placeholder="Weight" onChange={(e) => this.filter(2,e.target.value)}/></div>}]
             
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
        title: <center className="dataTable__header__text">Code</center>,
        dataIndex: 'code',
        key: 'code',
        ...this.getColumnSearchProps('code'),
        sorter:{
          compare: (a, b) => a.code.localeCompare(b.code),
        },
      },
      {
        title: <center className="dataTable__header__text">Name</center>,
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter:{
          compare: (a, b) => a.name.localeCompare(b.name),
        },
      },
      {
        title: <center className="dataTable__header__text">Weight</center>,
        dataIndex: 'weight',
        key: 'weight',
        ...this.getColumnSearchProps('weight'),
        sorter:{
          compare: (a, b) => a.weight.localeCompare(b.weight),
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

export default ElecTypesDataTable;