import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import "./forceClaimPopUp.css"

const CryptoJS = require("crypto-js");
    const SecureStorage = require("secure-web-storage");
    var SECRET_KEY = 'sanud2ha8shd72h';
    
    var secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key) {
            key = CryptoJS.SHA256(key, SECRET_KEY);
    
            return key.toString();
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    
            data = data.toString();
    
            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    
            data = data.toString(CryptoJS.enc.Utf8);
    
            return data;
        }
    });

export default class UploadPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            users: []
        }
        this.id = props.id;
    }

    async openModal() {  
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
        await this.setState({
            users: []
        })
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/users/"+secureStorage.getItem("tab"), options)
        .then(response => response.json())
        .then(async json => {
            let usernames = json.usernames
            for(let i = 0; i < json.usernames.length; i++){
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/getroles/"+json.usernames[i], options)
                .then(response => response.json())
                .then(async json =>{
                    for(let j = 0; j < json.roles.length; j++){
                        if(secureStorage.getItem("tab") === "Design" && (json.roles[j] === "DES" || json.roles[j] === "LDE")){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Stress" && (json.roles[j] === "STR" || json.roles[j] === "LST")){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Supports" && (json.roles[j] === "SUP" || json.roles[j] === "LSP")){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Materials" && json.roles[j] === "MAT"){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Issuer" && json.roles[j] === "ISS"){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Materials" && json.roles[j] === "MAT"){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Process" && json.roles[j] === "PRO"){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                        if(secureStorage.getItem("tab") === "Instrument" && json.roles[j] === "INS"){
                            let users_array = this.state.users
                            users_array.push(json.roles[j] + " - " + usernames[i])
                            await this.setState({
                                users : users_array
                            })
                        }
                    }
                })
            }
        })   
        this.setState({
            visible : true,
        });

    }

    closeModal() {
        this.setState({
            visible : false,
        });
    }

    getUser(){
        this.props.assignToUser(document.getElementById("userSelect").value)
        this.closeModal()
    }

    render() {
        return (
            <section style={{float:"left"}}>
                <button value="Force claim" className="action__btn" style={{zoom:0.8}} onClick={() => this.openModal()}>Assign</button>                <div>
                    <Modal visible={this.state.visible} width="650" height="180" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div className="popUp__container" >
                            <center className="popUp__title">Select a user</center>          
                        </div>
                        <div className="selector__container">
                        
                            <select id="userSelect" className="userSelect">
                                {this.state.users.map(user =>(
                                    <option>{user}</option>
                                ))}
                            </select>
                                
                            <button class="btn__assign__user" onClick={()=>this.getUser()}>Assign</button>
                        </div>
                    </Modal>
                </div>
            </section>
            
        );
    }
}