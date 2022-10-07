import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import warningIT from "../../assets/images/warningIT.png"
import "./pipingDataTable.css"

class PipingDataTable extends React.Component{ //Tabla de lineas modeladas tipo isotracker
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", "", ""],
    tab: this.props.currentTab,
    role: this.props.currentRole,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    filters: []
  }; 

  async componentDidMount(){
    this.props.loading(true)
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }
    //Get de las lineas en funcion del tab
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPipesByStatus/" + this.props.currentTab, options)
        .then(response => response.json())
        .then(async json => {
            let rows = []
            if(json.rows){
              for(let i = 0; i < json.rows.length; i++){
                let iButton, vButton, naButton, claimedBtn, notInSDesignButton;
                if(json.rows[i].valves === 1){ //Comprobamos si tiene valvulas
                  vButton = <button className="btn btn-success" disabled onClick={() => this.vCancelClick(json.rows[i].id)}style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>V</button>
                }else{
                  vButton = <button className="btn btn-warning" disabled onClick={() => this.vClick(json.rows[i].id)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>V</button>
                }

                if(json.rows[i].instruments === 1){ //Comprobamos si tiene instrumentos
                  iButton = <button className="btn btn-success" disabled onClick={() => this.iCancelClick(json.rows[i].id)}style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>I</button>
                }else{
                  iButton = <button className="btn btn-warning" disabled onClick={() => this.iClick(json.rows[i].id)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>I</button>
                }

                if(json.rows[i].instruments === 2){ //Comprobamos si tiene n/a
                  naButton = <button className="btn btn-success" disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>N/A</button>
                }else{
                  naButton = <button className="btn btn-success" disabled style={{backgroundColor:"white", color:"black", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>N/A</button>
                }

                if(json.rows[i].isotracker === "In IsoTracker" && json.rows[i].progress !== 100){ //Comprobamos si la iso correspondiente a la linea se ha subido a isotracker
                  notInSDesignButton = <img src={warningIT} alt="warning" className="warningIT__image" />
                }else{
                  notInSDesignButton = null
                }

                if(json.rows[i].name){ //Miramos si esta reclamada
                  claimedBtn = <button className="btn btn-success"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px"}}>CLAIMED</button>
                }

                let row = {key: json.rows[i].id, id: json.rows[i].id, tag: json.rows[i].tag, type: json.rows[i].code, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), user: json.rows[i].name, isotracker: json.rows[i].isotracker, actions: <div>{claimedBtn} {vButton} {iButton} {naButton} {notInSDesignButton}</div>}
                
                if((json.rows[i].valves !== 0 || json.rows[i].instruments !== 0) && this.state.tab !== "PipingSDesign"){ //Indicamos el progreso de la linea
                  if(row.type === "TL1"){
                    row.progress = json.rows[i].progress + 33 + "% (" + (json.rows[i].stage1 + 1) + ")"
                  }else if(row.type === "TL2"){
                    row.progress = json.rows[i].progress + 20 + "% (" + (json.rows[i].stage1 + 1) + ")"
                  }else{
                    row.progress = json.rows[i].progress + 10 + "% (" + (json.rows[i].stage1 + 1) + ")"
                  }              
                }else{
                  row.progress = json.rows[i].progress + "% (" + json.rows[i].stage1 + ")"
                }
                
                if(row){
                    if(i % 2 === 0){
                        row["color"] = "#fff"
                    }else{
                        row["color"] = "#eee"
                    }
                }
                
                rows.push(row)
              }
            }
            
            const filterRow = [{tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2, e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(4,e.target.value)}/></div>, isotracker: <div><input type="text" className="filter__input" placeholder="IsoTracker" onChange={(e) => this.filter(5,e.target.value)}/></div>, progress: <div><input type="text" className="filter__input" placeholder="Progress" onChange={(e) => this.filter(7,e.target.value)}/></div>}]
                
            this.setState({data : rows, displayData: rows});
            await this.setState({filters : filterRow})
            this.props.loading(false)
        })
  }

  async componentDidUpdate(prevProps, prevState){
    if(prevProps.currentTab !== this.props.currentTab || prevProps.updateData !== this.props.updateData){
      this.props.loading(true)
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getPipesByStatus/" + this.props.currentTab, options)
        .then(response => response.json())
        .then(async json => {
            let rows = []
            if(json.rows){
              for(let i = 0; i < json.rows.length; i++){
                let iButton, vButton, claimedBtn, naButton, notInSDesignButton;
                if(json.rows[i].valves === 1){
                  vButton = <button className="btn btn-success" disabled onClick={() => this.vCancelClick(json.rows[i].id)}style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>V</button>
                }else{
                  vButton = <button className="btn btn-warning" disabled onClick={() => this.vClick(json.rows[i].id)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>V</button>
                }

                if(json.rows[i].instruments === 1){
                  iButton = <button className="btn btn-success" disabled onClick={() => this.iCancelClick(json.rows[i].id)}style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>I</button>
                }else{
                  iButton = <button className="btn btn-warning" disabled onClick={() => this.iClick(json.rows[i].id)}style={{backgroundColor:"white", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"40px"}}>I</button>
                }

                if(json.rows[i].instruments === 2){
                  naButton = <button className="btn btn-success" disabled style={{fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"60px"}}>N/A</button>
                }else{
                  naButton = <button className="btn btn-success" disabled style={{backgroundColor:"white",color:"black", fontSize:"12px", borderColor:"black", padding:"2px 5px 2px 5px", width:"60px"}}>N/A</button>
                }

                if(json.rows[i].isotracker === "In IsoTracker" && json.rows[i].progress !== 100){
                  notInSDesignButton = <img src={warningIT} alt="warning" className="warningIT__image" />
                }else{
                  notInSDesignButton = null
                }

                if(json.rows[i].name){
                  claimedBtn = <button className="btn btn-success"  disabled style={{fontSize:"12px", padding:"2px 5px 2px 5px", marginRight: "5px"}}>CLAIMED</button>
                }
                
                let row = {key: json.rows[i].id, id: json.rows[i].id, tag: json.rows[i].tag, type: json.rows[i].code, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), user: json.rows[i].name, isotracker: json.rows[i].isotracker, actions: <div>{claimedBtn} {vButton} {iButton} {naButton} {notInSDesignButton}</div>}
                
                if((json.rows[i].valves !== 0 || json.rows[i].instruments !== 0) && this.state.tab !== "PipingSDesign"){
                  if(row.type === "TL1"){
                    row.progress = json.rows[i].progress + 33 + "% (" + (json.rows[i].stage1 + 1) + ")"
                  }else if(row.type === "TL2"){
                    row.progress = json.rows[i].progress + 20 + "% (" + (json.rows[i].stage1 + 1) + ")"
                  }else{
                    row.progress = json.rows[i].progress + 10 + "% (" + (json.rows[i].stage1 + 1) + ")"
                  }
                }else{
                  row.progress = json.rows[i].progress + "% (" + json.rows[i].stage1 + ")"
                }

                if(row){
                    if(i % 2 === 0){
                        row["color"] = "#fff"
                    }else{
                        row["color"] = "#eee"
                    }
                }
                
                rows.push(row)
              }
            }
                
            this.setState({data : rows, displayData: rows});
            this.props.loading(false)
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
        fil = Object.keys(auxDisplayData[i])[column+1]
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
      ids.push(selectedRows[i].id)
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
      getCheckboxProps: (record) => record.user ?(
        {
        
        disabled: true,
        // Column configuration not to be checked
        name: record.name,
      }) : ({
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
        sorter:{
          compare: (a, b) => a.tag.props.children.localeCompare(b.tag.props.children),
        },
      },
      {
        title: <center className="dataTable__header__text">Type</center>,
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        width: "100px",
        sorter:{
          compare: (a, b) => { return a.type.localeCompare(b.type)},
        },
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'date',
        key: 'date',
        ...this.getColumnSearchProps('date'),
        width:"200px",
        sorter: {
          compare: (a, b) => a.date.replace(/\D/g,'') - b.date.replace(/\D/g,''),
        },
      },
      {
        title: <div className="dataTable__header__text">User</div>,
        dataIndex: 'user',
        key: 'user',
        ...this.getColumnSearchProps('user'),
        sorter: {
          compare: (a, b) => { return a.user.localeCompare(b.user)},
        },
      },
      {
        title: <div className="dataTable__header__text">Progress</div>,
        dataIndex: 'progress',
        key: 'progress',
        ...this.getColumnSearchProps('isotracker'),
        width: "120px",
        sorter: {
          compare: (a, b) => { return a.progress.localeCompare(b.progress)},
        },
      },
      {
        title: <div className="dataTable__header__text">IsoTracker</div>,
        dataIndex: 'isotracker',
        key: 'isotracker',
        ...this.getColumnSearchProps('isotracker'),
        sorter: {
          compare: (a, b) => { return a.isotracker.localeCompare(b.isotracker)},
        },
      },
      {
        title: <div className="dataTable__header__text">Actions</div>,
        dataIndex: 'actions',
        key: 'actions',
        width: "300px",
        ...this.getColumnSearchProps('actions'),
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
        <div className="dataTable__container">
        <Table className="customTable" bordered = {true} rowSelection={{type: 'checkbox', ...rowSelection}} style={{ height: '430px', marginTop: "-30px" }} columns={columns} dataSource={this.state.displayData} scroll={{y:437}} pagination={{disabled:true, defaultPageSize:5000}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} rowSelection={{type: 'checkbox', ...rowSelectionFilter}} scroll={{y:437}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/> 
          {totalElements}
        </div>
      </div>
    );
  }
}

export default PipingDataTable;