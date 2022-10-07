import React, { useEffect } from "react";
import NavBar from '../../components/navBar/navBar';
import './register.css';
import { useState } from 'react';
//Página de home con el menú para ir a las aplicaciones de isotracker

const Register = () =>{
    const [role, setRole] = useState();
    const [email, setEmail] = useState();
    const [userName, setUserName] = useState();
    const [error, setError] = useState();
    const [roleItems, setRoleItems] = useState([]);

    const body = {
        email: email,
        userName: userName,
        role: role
    }

    useEffect(()=>{
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/roles")
        .then(response => response.json())
        .then(json => {
                setRoleItems(json);
            }
        )
        .catch(error => {
            setError(true);
        })
    },[]);


    const handleRegister = () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/register", options)
            .then(response => response.json())
            .then(json => {
                    window.location.reload(false);                
                }
            )
            .catch(error => {
                window.location.reload(false);
                setError(true);
            })
    }

    return(
        <body>
            <div className="home__background">
                <NavBar/>
                
                <div className="register__form__container">
                    <form>
                        <center><h3>Register</h3></center>

                        <div className="form-group" style={{display:"flex", alignItems:"left"}}>
                            <label style={{position:"absolute"}}>Role</label>
                            <select type="select" className="destination__select" style={{position:"relative", marginTop:"30px"}} onChange={(e) => setRole(e.target.value)}>
                                <option>Select a role..</option>
                                {roleItems.map((role)=>(
                                    <option value={role.name}>{role.name}</option>
                                )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" className="form-control" placeholder="Last name" onChange={(e) => setUserName(e.target.value)}/>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        {error && <p className="error__message" style={{color: "red"}}>Email or password incorrect. Try again.</p>}
                        <button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginTop:"30px", backgroundColor: "#17a2b8", marginBottom:"10px"}} onClick={handleRegister}>Register</button>
                    </form>
                </div>
  );
            </div>
            
        </body>
    );
};

export default Register;