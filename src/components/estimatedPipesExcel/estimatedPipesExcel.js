import React from 'react';
import 'antd/dist/antd.css';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import "./estimatedPipesExcel.css"

class EstimatedPipesExcel extends React.Component{
  state = {
    searchText: '',
    searchedColumn: '',
    data: [],
    tab: this.props.currentTab,
    selectedRows: [],
    selectedRowsKeys: [],
    updateData: this.props.updateData,
    username: "",
    acronyms : null,
    diameters: [],
    areas: [],
    trains: ["01", "02", "03", "04", "05"],
    line_refs: [],
    new_data: {},
    warning: false,
    empty: false,
    tags: [],
    designers: [],
    owners: [["", "", ""]]
  };

  async componentDidMount(){

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }


  //Get de las areas para el desplegable de la tabla
  fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/areas", options)
    .then(response => response.json())
    .then(json => {
      let areas_options = []
      for(let i = 0; i < json.length; i++){
        areas_options.push(json[i].name)
      }
      this.setState({areas : areas_options});

  })

  //Get de diametros para el desplegable de la tabla
  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/diameters", options)
  .then(response => response.json())
  .then(json => {
    let diameters = []
    for(let i = 0; i < json.diameters.length; i++){
      diameters.push(json.diameters[i].diameter)
    }
    this.setState({diameters : diameters});

  })

  //Get de las line references para el desplegable de la tabla
  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/lineRefs", options)
  .then(response => response.json())
  .then(json => {
    let line_refs = []
    for(let i = 0; i < json.line_refs.length; i++){
      line_refs.push(json.line_refs[i].line_ref)
    }
    this.setState({line_refs : line_refs});

  })

  //Get de los diseñadores del proyecto para el desplegable de owners
  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/designers", options)
  .then(response => response.json())
  .then(json => {
    let designers = []
    for(let i = 0; i < json.designers.length; i++){
      designers.push(json.designers[i].name)
    }
    this.setState({designers : designers});

  })

