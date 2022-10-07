import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"
import "./loadingScreen.css"

const LoadingScreen = props =>{

    return( 
        <div className="loading__screen">
            <div className="logo__container">
                <img src={IsoTrackerLogo} alt="isotrackerLogo" className="logo"/>
                
            </div>
            <div className="text__container">
                <text style={{fontSize:"25px"}}>© Copyright 2021 Technip Iberia, S.A.U - Developed by: J.Reyes-Sztayzel / A.Domínguez-Ortega</text>
            </div>
            <div className="progress__bar">
                <progress value={props.progress} max="100" backgroundColor="red"/>
            </div>
            
        </div>
    );
};

export default LoadingScreen;