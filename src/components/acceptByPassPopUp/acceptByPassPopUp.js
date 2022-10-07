import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import AlertF from "../../components/alert/alert"


export default class AcceptByPassPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            id: this.props.id,
            answer: 2
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

    async acceptByPass(){
        
        const body ={
          id : this.state.id,
          type: this.state.answer
        }
        const options = {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/answerByPass", options)
            .then(response => response.json())
            .then(async json => {
              if(json.success){
                this.props.success()
              }
            })
        this.closeModal()
      }


    render() {
        return (
            <section>
                <button className="ready__btn btn-sm btn-info"  style={{fontWeight: "bold", marginRight:"5px", width:"60px", height:"28px", backgroundColor:"#66A9F4"}} onClick={() => this.openModal()}>Doc</button>
                <div>
                    <Modal visible={this.state.visible} width="500" height="190" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className="popUp__container" >
                            <center className="popUp__title"><h3>Answer ByPass {this.props.tag}</h3></center>
                                
                        </div>
                        
                        <center style={{marginTop: "20px"}}>
                            <label for="select">Type: </label>
                            <select className="popUp_input_select" name="select" onChange={(e) => this.setState({answer: e.target.value})} value={this.state.selected}>
                                <option value={2} selected>CODE3</option>
                                <option value={3}>IFC</option>
                            </select>
                        </center>
                        <center className="popUp__buttons__container__users">
                            <button class="btn btn-sm btn-success" onClick={() => this.acceptByPass()} style={{marginRight:"5px", fontSize:"16px"}}>Accept</button>
                            <button class="btn btn-sm btn-danger" onClick={() => this.closeModal()} style={{marginLeft:"5px", fontSize:"16px"}}>Cancel</button>
                        </center>
                    </Modal>
                </div>
            </section>
        );
    }
}