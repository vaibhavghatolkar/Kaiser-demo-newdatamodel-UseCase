import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls';
import '../color.css'
import Strings from '../../../helpers/Strings';
const bcrypt = require('bcryptjs');

export class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            EmailId: '',
            User_P: '',
            errors: {},
            loginStarted: false,
            disabled: 'block',
        };
        this.loginUser = this.loginUser.bind(this);
        this._onBlur = this._onBlur.bind(this)
        this.lodderfalse = this.lodderfalse.bind(this)

    }

    checkuser = async () => {
        let query = `{
            CheckUser {
              Login
              UserInfo
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        return fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': this.state.EmailId,
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data.CheckUser && res.data.CheckUser.length > 0) {
                    if (res.data.CheckUser[0].UserInfo) {
                        if (bcrypt.compareSync(this.state.User_P, res.data.CheckUser[0].UserInfo)) {
                            this.loginUser(1)
                        } else {
                            this.showAlert()
                        }
                    } else {
                        this.showAlert()
                    }
                } else {
                    this.showAlert()
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    showAlert = () => {
        alert('You have entered wrong username or password')
        this.lodderfalse()
    } 

    loginUser = async (flag) => {
        // event.persist();
        let query = `{
            UserLogin(Login:${flag}) {
              Login, Id, DbTech, role_id
            }
          }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': this.state.EmailId,
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
              
                if (res.data.UserLogin[0].Login == 1) {
                    this.setState({
                        loggedIn: true,
                        loginStarted: false
                    })
                    setTimeout(() => {
                        sessionStorage.setItem("token", "sdjjasdnjas")
                        localStorage.setItem("UserId", res.data.UserLogin[0].Id)
                        localStorage.setItem("DbTech", res.data.UserLogin[0].DbTech)
                        sessionStorage.setItem("role_id", res.data.UserLogin[0].role_id)
                        sessionStorage.setItem("user-id", this.state.EmailId)
                        this.props.handleFlag(this.state.loggedIn)
                      
                    }, 100);
                 
                } else {
                    this.setState({
                        loginStarted: false
                    }, () => {
                        alert("You have entered wrong username or password")
                    })
                }

            }).catch(err => {
                console.log('error is this ', err)
                this.setState({
                    loginStarted: false
                })
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    onHandleChange(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }
    _onBlur() {
        console.log('on blur is hit')
        this.validateForm();
    }

    lodderfalse() {
        this.setState({
            loginStarted: false,
        })
    }

    validateForm() {

        let formIsValid = true;
        if (this.state.User_P == "" && this.state.EmailId == "") {
            formIsValid = false;
            this.refs.User_P.focus();
            this.refs.EmailId.focus();
            alert("Please Enter your UserName & Password.");
            this.lodderfalse()
        }
        else if (this.state.EmailId == "") {
            formIsValid = false;
            this.refs.EmailId.focus();
            alert("Please Enter your UserName .");
            this.lodderfalse()
        }
        else if (this.state.User_P == "") {
            formIsValid = false;
            this.refs.User_P.focus();
            alert("Please Enter your Password.");
            this.lodderfalse()
        }
        else if (this.state.EmailId != "") {
            //regular expression for email validation
            var pattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
            if (!pattern.test(this.state.EmailId)) {
                formIsValid = false;
                alert("Please Enter Valid UserName.");
                this.lodderfalse()
            }
        }

        return formIsValid;

    }
    handleKeyPress = event => {
        if (event.which == 13 || event.keyCode == 13) {
            this.setState({
                loginStarted: true
            }, () => {
                setTimeout(() => {
                    if(this.validateForm()){
                        this.checkuser()
                    }
                }, 100);
            })
        }
    };

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="gradient-color col-9" style={{ minHeight: '100vh', marginLeft: '-15px' }}>
                        <img src={require('../../components/Images/HiPaaS_logo.png')} alt="logo" className="Hipaas_logo" align="center" />
                        <p className="para">HiPaaS is a HIPAA compliant microservices-based Healthcare cloud platform to enable EHR integration, resolve interoperability issues, <br />
                            simplify healthcare standards and aggregate healthcare data
                        </p>
                        <a href="https://www.hipaas.com/" target="blank" className="contact"> Contact Us </a>

                    </div>
                    <div className="col-3 vartical-center" >
                        {this.state.loginStarted == true ?
                            <div style={{ marginLeft: "45%", position: 'absolute', marginTop: '50%' }} class="spinner-border text-muted"></div>
                            : ""}
                        <div style={{ opacity: this.state.loginStarted == true ? '0.4' : '' }} >
                            <div style={{ padding: "20px" }}>
                                <span style={{ color: "var(--gray-dark-color)", fontSize: "16px" }}>Log in to <b>HiPaaS Portal </b></span>
                                <p>Enter your username and password to log into your HiPaaS Portal</p>
                            </div>
                            <div className="form-group" style={{ paddingLeft: "20px", marginTop: "-5px" }}>
                                <label className="header_login"><b>Username</b></label>
                                <input disabled={this.state.loginStarted}
                                    ref="EmailId"
                                    onChange={(e) => this.onHandleChange(e, 'EmailId')} name="email" type="text" className="form-control shadow-none widthText" id="Email"
                                    placeholder="Enter Username" onKeyPress={this.handleKeyPress} />
                                {/* <div className="errorMsg">{this.state.errors.EmailId}</div> */}
                            </div>
                            <div className="form-group" style={{ paddingLeft: "20px" }}>
                                <label className="header_login"><b>Password</b></label>
                                <input disabled={this.state.loginStarted}
                                    ref="User_P" 
                                    onChange={(e) => this.onHandleChange(e, 'User_P')} name="password" type="password" className="form-control shadow-none widthText" id="Password"
                                    placeholder="Enter Password" onKeyPress={this.handleKeyPress} />
                                {/* <div className="errorMsg">{this.state.errors.User_P}</div> */}
                            </div>
                            {/* <div style={{ marginTop: "15px", paddingLeft: "22px" }} >
                            <a href="#" style={{ color: "var(--login-color)", fontSize: "12px" }}>Forgot your password?</a>
                        </div> */}

                            <div style={{ paddingLeft: "10px" }}>
                                <button data-toggle="modal" data-target="#myModal10"
                                    disabled={this.state.loginStarted}
                                    onClick={(event) => {
                                        this.setState({
                                            loginStarted: true,
                                        }, () => {
                                            setTimeout(() => {
                                                if (this.validateForm()) {
                                                    this.checkuser()
                                                }
                                                // this.loginUser(event)
                                            }, 100);
                                        })
                                    }} className="btn btn-demo">Log in to Account</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}