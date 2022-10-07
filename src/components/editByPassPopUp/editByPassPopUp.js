import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../alert/alert"


export default class EditPassPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            blankFields: false,
            tag: this.props.tag,
            type: this.props.type,
            note: this.props.note,
            id: this.props.id
        }
        
    }

    openModal() {      
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false,
        });
    }

    editByPass(){
        const notes = document.getElementById("notes").value
        if(notes === "" || notes === null){
            this.setState({
                blankFields: true
            })
        }else{
            this.props.editByPass(this.state.type, this.state.note, this.state.id)
            this.closeModal()
        }
    }


    render() {
        
        return (
            <section >
                <button className="ready__btn btn-sm btn-info" style={{fontWeight: "bold", backgroundColor:"#66A9F4", width:"60px", marginRight:"5px"}} onClick={() => this.openModal()}>Edit</button>
                <div>
                    <Modal visible={this.state.visible} width="410" height="370" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({blankFields: false})}
                        >
                        <AlertF type="warning" text="The byPass needs notes!" popUp={true} margin="4px"/>
                      </div>

                    <div className="popUp__container" >
                            <center className="popUp__title"><h3>Edit ByPass {this.props.tag}</h3></center>
                                
                        </div>
                        
                        <div className="popUp__input" style={{marginTop: "20px", marginLeft:"30px"}}>
                            <label for="select">Type: </label>
                            <select className="popUp_input_select" name="select" onChange={(e) => this.setState({type: e.target.value})} defaultValue={this.state.type}>
                                <option value={1}>Instrument</option>
                                <option value={2}>Equipment</option>
                                <option value={3}>Material</option>
                                <option value={4}>PID</option>
                            </select>
                        </div>
                        <center style={{marginTop: "10px"}}>
                            <textarea style={{width: "310px", height: "170px"}} defaultValue={this.state.note} onChange={(e) => this.setState({note: e.target.value})} id="notes" name="notes"></textarea>
                        </center>
                        <center className="popUp__buttons__container__users">
                            <button class="btn btn-sm btn-success" onClick={() => this.editByPass()} style={{marginRight:"5px", fontSize:"16px"}}>Confirm</button>
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </center>
                    </Modal>
                </div>
            </section>
        );
    }
}