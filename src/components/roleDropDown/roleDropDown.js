import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import "./roleDropDown.css"

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
  },
  title: {
    fontSize: "40px",
  }
}));


const RoleDropDown = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedFeed, setSelectedFeed] = React.useState(0)
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

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


  var options = ["none"]
  var feedRole = ["none"]

  if (props.roles){
    options = props.roles;
    feedRole = props.roles
    // feedRole.push(props.roles[8])
    // designRole.push(props.roles[0], props.roles[1])
  }

  useEffect(()=>{
    if (options.indexOf(secureStorage.getItem('role')) !== -1){
      setSelectedIndex(options.indexOf(secureStorage.getItem('role')))
    }else{
      setSelectedIndex(0)
    }

    if (feedRole.indexOf(secureStorage.getItem('role')) !== -1){
      setSelectedFeed(feedRole.indexOf(secureStorage.getItem('role')))
    }else{
      setSelectedFeed(8)
    }

    // eslint-disable-next-line
  },[options, feedRole])

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    props.onChange(options[index]);
    secureStorage.setItem('role', options[index])
  };

  // const handleMenuItemClickFeed = (event, index) => {
  //   setSelectedFeed(index);
  //   setAnchorEl(null);
  //   props.onChange(feedRole[index]);
  //   secureStorage.setItem('role', feedRole[index])
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   console.log("feed enter" + props.feedEnter);
  //   if(props.feedEnter === true){
      
  //   } else {

  //   }

  // }, [])
  

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Device settings" >
        <ListItem
          style={{marginLeft:"25px"}}
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Role"
          onClick={handleClickListItem}
        >
          <ListItemText className ={classes.title} primary="Select Role" secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
      
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            style={{fontSize: "14px", fontFamily:"Quicksand"}}
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default RoleDropDown;