import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './onHoldTable.css'
import { Link } from 'react-router-dom';
import CommentPopUp from '../commentPopUp/commentPopUp';
import HoldsPopUp from '../holdsPopUp/holdsPopUp';

class OnHoldTable extends React.Component{
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
    currentRole: this.props.currentRole
  };


  componentDidMount(){
    
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/roles/acronyms")
    .then(response => response.json())
    .then(json => {
      let dict = {}
      
      for(let i = 0; i < json.length; i++){
        dict[json[i].name] = json[i].code
      }
      this.setState({
        acronyms: dict
      })
    })

    if(process.env.REACT_APP_PROGRESS === "1"){
      const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
      }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/holds", options)
            .then(response => response.json())
            .then(async json => {
                    var rows = []
                    for(let i = 0; i < json.rows.length; i++){
                      if(json.rows[i].onhold !== 2){
                        if(json.rows[i].filename){
                          var holds = [json.rows[i].hold1, json.rows[i].hold2, json.rows[i].hold3, json.rows[i].hold4, json.rows[i].hold5, json.rows[i].hold6, json.rows[i].hold7, json.rows[i].hold8, json.rows[i].hold9, json.rows[i].hold10]
                          var descriptions = [json.rows[i].description1, json.rows[i].description2, json.rows[i].description3, json.rows[i].description4, json.rows[i].description5, json.rows[i].description6, json.rows[i].description7, json.rows[i].description8, json.rows[i].description9, json.rows[i].description10]
      
                          let user = null
                          if(json.rows[i].role && json.rows[i].user){
                            user = <div style={{textAlign:"left", display:"flex"}}>{this.state.acronyms[json.rows[i].role] + " - " + json.rows[i].user}</div>
                          }
                          var row = null
                          if(this.state.currentRole === "SpecialityLead"){
                            row = {key:i,  id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].to, user: user, holds: <div><HoldsPopUp isoid={json.rows[i].isoid} tag={json.rows[i].iso_tag} holds = {holds} descriptions = {descriptions}/> <button class="csp_exclude_btn btn-sm btn-warning" onClick={() => this.excludeHold(json.rows[i].filename)}>EXCLUDE</button></div>}
                          }else{
                            row = {key:i,  id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].to, user: user, holds: <div><HoldsPopUp isoid={json.rows[i].isoid} tag={json.rows[i].iso_tag} holds = {holds} descriptions = {descriptions}/> </div>}
                          }
                          
                      
                          rows.push(row)   
                        }else{
                          var holds = [json.rows[i].hold1, json.rows[i].hold2, json.rows[i].hold3, json.rows[i].hold4, json.rows[i].hold5, json.rows[i].hold6, json.rows[i].hold7, json.rows[i].hold8, json.rows[i].hold9, json.rows[i].hold10]
                          var descriptions = [json.rows[i].description1, json.rows[i].description2, json.rows[i].description3, json.rows[i].description4, json.rows[i].description5, json.rows[i].description6, json.rows[i].description7, json.rows[i].description8, json.rows[i].description9, json.rows[i].description10]
  
                          var row = {key:i,  id: json.rows[i].isoid, type: "", revision: "", date: "", from: "", user: "", holds: <HoldsPopUp isoid={json.rows[i].isoid} tag={json.rows[i].iso_tag} holds = {holds} descriptions = {descriptions}/>}
                          
                          rows.push(row) 
                        }
                      }
                                     
                    }
                    
                    const filterRow = [{key:0, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(0, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, revision: <div><input type="text" className="filter__input" placeholder="Revision" onChange={(e) => this.filter(2,e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, from: <div><input type="text" className="filter__input" placeholder="From" onChange={(e) => this.filter(4,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(5,e.target.value)}/></div>}]
                
                    this.setState({data : rows, selectedRows: [], displayData: rows});
                    await this.setState({filters : filterRow})
    
                }
            )
            .catch(error => {
                console.log(error);
            })  
      }else{
        
        
        const body ={
          currentTab : this.props.currentTab
        }
        const options = {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/files", options)
              .then(response => response.json())
              .then(async json => {
                      var rows = []
                      for(let i = 0; i < json.rows.length; i++){
                          var row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from, user: <div style={{textAlign:"left", display:"flex"}}>{this.state.acronyms[json.rows[i].role] + " - " + json.rows[i].user} <CommentPopUp comments={json.rows[i].comments} filename={json.rows[i].filename} updated={json.rows[i].updated_at}/></div>}
                      
                          rows.push(row)                
                      }
                      
                      const filterRow = [{key:0, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(0, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, revision: <div><input type="text" className="filter__input" placeholder="Revision" onChange={(e) => this.filter(2,e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, from: <div><input type="text" className="filter__input" placeholder="From" onChange={(e) => this.filter(4,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(5,e.target.value)}/></div>}]
                
                    this.setState({data : rows, selectedRows: [], displayData: rows});
                    await this.setState({filters : filterRow})

                  }
          )
          .catch(error => {
              console.log(error);
          })
        }

    
  }

  componentDidUpdate(prevProps, prevState){

    if(prevProps !== this.props){
      if(process.env.REACT_APP_PROGRESS === "1"){
        const options = {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
        }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/holds", options)
              .then(response => response.json())
              .then(async json => {
                      var rows = []
                     
                      for(let i = 0; i < json.rows.length; i++){
                        if(json.rows[i].onhold !== 2){
                          if(json.rows[i].filename){
                            var holds = [json.rows[i].hold1, json.rows[i].hold2, json.rows[i].hold3, json.rows[i].hold4, json.rows[i].hold5, json.rows[i].hold6, json.rows[i].hold7, json.rows[i].hold8, json.rows[i].hold9, json.rows[i].hold10]
                            var descriptions = [json.rows[i].description1, json.rows[i].description2, json.rows[i].description3, json.rows[i].description4, json.rows[i].description5, json.rows[i].description6, json.rows[i].description7, json.rows[i].description8, json.rows[i].description9, json.rows[i].description10]
        
                            let user = null
                          if(json.rows[i].role && json.rows[i].user){
                            user = <div style={{textAlign:"left", display:"flex"}}>{this.state.acronyms[json.rows[i].role] + " - " + json.rows[i].user}</div>
                          }
                            if(this.state.currentRole === "SpecialityLead"){
                              row = {key:i,  id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].to, user: user, holds: <div><HoldsPopUp isoid={json.rows[i].isoid} tag={json.rows[i].iso_tag} holds = {holds} descriptions = {descriptions}/> <button class="csp_exclude_btn btn-sm btn-warning" onClick={() => this.excludeHold(json.rows[i].filename)}>EXCLUDE</button></div>}
                            }else{
                              row = {key:i,  id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].to, user: user, holds: <div><HoldsPopUp isoid={json.rows[i].isoid} tag={json.rows[i].iso_tag} holds = {holds} descriptions = {descriptions}/> </div>}
                            }
                        
                            rows.push(row)   
                          }else{
                            var holds = [json.rows[i].hold1, json.rows[i].hold2, json.rows[i].hold3, json.rows[i].hold4, json.rows[i].hold5, json.rows[i].hold6, json.rows[i].hold7, json.rows[i].hold8, json.rows[i].hold9, json.rows[i].hold10]
                            var descriptions = [json.rows[i].description1, json.rows[i].description2, json.rows[i].description3, json.rows[i].description4, json.rows[i].description5, json.rows[i].description6, json.rows[i].description7, json.rows[i].description8, json.rows[i].description9, json.rows[i].description10]
    
                            var row = {key:i,  id: json.rows[i].isoid, type: "", revision: "", date: "", from: "", user: "", holds: <HoldsPopUp isoid={json.rows[i].isoid} tag={json.rows[i].iso_tag} holds = {holds} descriptions = {descriptions}/>}
                            
                            rows.push(row) 
                          }
                        }
                                       
                      }
                      
                      const filterRow = [{key:0, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(0, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, revision: <div><input type="text" className="filter__input" placeholder="Revision" onChange={(e) => this.filter(2,e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, from: <div><input type="text" className="filter__input" placeholder="From" onChange={(e) => this.filter(4,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(5,e.target.value)}/></div>}]
                  
                      this.setState({data : rows, selectedRows: [], displayData: rows});
                      await this.setState({filters : filterRow})
      
                  }
              )
              .catch(error => {
                  console.log(error);
              })  
        }else{
          
          
          const body ={
            currentTab : this.props.currentTab
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/files", options)
                .then(response => response.json())
                .then(async json => {
                        var rows = []
                        for(let i = 0; i < json.rows.length; i++){
                            var row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from, user: <div style={{textAlign:"left", display:"flex"}}>{this.state.acronyms[json.rows[i].role] + " - " + json.rows[i].user} <CommentPopUp comments={json.rows[i].comments} filename={json.rows[i].filename} updated={json.rows[i].updated_at}/></div>}
                        
                            rows.push(row)                
                        }
                        
                        const filterRow = [{key:0, id: <div><input type="text" className="filter__input" placeholder="ISO ID" onChange={(e) => this.filter(0, e.target.value)}/></div>, type: <div><input type="text" className="filter__input" placeholder="Type" onChange={(e) => this.filter(1, e.target.value)}/></div>, revision: <div><input type="text" className="filter__input" placeholder="Revision" onChange={(e) => this.filter(2,e.target.value)}/></div>, date: <div><input type="text" className="filter__input" placeholder="Date" onChange={(e) => this.filter(3,e.target.value)}/></div>, from: <div><input type="text" className="filter__input" placeholder="From" onChange={(e) => this.filter(4,e.target.value)}/></div>, user: <div><input type="text" className="filter__input" placeholder="User" onChange={(e) => this.filter(5,e.target.value)}/></div>}]
                  
                      this.setState({data : rows, selectedRows: [], displayData: rows});
                      await this.setState({filters : filterRow})
  
                    }
            )
            .catch(error => {
                console.log(error);
            })
          }
      }

  }

  async excludeHold(fileName){
    this.props.excludeHold(fileName)
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
        if(fil === "id" && auxDisplayData[i][fil].props){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children.includes(this.state.filterData[column])){
            exists = false
          }  
        }else if(fil === "user" && process.env.REACT_APP_PROGRESS === "0"){
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].props.children[0].includes(this.state.filterData[column])){
            exists = false
          } 
        }else{
          if(auxDisplayData[i][fil]){
            if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].includes(this.state.filterData[column])){
              exists = false
            }
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
        title: <center className="dataTable__header__text">ISO ID</center>,
        dataIndex: 'id',
        key: 'id',
        ...this.getColumnSearchProps('id'),
        
      },
      {
        title: <div className="dataTable__header__text">Type</div>,
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type'),
        sorter: {
          compare: (a, b) => { return a.type.localeCompare(b.type)},
        },
        width: "160px"
      },
      {
        title: <center className="dataTable__header__text">Revision</center>,
        dataIndex: 'revision',
        key: 'revision',
        ...this.getColumnSearchProps('revision'),
        sorter:{
          compare: (a, b) => a.revision.localeCompare(b.revision),
        },
        width: "160px"
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'date',
        key: 'date',
        ...this.getColumnSearchProps('date'),
        sorter: {
          compare: (a, b) => a.date.replace(/\D/g,'') - b.date.replace(/\D/g,''),
        },
        sortOrder: 'descend'
      },
      {
        title: <div className="dataTable__header__text">From</div>,
        dataIndex: 'from',
        key: 'from',
        ...this.getColumnSearchProps('from'),
        sorter: {
          compare: (a, b) => { return a.from.localeCompare(b.from)},
        },
      },
      {
        title: <div className="dataTable__header__text">User</div>,
        dataIndex: 'user',
        key: 'user',
        ...this.getColumnSearchProps('user'),
        width: "500px"
      },
      {
        title: <div className="dataTable__header__text">Holds</div>,
        dataIndex: 'holds',
        key: 'holds',
        width: "150px"
      },
    ];

    

    if(process.env.REACT_APP_PROGRESS === "0"){
      columns = [
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
        },
        {
          title: <div className="dataTable__header__text">Date</div>,
          dataIndex: 'date',
          key: 'date',
          ...this.getColumnSearchProps('date'),
          sorter: {
            compare: (a, b) => a.date.replace(/\D/g,'') - b.date.replace(/\D/g,''),
          },
        },
        {
          title: <div className="dataTable__header__text">From</div>,
          dataIndex: 'from',
          key: 'from',
          ...this.getColumnSearchProps('from'),
          sorter: {
            compare: (a, b) => { return a.from.localeCompare(b.from)},
          },
        },
        {
          title: <div className="dataTable__header__text">User</div>,
          dataIndex: 'user',
          key: 'user',
          ...this.getColumnSearchProps('user'),
        },
      ];
    }
    

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
      table = <Table className="customTable" bordered = {true} columns={columns} style={{ height: '430px' }}  dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small"/>
    }else{
      table = <Table className="customTable" bordered = {true} rowSelection={{type: 'checkbox', ...rowSelection}} columns={columns} style={{ height: '430px' }}  dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small"/>
    }

    return (
      <div>
        {this.state.updateData}
        <div className="dataTable__container">
          {table}
          <Table className="filter__table" pagination={{disabled:true}}  scroll={{y:330}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/> 
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default OnHoldTable;