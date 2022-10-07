import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import CommentIcon from "../../assets/images/comment.png"
import './commentPopUp.css'

export default class CommentPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            user: null,
            updated: null
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

    componentDidMount(){
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/lastUser/"+this.props.filename, options)
        .then(response => response.json())
        .then(json =>{
            this.setState({user: json.user})
        })

        let updated = this.props.updated
        updated = updated.substring(0,10) + " " + updated.substring(11, 19) 
        this.setState({updated: updated})
    }

    render() {
        return (
            <div style={{marginRight:"15px", marginLeft:"15px"}}>
                <img onClick={() => this.openModal()} src={CommentIcon} alt="comment" className="comment__image" />
                <div>
                    <Modal visible={this.state.visible} width="550" height="200" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div style={{marginTop:"10px"}}>
                            <center><p style={{fontWeight:"bold"}}>{this.state.user} at {this.state.updated}</p></center>
                            <p style={{fontSize:"20px", padding:"5px 5px 5px 15px"}}>{this.props.comments}</p>   
                        </div>
                                
                    </Modal>
                </div>
            </div>
        );
    }
}