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

class DragAndDrop extends React.Component{

  state = {
    fileList: [],
    success: false,
    error: false,
    pipeError: false,
    ownerError: false,
    uploaded: false,
    errorAlerts: [],
    pipeErrorAlerts: [],
    ownerErrorAlerts: [],
    max: 0,
    uploadingPreview: false,
    uploading: false,
    nSuccess: 0
  };

  async uploadFile(file) {
    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/upload", {
      // content-type header should not be specified!
      method: 'POST',
      body: file,
    })
      .then(response => {
        // Do something with the successful response
        if (response.status === 200){
          let n = this.state.nSuccess
          this.setState({nSuccess: n+1})
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
          let cl = false
          if (i > 0) {
            extension = filename.substring(i+1);
            if(filename.substring(i-2) === 'CL.pdf'){
              cl = true
            }
          }
          if(extension === "pdf" && !cl){
            let body =  {
              fileName: filename,
              user: this.props.user,
              role: this.props.role
            }
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
        }else{
          for (let value of file.values()) {
            let joined = this.state.errorAlerts.concat(value.name);
            this.setState({
              errorAlerts : joined,
              error: true
            })
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

  async updateFile(file) {

    
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
            let joined = this.state.errorAlerts.concat(value.name);
            this.setState({
              errorAlerts : joined,
              error: true
            })
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
      ownerErrorAlerts: [],
      counter: 0,
      max: files.length,
      uploading: true,
      nSuccess: 0
    })

    await allFiles.forEach(file => {
      const formData  = new FormData(); 
      formData.append('file', file.file);  
      if(this.props.mode === "upload"){

        if(process.env.REACT_APP_PROGRESS === "0"){
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/checkOwner/"+file.file.name)
        .then(response => response.json())
        .then(async json =>{
          if(json.owner){
            this.uploadFile(formData);
          }else{
            let joined = this.state.ownerErrorAlerts.concat(file.file.name);
            this.setState({
              ownerErrorAlerts : joined,
              ownerError: true
            })
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
          }
        })
          this.uploadFile(formData);
        }else{
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/checkOwner/"+file.file.name)
        .then(response => response.json())
        .then(async json =>{
          if(json.owner){
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/checkPipe/"+file.file.name)
          .then(response => response.json())
          .then(async json =>{
            if(json.exists){
              this.uploadFile(formData);
            }else{
              let joined = this.state.pipeErrorAlerts.concat(file.file.name);
              this.setState({
                pipeErrorAlerts : joined,
                pipeError: true
              })
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
            }
          })
          }else{
            let joined = this.state.ownerErrorAlerts.concat(file.file.name);
            this.setState({
              ownerErrorAlerts : joined,
              ownerError: true
            })
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
          }
        })
          
        }
        
      }else{
        if(String(this.props.iso).trim() === String(file.file.name.split('.').slice(0, -1)).trim() || 
           String(this.props.iso+'-CL').trim() === String(file.file.name.split('.').slice(0, -1)).trim() ){
          this.updateFile(formData);
        }else{
          let joined = this.state.errorAlerts.concat(file.file.name);
            this.setState({
              errorAlerts : joined,
              error: true,
              uploading: false
            })
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
    const ownerErrorAlerts = this.state.ownerErrorAlerts;
    let errors = []
    let pipeErrors = []
    let ownerErrors =[]
    if(errorAlerts.length > 0){
      for(let i = 0; i < errorAlerts.length; i++){
        
        if (this.props.mode === "upload"){
          errors.push(<Alert severity="error"
          >
            The file {errorAlerts[i]} already exists!

          </Alert>)
        }else{
          errors.push(<Alert severity="error"
          >
            The file {errorAlerts[i]} doesn't belong to this isometric!

          </Alert>)
        }
      }
    }

    if(pipeErrorAlerts.length > 0){
      for(let i = 0; i < pipeErrorAlerts.length; i++){
        
          pipeErrors.push(<Alert severity="error"
          >
            The file {pipeErrorAlerts[i]} doesn't belong to this project!

          </Alert>)
      }
    }

    if(ownerErrorAlerts.length > 0){
      for(let i = 0; i < ownerErrorAlerts.length; i++){
        
          ownerErrors.push(<Alert severity="error"
          >
            The isometric {ownerErrorAlerts[i]} doesn't have an owner!

          </Alert>)
      }
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
            <Alert
            >
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
        <Collapse in={this.state.ownerError}>
          <Collapse in={this.state.uploaded}>
            {ownerErrors}
          </Collapse>
          
        </Collapse>
        <Collapse in={this.state.uploading}>
          <Alert severity="info"
            >
              The files are uploading...

            </Alert>
        </Collapse>
        
      </div>
    )
  }
}

export default DragAndDrop;