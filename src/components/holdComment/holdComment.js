import React, { Component } from 'react';
import Modal from 'react-awesome-modal';

export default class holdComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
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
        this.props.sendHolds(comments)
        this.closeModal()
    }

    render() {
        
        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"right"}}>
                <button className="action__btn"  onClick={() => this.openModal()}>Hold</button>
                <div>
                    <Modal visible={this.state.visible} width="550" height="220" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div style={{marginTop:"10px"}}>   
                            <textarea id="comments" placeholder="Comments" class="comments" cols="51" rows="6" required="" maxlength="400" name="comments" style={{margin: "10px 10px 10px 10px"}}></textarea>
                        </div>
                                
                            <button class="btn btn-sm btn-success" style={{fontSize:"15px"}} onClick={()=>this.return()}>Send to holds</button>
                    </Modal>
                </div>
            </div>
        );
    }
}