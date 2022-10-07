//Lista que muestra las diferentes aplicaciones de IsoTracker y su progreso

import './menuList.css'
import FileIcon from "../../assets/images/file-icon.png"
import ChartColorIcon from "../../assets/images/chart-color-icon.png"
import PipeIcon from "../../assets/images/pipe-icon.png"
import EquiIcon from "../../assets/images/equi-icon.png"
import StruIcon from "../../assets/images/stru-icon.png"
import ElecIcon from "../../assets/images/elec-icon.png"
import InstIcon from "../../assets/images/inst-icon.png"
import React, { useState, useEffect } from 'react';

const MenuList = () =>{

    //Existe un estado para cada opción del menu
    const [isoIsShown, setIsoIsShown] = useState(false);
    const [progIsShown, setProgIsShown] = useState(false);
    const [pipeIsShown, setPipeIsShown] = useState(false);
    const [equipIsShown, setEquipIsShown] = useState(false);
    const [civIsShown, setCivIsShown] = useState(false);
    const [instIsShown, setInstIsShown] = useState(false);
    const [elecIsShown, setElecIsShown] = useState(false);

    const [pipesWeight, setPipesWeight] = useState()
    const [pipesProgress, setPipesProgress] = useState()
    const [pipesProgressWidth, setPipesProgressWidth] = useState()

    const [equisWeight, setEquisWeight] = useState()
    const [equisProgress, setEquisProgress] = useState()
    const [equisProgressWidth, setEquisProgressWidth] = useState()

    const [civilsWeight, setCivilsWeight] = useState()
    const [civilsProgress, setCivilsProgress] = useState()
    const [civilsProgressWidth, setCivilsProgressWidth] = useState()

    const [instsWeight, setInstsWeight] = useState()
    const [instsProgress, setInstsProgress] = useState()
    const [instsProgressWidth, setInstsProgressWidth] = useState()

    const [elecsWeight, setElecsWeight] = useState()
    const [elecsProgress, setElecsProgress] = useState()
    const [elecsProgressWidth, setElecsProgressWidth] = useState()

    const [totalWeight, setTotalWeight] = useState()
    const [totalProgress, setTotalProgress] = useState()
    const [totalProgressWidth, setTotalProgressWidth] = useState()

    const [progressButtons, setProgressButtons] = useState()
    const [refresh, setRefresh] = useState(false)


    useEffect(async ()=>{

            if(process.env.REACT_APP_PROGRESS === "1"){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }

            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/pipingWeight", options)
                .then(response => response.json())
                .then(async json => {
                    await setPipesWeight(json.weight)
                    await setPipesProgress(json.progress)
                    await setPipesProgressWidth(json.progress + "%")
                }
                )
                .catch(error => {
                    console.log(error);
                })   

            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/equipments/weight", options)
                .then(response => response.json())
                .then(async json => {
                    await setEquisWeight(json.weight)
                    await setEquisProgress(json.progress)
                    await setEquisProgressWidth(json.progress+"%")
                }
                )
                .catch(error => {
                    console.log(error);
                }) 
                
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/civils/weight", options)
                .then(response => response.json())
                .then(async json => {
                    await setCivilsWeight(json.weight)
                    await setCivilsProgress(json.progress)
                    await setCivilsProgressWidth(json.progress + "%")
                }
                )
                .catch(error => {
                    console.log(error);
                }) 
                
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/instrumentation/weight", options)
                .then(response => response.json())
                .then(async json => {
                    await setInstsWeight(json.weight)
                    await setInstsProgress(json.progress)
                    await setInstsProgressWidth(json.progress + "%")
                }
                )
                .catch(error => {
                    console.log(error);
                })   

            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/electrical/weight", options)
                .then(response => response.json())
                .then(async json => {
                    await setElecsWeight(json.weight)
                    await setElecsProgress(json.progress)
                    await setElecsProgressWidth(json.progress + "%")
                }
                )
                .catch(error => {
                    console.log(error);
                })   
                await setTotalWeight(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)
                await setTotalProgress(((pipesWeight/totalWeight) * pipesProgress + (equisWeight/totalWeight) * equisProgress + (civilsWeight/totalWeight) * civilsProgress + (instsWeight/totalWeight) * instsProgress + (elecsWeight/totalWeight) * elecsProgress).toFixed(2))
                await setTotalProgressWidth(totalProgress+"%")
            }
        
    },[])   

    //((pipesWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * pipesProgress + (equisWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * equisProgress + (civilsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * civilsProgress + (instsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * instsProgress + (elecsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * elecsProgress).toFixed(2)

    useEffect(async() =>{
        if(process.env.REACT_APP_PROGRESS === "1"){
            setProgressButtons(<div>
                <div className="panel__content__container">
            <div>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/3dprogress"} style={{textDecoration: "none"}}>
                    <h4  className="panel__icon__container" onMouseEnter={() => setProgIsShown(true)} onMouseLeave={() => setProgIsShown(false)}><img src={ChartColorIcon} alt="chart" className="panel__icon"/>&nbsp;&nbsp;&nbsp;3D Progress (Weight: {pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight} | 100%)</h4>
                </a>
                <div class="progress" style={{height: "30px"}}>
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{color: "black", fontSize: "15px", width: ((pipesWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * pipesProgress + (equisWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * equisProgress + (civilsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * civilsProgress + (instsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * instsProgress + (elecsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) * elecsProgress).toFixed(2)+"%", backgroundColor: "#94dcaa",textAlign: "center"}}>
                        <span class="sr-only"></span><strong>{(pipesProgress*(pipesWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) + equisProgress*(equisWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) + instsProgress*(instsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) + civilsProgress*(civilsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)) + elecsProgress*(elecsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight))).toFixed(2)}%</strong>                                         
                    </div>
                </div>
            </div>
        </div>
        <div className="panel__content__container">
            <div>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/piping"} style={{textDecoration: "none"}}>
                    <h4 className="panel__icon__container" onMouseEnter={() => setPipeIsShown(true)} onMouseLeave={() => setPipeIsShown(false)}><img src={PipeIcon} alt="pipe" className="panel__icon"/>&nbsp;&nbsp;&nbsp;Piping (Weight: {pipesWeight} | {(pipesWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)*100).toFixed(2)}%)</h4>        
                </a>
                <div class="progress" style={{height: "25px"}}>
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{color: "black", fontSize: "15px", width: pipesProgressWidth, backgroundColor: "#94dcaa",textAlign: "center"}}>
                        <span class="sr-only"></span><strong>{pipesProgress}%</strong>                                       
                    </div>
                </div>          
            </div>
        </div>
        <div className="panel__content__container">
            <div>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/equipments"}style={{textDecoration: "none"}}>
                    <h4 className="panel__icon__container" onMouseEnter={() => setEquipIsShown(true)} onMouseLeave={() => setEquipIsShown(false)}><img src={EquiIcon} alt="equi" className="panel__icon"/>&nbsp;&nbsp;&nbsp;Equipment (Weight: {equisWeight} | {(equisWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)*100).toFixed(2)}%)</h4>                   
                </a>
                <div class="progress" style={{height: "25px"}}>
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{color: "black", fontSize: "15px", width: equisProgressWidth, backgroundColor: "#94dcaa",textAlign: "center"}}>
                        <span class="sr-only"></span><strong>{equisProgress}%</strong>                                         
                    </div>
                </div>
            </div>
        </div>
        <div className="panel__content__container">
            <div>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/civil"}style={{textDecoration: "none"}}>
                    <h4  className="panel__icon__container" onMouseEnter={() => setCivIsShown(true)} onMouseLeave={() => setCivIsShown(false)}><img src={StruIcon} alt="stru" className="panel__icon"/>&nbsp;&nbsp;&nbsp;Civil (Weight: {civilsWeight} | {(civilsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)*100).toFixed(2)}%)</h4> 
                </a>
                <div class="progress" style={{height: "25px"}}>
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{color: "black", fontSize: "15px", width: civilsProgressWidth, backgroundColor: "#94dcaa",textAlign: "center"}}>
                        <span class="sr-only"></span><strong>{civilsProgress}%</strong>                                        
                    </div>
                </div>         
            </div>
        </div>
        <div className="panel__content__container">
            <div >
                <a href={"/"+process.env.REACT_APP_PROJECT+"/instrumentation"}style={{textDecoration: "none"}} className="panel__content__link">
                    <h4 className="panel__icon__container" onMouseEnter={() => setInstIsShown(true)} onMouseLeave={() => setInstIsShown(false)}><img src={InstIcon} alt= "inst" className="panel__icon"/>&nbsp;&nbsp;&nbsp;Instrumentation (Weight: {instsWeight} | {(instsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)*100).toFixed(2)}%)</h4>         
                </a>
                <div class="progress" style={{height: "25px"}}>
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{color: "black", fontSize: "15px", width: instsProgressWidth, backgroundColor: "#94dcaa",textAlign: "center"}}>
                        <span class="sr-only"></span><strong>{instsProgress}%</strong>                                         
                    </div>
                </div>   
            </div>
        </div>
        <div className="panel__content__container">
            <div>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/electrical"} style={{textDecoration: "none"}} className="panel__content__link">
                    <h4 className="panel__icon__container" onMouseEnter={() => setElecIsShown(true)} onMouseLeave={() => setElecIsShown(false)}><img src={ElecIcon} alt="inst" className="panel__icon"/>&nbsp;&nbsp;&nbsp;Electrical (Weight: {elecsWeight} | {(elecsWeight/(pipesWeight + equisWeight + instsWeight + civilsWeight + elecsWeight)*100).toFixed(2)}%)</h4>
                </a>
                <div class="progress" style={{height: "25px"}}>
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{color: "black", fontSize: "15px", width: elecsProgressWidth, backgroundColor: "#94dcaa",textAlign: "center"}}>
                        <span class="sr-only"></span><strong>{elecsProgress}%</strong>                                         
                    </div>
                </div>
                
            </div>
        </div>   </div>)
        }else{
            setProgressButtons(<div className="panel__content__container">
            <div>
                <a href={"/"+process.env.REACT_APP_PROJECT+"/isotracker"} style={{textDecoration: "none"}}>
                    <h4 className="panel__icon__container" onMouseEnter={() => setIsoIsShown(true)} onMouseLeave={() => setIsoIsShown(false)} ><img src={FileIcon} alt="file" className="panel__icon"/>&nbsp;&nbsp;&nbsp;IsoTracker</h4>
                    <div className="progress__bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                        <span class="sr-only"></span><strong>Open</strong>
                    </div>
                </a> 
            </div>
        </div>)
        }
    },[totalProgressWidth, refresh, isoIsShown, progIsShown, pipeIsShown, equipIsShown, civIsShown, instIsShown, elecIsShown])

    if(!refresh){
        setRefresh(true)
    }
    

    return(
        <div class="panel__container">
            <div className="panel__heading__container">
                <h4>
                    <text className="panel__heading__text"><strong style={{fontWeight:"700"}}>3D</strong>Tracker</text>
                </h4>
            </div>

            <div className="elements__container">
                <div className="menu">
                    <div className="panel__content__container__title">
                    <a href={"/"+process.env.REACT_APP_PROJECT+"/isotracker"} style={{textDecoration: "none"}}>
                        <h4 className="click__text">Click here to open</h4>
                        <h4 className="iso__title__menu">ISO<text style={{fontWeight:"100"}}>Tracker</text></h4>
                        </a>
                    </div>
                        
                    <h4 className="disciplines__text">You can also click any of the items below to check disciplines.</h4>

                    {progressButtons}
                </div>
                
            </div>
            
            
        </div>
    );
};

export default MenuList;