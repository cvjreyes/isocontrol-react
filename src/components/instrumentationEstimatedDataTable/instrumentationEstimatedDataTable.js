import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';

class InstrumentationEstimatedDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", "", "", "", "", "", ""],
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


    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrumentation/steps", options)
    .then(response => response.json())
    .then(async json => {
      let percentages = []
      for(let i = 0; i < json.rows.length; i++){
        percentages.push(json.rows[i].percentage)
      }
      await this.setState({steps : percentages});
    }) 


    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrumentation/estimated", options)
      .then(response => response.json())
      .then(async json => {
        var rows = []
        var row = null
        
        for(let i = 0; i < json.rows.length; i++){
            let mod = 0
            if(json.rows[i].modelled){
              mod = json.rows[i].modelled
            }
            if(i % 2 === 0){
              row = {area: json.rows[i].area, type: json.rows[i].type, quantity: json.rows[i].quantity, modelled: mod, color: "#fff"}
            }else{
              row = {area: json.rows[i].area, type: json.rows[i].type, quantity: json.rows[i].quantity, modelled: mod, color: "#eee"}
            }
            
            for(let j = 0; j < this.state.steps.length; j++){
              let currentStep = this.state.steps[j].toString()
              row[currentStep] = json.rows[i][currentStep]
            }
            rows.push(row)
        }
        let filterRow = [{area: <div><input type="text" className="filter__input" placeholder="Area" onChange={(e) => this.filter(0, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, quantity: <div><input type="text" className="filter__input" placeholder="Qty" onChange={(e) => this.filter(2,e.target.value)}/></div>, modelled: <div><input type="text" className="filter__input" placeholder="Modelled" onChange={(e) => this.filter(3,e.target.value)}/></div>}]
        for(let j = 0; j < this.state.steps.length; j++){
          let currentStep = this.state.steps[j].toString()
          filterRow[0][currentStep] =  <div><input type="text" className="filter__input" placeholder={currentStep+"%"} onChange={(e) => this.filter(j+4,e.target.value)}/></div>
        }
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
        let keys = Object.keys(auxDisplayData[i])
        keys.pop()
        fil = keys[(column+this.state.steps.length) % keys.length]
       
        if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
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
        title: <center className="dataTable__header__text">Type</center>,
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        sorter:{
          compare: (a, b) => a.type.localeCompare(b.type),
        },
      },
      {
        title: <div className="dataTable__header__text">Qty</div>,
        dataIndex: 'quantity',
        key: 'quantity',
        ...this.getColumnSearchProps('quantity'),
        sorter: {
          compare: (a, b) => a.quantity-b.quantity,
        },
      },
      {
        title: <div className="dataTable__header__text">Modelled</div>,
        dataIndex: 'modelled',
        key: 'modelled',
        ...this.getColumnSearchProps('modelled'),
        sorter: {
          compare: (a, b) => a.modelled-b.modelled,
        },
      },
    ];
    
    for(let i = 0; i < this.state.steps.length; i++){
      let index = this.state.steps[i]
      columns.push({
        title: <div className="dataTable__header__text">{this.state.steps[i]}%</div>,
        dataIndex: index,
        key: index,
        ...this.getColumnSearchProps(index),
        sorter: {
          compare: (a, b) => a[index] - b[index],
        },
      })
    }

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
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.displayData}  style={{ height: '500px' }} scroll={{y:400}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small"
         rowClassName= {(record) => record.color.replace('#', '')}/>
         <Table className="filter__table" pagination={{disabled:true}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>

          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default InstrumentationEstimatedDataTable;