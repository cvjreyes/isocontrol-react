import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './newRevPopUp.css'

export default class NewRevPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
        this.user = props.user;
        this.role = props.role;
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    return(){
        const comments = document.getElementById("comments").value
        this.props.newRev(comments)
        this.closeModal()
    }

    render() {
        
        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"right"}}>
                <button className="action__btn" style={{zoom:0.8}} onClick={() => this.openModal()}>New Rev</button>
                <div>
                    <Modal visible={this.state.visible} width="650" height="300" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <center style={{fontSize:"22px", marginTop:"20px"}}>
                            <p>New revision</p>
                        </center>
                        <div className="body__container" style={{marginTop: "20px"}}>   
                            <textarea id="comments" placeholder="Comments" class="comments" cols="51" rows="6" required="" maxlength="400" name="comments" style={{margin: "10px 10px 10px 10px"}}></textarea>
                        </div>
                        <center className="buttons__container">
                            <button class="btn btn-sm btn-success" style={{marginRight:"5px", fontSize:"16px"}} onClick={()=>this.return()}>Confirm</button>
                            <button class="btn btn-sm btn-danger" style={{marginRight:"5px", fontSize:"16px"}} onClick={()=>this.closeModal()}>Cancel</button>
                        </center>
                    </Modal>
                </div>
            </div>
        );
    }
}