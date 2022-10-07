import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import './cancelIso.css'

export default class CancelIso extends Component {
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
        const tray = document.getElementById("tray").value
        const comments = document.getElementById("comments").value
        this.props.returnIso(tray, comments)
        this.closeModal()
    }

    render() {
        var trayHeader, traySelect
        trayHeader = <div className="cancel__header__tray">Tray</div>
        if(this.props.role === "SpecialityLead"){
            traySelect = <select className="destination__select__return" id="tray" ><option value="Design" selected="selected">Design</option><option value="Stress">Stress</option><option value="Supports">Supports</option><option value="Materials">Materials</option><option value="Issuer">Issuer</option></select>
        }else if(this.props.role === "Supports"){
            traySelect = <select className="destination__select__return" id="tray"><option value="Design" selected="selected">Design</option><option value="Stress">Stress</option></select>
        }else if(this.props.role === "Materials"){
            traySelect = <select className="destination__select__return" id="tray" ><option value="Design" selected="selected">Design</option><option value="Stress">Stress</option><option value="Supports">Supports</option></select>
        }else if(this.props.role === "Issuer"){
            traySelect = <select className="destination__select__return" id="tray" ><option value="Design" selected="selected">Design</option><option value="Stress">Stress</option><option value="Supports">Supports</option><option value="Materials">Materials</option></select>
        }
        
        return (
            <div style={{marginRight:"5px", marginLeft:"5px", float:"right"}}>
                <button className="action__btn" style={{zoom:0.8}} onClick={() => this.openModal()}>Return</button>
                <div>
                    <Modal visible={this.state.visible} width="650" height="370" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="header__container">
                            {trayHeader}
                            <div className="cancel__header__comments">Comments</div>
                        </div>
                        <div className="body__container">   
                            {traySelect}
                            <textarea id="comments" class="comments" cols="51" rows="6" required="" maxlength="400" name="comments" className='popUp__textarea__return' style={{marginTop: "20px"}}></textarea>
                        </div>
                        <center className="popUpP__buttons__container__return">
                            <button class="btn__confirm__return" onClick={()=>this.return()}>Confirm</button>
                            <button class="btn__cancel__return" onClick={()=>this.closeModal()}>Cancel</button>
                        </center>
                    </Modal>
                </div>
            </div>
        );
    }
}