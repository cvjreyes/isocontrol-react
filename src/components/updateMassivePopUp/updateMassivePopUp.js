import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './updateMassivePopUp.css'
import UpdateMassive from "../updateMassive/updateMassive"

export default class UpdateMassivePopUp extends Component {
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
            dad: <UpdateMassive mode="update" role={this.props.role} user={this.props.currentUser} reset={true}/>
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
                <input type="button" style={{zoom:0.8}} value="Upload" className="upload__massive__button" onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="900" height="1000" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <p className="upload__massive__title">Upload files for your isometrics</p>
                        <div className="popUp__container" >
                            <center className="popUp__title"><h1>{this.id}</h1></center>
                                
                        </div>
                        <div className="dnd__massive__container">
                            {this.state.dad}
                        </div> 
                        <center className="popUp__massive__warning__title">***WARNING!*** This action will replace the current(s) file(s). Take appropiate cautions.</center>
                        <center className="popUp__warning__subtitle">If you are not sure of this action, click cancel and contact your supervisor.</center>
                        <div className="popUp__buttons__container">
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginRight:"5px", fontSize:"16px"}}>Close</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}