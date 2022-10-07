import React, { Component } from 'react';
import UploadReportPopUp from "../../components/uploadReportPopUp/uploadReportPopUp"
import UploadEquisModelledPopUp from "../../components/uploadEquisModelledPopUp/uploadEquisModelledPopUp"
import UploadEquisEstimatedPopUp from "../../components/uploadEquisEstimatedPopUp/uploadEquisEstimatedPopUp"
import UploadInstrumentationModelledPopUp from '../uploadInstrumentationModelledPopUp/uploadInstrumentationModelledPopUp';
import UploadInstrumentationEstimatedPopUp from '../uploadInstrumentationEstimatedPopUp/uploadInstrumentationEstimatedPopUp';
import UploadCivilEstimatedPopUp from '../uploadCivilEstimtedPopUp/uploadCivilEstimtedPopUp';
import UploadCivilModelledPopUp from '../uploadCivilModelledPopUp/uploadCivilModelledPopUp';
import UploadElectricalEstimatedPopUp from '../uploadElectricalEstimatedPopUp/uploadElectricalEstimatedPopUp';
import UploadElectricalModelledPopUp from '../uploadElectricalModelledPopUp/uploadElectricalModelledPopUp';
import UploadPipesEstimatedPopUp from '../uploadPipesEstimatedPopUp/uploadPipesEstimatedPopUp';
import UploadBOMPopUp from '../updateBOMPopUp/updateBOMPopUp';

export default class ReportBoxBtns extends Component {

    setErrorReport(){
        this.props.setErrorReport();
    }

    setUploading(active){
        this.props.setUploading(active)
    }

    setErrorReportData(index){
        this.props.setErrorReportData(index)
    }



    render() {
        let adminBtns, modelledBtn, bomBtn = null
        if(this.props.user === "super@user.com"){
            adminBtns = <div><button className="btn btn-bg btn-info" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadStatus3D()}>Status 3D</button>
            <UploadReportPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)}/>
            <UploadPipesEstimatedPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadEquisModelledPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadEquisEstimatedPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadInstrumentationModelledPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadInstrumentationEstimatedPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadCivilModelledPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadCivilEstimatedPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadElectricalModelledPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            <UploadElectricalEstimatedPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)} setErrorReportData={this.setErrorReportData.bind(this)}/>
            </div>

        }


        if(this.props.role === "Materials" || this.props.role === "SpecialityLead"){
            bomBtn = <UploadBOMPopUp setUploading={this.setUploading.bind(this)} setErrorReport={this.setErrorReport.bind(this)}/>
        }

        if(process.env.REACT_APP_PROGRESS === "1"){
            modelledBtn = <button className="btn btn-bg btn-success" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadModelled()}>Modelled</button>

        }else{
            modelledBtn = null
        }
        return (
            <div>
                <button className="btn btn-bg btn-success" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadHistory()}>Comments</button>
                <button className="btn btn-bg btn-success" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadStatus()}>Status</button>
                <button className="btn btn-bg btn-success" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadPI()}>SPO-SIT</button>
                <button className="btn btn-bg btn-success" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadIssued()}>Issued</button>
                <button className="btn btn-bg btn-success" style={{float:"left", marginTop:"10px", marginLeft:"10px", height:"150px", width:"150px"}} onClick={() => this.props.downloadUsers()}>Users</button>
                {bomBtn}
                {modelledBtn}
                {adminBtns}
                
            </div>
        );
    }
}