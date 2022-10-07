import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class IsoControlNotModelledDataTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    displayData: [],
    filterData: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    tab: this.props.currentTab,
    role: this.props.currentRole,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    filters: []
  };

  unlock(filename){
    this.props.unlock(filename)
  }

  rename(newName, oldName){
    this.props.rename(newName, oldName)
  }

  componentDidMount(){
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getNotModelled", options)
    .then(response => response.json())
    .then(json =>{
        let rows = []
        for(let i = 0; i < json.rows.length; i++){
            
            if(json.rows[i].BOM === "In BOM"){
              json.rows[i].line_id = json.rows[i].bom_unit + json.rows[i].line
              json.rows[i].iso_id = json.rows[i].bom_unit + json.rows[i].area + json.rows[i].line + json.rows[i].train

              json.rows[i].unit = json.rows[i].bom_unit
            }else{
              json.rows[i].line_id = json.rows[i].LDL_unit + json.rows[i].fluid + json.rows[i].seq
              json.rows[i].iso_id = " "

              json.rows[i].unit = json.rows[i].LDL_unit
              json.rows[i].line = json.rows[i].fluid + json.rows[i].seq
              json.rows[i].spec_code = json.rows[i].spec_code_ldl
            }

            if(!json.rows[i].spec_code){
              json.rows[i].spec_code = ""
            }

            if(!json.rows[i].area){
              json.rows[i].area = ""
            }

            if(!json.rows[i].train){
              json.rows[i].train = ""
            }

            if(!json.rows[i].total_weight){
              json.rows[i].total_weight = ""
            }

            if(i % 2 === 0){
                json.rows[i].color = "#fff"
            }else{
                json.rows[i].color = "#eee"
            }
            rows.push(json.rows[i])
        }
        this.setState({data: rows, displayData: rows})
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
          if(this.state.filterData[column] !== "" && this.state.filterData[column] && !auxDisplayData[i][fil].toString().includes(this.state.filterData[column])){
            exists = false
          }
        }else if(this.state.filterData[column]){
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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>


      
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
          


    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text => 
      
      text
    
      
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

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
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Unit" style={{textAlign:"center"}} onChange={(e) => this.filter(5, e.target.value)}/></center>,
        dataIndex: 'unit',
        key: 'unit',
        ...this.getColumnSearchProps('unit'),
        align: "center"
      },
      {
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Area" style={{textAlign:"center"}} onChange={(e) => this.filter(0, e.target.value)}/></center>,
        dataIndex: 'area',
        key: 'area',
        ...this.getColumnSearchProps('area'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Line" style={{textAlign:"center"}} onChange={(e) => this.filter(1, e.target.value)}/></div>,
        dataIndex: 'line',
        key: 'line',
        ...this.getColumnSearchProps('line'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Train Nº" style={{textAlign:"center"}} onChange={(e) => this.filter(2, e.target.value)}/></div>,
        dataIndex: 'train',
        key: 'train',
        ...this.getColumnSearchProps('train'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Line ID" style={{textAlign:"center"}} onChange={(e) => this.filter(11, e.target.value)}/></div>,
        dataIndex: 'line_id',
        key: 'line_id',
        ...this.getColumnSearchProps('line_id'),
        align: "center"
      },
      {
        title: <center className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="ISO ID" style={{textAlign:"center"}} onChange={(e) => this.filter(12, e.target.value)}/></center>,
        dataIndex: 'iso_id',
        key: 'iso_id',
        ...this.getColumnSearchProps('iso_id'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Spec code" style={{textAlign:"center"}} onChange={(e) => this.filter(3, e.target.value)}/></div>,
        dataIndex: 'spec_code',
        key: 'spec_code',
        widht: '10%',
        ...this.getColumnSearchProps('spec_code'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="Total weight" style={{textAlign:"center"}} onChange={(e) => this.filter(4, e.target.value)}/></div>,
        dataIndex: 'total_weight',
        key: 'total_weight',
        ...this.getColumnSearchProps('total_weight'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="BOM" style={{textAlign:"center"}} onChange={(e) => this.filter(10, e.target.value)}/></div>,
        dataIndex: 'BOM',
        key: 'BOM',
        ...this.getColumnSearchProps('BOM'),
        align: "center"
      },
      {
        title: <div className="dataTable__header__text"><input  type="text" className="filter__input" placeholder="LDL" style={{textAlign:"center"}} onChange={(e) => this.filter(9, e.target.value)}/></div>,
        dataIndex: 'LDL',
        key: 'LDL',
        ...this.getColumnSearchProps('LDL'),
        align: "center"
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
        <Table className="customTable" bordered = {true} columns={columns} dataSource={this.state.displayData} scroll={{y:400}} pagination={{disabled:true, defaultPageSize:5000, hideOnSinglePage:true}} size="small" rowClassName= {(record) => record.color.replace('#', '')}/>
          {totalElements}
        </div>
        
      </div>
    );
  }
}

export default IsoControlNotModelledDataTable;