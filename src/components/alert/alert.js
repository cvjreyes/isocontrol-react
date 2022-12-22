import React, { Component } from "react";
import SuccessIcon from "../../assets/images/CheckCircle.png";
import ErrorIcon from "../../assets/images/WarningCircle.png";
import WarningIcon from "../../assets/images/Warning.png";
import "./alert.css";

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      text: props.text,
      alert: null,
      subtext: props.subtext,
      popUp: props.popUp,
      change: props.change,
    };
  }

  componentDidMount() {
    let alertComponent = null;
    if (this.state.type === "success") {
      if (this.state.change) {
        alertComponent = (
          <div className="alert__success" style={{ zIndex: "3" }}>
            <img src={SuccessIcon} className="alert__icon" alt="success"></img>
            <div className="text__alert__container">
              <p className="alert__title">Excellent!</p>
              <p className="alert__text" style={{ marginLeft: "0px" }}>
                {this.props.text}
              </p>
            </div>
          </div>
        );
      } else {
        alertComponent = (
          <div className="alert__success" style={{ zIndex: "3" }}>
            <img src={SuccessIcon} className="alert__icon" alt="success2"></img>
            <div className="text__alert__container">
              <p className="alert__title">Excellent!</p>
              <p
                className="alert__text"
                style={{ marginLeft: this.props.margin }}
              >
                {this.props.text}
              </p>
            </div>
          </div>
        );
      }
      this.setState({ alert: alertComponent });
    } else if (this.state.type === "error") {
      if (this.state.change) {
        alertComponent = (
          <div className="alert__error" style={{ zIndex: "3" }}>
            <img src={ErrorIcon} className="alert__icon" alt="error"></img>
            <div className="text__alert__container">
              <p className="alert__title">Oops!</p>
              <p className="alert__error__text" style={{ marginLeft: "0px" }}>
                {this.props.text}
              </p>
              <p
                className="alert__subtext"
                style={{ marginLeft: this.props.margin }}
              >
                {this.props.subtext}
              </p>
            </div>
          </div>
        );
      } else {
        alertComponent = (
          <div className="alert__error">
            <img src={ErrorIcon} className="alert__icon" alt="error2"></img>
            <div className="text__alert__container">
              <p className="alert__title">Oops!</p>
              <p className="alert__error__text">{this.props.text}</p>
              <p
                className="alert__subtext"
                style={{ marginLeft: this.props.margin }}
              >
                {this.props.subtext}
              </p>
            </div>
          </div>
        );
      }
      this.setState({ alert: alertComponent });
    } else if (this.state.type === "qtracker") {
      alertComponent = (
        <div className="alert__qtracker">
          <img src={SuccessIcon} className="alert__icon" alt="success"></img>
          <div className="text__alert__container">
            <p className="alert__title">Success</p>
            <p className="alert__text" style={{ marginLeft: "-1px" }}>
              Request sent successfully!
            </p>
          </div>
        </div>
      );
      this.setState({ alert: alertComponent });
    } else {
      if (this.state.popUp) {
        if (this.state.type === "successPopUp") {
          alertComponent = (
            <div className="alert__success" style={{ marginTop: "-200px" }}>
              <img
                src={WarningIcon}
                className="alert__icon"
                alt="success"
              ></img>
              <div className="text__alert__container">
                <p className="alert__title" style={{ width: "300px" }}>
                  Success
                </p>
                <p className="alert__text" style={{ marginLeft: "5px" }}>
                  {this.props.text}
                </p>
              </div>
            </div>
          );
        } else {
          alertComponent = (
            <div className="alert__warning" style={{ marginTop: "-200px" }}>
              <img
                src={WarningIcon}
                className="alert__icon"
                alt="warning"
              ></img>
              <div className="text__alert__container">
                <p className="alert__title">Warning</p>
                <p className="alert__text">{this.props.text}</p>
              </div>
            </div>
          );
        }
      } else {
        alertComponent = (
          <div className="alert__warning">
            <img src={WarningIcon} className="alert__icon" alt="warning2"></img>
            <div className="text__alert__container">
              <p className="alert__title">Warning</p>
              <p
                className="alert__text"
                style={{ marginLeft: this.props.margin }}
              >
                {this.props.text}
              </p>
            </div>
          </div>
        );
      }
      this.setState({ alert: alertComponent });
    }
  }

  render() {
    return <div className="alert__container__fade">{this.state.alert}</div>;
  }
}
