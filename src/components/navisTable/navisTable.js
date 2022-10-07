import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as FileSaver from "file-saver";


class NavisTable extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
  };

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }

    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/navis", options)
    .then(response => response.json())
    .then(json => {
        let rows = []
        for(let i = 0; i < json.rows.length; i++){
            if(i % 2 === 0){
                rows.push({key:i, object: json.rows[i].object, attribute: json.rows[i].value, color:"#fff"})
              }else{
                rows.push({key:i, object: json.rows[i].object, attribute: json.rows[i].value, color:"#eee"})              }
            
        }
        this.setState({data : rows});
    })

    
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

    this.setState({
      selectedRowsKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
    //this.setState({ selectedRows: selectedRows });
    //this.props.onChange(ids);
    
  };

  generateXML(){
    let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n    <exchange xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://download.autodesk.com/us/navisworks/schemas/nw-exchange-12.0.xsd">\n      <optionset name="">\n           <optionset name="interface">\n              <optionset name="smart_tags">\n                     <option name="enabled">\n                           <data type="bool">true</data>\n                     </option>\n                     <option name="hide_category" flags="32">\n                           <data type="bool">false</data>\n                     </option>\n                     <optionarray name="definitions">\n'
    
    for(let i = 0; i < this.state.selectedRows.length; i++){
        let option = this.state.selectedRows[i].attribute.toLowerCase()
        xml+= '                                 <optionset name="">\n                                       <option name="category">\n                                          <data type="name">\n                                              <name internal="lcldrvm_props">PDMS</name>\n                                          </data>\n                                       </option>\n                                       <option name="property">\n                                          <data type="name">\n                                              <name internal="lcldrvm_prop_'+option+'">'+option.toUpperCase()+'</name>\n                                          </data>\n                                       </option>\n                                </optionset>\n'
    }
    xml+='                  </optionarray>\n               </optionset>\n         </optionset>\n      </optionset>\n  </exchange>'
    const data = new Blob([xml], { type: 'txt' });
    FileSaver.saveAs(data, "navis.xml");
}
  

  render() {
    
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


    const columns = [
      {
        title: <center className="dataTable__header__text">Object 3D</center>,
        dataIndex: 'object',
        key: 'object',
        width: '15%',
        ...this.getColumnSearchProps('object'),
        sorter:{
          compare: (a, b) => a.object.localeCompare(b.object),
        },
        align: "center"
      },
      {
        title: <center className="dataTable__header__text">Attribute</center>,
        dataIndex: 'attribute',
        key: 'attribute',
        ...this.getColumnSearchProps('attribute'),
        sorter:{
          compare: (a, b) => a.attribute.localeCompare(b.attribute),
        },
      },
      
    ];
    

    return (
      <div>

          <button className="btn btn-warning" style={{width:"78%", fontSize:"24px", top:"0",left:"11%",zIndex:"999", backgroundColor:"#CBB956", position:"fixed", color:"white", paddingTop:"13px", paddingBottom:"13px"}} onClick={()=> this.generateXML()}>Generate XML</button>

        <div className="estimatedDataTable__container" style={{marginTop:"5px"}}>
        <Table className="customTable" bordered = {true} columns={columns} rowSelection={{type: 'checkbox', ...rowSelection}} dataSource={this.state.data} pagination={{ pageSize: this.state.data.length  }} size="small"
         rowClassName= {(record) => record.color.replace('#', '')}/>
        </div>
        
      </div>
    );
  }
}

export default NavisTable;