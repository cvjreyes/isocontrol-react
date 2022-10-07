import React, { Component } from 'react';
import Modal from 'react-awesome-modal';


export default class CancelRevPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
        }
        
    }

   
    async openModal() {      
        
        this.setState({
            visible : true,
        });
    }

    closeModal() {
        this.setState({
            visible : false,
        });
    }

    cancelRev(){
        this.props.cancelRev(this.props.iso)
        this.closeModal()
    }


    render() {
        return (
            <section >
                <input type="button"  value="Cancel rev" className="btn"  style={{fontSize:"12px", padding:"2px 5px 2px 5px", width:"75px", marginLeft:"5px",float:"right", backgroundColor:"#DC143C", color:"white"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="650" height="160" effect="fadeInUp" onClickAway={() => this.closeModal()}>

                    <div className="popUp__container" >
                            <center className="popUp__title"><h3><strong>Are you sure you want to cancel {this.props.iso} new revision?</strong></h3></center>
                                
                        </div> 

                        <div className="popUp__buttons__container__manage">
                            <button class="btn btn-sm btn-danger" onClick={() => this.cancelRev()} style={{marginRight:"5px", fontSize:"16px"}}>Cancel</button>
                            <button class="btn btn-sm btn-warning" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Back</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}