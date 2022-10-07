import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './deleteUserConfPopUp.css'

export default class DeleteUserConfPopUp extends Component {
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

    deleteUser(){
        this.props.deleteUser(this.props.id)
        this.closeModal()
    }


    render() {
        return (
            <section >
                <input type="button"  value="DELETE" className="btn"  style={{padding:"2px 5px 2px 5px", marginRight:"5px", marginLeft:"5px", width:"70px", fontSize:"12px", float:"right", backgroundColor:"#DC143C", color:"white"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="400" height="180" effect="fadeInUp" onClickAway={() => this.closeModal()}>

                    <div className="popUp__container" >
                            <center className="popUp__title" style={{fontSize:"20px"}}>Are you sure you want to delete <p style={{color: 'black'}}>{this.props.username}?</p></center>
                                
                        </div> 

                        <div className="popUp__buttons__container__manage" style={{marginTop: "30px"}}>
                            <button class="btn__delete__user" onClick={() => this.deleteUser()}>Delete</button>
                            <button class="btn__cancel__user" onClick={() => this.closeModal()}>Cancel</button>
                        </div>
                    </Modal>
                </div>
            </section>
        );
    }
}