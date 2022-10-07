import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';


class ModelledDataTable extends React.Component{ //Tabla de las lineas modeladas
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

  unlock(isoid){
    this.props.unlock(isoid)
  }

  componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    //Get de las lineas modeladas
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/modelled", options)
      .then(response => response.json())
      .then(async json => {
        var rows = []
        var row = null
        for(let i = 0; i < json.rows.length; i++){
            row = {id: json.rows[i].isoid, tag: json.rows[i].tag, type: json.rows[i].code.toString()}
            console.log(json.rows[i].blocked)
            if(json.rows[i].blocked === 1 && this.props.role === "SpecialityLead"){
              console.log("ASD")
              row.id = <div>{json.rows[i].isoid} <button className="btn btn-success" onClick={()=>this.unlock(json.rows[i].isoid)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px",  marginLeft:"10px"}}>UNLOCK</button></div>
            }
            if(row){
              if(i % 2 === 0){
                row["color"] = "#fff"
              }else{
                row["color"] = "#eee"
              }
            }
            if(row.id && row.tag){
              rows.push(row)
            }
            
            }
        
            let filterRow = [{tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(0, e.target.value)}/></div>, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2,e.target.value)}/></div>}]
             
            this.setState({data : rows, role: this.props.role, displayData: rows});
            await this.setState({filters : filterRow})

    }) 
  }

  componentDidUpdate(prevProps, prevState){

    if(prevProps !== this.props){
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/modelled", options)
      .then(response => response.json())
      .then(async json => {
        var rows = []
        var row = null
        for(let i = 0; i < json.rows.length; i++){
            row = {id: json.rows[i].isoid, tag: json.rows[i].tag, type: json.rows[i].code.toString()}
            if(json.rows[i].blocked === 1 && this.props.role === "SpecialityLead"){
              row.id = <div>{json.rows[i].isoid} <button className="btn btn-success" onClick={()=>this.unlock(json.rows[i].isoid)} style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px",  marginLeft:"10px"}}>UNLOCK</button></div>
            }
            if(row){
              if(i % 2 === 0){
                row["color"] = "#fff"
              }else{
                row["color"] = "#eee"
              }
            }
            if(row.id && row.tag){
              rows.push(row)
            }
            
            }
        
            let filterRow = [{tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(0, e.target.value)}/></div>, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2,e.target.value)}/></div>}]
             
            this.setState({data : rows, role: this.props.role, displayData: rows});
            await this.setState({filters : filterRow})

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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
        fil = Object.keys(auxDisplayData[i])[column]
        if(fil === "tag"){
          fil = "id"
        }else if(fil === "id"){
          fil = "tag"
        }
        if(auxDisplayData[i][fil].props){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[0].includes(this.state.filterData[column])){
            exists = false
          }        
        }else if(auxDisplayData[i][fil]){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
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
        title: <center className="dataTable__header__text">TAG</center>,
        dataIndex: 'tag',
        key: 'tag',
        ...this.getColumnSearchProps('tag'),
        sorter:{
          compare: (a, b) => a.tag.localeCompare(b.tag),
        },
      },
      {
        title: <center className="dataTable__header__text">ISO ID</center>,
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
        sorter:{
          compare: (a, b) => a.id.localeCompare(b.id),
        },
      },
      {
        title: <div className="dataTable__header__text">Type</div>,
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        sorter: {
          compare: (a, b) => a.type.localeCompare(b.type),
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
        <div className="dataTable__container" style={{float:"top", position:"relative"}}>
        <Table className="customTable" style={{ height: '430px' }} bordered = {true}  columns={columns} dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default ModelledDataTable;