import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import IsoControlHoldsPopUp from '../isoControlHoldsPopUp/isoControlHoldsPopUp';

class IsoControlHoldsDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", ""],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    filters: [],
    currentRole: this.props.currentRole,
  };

  constructor(props){
    super(props)
    this.update = this.update.bind(this)
  }


  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    //Get de los holds de isocontrol
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/modelledEstimatedHolds", options)
    .then(response => response.json())
    .then(async json => {
      let rows = [] 
      for(let i = 0; i < json.rows.length; i++){
          rows.push({tag: json.rows[i].tag, holds: <IsoControlHoldsPopUp tag = {json.rows[i].tag} update={this.update} updateData={this.props.updateData}/>})
          /*
          if(!json.has_roles && !json.description){
            row["holds"] = <IsoControlHoldsPopUp tag={json.rows[i].tag} holds = {holds} descriptions = {descriptions}/>
          }else if(json.has_roles && !json.description){

          }else if(!json.has_roles && json.description){

          }else{

          }*/
      }
      const filterRow = [{key: 0, tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(0, e.target.value)}/></div>}]
      await this.setState({data: rows, displayData: rows, filters: filterRow})
    })
  }

  async componentDidUpdate(prevProps, prevState){
    if(prevProps !== this.props){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
    
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/modelledEstimatedHolds", options)
        .then(response => response.json())
        .then(async json => {
          let rows = [] 
          for(let i = 0; i < json.rows.length; i++){
              rows.push({tag: json.rows[i].tag, holds: <IsoControlHoldsPopUp tag = {json.rows[i].tag} update={this.update}/>})
          }
          const filterRow = [{key: 0, tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(0, e.target.value)}/></div>}]
          await this.setState({data: rows, displayData: rows, filters: filterRow})
        })
      }

  }

  async update(){
    await this.props.updateDataMethod()
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length; column ++){
          
        fil = Object.keys(auxDisplayData[i])[column]
       
        if(auxDisplayData[i][fil]){
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
    const selectedRows = this.state.selectedRows;
    const selectedRowsKeys = this.state.selectedRowsKeys;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: (record) => (      
        {
        
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
    if(localStorage.getItem("update") === "true"){
      this.setState({
        selectedRows: [],
        selectedRowsKeys: []
      })
      rowSelection.selectedRowKeys = []
      rowSelection.selectedRows = []
      localStorage.setItem("update", false)
    }else{
      rowSelection.selectedRowKeys = selectedRowsKeys 
      rowSelection.selectedRows = selectedRows;
    }  
    
    
    let columns = [
      {
        title: <center className="dataTable__header__text">TAG</center>,
        dataIndex: 'tag',
        key: 'tag',
        ...this.getColumnSearchProps('tag'),
        
      },
      {
        title: <div className="dataTable__header__text">Holds</div>,
        dataIndex: 'holds',
        key: 'holds',
        width: "150px"
      },
    ];    

    var totalElements = null
    if (this.state.data.length === 0){
      totalElements = null;
    }else{
      totalElements = (<div style={{position: "absolute", bottom: 25, left:0}}>
      <b>Total elements: {this.state.data.length}</b>
     </div>);
    }

    let table = null
    if(process.env.REACT_APP_PROGRESS === "1"){
      table = <Table className="customTable" bordered = {true} columns={columns} style={{ height: '400px' }}  dataSource={this.state.displayData} scroll={{y:300}} pagination={{disabled:true, defaultPageSize:5000}} size="small"/>
    }else{
      table = <Table className="customTable" bordered = {true} rowSelection={{type: 'checkbox', ...rowSelection}} columns={columns} style={{ height: '400px' }}  dataSource={this.state.displayData} scroll={{y:437}} pagination={{disabled:true, defaultPageSize:5000}} size="small"/>
    }

    return (
      <div>
        {this.state.updateData}
        <div className="dataTable__container">
          {table}
          <Table className="filter__table" pagination={{disabled:true}}  scroll={{y:437}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/> 
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default IsoControlHoldsDataTable;