  //Get de las lineas modeladas
  await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/modelledEstimatedPipes", options)
  .then(response => response.json())
  .then(async json => {
    let rows = [] 
    let tags = []
    let row = {}
    let tag = ""
    for(let i = 0; i < json.rows.length; i++){ //Por cada linea modelada
      //Creamos la linea en la tabla excel
      row = {"Line reference": json.rows[i].line_reference, "Owner IFC":json.rows[i].owner_ifc, "Owner IsoTracker":json.rows[i].owner_iso, "Unit": json.rows[i].unit, "Area": json.rows[i].area, "Fluid": json.rows[i].fluid, "Seq": json.rows[i].seq, "Spec": json.rows[i].spec, "Type": json.rows[i].type, "Diameter": json.rows[i].diameter, "Insulation": json.rows[i].insulation, "Train": json.rows[i].train, "Status": json.rows[i].status, "id":json.rows[i].id}
      let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/)        
      tag = row[tag_order[0]] + "-" + row[tag_order[1]] + "-" + row[tag_order[2]] + "-" + row[tag_order[3]] + "-" + row[tag_order[4]] + "-" + row[tag_order[5]] + "-" + row[tag_order[6]] + "_" + row[tag_order[7]]  

      row["Tag"] = tag
      rows.push(row)
      tags.push(json.rows[i].tag)
    }
    await this.setState({data: rows, tags: tags})
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


    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/modelledEstimatedPipes", options)
    .then(response => response.json())
    .then(async json => {
      let rows = [] 
      let row = {}
      let tags =[]
      let tag = ""
      for(let i = 0; i < json.rows.length; i++){
        row = {"Line reference": json.rows[i].line_reference, "Owner IFC":json.rows[i].owner_ifc, "Owner IsoTracker":json.rows[i].owner_iso, "Unit": json.rows[i].unit, "Area": json.rows[i].area, "Fluid": json.rows[i].fluid, "Seq": json.rows[i].seq, "Spec": json.rows[i].spec, "Type": json.rows[i].type, "Diameter": json.rows[i].diameter, "Insulation": json.rows[i].insulation, "Train": json.rows[i].train, "Status": json.rows[i].status, "id":json.rows[i].id}
        let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/)        
        tag = row[tag_order[0]] + "-" + row[tag_order[1]] + "-" + row[tag_order[2]] + "-" + row[tag_order[3]] + "-" + row[tag_order[4]] + "-" + row[tag_order[5]] + "-" + row[tag_order[6]] + "_" + row[tag_order[7]]  

        row["Tag"] = tag
        rows.push(row)
        tags.push(json.rows[i].tag)
      }
      await this.setState({data: rows})
    })
  }

}

  addRow(){
    let rows = this.state.data
    rows.push({"Line reference": "", "Tag": "", "Owner IFC": "", "Owner IsoTracker": "", "Unit": "", "Area": "", "Fluid": "", "Seq": "", "Spec": "", "Type": "", "Diameter": "", "Insulation": "", "Train": "", "Status": ""})
    this.setState({data: rows})
  }
  
  async submitChanges(){
    
    let new_rows = []
    Object.entries(this.state.new_data)
    .map( ([key, value]) => new_rows.push(value)) //Por cada linea de la tabla nueva o modificada
    for(let i = 0; i < new_rows.length; i++){
      //Comprobamos que tenga los campos llenos
      if(new_rows[i]["Line reference"] === "" || new_rows[i].Tag === "" || new_rows[i].Unit === "" || new_rows[i].Area === "" || new_rows[i].Fluid === "" || new_rows[i].Seq === "" || new_rows[i].Spec === "" || new_rows[i].Diameter === "" || new_rows[i].Insulation === "" || new_rows[i].Train === "" || new_rows[i]["Line reference"] === null || new_rows[i].Tag === null || new_rows[i].Unit === null || new_rows[i].Area === null || new_rows[i].Fluid === null || new_rows[i].Seq === null || new_rows[i].Spec === null || new_rows[i].Diameter === null || new_rows[i].Insulation === null || new_rows[i].Train === null){
        await this.setState({empty: true})
        new_rows.splice(i, 1)
      }
    }

    const body = {
      rows: new_rows,
      owners: this.state.owners
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
    //Submit de los datos nuevos
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitModelledEstimatedPipes", options)
    .then(response => response.json())
    .then(async json => {
      if(json.success){
        this.props.success()
        
      }
      if(this.state.warning){
        this.props.estimatedWarning()
      }
      if(this.state.empty){
        this.props.estimatedEmpty()
      }
      this.setState({new_data: [], warning: false, empty: false})
    })

    await this.props.updateData()
  }

  handleChange = async(changes, source) =>{ //Este metodo se llama cada vez de que se modifica un campo en la tabla
    if (source !== 'loadData'){ //Si el cambio no se debe a la carga de datos (es decir cuando se ha modificado algo)
      let data_aux = this.state.data
      for(let i = 0; i < changes.length; i+=4){ //Por cada cambio
        if(changes[i][1] === "Owner IFC"){ //No se usa
          let owners = this.state.owners
          owners.push(["IFC", this.state.data[changes[i][0]].Tag, changes[0][3]]) //Guardamos el owner en un array para guardarlo en la bd cuando hagamos el submit
          this.setState({owners: owners})
        }else if(changes[i][1] === "Owner IsoTracker"){ //Si el cambio se ha producido en la columna owner
          let owners = this.state.owners
          owners.push(["ISO",this.state.data[changes[i][0]].Tag, changes[0][3]])
          this.setState({owners: owners})
        }else{ //Si el cambio se ha producido en cualquier otra columna
          let row_id = changes[i][0]
          if(this.state.data[row_id].Status === "MODELLED*" || this.state.data[row_id].Status === "MODELLED"){ //Si la linea estaba modelada
            data_aux[row_id][changes[0][1]] = "##########" //Se pone esto en el campo modificado indicando un error, ya que no se puede modificar una linea modelada
            await this.setState({data: data_aux, warning: true})
          }else{//Si no esta modelada
          let row = this.state.data[row_id]
          if (changes[i][1] === 'Line reference'){ //Si el cambio ha sido en el campo de la line reference
            const options = {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              },
            }
            //Cogemos los datos relacionados a la line reference seleccionada
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getDataByRef/" + changes[i][3], options)
              .then(response => response.json())
              .then(async json => {
                if(json.pipe){
                  //Completamos automaticamente los siguientes campos de la linea
                  data_aux[row_id].Unit = json.pipe[0].unit
                  data_aux[row_id].Fluid = json.pipe[0].fluid
                  data_aux[row_id].Seq = json.pipe[0].seq
                  data_aux[row_id].Spec = json.pipe[0].spec_code
                  data_aux[row_id].Insulation = json.pipe[0].insulation
  
                    if(json.pipe[0].calc_notes !== "NA" && json.pipe[0].calc_notes !== "unset"){ //Obtenemos el tipo de linea
                      data_aux[row_id].Type = "TL3"
                    }else if(process.env.NODE_MMDN === "0"){
                      if(data_aux[row_id].Diameter < 2.00){
                        data_aux[row_id].Type = "TL1"
                      }else{
                        data_aux[row_id].Type = "TL2"
                      }
                    }else{
                      if(data_aux[row_id].Diameter < 50){
                        data_aux[row_id].Type = "TL1"
                      }else{
                        data_aux[row_id].Type = "TL2"
                      }
                    }
  
                await this.setState({data : data_aux})
                }
            })
    
          }
          if(row.Area && row.Diameter && row.Train && row["Line reference"]){ //Si la linea tiene todos los campos llenos (excepto el owner que no es olbigatorio)
            //Generamos el tag
            let tag_order = process.env.REACT_APP_TAG_ORDER.split(/[ -]+/)        
            data_aux[row_id].Tag = row[tag_order[0]] + "-" + row[tag_order[1]] + "-" + row[tag_order[2]] + "-" + row[tag_order[3]] + "-" + row[tag_order[4]] + "-" + row[tag_order[5]] + "-" + row[tag_order[6]] + "_" + row[tag_order[7]]  
          }
          let new_data = this.state.new_data
          if(this.state.tags.indexOf(data_aux[row_id].Tag) > -1 && this.state.tags.indexOf(data_aux[row_id].Tag) !== row_id){ //Si el tag generado ya existe quiere decir que la linea esta repetida
            data_aux[row_id].Tag = "ALREADY EXISTS"
            data_aux[row_id].Area = ""
            data_aux[row_id].Diameter = ""
            data_aux[row_id].Train = ""
            data_aux[row_id].Status = ""
          }else{ //Si no le colocamos el status ESTIMATED y obtenemos el TL
              data_aux[row_id].Status = "ESTIMATED"
              if(data_aux[row_id].Type !== "TL3"){
                if(process.env.NODE_MMDN === "0"){
                  if(data_aux[row_id].Diameter < 2.00){
                    data_aux[row_id].Type = "TL1"
                  }else{
                    data_aux[row_id].Type = "TL2"
                  }
                }else{
                  if(data_aux[row_id].Diameter < 50){
                    data_aux[row_id].Type = "TL1"
                  }else{
                    data_aux[row_id].Type = "TL2"
                  }
                }
              }
            
            new_data[row_id] = row //Finalmente guardamos los cambios en un diccionario para mas tarde hacer el submit
          }
        
          
          await this.setState({data : data_aux, new_data: new_data})
        
          if(!row["Line reference"] && row.id){
            let new_data = this.state.new_data
            new_data[row_id] = {"Line reference": "deleted", id: row.id}
            await this.setState({data : data_aux, new_data: new_data})
          }
        }
        }
        
    }
      
    }
  }


  render() {

    const settings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: [180, 473, 240, 70, 70, 70, 100, 95, 80, 105, 110, 70, 120],
        fontSize: 24
        //... other options
      }
  

      return (
          <div style={{zoom:"0.85"}}>
            <div id="hot-app">
              <HotTable
                data={this.state.data}
                colHeaders={["<b className='header'>Line reference</b>", "<b>Tag</b>", "<b>Owner IsoTracker</b>", "<b>Unit</b>", "<b>Area</b>", "<b>Fluid</b>", "<b>Seq</b>", "<b>Spec</b>", "<b>Type</b>", "<b>Diameter</b>", "<b>Insulation</b>", "<b>Train</b>", "<b>Status</b>"]}
                rowHeaders={true}
                rowHeights="30px"
                columnHeaderHeight={30}
                width="101%"
                height="470"
                settings={settings}
                manualColumnResize={true}
                manualRowResize={true}
                columns= {[{ data: "Line reference", type:'dropdown', source: this.state.line_refs, strict: true}, { data: "Tag", type:'text', readOnly: true}, { data: "Owner IsoTracker", type:'dropdown', source: this.state.designers, strict: true}, { data: "Unit", type:'text', readOnly: true},{ data: "Area", type:'dropdown', source: this.state.areas, strict: true }, { data: "Fluid", type:'text', readOnly: true}, { data: "Seq", type:'text', readOnly: true}, { data: "Spec", type:'text', readOnly: true},  { data: "Type", type:'text', readOnly: true}, { data: "Diameter", type:'dropdown', source: this.state.diameters, strict: true}, { data: "Insulation", type:'text', readOnly: true},{ data: "Train", type:'dropdown', source: this.state.trains, strict: true},{ data: "Status", type:'text', readOnly: true}]}
                filters={true}
                dropdownMenu= {[
                    'make_read_only',
                    '---------',
                    'alignment',
                    '---------',
                    'filter_by_condition',
                    '---------',
                    'filter_operators',
                    '---------',
                    'filter_by_condition2',
                    '---------',
                    'filter_by_value',
                    '---------',
                    'filter_action_bar',
                  ]}
                  afterChange={this.handleChange}
              />
              <br></br>
              <div style={{marginLeft:"695px"}}>
                  <button class="btn btn-sm btn-info" onClick={() => this.addRow()} style={{marginRight:"25px", fontSize:"16px", width:"160px", borderRadius:"10px"}}>Add</button>
                  <button class="btn btn-sm btn-success" onClick={() => this.submitChanges()} style={{marginRight:"5px", fontSize:"16px", width:"160px", borderRadius:"10px"}}>Save</button>
              </div>
              <br></br>
            </div>
          </div>
      );
  }
}

export default EstimatedPipesExcel;