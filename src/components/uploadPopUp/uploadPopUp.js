import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './uploadPopUp.css'
import DragAndDrop from "../../components/dragAndDrop/dragAndDrop"

export default class UploadPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            dad: null
        }
        this.id = props.id;
    }
   

    openModal() {      
        this.setState({
            visible : true,
            dad: <DragAndDrop mode="update" iso={this.id} role={this.props.role} user={this.props.currentUser} reset={true}/>
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            dad: null
        });
    }

    render() {
        return (
            <section >
                <input type="button"  value="UPLOAD" className="btn btn-warning"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", backgroundColor:"#B0E0E6", borderColor:"#B0E0E6", width:"100px", float:"left", marginRight: "5px", marginTop:"3px"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="840" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center className="popUp__title">{this.id}</center>
                                
                        </div>
                        <div className="dnd__container">
                            {this.state.dad}
                        </div> 
                        <div className="popUp__warning__container">
                            <center className="popUp__warning__title">***WARNING!*** This action will replace the current(s) file(s). Take appropiate cautions.</center>
                            <center className="popUp__warning__subtitle__2">If you are not sure of this action, click cancel and contact your supervisor.</center>
                        </div>
                        <div className="popUp__buttons__container">
                            <button class="mytray__upload__button__cancel" onClick={() => this.closeModal()} >Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}