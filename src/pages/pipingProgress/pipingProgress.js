
import React, { useState , useEffect} from 'react'
import { HotTable } from '@handsontable/react';
import IdleTimer from 'react-idle-timer'
import {useHistory} from "react-router";
import ArrowImage from "../../assets/images/ArrowLeft.svg"
import AlertF from "../../components/alert/alert"
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse'
import SaveIcon from "../../assets/images/save.svg"
import { Line } from 'react-chartjs-2';
import NavBarProdCurve from '../../components/navBarProdCurve/navBarProdCurve';
import { SettingsCellSharp } from '@mui/icons-material';


const PipingProgress = () =>{

    const history = useHistory();

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


    const [updateData, setUpdateData] = useState(false)
    const [updateRows, setUpdateRows] = useState(false)
    const [management, setManagement] = useState([])

    const [estimatedData, setEstimatedData] = useState([])
    const [forecastData, setForecastData] = useState([])
    const [progressData, setProgressData] = useState([])
    const [cells, setCells] = useState()
    const [overallTable, setOverallTable] = useState()


    const [success, setSuccess] = useState(false)
    const [spanAlert, setSpanAlert] = useState(false)
    const [pipingAlert, setPipingAlert] = useState(false)
    const [materialsAlert, setMaterialsAlert] = useState(false)


    const [lineChart, setLineChart] = useState()

    const [loading, setLoading] = useState(false)


    document.body.style.zoom = 1

    
    function handleOnIdle(){
        const body = {
            user: secureStorage.getItem("user"),
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/exitEditCSP", options)
            .then(response => response.json())
            .then(async json => {

            })
        secureStorage.clear()
        history.push("/" + process.env.REACT_APP_PROJECT)
    }

    async function submitEstimatedForecastIFD(){ //Submit del forecast de isocontrol
        const body ={
            estimated: estimatedData,
            forecast: forecastData
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitEstimatedForecastIFD", options)
        .then(response => response.json())
        .then(async json => {
            if(json.success){
                await setSuccess(true)
                await setUpdateData(!updateData)
            }
        })        
    }

    const spanSettings = {
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: 215,
        //... other options
    }

    useEffect(async() =>{   
        await setLoading(true)
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }

        //Obtenemos el project span
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectSpan", options)
            .then(response => response.json())
            .then(async json => {
                const span = json.span
                if(span.length > 0){
                    await setManagement({"Starting date": span[0].starting_date.toString().substring(8,10) + "/" + span[0].starting_date.toString().substring(5,7) + "/" + span[0].starting_date.toString().substring(0,4), "Finishing date": span[0].finishing_date.toString().substring(8,10) + "/" + span[0].finishing_date.toString().substring(5,7) + "/" + span[0].finishing_date.toString().substring(0,4)})
                }else{
                    await setManagement({"Starting date": "", "Finishing date": ""})
                }

            //Obtenemos el progreso de isocontrol
            await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isocontrolProgress", options)
            .then(response => response.json())
            .then(async json => {
                const progress = json.progress
                let p = []
                let pw = []
                let p_table = []
                //Rellenamos los arrays con los datos del progreso con los que montaremos la tabla y la grafica
                for(let i = 0; i < progress.length; i++){
                    p.push(progress[i].progress)
                    if(progress[i].progress){
                        p_table.push(progress[i].progress)
                    }else{
                        p_table.push('') 
                    }
                    pw.push("w" + progress[i].week)
                }
                //Lo mismo para las estimadas
                await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isocontrolEstimated", options)
                .then(response => response.json())
                .then(async json => {
                    const estimated = json.progress
                    let e = []
                    let ew = []
                    let e_table = estimatedData
                    let cells = []
                    
                    for(let i = 0; i < estimated.length; i++){
                        e.push(estimated[i].progress)
                        if(estimated[i].progress){
                            e_table.push(estimated[i].progress)
                        }else{
                            e_table.push('') 
                        }
                        if(!p_table[i]){
                            p_table[i] = ''
                        }
                        ew.push("w" + estimated[i].week)
                        cells.push({row: 0, col: i, readOnly:true})
                    }
                    //Y lo mismo para el forecast
                    await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/isocontrolForecast", options)
                    .then(response => response.json())
                    .then(async json => {
                        const forecast = json.progress
                        let f = []
                        let f_table = forecastData
                        let fw = []
                        for(let i = 0; i < forecast.length; i++){
                            f.push(forecast[i].progress)
                            if(forecast[i].progress){
                                f_table.push(forecast[i].progress)
                            }else{
                                f_table.push('') 
                            }
                            fw.push("w" + forecast[i].week)
                        }

                        let labels = null
                        if(pw.length > ew.length){
                            labels = pw
                        }else{
                            labels = ew
                        }

                        let tableHeaders = []
                        for(let i = 0; i < e_table.length; i++){
                            tableHeaders.push(i+1)
                        }

                        const settings = {
                            licenseKey: 'non-commercial-and-evaluation',
                            colWidths: 40,
                            rowHeaderWidth: 190
                            //... other options
                        }

                        let overallTable = []
                        await setEstimatedData(e_table)
                        await setForecastData(f_table)
                        await setCells(cells)
                        await setTimeout(async function () {
                            //Generamos la tabla de overall
                            await overallTable.push(<div id="hot-app" style={{borderBottom:"1px solid lightgray", borderTop:"1px solid lightgray", width:"1750px", paddingBottom:"30px", paddingTop:"30px", marginTop:"20px"}}><div style={{display: "flex"}}><text className="materials__title">Progress</text><button className="save__button" onClick={()=> submitEstimatedForecastIFD()}><img src={SaveIcon} alt="save" className="save__icon"></img></button></div>
                        <div style={{marginTop:"10px"}}><HotTable
                                data={[p_table, e_table, f_table]}
                                colHeaders={tableHeaders}
                                rowHeaders={["Real progress", "Estimated progress", "Forecast"]}
                                width="1750"
                                height="138"
                                settings={settings} 
                                manualColumnResize={true}
                                manualRowResize={true}
                                filters={true}
                                className='progress-table'
                                cell={cells}
                            /></div></div>)

                        await setOverallTable(overallTable)
                        }, 1000);
                        
                        //Creamos la grafica de progreso con el progreso real, estimado y forecast
                        await setLineChart(<Line
                            data={{
                                labels: labels,
                                datasets: [{
                                    label: 'Progress',
                                    fill: false,
                                    lineTension: 0.2,
                                    backgroundColor: 'rgb(147,112,219)',
                                    borderColor: 'rgb(147,112,219)',
                                    borderWidth: 1,
                                    data: p
                                },{
                                    label: 'Estimated',
                                    fill: false,
                                    lineTension: 0.2,
                                    backgroundColor: 'rgb(255,80,80)',
                                    borderColor: 'rgb(255,80,80)',
                                    borderWidth: 1,
                                    data: e
                                },{
                                    label: 'Forecast',
                                    fill: false,
                                    lineTension: 0.2,
                                    backgroundColor: 'rgb(34,139,34)',
                                    borderColor: 'rgb(34,139,34)',
                                    borderWidth: 1,
                                    data: f
                                }],
                            }}
                            options={{
                                hover: {
                                    mode: 'new mode'
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100
                                    }
                                },
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "PROGRESS (%)",
                                        font: {size: "22px", family:"Quicksand"}
                                    },
                                    legend: {
                                        display: true,
                                        position: "left",
                                        labels: {
                                            filter: function (legendItem, chartData) {
                                                    chartData.datasets[legendItem.datasetIndex].hidden = true
                                                return true
                                            },
                                        },
                                    },
                                    
                                },
                            }}
                        />)
                    })
                })
            })
            })
        await setLoading(false)
    }, [updateData])

    

    async function submitManagement(){ //Submit del span del proyecto
        const body ={
            span : management
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
        await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/submitProjectSpan", options)
        .then(response => response.json())
        .then(async json => {
            if(json.success){
                await setSpanAlert(true)
                await setUpdateData(!updateData)
            }
        })
    }


    return(

        <body style={{overflow:"hidden", height:"100vh"}}>
            {updateData}
            {updateRows}
            <IdleTimer
                timeout={1000 * 60 * 15}
                onIdle={handleOnIdle}
                debounce={250}
            />
            <NavBarProdCurve/>
            <div className={`alert alert-success ${spanAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => setSpanAlert(false)}>
                <AlertF type="success" text="Project week span saved!" margin="0px"/>
            </div>
            <div className={`alert alert-success ${pipingAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => setPipingAlert(false)}>
                <AlertF type="success" text="Piping classes saved!" margin="0px"/>
            </div>
            <div className={`alert alert-success ${materialsAlert ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => setMaterialsAlert(false)}>
                <AlertF type="success" text="Materials saved!" margin="0px"/>
            </div>
            <div className={`alert alert-success ${success ? 'alert-shown' : 'alert-hidden'}`} onTransitionEnd={() => setSuccess(false)}>
                <AlertF type="success" text="Changes saved!" margin="0px"/>
            </div>
            <Collapse in={loading}>
                <Alert style={{fontSize:"16px",position: "fixed", left: "50%", top:"10%", transform: "translate(-50%, -50%)",zIndex:"0"}} severity="info"
                    >
                    Processing...
                </Alert>
            </Collapse>
            <div id="pdf">
                <div style={{marginLeft: "100px", marginBottom: "-120px"}}>
                    <button className="back__button" onClick={()=>history.push('/'+process.env.REACT_APP_PROJECT+'/piping')} style={{width:"180px", marginTop: "80px"}}><img src={ArrowImage} alt="hold" className="navBar__icon" style={{marginRight:"0px", height: "30px"}}></img><p className="back__button__text">Back to menu</p></button>
                </div>
                <div className="top__container">
                    {/*{tabBtns}
                    <div className={`Cabecera ${ menu ? 'isActive' : '' }` }>
                            <button 
                                onClick={ toggleMenu }
                                className="Cabecera__button">
                                <svg className="Cabecera__svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                            </button>
                            <nav className={`Cabecera__nav ${ menu ? 'isActive' : '' }` }>
                                
                                {/* Menu Users *
                                <button className={`Cabecera__titulo ${ menuUsers ? 'isActiveUsers' : '' }` } onClick={ toggleMenuUsers }>
                                    <img src={ArrowDownImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "10px"}}></img>
                                    Users 
                                </button>
                                <ul className={`Cabecera__ul ${ menuUsers ? 'isActiveUsers' : '' }` }>
                                    <li className="Cabecera__li">
                                        <img src={WeightImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "22px"}}></img>
                                        <a onClick={async() => await setTab("weight")} className="Cabecera__a">By Weights</a>
                                    </li>
                                    <li className="Cabecera__li">
                                        <img src={IsometricsImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "22px"}}></img>
                                        <a onClick={async() => await setTab("prod")} className="Cabecera__a">By Isometrics</a>
                                    </li>
                                </ul>

                                {/* Menu Production *

                                <button className={`Cabecera__titulo ${ menuProduction ? 'isActiveProduction' : '' }` } onClick={ toggleMenuProduction }>
                                    <img src={ArrowDownImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "10px"}}></img>
                                    Production 
                                </button>
                                <ul className={`Cabecera__ul ${ menuProduction ? 'isActiveProduction' : '' }` }>
                                    <li className="Cabecera__li">
                                        <img src={WeightImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "22px"}}></img>
                                        <a onClick={async() => await setTab("weight")} className="Cabecera__a">By Weight</a>
                                    </li>
                                    <li className="Cabecera__li">
                                        <img src={AtomImage} alt="hold" className="Cabecera__navBar__icon" style={{marginRight:"5px", height: "22px"}}></img>
                                        <a onClick={async() => await setTab("weight")} className="Cabecera__a">By Material</a>
                                    </li>
                                </ul>

                            </nav>
                        </div>*/}
                    <div id="graph" className='graph__container'>
                        {lineChart}
                    </div>
                    <div className="materials__pc__container" style={{marginTop: "155px"}}>
                            <div style={{display:"flex"}}>
                                <text className="materials__title">Project Management</text>
                                <button className="save__button" onClick={()=> submitManagement()}><img src={SaveIcon} alt="save" className="save__icon"></img></button>
                            </div>
                            <div style={{marginBottom:"20px", marginTop:"10px"}}>
                                <HotTable
                                    data={management}
                                    colHeaders = {["<b>Starting date</b>", "<b>Finishing date</b>"]}
                                    width="500"
                                    height="60"
                                    settings={spanSettings} 
                                    manualColumnResize={true}
                                    manualRowResize={true}
                                    columns= {[{ data: "Starting date", type:"date"}, { data: "Finishing date", type:"date"}]}
                                    className='project__management'
                                />
                            </div>
                        </div>
                </div>
                <div className="materials__tables__container">
                    {overallTable}
                </div>
            </div>
        </body>
    );
};

export default PipingProgress;