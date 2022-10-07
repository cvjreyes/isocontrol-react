import React, { Component } from 'react';
import Modal from 'react-awesome-modal';

export default class RenamePopUp extends Component {
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

    rename(){
        const newName = document.getElementById("comments").value
        const oldName = this.props.filename

        this.props.rename(newName, oldName)

        this.closeModal()
        
    }

    render() {
        
        return (
            <section style={{display:"inline-block"}}>
                <button type="button" class="btn btn-sm btn-danger" style={{fontSize:"12px",  padding:"2px 5px 2px 5px", marginRight:"5px"}} onClick={() => this.openModal()}>LOCKED</button>
                <div>
                    <Modal visible={this.state.visible} width="550" height="150" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <center style={{marginTop:"10px"}}>
                            <h4>{this.props.filename}</h4>
                        </center>
                        <div style={{marginTop:"10px", display:"inline-block", marginLeft:"30px"}}>  
                            <textarea id="comments" defaultValue={this.props.filename} class="comments" cols="51" rows="1" required="" maxlength="400" name="comments" style={{margin: "2px 10px 10px 10px", float:'left'}}></textarea>
                            <button class="btn btn-sm btn-success" style={{fontSize:"15px", float:"left"}} onClick={()=>this.rename()}>Rename</button>
                        </div>
                                
                            
                    </Modal>
                </div>
            </section>
        );
    }
}