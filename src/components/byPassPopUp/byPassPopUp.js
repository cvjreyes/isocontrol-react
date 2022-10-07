import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../../components/alert/alert"
import "./byPassPopUp.css"


export default class ByPassPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            blankFields: false,
            type: 1,
            note: null,
            id: this.props.id
        }
        
    }
   

    openModal() {      
        document.getElementById("notes").value = ""
        this.setState({
            visible : true,
            note: null
        });
    }

    closeModal() {
        
        this.setState({
            visible : false,
            blankFields: false,
            type: 1,
            note: null
        });
    }

    createByPass(){
        const notes = this.state.note
        if(notes === "" || notes === null){
            this.setState({
                blankFields: true
            })
        }else{
            this.props.creatByPass(this.state.type, notes, this.state.id)
            this.closeModal()
        }
    }


    render() {
        return (
            <section >
                <input type="button"  value="BYPASS" className="btn btn_warning" style={{fontSize: "12px", fontWeight:"bold", padding: "2px 5px", backgroundColor: "#FF3358", color: "white", width: "100px", float: "left", marginRight: "5px", marginTop: "3px"}} onClick={() => this.openModal()} />
                <div>
                    <Modal visible={this.state.visible} width="400" height="410" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div
                        className={`alert alert-success ${this.state.blankFields ? 'alert-shown' : 'alert-hidden'}`}
                        onTransitionEnd={() => this.setState({blankFields: false})}
                        >
                        <AlertF type="warning" text="The byPass needs notes!" popUp={true} margin="4px"/>
                      </div>

                    <div className="popUp__container" >
                            <center className="popUp__title">Create ByPass</center>
                                
                        </div>
                        
                        <div className="popUp__input__bypass" style={{marginTop: "20px"}}>
                            <label for="select">Type: </label>
                            <select className="popUp_input_select__bypass" name="select" onChange={(e) => this.setState({type: e.target.value})} value={this.state.selected}>
                                <option value={1} selected>Instrument</option>
                                <option value={2}>Equipment</option>
                                <option value={3}>Material</option>
                                <option value={4}>PID</option>
                                <option value={5}>Civil</option>
                            </select>
                        </div>
                        <center style={{marginTop: "10px"}}>
                            <textarea className='popUp__textarea__bypass' placeholder=' Notes...' id="notes" name="notes" onChange={(e) => this.setState({note: e.target.value})}></textarea>
                        </center>
                        <center className="popUp__buttons__container__users">
                            <button class="btn__create__bypass" onClick={() => this.createByPass()}>Create</button>
                            <button class="btn__cancel__bypass" onClick={() => this.closeModal()}>Cancel</button>
                        </center>
                    </Modal>
                </div>
            </section>
        );
    }
}