import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import AcceptByPassPopUp from '../acceptByPassPopUp/acceptByPassPopUp';
import EditByPassPopUp from '../editByPassPopUp/editByPassPopUp';
import DeleteByPassPopUp from '../deleteByPassPopUp/deleteByPassPopUp';
import ByPassRejNACommentPopUp from '../byPassRejNACommentPopUp/byPassRejNACommentPopUp';

const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';
    
  var secureStorage = new SecureStorage(localStorage, {
      hash: function hash(key) {
          key = CryptoJS.SHA256(key, SECRET_KEY);
  
          return key.toString();
      },
      encrypt: function encrypt(data) {
          data = CryptoJS.AES.encrypt(data, SECRET_KEY);
  
          data = data.toString();
  
          return data;
      },
      decrypt: function decrypt(data) {
          data = CryptoJS.AES.decrypt(data, SECRET_KEY);
  
          data = data.toString(CryptoJS.enc.Utf8);
  
          return data;
      }
  });

class ByPassDataTable extends React.Component{
    state = {
      searchText: '',
      searchedColumn: '',
      data: [],
      displayData: [],
      filterData: ["", "", "", "", "", ""],
      role: secureStorage.getItem("role"),
      user: secureStorage.getItem("user"),
      tab: this.props.currentTab,
      updateData: this.props.updateData,
      popup: false,
      filters: []
    };

  updateData() {
    this.setState({data : []})
    this.props.updateD()
  }

  success(){
    //this.props.successAlert()
  }


