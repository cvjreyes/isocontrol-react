import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import Highlighter from 'react-highlight-words';
import './binTable.css'
import { Link } from 'react-router-dom';


class BinTable extends React.Component{
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
    filters: []
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
                    var row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from, user: this.state.acronyms[json.rows[i].role] + " - " + json.rows[i].user}
                 
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

  componentDidUpdate(prevProps, prevState){

    if(prevProps !== this.props){
      
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
                      var row = {key:i, id: <Link onClick={() => this.getMaster(json.rows[i].filename)}>{json.rows[i].filename}</Link> , type: json.rows[i].code, revision: "*R" + json.rows[i].revision, date: json.rows[i].updated_at.toString().substring(0,10) + " "+ json.rows[i].updated_at.toString().substring(11,19), from: json.rows[i].from, user: this.state.acronyms[json.rows[i].role] + " - " + json.rows[i].user}
                   
                      rows.push(row)                
                  }
                  this.setState({
                    data : rows,
                  });

                  let auxDisplayData = this.state.data
                  let resultData = []
                  let fil, exists = null
                  for(let i = 0; i < auxDisplayData.length; i++){
                    exists = true
                    for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
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
      for(let column = 0; column < Object.keys(auxDisplayData[i]).length-1; column ++){
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
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
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
        width: '23%',
        ...this.getColumnSearchProps('id'),
        sorter:{
          compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
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
        title: <center className="dataTable__header__text">Revision</center>,
        dataIndex: 'revision',
        key: 'revision',
        width: '8%',
        ...this.getColumnSearchProps('revision'),
        sorter:{
          compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
        },
      },
      {
        title: <div className="dataTable__header__text">Date</div>,
        dataIndex: 'date',
        key: 'date',
        width: '20%',
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
        sorter: {
          compare: (a, b) => { return a.user.localeCompare(b.user)},
        },
      },
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
          title: <center className="dataTable__header__text">Revision</center>,
          dataIndex: 'revision',
          key: 'revision',
          width: '8%',
          ...this.getColumnSearchProps('revision'),
          sorter:{
            compare: (a, b) => a.id.props.children.localeCompare(b.id.props.children),
          },
        },
        {
          title: <div className="dataTable__header__text">Date</div>,
          dataIndex: 'date',
          key: 'date',
          width: '20%',
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
          sorter: {
            compare: (a, b) => { return a.user.localeCompare(b.user)},
          },
        },
      ];
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
        <div className="dataTable__container">
        <Table className="customTable" bordered = {true} rowSelection={{type: 'checkbox', ...rowSelection}} style={{ height: '430px' }} columns={columns} dataSource={this.state.displayData} scroll={{y:330}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small"/>
        <Table className="filter__table" pagination={{disabled:true}} rowSelection={{type: 'checkbox', ...rowSelectionFilter}} scroll={{y:400}} showHeader = {false} bordered = {true} columns={columns} dataSource={this.state.filters} size="small"/> 
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default BinTable;