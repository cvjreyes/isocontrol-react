import React, { Component } from 'react';
import Modal from 'react-awesome-modal';


export default class DeleteByPassPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            id: this.props.id
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

    deleteByPass(){
        this.props.deleteByPass(this.state.id)
        this.closeModal()
    }

    render() {
        return (
            <section >
                <button className="ready__btn btn-sm btn-danger" style={{fontWeight: "bold", backgroundColor:"#66A9F4", width:"60px", backgroundColor:"#FF3358"}} onClick={() => this.openModal()}>Delete</button>
                <div>
                    <Modal visible={this.state.visible} width="650" height="130" effect="fadeInUp" onClickAway={() => this.closeModal()}>

                    <div className="popUp__container" >
                            <center className="popUp__title"><h3><strong>Are you sure you want to delete {this.props.tag}?</strong></h3></center>
                                
                        </div> 

                        <div className="popUp__buttons__container__manage">
                            <button class="btn btn-sm btn-danger" onClick={() => this.deleteByPass()} style={{marginRight:"5px", fontSize:"16px"}}>Delete</button>
                            <button class="btn btn-sm btn-warning" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}