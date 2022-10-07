import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../../components/alert/alert"


export default class ByPassRejNACommentPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            id: this.props.id,
            type: this.props.type,
            tag: this.props.tag,
            button: null,
            comments: null
        }
        
    }

    componentDidMount(){
        if(this.state.type === "Reject"){
            this.setState({button: <button className="csp__cancel__btn btn-sm btn-danger" style={{marginRight:"5px", width:"60px", height:"27px"}} onClick={() => this.openModal()}>Reject</button>})
        }else{
            this.setState({button: <button button className="ready__btn btn-sm btn-info" style={{backgroundColor:"#66A9F4", width:"60px", height:"27px"}} onClick={() => this.openModal()}>N/A</button>})     
        }
    }
   

    openModal() {      
        this.setState({
            visible : true,
        });
    }

    closeModal() {

        this.setState({
            visible : false,
        });
    }

    async rejectByPass(){
        if(this.state.type === "Reject"){
            this.props.rejectByPass(this.state.id, this.state.comments)
        }else{
            this.props.naByPass(this.state.id, this.state.comments)
        }
        this.closeModal()
      }


    render() {
        return (
            <section>
                <div>{this.state.button}
                    <Modal visible={this.state.visible} width="500" height="295" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="popUp__container" >
                            <center className="popUp__title"><h3>{this.state.type} ByPass {this.props.tag}</h3></center>
                                
                        </div>
                        
                        <center style={{marginTop: "20px"}}>
                         <textarea id="comments" placeholder="Comments" class="comments" cols="51" rows="4" required="" maxlength="400" name="comments" onChange={(e) => this.setState({comments: e.target.value})} style={{margin: "10px 10px 10px 10px"}}></textarea>
                        </center>
                        <center className="popUp__buttons__container__users">
                            <button class="btn btn-sm btn-success" onClick={() => this.rejectByPass()} style={{marginRight:"5px", fontSize:"16px"}}>Submit</button>
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </center>
                    </Modal>
                </div>
            </section>
        );
    }
}