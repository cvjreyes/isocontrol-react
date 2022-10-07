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

class UpdateMassive extends React.Component{

  state = {
    fileList: [],
    success: false,
    error: false,
    pipeError: false,
    uploaded: false,
    errorAlerts: [],
    pipeErrorAlerts: [],
    max: 0,
    uploadingPreview: false,
    uploading: false,
    nSuccess: 0,
    userFiles: []
  };

  async componentDidMount(){
    const body ={
        currentRole : this.props.role,
        currentUser: this.props.user
      }
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }
      fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getFilenamesByUser", options)
      .then(response => response.json())
      .then(json =>{
        let files = json.files
        let isos = []
        for(let i = 0; i < files.length; i++){
            isos.push(files[i].isoid)
            isos.push(files[i].isoid + "-CL")
        }
        this.setState({userFiles: isos})
      })
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
    let userFiles = this.state.userFiles
    this.setState({
      success: false,
      uploaded: false,
      error: false,
      pipeError: false,
      errorAlerts: [],
      pipeErrorAlerts: [],
      counter: 0,
      max: files.length,
      uploading: true,
      nSuccess: 0,
      userFiles: userFiles
    })

    await allFiles.forEach(file => {
      const formData  = new FormData(); 
      formData.append('file', file.file);  
     
        if(this.state.userFiles.indexOf(String(file.file.name.split('.').slice(0, -1)).trim()) > -1){
          this.updateFile(formData);
        }else{
          
          let joined = this.state.errorAlerts;
          joined.push(file.file.name)
            this.setState({
              errorAlerts : joined,
              error: true,
              uploading: false
            })
        
      }
      file.remove();
    });    
    await this.setState({
      uploaded: true,
    })

  }

  render(){
    const errorAlerts = this.state.errorAlerts;
    const pipeErrorAlerts = this.state.pipeErrorAlerts;
    let errors = []
    let pipeErrors = []
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
            The file {errorAlerts[i]} doesn't belong to any of your isometrics!

          </Alert>)
        }
      }
    }

    if(pipeErrorAlerts.length > 0){
      for(let i = 0; i < pipeErrorAlerts.length; i++){
        
          pipeErrors.push(<Alert severity="error"
          >
            The file {pipeErrorAlerts[i]} doesn't belong to any of your isometrics!

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
          height: '250px'
        },
        dropzoneActive: {
          height: '300px'
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

export default UpdateMassive;