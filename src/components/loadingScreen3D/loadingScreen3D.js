import IsoTrackerLogo from "../../assets/images/3DTracker.svg"

const LoadingScreen3D = props =>{

    return( 
        <div className="loading__screen">
            <div className="logo__container">
                <img src={IsoTrackerLogo} alt="isotrackerLogo" className="logo"/>
                
            </div>
            <div className="text__container">
                <p style={{fontSize:"25px"}}>© Copyright 2021 Technip Iberia, S.A.U - Developed by: J.Reyes-Sztayzel / A.Domínguez-Ortega</p>
            </div>
            <div className="progress__bar">
                <progress value={props.progress} max="100"/>
            </div>
            
        </div>
    );
};

export default LoadingScreen3D;