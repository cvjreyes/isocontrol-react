//Tabla de estado de IsoTracker

import "./stateTable.css"
import React, { useState , useEffect} from 'react'

const StateTable = props =>{

    const [designR0, setDesignR0] = useState(0)
    const [designR1, setDesignR1] = useState(0)
    const [designR2, setDesignR2] = useState(0)
    const [designHold, setDesignHold] = useState(0)
    const [designDeleted, setDesignDeleted] = useState(0)
    const [designStock, setDesignStock] = useState(0)
    const [stressR0, setStressR0] = useState(0)
    const [stressR1, setStressR1] = useState(0)
    const [stressR2, setStressR2] = useState(0)
    const [stressHold, setStressHold] = useState(0)
    const [stressDeleted, setStressDeleted] = useState(0)
    const [stressStock, setStressStock] = useState(0)
    const [supportsR0, setSupportsR0] = useState(0)
    const [supportsR1, setSupportsR1] = useState(0)
    const [supportsR2, setSupportsR2] = useState(0)
    const [supportsHold, setSupportsHold] = useState(0)
    const [supportsDeleted, setSupportsDeleted] = useState(0)
    const [supportsStock, setSupportsStock] = useState(0)
    const [materialsR0, setMaterialsR0] = useState(0)
    const [materialsR1, setMaterialsR1] = useState(0)
    const [materialsR2, setMaterialsR2] = useState(0)
    const [materialsHold, setMaterialsHold] = useState(0)
    const [materialsDeleted, setMaterialsDeleted] = useState(0)
    const [materialsStock, setMaterialsStock] = useState(0)
    const [issuerR0, setIssuerR0] = useState(0)
    const [issuerR1, setIssuerR1] = useState(0)
    const [issuerR2, setIssuerR2] = useState(0)
    const [issuerHold, setIssuerHold] = useState(0)
    const [issuerDeleted, setIssuerDeleted] = useState(0)
    const [issuerStock, setIssuerStock] = useState(0)
    const [toIssueR0, setToIssueR0] = useState(0)
    const [toIssueR1, setToIssueR1] = useState(0)
    const [toIssueR2, setToIssueR2] = useState(0)
    const [toIssueHold, setToIssueHold] = useState(0)
    const [toIssueDeleted, setToIssueDeleted] = useState(0)
    const [toIssueStock, setToIssueStock] = useState(0)
    const [issuedR0, setIssuedR0] = useState(0)
    const [issuedR1, setIssuedR1] = useState(0)
    const [issuedR2, setIssuedR2] = useState(0)
    const [issuedDeleted, setIssuedDeleted] = useState(0)
    const [issuedStock, setIssuedStock] = useState(0)
    const [totalR0, setTotalR0] = useState(0)
    const [totalR1, setTotalR1] = useState(0)
    const [totalR2, setTotalR2] = useState(0)
    const [totalHold, setTotalHold] = useState(0)
    const [totalDeleted, setTotalDeleted] = useState(0)
    const [totalStock, setTotalStock] = useState(0)
    const [model, setModel] = useState(0)

    const [progress, setProgress] = useState(0)
    const [progressIso, setProgressIso] = useState(0)
    

    const [realProgressTD, setRealProgressTD] = useState()
    const [realProgressIsoTD, setRealProgressIsoTD] = useState()
    const [realProgressTDValue, setRealProgressTDValue] = useState()
    const [realProgressIsoTDValue, setRealProgressIsoTDValue] = useState()

    const[progressHeader, setProgressHeader] = useState()
    const[progressTD, setProgressTD] = useState()
    const[totalHeader, setTotalHeader] = useState()
    const [totalStockTD, setTotalStockTD] = useState()

    const [pISOHeaderTD, setpISOHeaderTD] = useState()
    const [pISOValueTD, setpISOValueTD] = useState()

    const [loading, setLoading] = useState(true);

    useEffect(async ()=>{
        if(loading){
            if(process.env.REACT_APP_PROGRESS === "0"){
                fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateStatus")
                .then(response => response.json())
                .then(json => {
                    setDesignR0(json["designR0"])
                    setDesignR1(json["designR1"])
                    setDesignR2(json["designR2"])
                    setDesignHold(json["designHold"])
                    setDesignDeleted(json["designDeleted"])
                    setDesignStock(json["designStock"])
                    setStressR0(json["stressR0"])
                    setStressR1(json["stressR1"])
                    setStressR2(json["stressR2"])
                    setStressHold(json["stressHold"])
                    setStressDeleted(json["stressDeleted"])
                    setStressStock(json["stressStock"])
                    setSupportsR0(json["supportsR0"])
                    setSupportsR1(json["supportsR1"])
                    setSupportsR2(json["supportsR2"])
                    setSupportsHold(json["supportsHold"])
                    setSupportsDeleted(json["supportsDeleted"])
                    setSupportsStock(json["supportsStock"])
                    setMaterialsR0(json["materialsR0"])
                    setMaterialsR1(json["materialsR1"])
                    setMaterialsR2(json["materialsR2"])
                    setMaterialsHold(json["materialsHold"])
                    setMaterialsDeleted(json["materialsDeleted"])
                    setMaterialsStock(json["materialsStock"])
                    setIssuerR0(json["issuerR0"])
                    setIssuerR1(json["issuerR1"])
                    setIssuerR2(json["issuerR2"])
                    setIssuerHold(json["issuerHold"])
                    setIssuerDeleted(json["issuerDeleted"])
                    setIssuerStock(json["issuerStock"])
                    setToIssueR0(json["toIssueR0"])
                    setToIssueR1(json["toIssueR1"])
                    setToIssueR2(json["toIssueR2"])
                    setToIssueHold(json["toIssueHold"])
                    setToIssueDeleted(json["toIssueDeleted"])
                    setToIssueStock(json["toIssueStock"])
                    setIssuedR0(json["issuedR0"])
                    setIssuedR1(json["issuedR1"])
                    setIssuedR2(json["issuedR2"])
                    setIssuedDeleted(json["issuedDeleted"])
                    setIssuedStock(json["issuedStock"])
                    setTotalR0(json["totalR0"])
                    setTotalR1(json["totalR1"])
                    setTotalR2(json["totalR2"])
                    setTotalHold(json["totalHold"])
                    setTotalDeleted(json["totalDeleted"])
                    setTotalStock(json["totalStock"])
                    
                    setTotalHeader(<td  className="statusTable__header" style={{backgroundColor:"blue", borderRadius:"0 1em 0 0"}}>Total</td>)
                    setTotalStockTD(<td className="statusTable__state__stock" style={{fontWeight:"bold", color:"black", borderRadius:"0 0 1em 0"}}>{totalStock}</td>)

                    setLoading(false)
                }) 
            }else{
                fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/updateStatus")
                    .then(response => response.json())
                    .then(json => {
                        setDesignR0(json["designR0"])
                    setDesignR1(json["designR1"])
                    setDesignR2(json["designR2"])
                    setDesignHold(json["designHold"])
                    setDesignDeleted(json["designDeleted"])
                    setDesignStock(json["designStock"])
                    setStressR0(json["stressR0"])
                    setStressR1(json["stressR1"])
                    setStressR2(json["stressR2"])
                    setStressHold(json["stressHold"])
                    setStressDeleted(json["stressDeleted"])
                    setStressStock(json["stressStock"])
                    setSupportsR0(json["supportsR0"])
                    setSupportsR1(json["supportsR1"])
                    setSupportsR2(json["supportsR2"])
                    setSupportsHold(json["supportsHold"])
                    setSupportsDeleted(json["supportsDeleted"])
                    setSupportsStock(json["supportsStock"])
                    setMaterialsR0(json["materialsR0"])
                    setMaterialsR1(json["materialsR1"])
                    setMaterialsR2(json["materialsR2"])
                    setMaterialsHold(json["materialsHold"])
                    setMaterialsDeleted(json["materialsDeleted"])
                    setMaterialsStock(json["materialsStock"])
                    setIssuerR0(json["issuerR0"])
                    setIssuerR1(json["issuerR1"])
                    setIssuerR2(json["issuerR2"])
                    setIssuerHold(json["issuerHold"])
                    setIssuerDeleted(json["issuerDeleted"])
                    setIssuerStock(json["issuerStock"])
                    setToIssueR0(json["toIssueR0"])
                    setToIssueR1(json["toIssueR1"])
                    setToIssueR2(json["toIssueR2"])
                    setToIssueHold(json["toIssueHold"])
                    setToIssueDeleted(json["toIssueDeleted"])
                    setToIssueStock(json["toIssueStock"])
                    setIssuedR0(json["issuedR0"])
                    setIssuedR1(json["issuedR1"])
                    setIssuedR2(json["issuedR2"])
                    setIssuedDeleted(json["issuedDeleted"])
                    setIssuedStock(json["issuedStock"])
                    setTotalR0(json["totalR0"])
                    setTotalR1(json["totalR1"])
                    setTotalR2(json["totalR2"])
                    setTotalHold(json["totalHold"])
                    setTotalDeleted(json["totalDeleted"])
                    setTotalStock(json["totalStock"])
                    setModel(json["modelCount"])
                    }) 
                    const options = {
                        method: "GET",
                    }
                    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/currentProgressISO", options)
                    .then(response => response.json())
                    .then(async json =>{
                         await setProgressIso([json.progressISO, json.realprogressISO])
                    })
                    
                    fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/currentProgress", options)
                    .then(response => response.json())
                    .then(async json =>{
                         await setProgress([json.progress, json.realprogress])
                    })
                    if(props.currentRole === "SpecialityLead"){
                        await setRealProgressTD(<td  className="statusTable__header" style={{backgroundColor:"#0070ed"}}>R.P.</td>)
                        await setRealProgressIsoTD(<td  className="statusTable__header" style={{backgroundColor:"#0070ed", borderRadius:"0 1em 0 0"}}>R.P. ISO</td>)
                        await setRealProgressTDValue(<td rowSpan="6" className="statusTable__state">{progress[1]}%</td>)
                        await setRealProgressIsoTDValue(<td rowSpan="6" className="statusTable__state" style={{borderRadius:"0 0 1em 0"}}>{progressIso[1]}%</td>)
                        await setpISOHeaderTD(<td  className="statusTable__header" style={{backgroundColor:"#0070ed"}}>P.ISO</td>)
                        await setpISOValueTD(<td rowSpan="6" className="statusTable__state">{progressIso[0]}%</td>)
                    }else{
                        await setRealProgressTD(null)
                        await setRealProgressIsoTD(null)
                        await setRealProgressTDValue(null)
                        await setRealProgressIsoTDValue(null)
                        await setpISOHeaderTD(<td  className="statusTable__header" style={{backgroundColor:"#0070ed", borderRadius:"0 1em 0 0"}}>P.ISO</td>)
                        await setpISOValueTD(<td rowSpan="6" className="statusTable__state" style={{borderRadius:"0 0 1em 0", borderCollapse:"collapse"}}>{progressIso[0]}%</td>)
                    }
                    await setProgressHeader(<td  className="statusTable__header" style={{backgroundColor:"#0070ed"}}>P.</td>)
                    await setProgressTD(<td rowSpan="6" className="statusTable__state">{progress[0]}%</td> )
                    await setTotalHeader(<td  className="statusTable__header">Total</td>)
                    await setTotalStockTD(<td className="statusTable__state__stock" style={{fontWeight:"bold", color:"black"}}>{totalStock}</td>)
            }

            
            await setLoading(false)
        }
        
        
    },[loading])

    useEffect(async ()=>{
        await setLoading(true)
    }, [props.updateData, props.currentRole])

    

    return (
        
        <td className="statusTable__td">
            <table className="statusTable__table">
                <tbody className="statusTable__body">
                    <tr>
                        <td  className="statusTable__header" style={{backgroundColor: "purple", borderRadius:"1em 0 0 0"}}>M:{model}</td>
                        <td  className="statusTable__header" >Design</td>
                        <td  className="statusTable__header" >Stress</td>
                        <td  className="statusTable__header" >Supports</td>
                        <td  className="statusTable__header" >Materials</td>
                        <td  className="statusTable__header" >Issuer</td>
                        <td  className="statusTable__header" >To issue</td>
                        <td  className="statusTable__header" >Issued</td>
                        {totalHeader}
                        {progressHeader}
                        {pISOHeaderTD}
                        {realProgressTD}
                        {realProgressIsoTD}
                    </tr>
                    <tr>
                        <td className="statusTable__header" style={{backgroundColor:"white", color:"black", fontWeight:"bold"}}>R0</td>
                        <td className="statusTable__state">{designR0}</td>
                        <td className="statusTable__state">{stressR0}</td>
                        <td className="statusTable__state">{supportsR0}</td>
                        <td className="statusTable__state">{materialsR0}</td>
                        <td className="statusTable__state">{issuerR0}</td>
                        <td className="statusTable__state">{toIssueR0}</td>
                        <td className="statusTable__state">{issuedR0}</td>   
                        <td className="statusTable__state">{totalR0}</td>  
                        {progressTD} 
                        {pISOValueTD}  
                        {realProgressTDValue}
                        {realProgressIsoTDValue} 
                    </tr>
                    <tr>
                        <td className="statusTable__header" style={{backgroundColor:"#d1ebf7", color:"black", fontWeight:"bold"}}>R1</td>
                        <td className="statusTable__state_R1">{designR1}</td>
                        <td className="statusTable__state_R1">{stressR1}</td>
                        <td className="statusTable__state_R1">{supportsR1}</td>
                        <td className="statusTable__state_R1">{materialsR1}</td>
                        <td className="statusTable__state_R1">{issuerR1}</td>
                        <td className="statusTable__state_R1">{toIssueR1}</td>
                        <td className="statusTable__state_R1">{issuedR1}</td>   
                        <td className="statusTable__state_R1">{totalR1}</td> 
                  </tr>
                  <tr>
                        <td className="statusTable__header" style={{backgroundColor:"white", color:"black", fontWeight:"bold"}}>R2</td>
                        <td className="statusTable__state_R2">{designR2}</td>
                        <td className="statusTable__state_R2">{stressR2}</td>
                        <td className="statusTable__state_R2">{supportsR2}</td>
                        <td className="statusTable__state_R2">{materialsR2}</td>
                        <td className="statusTable__state_R2">{issuerR2}</td>
                        <td className="statusTable__state_R2">{toIssueR2}</td>
                        <td className="statusTable__state_R2">{issuedR2}</td>   
                        <td className="statusTable__state_R2">{totalR2}</td> 
                  </tr>
                  <tr>
                        <td className="statusTable__header" style={{backgroundColor:"#ff3358", color:"black", fontWeight:"bold"}}>On hold</td>
                        <td className="statusTable__state__hold">{designHold}</td>
                        <td className="statusTable__state__hold">{stressHold}</td>
                        <td className="statusTable__state__hold">{supportsHold}</td>
                        <td className="statusTable__state__hold">{materialsHold}</td>
                        <td className="statusTable__state__hold">{issuerHold}</td>
                        <td className="statusTable__state__hold">{toIssueHold}</td>
                        <td className="statusTable__state__hold">-</td>   
                        <td className="statusTable__state__hold">{totalHold}</td> 
                  </tr>
                  <tr>
                        <td className="statusTable__header" style={{backgroundColor:"#C0C0C0", color:"black", fontWeight:"bold"}}>Deleted</td>
                        <td className="statusTable__state__deleted">{designDeleted}</td>
                        <td className="statusTable__state__deleted">{stressDeleted}</td>
                        <td className="statusTable__state__deleted">{supportsDeleted}</td>
                        <td className="statusTable__state__deleted">{materialsDeleted}</td>
                        <td className="statusTable__state__deleted">{issuerDeleted}</td>
                        <td className="statusTable__state__deleted">{toIssueDeleted}</td>
                        <td className="statusTable__state__deleted">{issuedDeleted}</td>   
                        <td className="statusTable__state__deleted">{totalDeleted}</td> 
                  </tr>
                  <tr>
                        <td className="statusTable__header" style={{backgroundColor:"#94dcaa", borderRadius:"0 0 0 1em", color:"black", fontWeight:"bold", border: "0px solid black"}}>Stock</td>
                        <td className="statusTable__state__stock">{designStock}</td>
                        <td className="statusTable__state__stock">{stressStock}</td>
                        <td className="statusTable__state__stock">{supportsStock}</td>
                        <td className="statusTable__state__stock">{materialsStock}</td>
                        <td className="statusTable__state__stock">{issuerStock}</td>
                        <td className="statusTable__state__stock">{toIssueStock}</td>
                        <td className="statusTable__state__stock">{issuedStock}</td>   
                        {totalStockTD}
                  </tr>
                </tbody>
            </table>
        </td>
    );
};

export default StateTable;