  componentDidMount(){
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getByPassData", options)
        .then(response => response.json())
        .then(async json => {
          let row = {}
          let rows = []
          for(let i = 0; i < json.rows.length; i++){
            row = {key:json.rows[i].id, tag: json.rows[i].tag, isoid: json.rows[i].isoid, type: json.rows[i].type, date: json.rows[i].date.toString().substring(0,10) + " "+ json.rows[i].date.toString().substring(11,19), user: json.rows[i].user, notes: json.rows[i].note, comments: json.rows[i].comments, status: json.rows[i].status, actions: null}
            
            if(i % 2 === 0){
              row["color"] = "#fff"
            }else{
              row["color"] = "#eee"
            }

            if(secureStorage.getItem("role") === "ProjectAdmin" && row.status === "Pending"){
              row.actions = <div style={{display: "flex"}}><button button className="ready__btn btn-sm btn-success" style={{width:"60px", marginRight:"5px"}} onClick={() => this.approve(json.rows[i].id)}>Approve</button><ByPassRejNACommentPopUp type={"Reject"} tag={json.rows[i].tag} id={json.rows[i].id} rejectByPass={this.rejectByPass.bind(this)}/><ByPassRejNACommentPopUp type={"N/A"} tag={json.rows[i].tag} id={json.rows[i].id} naByPass={this.naByPass.bind(this)}/></div>
            }else if(json.rows[i].email === secureStorage.getItem("user") && row.status === "Pending"){
              let type = 1
              if(json.rows[i].type === "Equipment"){
                  type = 2
              }else if(json.rows[i].type === "Material"){
                  type = 3
              }else if(json.rows[i].type === "PID"){
                  type = 4
              }
              row.actions = <div style={{display: "flex"}}><EditByPassPopUp success={() => this.props.success()} id={json.rows[i].id} tag={json.rows[i].tag} type={type} note={json.rows[i].note} editByPass={(type, notes, id) => this.props.editByPass(type, notes, id)}/><DeleteByPassPopUp deleteByPass={(id) => this.props.deleteByPass(id)} tag={json.rows[i].tag} id={json.rows[i].id}/></div>
            }else if(json.rows[i].email === secureStorage.getItem("user") && (row.status === "Approved/CODE3" || row.status === "Approved/IFC")){
              row.actions = <button className="ready__btn btn-sm btn-success"  style={{fontWeight: "bold", marginRight:"5px", width:"60px"}} onClick={() => this.closeByPass(json.rows[i].id)}>Close</button>
            }else if(json.rows[i].status === "Approved"){
              row.actions = <div style={{display: "flex"}}><AcceptByPassPopUp success={() => this.props.success()} id={json.rows[i].id} tag={json.rows[i].tag}/></div>
            }

            rows.push(row)
          }
          const filterRow = [{key:0, tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(0, e.target.value)}/></div>, isoid: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2, e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(4,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(6, e.target.value)}/></div>}]
                
          this.setState({data : rows, selectedRows: [], displayData: rows});
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
      fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getByPassData", options)
          .then(response => response.json())
          .then(async json => {
            let row = {}
            let rows = []
            for(let i = 0; i < json.rows.length; i++){
              row = {key:json.rows[i].id, tag: json.rows[i].tag, isoid: json.rows[i].isoid, type: json.rows[i].type, date: json.rows[i].date.toString().substring(0,10) + " "+ json.rows[i].date.toString().substring(11,19), user: json.rows[i].user, notes: json.rows[i].note, comments: json.rows[i].comments, status: json.rows[i].status, actions: null}
              
              if(i % 2 === 0){
                row["color"] = "#fff"
              }else{
                row["color"] = "#eee"
              }
  
              if(secureStorage.getItem("role") === "ProjectAdmin" && row.status === "Pending"){
                row.actions = <div style={{display: "flex"}}><button button className="ready__btn btn-sm btn-success" style={{width:"60px", marginRight:"5px"}} onClick={() => this.approve(json.rows[i].id)}>Approve</button><ByPassRejNACommentPopUp type={"Reject"} tag={json.rows[i].tag} id={json.rows[i].id} rejectByPass={this.rejectByPass.bind(this)}/><ByPassRejNACommentPopUp type={"N/A"} tag={json.rows[i].tag} id={json.rows[i].id} naByPass={this.naByPass.bind(this)}/></div>
              }else if(json.rows[i].email === secureStorage.getItem("user") && row.status === "Pending"){
                let type = 1
                if(json.rows[i].type === "Equipment"){
                    type = 2
                }else if(json.rows[i].type === "Material"){
                    type = 3
                }else if(json.rows[i].type === "PID"){
                    type = 4
                }
                row.actions = <div style={{display: "flex"}}><EditByPassPopUp success={() => this.props.success()} id={json.rows[i].id} tag={json.rows[i].tag} type={type} note={json.rows[i].note} editByPass={(type, notes, id) => this.props.editByPass(type, notes, id)}/><DeleteByPassPopUp deleteByPass={(id) => this.props.deleteByPass(id)} tag={json.rows[i].tag} id={json.rows[i].id}/></div>
              }else if(json.rows[i].email === secureStorage.getItem("user") && (row.status === "Approved/CODE3" || row.status === "Approved/IFC")){
                row.actions = <button className="ready__btn btn-sm btn-success"  style={{marginRight:"5px", width:"60px", fontWeight: "bold"}} onClick={() => this.closeByPass(json.rows[i].id)}>Close</button>
              }else if(json.rows[i].status === "Approved"){
                row.actions = <div style={{display: "flex"}}><AcceptByPassPopUp success={() => this.props.success()} id={json.rows[i].id} tag={json.rows[i].tag}/></div>
              }
  
              rows.push(row)
            }
            const filterRow = [{key:0, tag: <div><input type="text" className="filter__input" placeholder="TAG" onChange={(e) => this.filter(0, e.target.value)}/></div>, isoid: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(1, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(2, e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(4,e.target.value)}/></div>, status: <div><input type="text" className="filter__input" placeholder="Status" onChange={(e) => this.filter(6, e.target.value)}/></div>}]
                  
            this.setState({data : rows, selectedRows: [], displayData: rows});
            await this.setState({filters : filterRow})
          })
    }
  }


  async rejectByPass(id, comments){
    const body ={
      id : id,
      comments: comments
    }
    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/rejectByPass", options)
        .then(response => response.json())
        .then(async json => {
          if(json.success){
            this.props.success()
          }
        })
  }

  async naByPass(id, comments){
    const body ={
      id : id,
      comments: comments
    }
    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/naByPass", options)
        .then(response => response.json())
        .then(async json => {
          if(json.success){
            this.props.success()
          }
        })
  }  

  async closeByPass(id){
    const body ={
      id : id,
    }
    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/closeByPass", options)
        .then(response => response.json())
        .then(async json => {
          if(json.success){
            this.props.success()
          }
        })
  }

  async approve(id){
    const body ={
      id : id,
    }
    const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/acceptByPass", options)
        .then(response => response.json())
        .then(async json => {
          if(json.success){
            this.props.success()
          }
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-2; column ++){
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
        ids.push(selectedRows[i].id.props.children)
      }
      this.setState({
        selectedRowsKeys: selectedRowKeys,
        selectedRows: selectedRows
      })
      this.props.onChange(ids);
    };


  render() {

    let columns = [
      {
        title: <center className="dataTable__header__text">TAG</center>,
        dataIndex: 'tag',
        key: 'tag',
        width: '6%',
        ...this.getColumnSearchProps('tag'),
        sorter:{
          compare: (a, b) => a.tag.localeCompare(b.tag),
        },
      },
      {
        title: <div className="dataTable__header__text">Iso ID</div>,
        dataIndex: 'isoid',
        key: 'isoid',
        ...this.getColumnSearchProps('isoid'),
        sorter: {
          compare: (a, b) => { return a.isoid.localeCompare(b.isoid)},
        },
      },
      {
        title: <center className="dataTable__header__text">Type</center>,
        dataIndex: 'type',
        key: 'type',
        width: '6%',
        ...this.getColumnSearchProps('type'),
        sorter:{
          compare: (a, b) => a.type.localeCompare(b.type),
        },
      },
      {
        title: <center className="dataTable__header__text">Date</center>,
        dataIndex: 'date',
        key: 'date',
        width: '10%',
        ...this.getColumnSearchProps('date'),
        sorter:{
          compare: (a, b) => a.date.localeCompare(b.date),
        },
      },
      {
        title: <div className="dataTable__header__text">User</div>,
        dataIndex: 'user',
        key: 'user',
        ...this.getColumnSearchProps('user'),
        sorter: {
          compare: (a, b) =>  a.user.localeCompare(b.user),
        },
      },
      {
        title: <div className="dataTable__header__text">Notes</div>,
        dataIndex: 'notes',
        key: 'notes',
        width:'29%',
      },
      {
        title: <div className="dataTable__header__text">Comments</div>,
        dataIndex: 'comments',
        key: 'comments',
      },
      {
        title: <div className="dataTable__header__text">Status</div>,
        dataIndex: 'status',
        key: 'status',
        width:'9%',
        ...this.getColumnSearchProps('status'),
        sorter: {
          compare: (a, b) => a.status.type - b.status.type,
        },
      },
      {
        title: <div className="dataTable__header__text">Actions</div>,
        dataIndex: 'actions',
        key: 'actions',
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
        <div className="dataTable__container">
        <Table className="customTable" style={{ height: '430px' }} bordered = {true} columns={columns} dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
        <Table className="filter__table" pagination={{disabled:true}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/>
          {totalElements}
        </div>
      </div>
    );
  }
}

export default ByPassDataTable;