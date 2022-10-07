//Cabecera de IsoTracker con diferentes desplegables y botones

import React, { useEffect ,useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useHistory} from "react-router";
import Trash from "../../assets/images/Trash.png"
import Bell from "../../assets/images/bell.svg"
import BellActive from "../../assets/images/bell_active.svg"
import './navBarProdCurve.css'
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


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    label: {
      },
      label2: {
      },
  }));


const NavBarProdCurve = (props) =>{
    const classes = useStyles();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const history = useHistory();
    const [username, setUsername] = React.useState("");
    const [progressButtons, setProgressButtons] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const ref = useRef()
    const [notifications, setNotifications] = useState(false)
    const [updateData, setUpdateData] = useState(false)
    const [bellImage, setBellImage] = useState()
    const [emptyNotifications, setEmptyNotifications] = useState()

    const handleClickUser = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUser = () => {
        setAnchorElUser(null);
    };

    const handleClickIsotracker = () => {
        history.push("/"+process.env.REACT_APP_PROJECT+"/isotracker");
    };

    const handleLogOut = () => {
        localStorage.clear();
        history.push("/"+process.env.REACT_APP_PROJECT+"/");
    };

    const handleChangePassword = () =>{
        setAnchorElUser(null);
        history.push("/"+process.env.REACT_APP_PROJECT+"/changepassword");
    }

    const handleClickEquipments = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/equipments");
    }

    const handleClickInstrument = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/instrumentation");
    }
    const handleClickCivil = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/civil");
    }
    const handleClickElectrical = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/electrical");
    }
    const handleClickPiping = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/piping");
    }
    const handleClickHome = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/home");
    }
    const handleClickSP = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/csptracker");
    }
    const handleClickPIT = () =>{
        history.push("/"+process.env.REACT_APP_PROJECT+"/pitrequests");
    }
     

    useEffect(() => {
        const checkIfClickedOutside = e => {
          // If the menu is open and the clicked target is not within the menu,
          // then close the menu
          if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
              
            setIsMenuOpen(false)
          }
        }

    
        document.addEventListener("mousedown", checkIfClickedOutside)
    
        return () => {
          // Cleanup the event listener
          document.removeEventListener("mousedown", checkIfClickedOutside)
        }
      }, [isMenuOpen])

    useEffect(async() =>{
        const bodyUsername = {
            email: secureStorage.getItem("user")
          }
        const optionsUsername = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyUsername)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/api/findByEmail", optionsUsername)
        .then(response => response.json())
        .then(json => {
            setUsername(json.name);
        })

        if(process.env.REACT_APP_PROGRESS === "1"){
            if(process.env.REACT_APP_SP === "1"){
                setProgressButtons(<div style={{ marginLeft: "3%", float:"left"}}>
                    <Button class="btn nohover" onClick={handleClickHome} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Home </i>
                    </Button><Button class="btn nohover" onClick={handleClickPiping} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Piping </i>
                    </Button><Button class="btn nohover" onClick={handleClickInstrument} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Instrumentation </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickEquipments} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Equipment </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickCivil} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Civil </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickElectrical} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Electrical </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickIsotracker} style={{marginRight:"50px", paddingTop: "0px"}}>
                                    <i className="nb__text" >IsoTracker </i>
                    </Button></div>)
            }else{
                setProgressButtons(<div style={{ marginLeft: "3%", float:"left" }}>
                    <Button class="btn nohover" onClick={handleClickHome} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Home </i>
                    </Button><Button class="btn nohover" onClick={handleClickPiping} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Piping </i>
                    </Button><Button class="btn nohover" onClick={handleClickInstrument} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Instrumentation </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickEquipments} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Equipment </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickCivil} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Civil </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickElectrical} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text">Electrical </i>
                    </Button>
                    <Button class="btn nohover" onClick={handleClickIsotracker} style={{marginRight:"50px", paddingTop: "0px"}}>
                        <i className="nb__text" >IsoTracker </i>
                    </Button></div>)
            }

        }
      
    },[])

    useEffect (async ()=>{

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/notifications/"+ secureStorage.getItem("user"), options)
        .then(response => response.json())
        .then(async json => {
            let notif = []
            let alert = false
            if(json.rows[0]){
                for(let i = 0; i < json.rows.length; i++){           
                    if(json.rows[i].read === 0){
                        alert = true
                        notif.push(<div className="notification__container" >
                                    <p className="notification__text" style={{fontWeight:"bold"}}>{json.rows[i].text}</p>
                                    <button className="markAsReadNotification__button" style={{marginLeft:"170px"}} onClick={()=> markAsRead(json.rows[i].id)}>Mark as read</button>
                                    <button className="deleteNotification__button"><img src={Trash} alt="trash" className="notificationTrash__icon" onClick={()=> deleteNotification(json.rows[i].id)}></img></button>
                                </div>)
                    }else{
                        notif.push(<div className="notification__container" >
                                    <p className="notification__text">{json.rows[i].text}</p>
                                    <button className="markAsReadNotification__button" style={{marginLeft:"157px"}} onClick={()=> markAsUnread(json.rows[i].id)}>Mark as unread</button>
                                    <button className="deleteNotification__button"><img src={Trash} alt="trash" className="notificationTrash__icon" onClick={()=> deleteNotification(json.rows[i].id)}></img></button>
                                </div>)
                    }
                    
                }
                await setEmptyNotifications(null)
            }else{
                await setEmptyNotifications(<div className="emptyNotifications__container">
                    <p className="emptyNotifications__text">No new notifications</p>
                </div>)
            }

            if(alert){
                await setBellImage(<img src={BellActive} alt="bellActive" className="nb__notificationBell__icon"></img>)
            }else{
                await setBellImage(<img src={Bell} alt="bell" className="nb__notificationBell__icon"></img>)
            }
            await setNotifications(notif)
        })
    },[updateData])

    
    useEffect(() => {
        const interval = setInterval(() => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }
    
            fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/notifications/"+ secureStorage.getItem("user"), options)
            .then(response => response.json())
            .then(async json => {
                let notif = []
                let alert = false
                if(json.rows[0]){
                    for(let i = 0; i < json.rows.length; i++){           
                        if(json.rows[i].read === 0){
                            alert = true
                            notif.push(<div className="notification__container" >
                                        <p className="notification__text" style={{fontWeight:"bold"}}>{json.rows[i].text}</p>
                                        <button className="markAsReadNotification__button" style={{marginLeft:"170px"}} onClick={()=> markAsRead(json.rows[i].id)}>Mark as read</button>
                                        <button className="deleteNotification__button"><img src={Trash} alt="trash" className="notificationTrash__icon" onClick={()=> deleteNotification(json.rows[i].id)}></img></button>
                                    </div>)
                        }else{
                            notif.push(<div className="notification__container" >
                                        <p className="notification__text">{json.rows[i].text}</p>
                                        <button className="markAsReadNotification__button" style={{marginLeft:"157px"}} onClick={()=> markAsUnread(json.rows[i].id)}>Mark as unread</button>
                                        <button className="deleteNotification__button"><img src={Trash} alt="trash" className="notificationTrash__icon" onClick={()=> deleteNotification(json.rows[i].id)}></img></button>
                                    </div>)
                        }
                        
                    }
                    await setEmptyNotifications(null)
                }else{
                    setEmptyNotifications(<div className="emptyNotifications__container">
                        <p className="emptyNotifications__text">No new notifications</p>
                    </div>)
                }
    
                if(alert){
                    setBellImage(<img src={BellActive} alt="bellActive" className="nb__notificationBell__icon"></img>)
                }else{
                    setBellImage(<img src={Bell} alt="bell" className="nb__notificationBell__icon"></img>)
                }
                await setNotifications(notif)
            })
        }, 10000);
        return () => clearInterval(interval);
      }, []);
      

    let projectBtn, pitButton, spbutton, pitButtonProgress, rightButtons = null
    if(process.env.REACT_APP_PROGRESS === "1"){
        if(process.env.REACT_APP_SP === "1"){
            if(process.env.REACT_APP_PIT === "1"){
            projectBtn = <Button class="btn nohover" disabled style={{marginRight:"20px", float:"right"}}>
            <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
        </Button>
            rightButtons = <div style={{width:"28%"}}>
                    
                            
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none", paddingTop: "0px"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                

                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "11%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
            </div>
            }else{
                projectBtn = <Button class="btn nohover" disabled style={{marginRight:"20px", float:"right"}}>
            <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
        </Button>
            rightButtons = <div style={{width:"40%"}}>
                    
                            
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none", paddingTop: "0px"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                

                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "26%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
            </div>
            }
        }else{
            if(process.env.REACT_APP_PIT === "1"){
                projectBtn = <Button class="btn nohover" disabled style={{float:"right", marginRight:"20px"}}>
                <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
            </Button>
                rightButtons= <div style={{width:"40%"}}>
                        
                            
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none", paddingTop: "0px"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                

                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "27%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
            </div>
            }else{
                projectBtn = <Button class="btn nohover" disabled style={{float:"right", marginRight:"20px"}}>
                <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
            </Button>
                rightButtons= <div style={{width:"40%"}}>
                        
                            
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none", paddingTop: "0px"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                

                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "34%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
            </div>
            }
        }
        
        
    }else{
        if(process.env.REACT_APP_SP === "1"){
            if(process.env.REACT_APP_PIT === "1"){
            projectBtn = <Button classes={{label: classes.label2}} class="btn nohover" disabled style={{float:"right", marginRight:"20px"}}>
            <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
        </Button>
        rightButtons= <div style={{width:"76%"}}>
                    
                        
            <button style={{float:"right", marginLeft:"20px", border:"none", background:"none"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
            <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
            <i className="nb__text">{username}&nbsp;🠗</i>
            </Button>
            

            {isMenuOpen && (
                <div className="notifications__container" style={{marginLeft: "62%"}}>
                    <div className="notificationPanel__header">
                        <p className="notificationHeader__text">Notifications</p>
                        <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                    </div>
                    {notifications}
                    {emptyNotifications}
                </div>
            )}
            
            {projectBtn}
        </div>
            }else{
                projectBtn = <Button classes={{label: classes.label2}} class="btn nohover" disabled style={{float:"right", marginRight:"20px"}}>
                <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
            </Button>
            rightButtons= <div style={{width:"82%"}}>
                        
                            
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                
    
                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "68%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
                </div>
            }
        
        }else{
            if(process.env.REACT_APP_PIT === "1"){
                projectBtn = <Button classes={{label: classes.label2}} class="btn nohover" disabled style={{float:"right", marginRight:"20px"}}>
                <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
                </Button>
                
                
                rightButtons= <div style={{width:"82%"}}>
                            
                                
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                

                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "68%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
            </div>
            }else{
                projectBtn = <Button classes={{label: classes.label2}} class="btn nohover" disabled style={{float:"right", marginRight:"20px"}}>
                <i className="nb__text__projectname" >{process.env.REACT_APP_APP_NAMEPROJ}</i>
                </Button>
                
                
                rightButtons= <div style={{width:"90%"}}>
                            
                                
                <button style={{float:"right", marginLeft:"20px", border:"none", background:"none"}} onClick={()=>setIsMenuOpen(!isMenuOpen)}>{bellImage}</button>
                <Button class="btn nohover" style={{float: "right"}} classes={{label: classes.label}} onClick={handleClickUser}>
                <i className="nb__text">{username}&nbsp;🠗</i>
                </Button>
                

                {isMenuOpen && (
                    <div className="notifications__container" style={{marginLeft: "75%"}}>
                        <div className="notificationPanel__header">
                            <p className="notificationHeader__text">Notifications</p>
                            <button className="markAllAsRead__button" onClick={()=> markAllAsRead()}>Mark all as read</button>            
                        </div>
                        {notifications}
                        {emptyNotifications}
                    </div>
                )}
                
                {projectBtn}
            </div>
            }
        }

    }
    let isotrackerBtnNoProgress = null
    if(process.env.REACT_APP_SP === "1"){
        if(process.env.REACT_APP_PROGRESS === "1"){
            spbutton = <Button class="btn nohover" onClick={handleClickSP} style={{marginRight:"50px" , paddingTop: "0px"}}>
            <i className="nb__text" >SPTracker</i>
            </Button>
        }else{
            spbutton = <Button class="btn nohover" onClick={handleClickSP} style={{marginLeft:"50px", paddingTop: "0px"}}>
            <i className="nb__text" >SPTracker</i>
            </Button>
            isotrackerBtnNoProgress = <Button class="btn nohover" onClick={handleClickIsotracker} style={{marginLeft:"50px", paddingTop: "0px"}}>
                        <i className="nb__text" >IsoTracker </i>
            </Button>
        }    
    }

    if(process.env.REACT_APP_PIT === "1"){
        if(process.env.REACT_APP_PROGRESS === "1"){
            pitButtonProgress = <Button class="btn nohover" onClick={handleClickPIT} style={{marginRight:"50px" , paddingTop: "0px"}}>
            <i className="nb__text" >PITRequests</i>
            </Button>
        }else{
            pitButton = <Button class="btn nohover" onClick={handleClickPIT} style={{marginLeft:"50px"}}>
            <i className="nb__text" >PITRequests</i>
            </Button>
            isotrackerBtnNoProgress = <Button class="btn nohover" onClick={handleClickIsotracker} style={{marginLeft:"50px" , paddingTop: "0px"}}>
                        <i className="nb__text" >IsoTracker </i>
            </Button>
        }    
    }    

    if(process.env.REACT_APP_PROGRESS === "0" && process.env.REACT_APP_SP === "0" && process.env.REACT_APP_PIT === "0"){
        isotrackerBtnNoProgress = <Button class="btn nohover" onClick={handleClickIsotracker} style={{marginLeft:"50px" , paddingTop: "0px"}}>
        <i className="nb__text" >IsoTracker </i>
        </Button>
    }

    function markAllAsRead(){
        const body = {
            email: secureStorage.getItem("user")
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/markAllNotificationsAsRead", options)
          .then(response => response.json())
          .then(json =>{
              if(json.success){
                setUpdateData(!updateData)
              }
          })
   
    }

    function markAsRead(id){
        const body = {
            id: id
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/markNotificationAsRead", options)
          .then(response => response.json())
          .then(json =>{
              if(json.success){
                setUpdateData(!updateData)
              }
          })
   
    }

    function markAsUnread(id){
        const body = {
            id: id
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/markNotificationAsUnread", options)
          .then(response => response.json())
          .then(json =>{
              if(json.success){
                setUpdateData(!updateData)
              }
          })
   
    }

    function deleteNotification(id){
        const body = {
            id: id
          }
          const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
          fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/deleteNotification", options)
          .then(response => response.json())
          .then(json =>{
              if(json.success){
                setUpdateData(!updateData)
              }
          })
    }


    
    return(
        <div ref={ref}>
        <div className={classes.root}>
            <div>
            <AppBar position="fixed" className="navBar__container" style={{height:"49px", borderBottomColor: "rgb(211, 224, 233)", borderLeftColor: "rgb(211, 224, 233)", bordeRightColor: "rgb(211, 224, 233)", borderTopColor: "rgb(211, 224, 233)", backgroundColor: "#383838"}}>
            
                <Toolbar>
                    
                    {progressButtons}   
                    {isotrackerBtnNoProgress}        
                    {pitButtonProgress}
                    {pitButton}
                    
                    {spbutton}

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorElUser}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUser}
                        PaperProps={{
                            style: {
                            left: '50%',
                            transform: 'translateX(+30%)',
                            }
                        }}
                    >
                    <MenuItem style={{fontFamily:"Quicksand", fontSize:"13.33px"}} onClick={handleChangePassword}>Change password</MenuItem>
                    <MenuItem style={{fontFamily:"Quicksand", fontSize:"13.33px"}} onClick={handleLogOut}><b>Logout</b></MenuItem>
                    </Menu>
                    {rightButtons}
                </Toolbar>

            </AppBar>
            </div>
        </div>
        </div>
    );
};

export default NavBarProdCurve;