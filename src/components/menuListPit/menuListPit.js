import React, { useState, useEffect } from 'react';
import MenuListPITList from "../menuListPitList/menuListPitList"




const MenuListPIT = (props) =>{

    function success(){
        props.success()
    }

    return(
        <div style={{zoom:0.8}} class="panel__container">
            <div className="panel__heading__container">
                <h4>
                    <text className="panel__heading__text">PITRequests</text>
                </h4>
            </div>

            <div className="elements__container">
                <div className="menu" style={{paddingTop:"10px"}}>
                    <MenuListPITList success={success.bind(this)}/>
                </div>
                
            </div>
            
            
        </div>
    );
};

export default MenuListPIT;