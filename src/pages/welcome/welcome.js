import React from "react";
import './welcome.css'

//Página de welcome que actua como portada

const Welcome = () =>{

    document.body.style.zoom = 1.
    document.title= process.env.REACT_APP_APP_NAMEPROJ
    return(
        <body>
        <div className="cover__background"> 
            <div className="cover__login__container">
            <a href={"/"+process.env.REACT_APP_PROJECT+"/navis"} className="cover__login__text">NAVISATTSELECT</a>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/login"} className="cover__login__text">LOGIN</a>
            </div>
            <div class="content">
                <div className="cover__main__container">
                    <div className="cover__main__text">IsoTracker v2021</div><br></br><div>
                    <div className="cover__main__footer"><center><footer>Ⓒ Copyright 2021 Technip Iberia, S.A.U - Developed by: J.Reyes-Sztayzel / A.Domínguez-Ortega</footer></center></div></div>
                </div>
            </div>
        </div>
        </body>
    );
};

export default Welcome;