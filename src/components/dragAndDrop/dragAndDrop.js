import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import React from 'react'
import {message} from'antd'
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse'

const Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
  return (
    <div>
      
      {submitButton}
      <div {...dropzoneProps}>
      
      {previews}
      {files.length < maxFiles && input}
        
      </div>

      
    </div>
  )
}

const validIsometricPdf = new RegExp("^[a-zA-Z0-9_-]+.(pdf)$")
const validIsometric = new RegExp("^[a-zA-Z0-9_-]+")

class DragAndDrop extends React.Component{

  state = {
    fileList: [],
    success: false,
    error: false,
    pipeError: false,
    uploaded: false,
    errorAlerts: [],
    pipeErrorAlerts: [],
    caracterError: false,
    caracterErrorAlert: [],
    max: 0,
    uploadingPreview: false,
    uploading: false,
    nSuccess: 0,
  };

  async uploadFile(file) {//Subida de un archivo al storage
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/upload", {
      // content-type header should not be specified!
      method: 'POST',
      body: file,
    })
      .then(response => {
        // Do something with the successful response
        if (response.status === 200){ //Si se ha subido con exito
          let n = this.state.nSuccess
          this.setState({nSuccess: n+1})
          if(!this.state.success){
              this.setState({
                success : true,
              })
          }

          let filename = null;
          for (let value of file.values()){          
            console.log("NOmbre archivo sin puntos: " + value.name);
            filename = value.name
          }

          let extension = "";
          let i = filename.lastIndexOf('.');
          let cl = false
          if (i > 0) {
            extension = filename.substring(i+1);
            if(filename.substring(i-2) === 'CL.pdf'){
              cl = true
            }
          }
          if(extension === "pdf" && !cl){ //Si lo que hemos subido es un master
            let body =  {
              fileName: filename,
              user: this.props.user,
              role: this.props.role
            }
            //Post del upload
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadHis", {
              // content-type header should not be specified!
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify(body)
            }).catch(error =>console.log(error))
          }
        }else{ //Si no se ha subido correctamente
          for (let value of file.values()) {
            if(validIsometricPdf.test(value.name) === false){
              let joined = this.state.caracterErrorAlert.concat(value.name);
              this.setState({
                caracterErrorAlert : joined,
                //error: false,
                caracterError: true,
              })
            } else {
              let joined = this.state.errorAlerts.concat(value.name);
              this.setState({
                errorAlerts : joined,
                error: true,
                //caracterError: false,
              })
            }
          }
        }
        let max = this.state.max - 1
        this.setState({
          max: max
        })
        if (max === 0){ //si ya se han subido todas mostramos alerta de success
          this.setState({
            uploaded: true,
            uploading: false
          })
          if(this.state.nSuccess > 0){
            let body =  {
              n: this.state.nSuccess
            }
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadNotifications", {
              // content-type header should not be specified!
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify(body)
            }).catch(error =>console.log(error))
          }    

        }
        
      })
      .catch(error => message.error(error)
    );
    this.props.uploaded()
  }

  async updateFile(file) { //Como upload pero para isos ya existentes

    //Post del update
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/update", {
      // content-type header should not be specified!
      method: 'POST',
      body: file,
    })
      .then(response => {
        // Do something with the successful response
        if (response.status === 200){
          if(!this.state.success){
              this.setState({
                success : true,
              })
          }

          let filename = null;
          for (let value of file.values()){
            filename = value.name
          }
          let extension = "";
          let i = filename.lastIndexOf('.');
          if (i > 0) {
            extension = filename.substring(i+1);
          }
          if(extension === "pdf"){
            let body =  {
              file: filename,
              user: this.props.user,
              role: this.props.role
            }
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateHis", {
              // content-type header should not be specified!
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
            }).then(response => console.log(response.json()))
            .catch(error => message.error(error))
          }
        }else{
          for (let value of file.values()) {
            if(validIsometricPdf.test(value.name) === false){
              let joined = this.state.caracterErrorAlert.concat(value.name);
              this.setState({
                caracterErrorAlert : joined,
                //error: false,
                caracterError: true,
              })
            } else {
              let joined = this.state.errorAlerts.concat(value.name);
              this.setState({
                errorAlerts : joined,
                error: true,
                //caracterError: false,
              })
            }
          }
        }
        let max = this.state.max - 1
        this.setState({
          max: max
        })
        
        if (max === 0){
          this.setState({
            uploaded: true,
            uploading: false
          })
        }
        
      })
      .catch(error => message.error(error)
    );
  }


  handleSubmit = async (files, allFiles) => {

    this.setState({
      success: false,
      uploaded: false,
      error: false,
      pipeError: false,
      errorAlerts: [],
      pipeErrorAlerts: [],
      caracterError: false,
      caracterErrorAlert:[],
      counter: 0,
      max: files.length,
      uploading: true,
      nSuccess: 0,
    })

    await allFiles.forEach(file => { //Para cada archivo se hace el upload o update
      const formData  = new FormData(); 
      formData.append('file', file.file);  
      if(this.props.mode === "upload"){
        if(process.env.REACT_APP_PROGRESS === "0"){
          this.uploadFile(formData);
        }else{
          if(validIsometricPdf.test(file.file.name) === false){
            let joinedCaracter = this.state.caracterErrorAlert.concat(file.file.name);
            console.log("Entra 1: " + this.state.caracterErrorAlert.concat(file.file.name));
            console.log("Joined caracter: " + joinedCaracter);
            this.setState({
              caracterErrorAlert: joinedCaracter,
              //error: false,
              caracterError: true,
              uploading: false
            })
            console.log("Caracter error alert: " + this.state.caracterErrorAlert);
            let max = this.state.max - 1
            this.setState({
              max: max
            })
            if (max === 0){
              this.setState({
                uploaded: true,
                uploading: false,
              })
            }
          } else {
            //Comprobamos que la linea existe en dpipes si el proyecto tiene progreso
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/checkPipe/"+file.file.name)
            .then(response => response.json())
            .then(async json =>{
              if(json.exists){
                this.uploadFile(formData);
              }else{
                if(validIsometricPdf.test(file.file.name) === false){
                  let joined = this.state.caracterErrorAlert.concat(file.file.name);
                  console.log("Entra 2: " + joined);
                  this.setState({
                    caracterErrorAlert : joined,
                    //pipeError: false,
                    caracterError: true,
                    uploading: false
                  })
                } else {
                  let joined = this.state.pipeErrorAlerts.concat(file.file.name);
                  console.log("Entra 3: " + joined);
                  this.setState({
                    pipeErrorAlerts : joined,
                    pipeError: true,
                    //caracterError: false,
                    uploading: false
                  })
                  console.log("Pipe error alert: " + this.state.pipeErrorAlerts);
                }
                let max = this.state.max - 1
                this.setState({
                  max: max
                })
                if (max === 0){
                  this.setState({
                    uploaded: true,
                    uploading: false,
                  })
                }
              }
            })
          }
        }
        
      }else{
        if(String(this.props.iso).trim() === String(file.file.name.split('.').slice(0, -1)).trim() || 
           String(this.props.iso+'-CL').trim() === String(file.file.name.split('.').slice(0, -1)).trim() ){
          this.updateFile(formData);
        }else{
          if(validIsometricPdf.test(file.file.name) === false){
            let joined = this.state.caracterErrorAlert.concat(file.file.name);
            this.setState({
              caracterErrorAlert : joined,
              //pipeError: false,
              caracterError: true,
              uploading: false,
            })
          } else {
            let joined = this.state.errorAlerts.concat(file.file.name);
              this.setState({
                errorAlerts : joined,
                error: true,
                //caracterError: false,
                uploading: false,
              })
          }
        }
      }
      file.remove();
    });    
    this.setState({
      uploaded: true
    })
    if(this.props.mode === "upload"){
      this.props.uploaded()
    }
    

  }

  render(){

    const errorAlerts = this.state.errorAlerts;
    const pipeErrorAlerts = this.state.pipeErrorAlerts;
    const caracterErrorAlert = this.state.caracterErrorAlert

    let errors = []
    let pipeErrors = []
    let caracterError = []

    if(errorAlerts.length > 0){
      for(let i = 0; i < errorAlerts.length; i++){
        if (this.props.mode === "upload"){
          
          errors.push(<Alert severity="error">
                        The file {errorAlerts[i]} already exists!
                      </Alert>)
          
        }else{
          
          errors.push(<Alert severity="error">
                        The file {errorAlerts[i]} doesn't belong to this isometric!
                      </Alert>)
          
        }
      }
    }

    console.log("pipeErrorAlerts: " + pipeErrorAlerts);
    if(pipeErrorAlerts.length > 0){
      for(let i = 0; i < pipeErrorAlerts.length; i++){
      
        pipeErrors.push(<Alert severity="error">
                          The file {pipeErrorAlerts[i]} doesn't belong to this project!
                        </Alert>)
        
      }
      console.log("For pipe: " + pipeErrors);
    }
    
    console.log("caracterErrorAlert: " + caracterErrorAlert);
    if(caracterErrorAlert.length > 0){
      for(let i = 0; i < caracterErrorAlert.length; i++){
      
        caracterError.push(<Alert severity="error">
                          The file {caracterErrorAlert[i]} has special caracters not allowed!
                        </Alert>)
        
      }
      console.log("For caracter: " + caracterError);
    }

    let inputContent = null
    let styles = null

    if(this.props.mode === "upload"){
      inputContent = "Drop isometrics here"
      styles = {
        dropzone: {
          maxHeight: '400px',
        },
      }
    }else{
      inputContent = "Drop the files to update"
      styles = {
        dropzone: {
          height: '350px'
        },
        dropzoneActive: {
          height: '350px'
        },
        previewContainer:{
          height: '2px'
        }
    }
    
  }
    return (
      <div>
        <Dropzone
          LayoutComponent={Layout}
          onSubmit={this.handleSubmit}
          inputContent= {inputContent}
          styles={styles}
        />

        <Collapse in={this.state.success}>
          <Collapse in={this.state.uploaded}>
            <Alert>
              The files have been uploaded!
            </Alert>
          </Collapse>
        </Collapse>

        <Collapse in={this.state.error}>
          <Collapse in={this.state.uploaded}>
            {errors}
          </Collapse>
        </Collapse>

        <Collapse in={this.state.pipeError}>
          <Collapse in={this.state.uploaded}>
            {pipeErrors}
          </Collapse>
        </Collapse>

        <Collapse in={this.state.caracterError}>
          <Collapse in={this.state.uploaded}>
            {caracterError}
          </Collapse>
        </Collapse>

        <Collapse in={this.state.uploading}>
          <Alert severity="info">
            The files are uploading...
          </Alert>
        </Collapse>
        
      </div>
    )
  }
}

export default DragAndDrop;