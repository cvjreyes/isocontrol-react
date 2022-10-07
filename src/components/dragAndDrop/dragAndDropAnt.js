//Drag and drop para subir isometricas

import React from 'react';
import 'antd/dist/antd.css';
import { Upload, message} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse'


class DragAndDrop extends React.Component{

  state = {
    fileList: [],
    success: false,
    error: false,
    uploaded: false,
    errorAlerts: [],
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
              fileName: filename,
              user: this.props.user,
            }
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadHis", {
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
        let aux = this.state.fileList;
        aux.splice(0,1)
        this.setState({
          fileList: aux,
        });
        let max = this.state.fileList.length;
        if (max === 0){
          this.setState({
            uploaded: true
          })
        }

      })
      .catch(error => message.error(error)
    );
  }

  handleUpload = () =>{
    this.setState({
      success: false,
      uploaded: false,
      error: false,
      errorAlerts: [],
      counter: 0
    })

    this.state.fileList.forEach(file => {

      const formData  = new FormData();
      formData.append('file', file);
      this.uploadFile(formData);

    });    
  }

render (){
  
  const fileList = this.state.fileList;
  const errorAlerts = this.state.errorAlerts;
  const { Dragger } = Upload;

  let errors = []
  for(let i = 0; i < errorAlerts.length; i++){
    let extension = "";
    let j = errorAlerts[i].lastIndexOf('.');
    if (j > 0) {
      extension = errorAlerts[i].substring(j+1);
    }
    if (extension === 'zip' || extension === 'pdf' ){
      errors.push(<Alert severity="error"
      >
        The file {errorAlerts[i]} already exists!

      </Alert>)
    }else{
      errors.push(<Alert severity="error"
      >
        The file {errorAlerts[i]} has an invalid format!

      </Alert>)
    }
  }

  const props = {
    name: 'file',
    multiple: true,
    action: "http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/upload",
    onRemove: file => {
      this.setState(state => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },
    beforeUpload: file => {
      this.setState(state => ({
        fileList: [...state.fileList, file],
        success: false,
        error: 0,
        uploaded: false
      }));

      return false;
      },
    accept: ".pdf,.zip",
      fileList
    };

      return(
          <div>
            <button onClick={this.handleUpload} class="btn btn-info btn-lg" style={{backgroundColor: "#17a2b8", width:"100%"}}>Upload files</button>
              <Dragger {...props}>
                
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag the isometrics to this area to upload</p>
                  <p className="ant-upload-hint">
                    You can drop single or multiple isometrics
                  </p>
              </Dragger>,
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
          </div>
      );
      }
}

export default DragAndDrop;


