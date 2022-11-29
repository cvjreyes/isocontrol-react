import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './uploadProcInst.css'
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse'

export default class UploadProcInst extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            visibleAccept: false,
            visibleDenied: false,
            file : null,
            role: this.props.role,
            user: this.props.currentUser,
            error: false,
            validFile: false
        }
        this.id = props.id;

    }
   
    onFileChange = event => {

        console.log("Nombre del archivo: " + event.target.files[0].name);
        console.log("Nombre del titulo del modal: " + this.id[0] + '.pdf');
        if(event.target.files[0].name === this.id[0] + '.pdf'){
            this.setState({
                validFile: true,
                file: event.target.files[0],
                error: false
            })
        } else {
            this.setState({
                validFile: false,
                error: true
            })
        }
        console.log("Validez: " + this.state.validFile);
        this.setState({ file: event.target.files[0]});
    };

    async accept(){
        if(this.state.file){
            if(this.id[0] + '.pdf' === this.state.file.name){
                
                const file  = new FormData(); 
                file.append('file', this.state.file); 
                const body = {
                    file: this.state.file.name,
                    action: "accept",
                    user: this.state.user,
                    role: this.state.role
                }
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
                console.log("Datos del Archivo: " + JSON.stringify(options));
                
                if(this.state.role === "Process"){
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadProc", {
                    // content-type header should not be specified!
                    method: 'POST',
                    body: file,
                    })
                    .then(response => {
                        // Do something with the successful response
                        this.setState({
                            file: null,
                            error: false
                        })
                        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/process", options)
                            .then(response => {
        
                                this.closeModal()
                                this.props.update()
                                this.props.success()
                            })            
                            
                    })
                    .catch(error => console.log(error)
                    );
                }else if(this.state.role === "Instrument"){
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadInst", {
                        // content-type header should not be specified!
                        method: 'POST',
                        body: file,
                        })
                        .then(response => {
                            // Do something with the successful response
                            this.setState({
                                file: null,
                                error: false
                            })
                            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrument", options)
                                .then(response => {
            
                                    this.closeModal()
                                    this.props.update()
                                    this.props.success()
                                })            
                                
                        })
                        .catch(error => console.log(error)
                        );
                }
        
                
            }else{
                this.setState({error: true})
            }
            
        }
        
    }

    async deny(){
        if(this.state.file){
            if(this.id[0] + '.pdf' === this.state.file.name){
                const file  = new FormData(); 
                file.append('file', this.state.file); 
                
                const body = {
                    file: this.state.file.name,
                    action: "deny",
                    user: this.state.user,
                    role: this.state.role
                }
    
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }

                if(this.state.role === "Process"){
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadProc", {
                    // content-type header should not be specified!
                    method: 'POST',
                    body: file,
                    })
                    .then(response => {
                        // Do something with the successful response
                        this.setState({
                            file: null,
                            error: false
                        })
                        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/process", options)
                            .then(response => {
        
                                this.closeModal()
                                this.props.update()
                                this.props.success()
                            })            
                            
                    })
                    .catch(error => console.log(error)
                    );
                }else if(this.state.role === "Instrument"){
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/uploadInst", {
                        // content-type header should not be specified!
                        method: 'POST',
                        body: file,
                        })
                        .then(response => {
                            // Do something with the successful response
                            this.setState({
                                file: null,
                                error: false
                            })
                            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrument", options)
                                .then(response => {
            
                                    this.closeModal()
                                    this.props.update()
                                    this.props.success()
                                })            
                                
                        })
                        .catch(error => console.log(error)
                        );
                }
        
                
            }else{
                this.setState({error: true})
            }
            
        }
    }

    openModal() {      
        this.setState({
            visible : true,
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            error: false
        });
    }

    openModalSeguroAccept() {      
        this.setState({
            visibleAccept : true,
        });
    }

    closeModalSeguroAccept() {
        this.setState({
            visibleAccept : false,
            error: false
        });
    }

    openModalSeguroDenied() {      
        this.setState({
            visibleDenied : true,
        });
    }

    closeModalSeguroDenied() {
        this.setState({
            visibleDenied : false,
            error: false
        });
    }

    render() {
        return (
            // <section>
            //     <input type="button"  value="UPLOAD" className="btn btn-warning"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#B0E0E6", borderColor:"#B0E0E6", width:"100px", float:"left", marginRight:"5px"}} onClick={() => this.openModal()} />
            //     <div>
            //         <Modal visible={this.state.visible} width="650" height="430" effect="fadeInUp" onClickAway={() => this.closeModal()}>
            //         <button onClick={() => this.closeModal()} style={{marginTop:"5px", fontSize:"16px", position:"absolute", right:"10px", backgroundColor:"transparent", border:"None"}}>X</button>

            //             <div className="popUpP__container" >

            //                 <center className="popUpP__title"><h1>{this.id}</h1></center>
            //                 <form>
            //                     <div class="form-group">
            //                         <center>
            //                             <input type="file" onChange={this.onFileChange} className="inputFile__container" id="exampleFormControlFile1"></input>
            //                             <Collapse in={this.state.error}>
            //                                 <Alert severity="error" style={{left: "180px",position: "absolute"}}
            //                                 >
            //                                 The file doesn't match the isometric!

            //                                 </Alert>
            //                             </Collapse>
            //                         </center>
            //                     </div>
            //                 </form>
            //             </div>
            //             <center className="popUpP__warning__title">***WARNING!*** This action may replace the current appended file. Take appropiate cautions.</center>
            //             <center className="popUpP__warning__subtitle">If you are not sure of this action, click cancel and contact your supervisor.</center>
                        // <div className="popUpP__buttons__container">
                        //     <button class="btn btn-sm btn-success" onClick={() => this.accept()} style={{marginRight:"40px", fontSize:"16px", width:"200px"}}>Accept</button>
                        //     <button class="btn btn-sm btn-danger" onClick={() => this.deny()} style={{marginRight:"5px", fontSize:"16px", width:"200px"}}>Deny</button>
                        // </div>
            //         </Modal>
            //     </div>
            // </section>

            <section >
                <input type="button"  value="UPLOAD" className="btn btn-warning"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#B0E0E6", borderColor:"#B0E0E6", width:"100px", float:"left", marginRight: "5px", marginTop:"3px"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center className="popUp__title">{this.id}</center>
                                
                        </div>
                        <div className="popUpP__container">
                            <form>
                                <div class="form-group">
                                    <center>
                                        <input type="file" onChange={this.onFileChange} className="inputFile__container" id="exampleFormControlFile1"></input>
                                        <Collapse in={this.state.error}>
                                            <Alert severity="error" style={{left: "180px",position: "absolute", top: "70px"}}
                                            >
                                            The file doesn't match the isometric!

                                            </Alert>
                                        </Collapse>
                                    </center>
                                </div>
                            </form>
                        </div> 
                        <div className="popUp__warning__container">
                            <center className="popUp__warning__title">***WARNING!*** This action will replace the current(s) file(s). Take appropiate cautions.</center>
                            <center className="popUp__warning__subtitle__2">If you are not sure of this action, click cancel and contact your supervisor.</center>
                        </div>
                        <div className="popUpP__buttons__container">
                            <button className={`btn__accept ${this.state.validFile ? "" : "disabled"}`} onClick={() => this.openModalSeguroAccept()} style={{marginRight:"40px", fontSize:"16px", width:"200px"}}>Accept</button>
                            <button className={`btn__deny ${this.state.validFile ? "" : "disabled"}`} onClick={() => this.openModalSeguroDenied()} style={{marginRight:"5px", fontSize:"16px", width:"200px"}}>Deny</button>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Modal visible={this.state.visibleAccept} width="500" height="180" effect="fadeInUp" onClickAway={() => this.closeModalSeguroAccept()}>
                        <div className='popUp__container'>
                            <label className="popUp__title" style={{fontSize: "25px", marginLeft: "20px"}}>Are you sure you want to <b>Accept</b>?</label>
                        </div>
                        <div className="popUpP__buttons__container">
                            <button className="btn__create__bypass" style={{fontSize: "18px"}} onClick={() => this.accept()} >Yes</button>
                            <button className="btn__cancel__bypass" style={{fontSize: "18px"}} onClick={() => this.closeModalSeguroAccept()} >No</button>
                        </div>
                        <center style={{marginTop: "2%"}}>
                            <Collapse in={this.state.error}>
                                <Alert severity="error" style={{left: "100px",position: "absolute"}}
                                >
                                The file doesn't match the isometric!

                                </Alert>
                            </Collapse>
                        </center>
                    </Modal>
                </div>
                <div>
                    <Modal visible={this.state.visibleDenied} width="500" height="180" effect="fadeInUp" onClickAway={() => this.closeModalSeguroDenied()}>
                        <div className='popUp__container'>
                            <label className="popUp__title" style={{fontSize: "25px", marginLeft: "25px"}}>Are you sure you want to <b>Deny</b>?</label>
                        </div>
                        <div className="popUpP__buttons__container">
                            <button className="btn__create__bypass" style={{fontSize: "18px"}} onClick={() => this.deny()} >Yes</button>
                            <button className="btn__cancel__bypass" style={{fontSize: "18px"}} onClick={() => this.closeModalSeguroDenied()} >No</button>
                        </div>
                        <center style={{marginTop: "2%"}}>
                            <Collapse in={this.state.error}>
                                <Alert severity="error" style={{left: "100px", position: "absolute"}}
                                >
                                The file doesn't match the isometric!

                                </Alert>
                            </Collapse>
                        </center>
                    </Modal>
                </div>
            </section>
        );
    }
}