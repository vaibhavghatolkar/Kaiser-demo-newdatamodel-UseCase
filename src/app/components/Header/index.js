import React from 'react'
import './styles.css'
import "../../containers/color.css";
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
const $ = window.$;
const bcrypt = require('bcryptjs');

export class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            oldText: '',
            newText: '',
            confirmNewText: ''

        };
        this._onBlur = this._onBlur.bind(this);

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
                'user-id': sessionStorage.getItem('user-id'),
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
                        if (bcrypt.compareSync(this.state.oldText, res.data.CheckUser[0].UserInfo)) {
                            this.updateText(1)
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
        alert('You have entered wrong old password')
    }

    updateText = (flag) => {
        // event.preventDefault();
        let userId = localStorage.getItem("UserId")
        var salt = bcrypt.genSaltSync(10);
        var EncryptedOldText = bcrypt.hashSync(this.state.oldText, salt);
        var EncryptedNewText = bcrypt.hashSync(this.state.newText, salt);
        $("#myModal10").modal("hide");
        let query = `mutation{
            UpdateUserInfoNew(Id:`+ userId + ` OldPassword:"` + EncryptedOldText + `" NewPassword:"` + EncryptedNewText + `" ForgotOrNot:1,Login:${flag})
          }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let message = res.data.UpdateUserInfoNew
                alert(message);
                window.location.reload()
            }).catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }
    validation() {
        let errors = {};
        let formIsValid = true;
        debugger;
        if (this.state.oldText == "") {
            formIsValid = false;
            this.refs.oldText.focus();
            alert("Please Enter your Old Password.");

        }
        else if (this.state.newText == "") {
            formIsValid = false;
            this.refs.newText.focus();
            alert("Please Enter your New Password.");

        }
        else if (this.state.newText != "") {
            let pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
            if (!pattern.test(this.state.newText)) {
                formIsValid = false;
                this.refs.newText.focus();
                alert("Please Enter Valid New Password.");
            }

            else if (this.state.confirmNewText == "") {
                formIsValid = false;
                this.refs.confirmNewText.focus();
                alert("Please Enter your Confirm Password.");
            }


            else if (this.state.confirmNewText != "") {
                let _pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
                if (!_pattern.test(this.state.confirmNewText)) {
                    formIsValid = false;
                    this.refs.confirmNewText.focus();
                    alert("Please Enter Valid Confirm Password.");
                }
                else if (this.state.confirmNewText != this.state.newText) {
                    formIsValid = false;
                    alert("Your New Password and Confirmation Password do not Match.");
                }
            }
        }



        this.setState({
            errors: errors
        });
        return formIsValid;

    }

    _onBlur() {
        this.validation()
    }

    onHandleChange = (event, name) => {
        this.setState({
            [name]: event.target.value
        });
    }

    logoutSession = () => {
        let query = `{
            Logout {
              Logout
            }
          }`
        console.log(query)
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {

            }).catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    logout = () => {
        this.logoutSession()
        setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload()
        }, 50);
    }
    siderbar() {

        $('#sidebar').toggleClass('active');
        if ($('#sidebar').attr('class') == "active") {
            $('#Col-12').removeClass("col-10");
            $('#Col-12').addClass('col-12');
        }
        else { $('#Col-12').removeClass("col-12"); $('#Col-12').addClass('col-10'); }
    }



    render() {
        return (
            <div>
                <div className="header_container">
                    {/* <h2 className="header_text"><b>EDIVAL</b>
                        <span className="Sidebar_drawer" onClick={this.siderbar} id="sidebarCollapse">&#9776; </span>
                    </h2>
                    <label style={{ color: "white", marginLeft: "20px", fontSize: "11px" }}>Powered by HiPaaS</label> */}
                    <div style={{ marginLeft: "20px" }}>
                        <img src={require('../Images/header_logo.png')} style={{ width: '70px', backgroundColor: 'white' }} />
                        <span className="Sidebar_drawer" style={{ position: 'absolute', paddingTop: '10px' }} onClick={this.siderbar} id="sidebarCollapse">&#9776; </span>
                    </div>
                    <label style={{ color: "white", marginLeft: "20px", fontSize: "10px", marginBottom: '0px' }}>Powered by HiPaaS</label>

                    {
                        localStorage.getItem('UserId') ?
                            <div className="dropdown" style={{ float: 'right', marginTop: "-24px" }}>
                                <img src={require('../Images/user.png')} style={{ width: '25px' }} />
                                <div className="dropdown-content">
                                    <a onClick={this.changeText} data-toggle="modal" data-target="#myModal10">Change Password</a>
                                    <a onClick={this.logout}>Logout</a>
                                </div>
                            </div>
                            : ''
                    }



                </div>
                <div className="modal" id="myModal10" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 style={{ color: 'var(--white-color)' }}>Change Password</h4>
                            </div>
                            <div className="modal-body">

                                <div className="form-group col-12">
                                    <label className="list-header2">Old Password</label>
                                    <input ref="oldText" onChange={(event) => this.onHandleChange(event, 'oldText')} name="OldPassword" type="password" className="form-control textInput"
                                        placeholder="Enter Old Password" autoComplete="new-password" value={this.state.oldText} />
                                    {/* <div className="errorMsg">{this.state.errors.oldText}</div> */}
                                </div>
                                <div className="form-group col-12">
                                    <label className="list-header2">New Password</label>
                                    <input ref="newText" onChange={(event) => this.onHandleChange(event, 'newText')} name="OldPassword" type="password" className="form-control textInput"
                                        placeholder="Enter New Password" autoComplete="off" value={this.state.newText} />
                                    {/* <div className="errorMsg">{this.state.errors.newText}</div> */}
                                </div>
                                <div className="form-group col-12">
                                    <label className="list-header2">Confirm New Password</label>
                                    <input ref="confirmNewText" onChange={(event) => this.onHandleChange(event, 'confirmNewText')} name="OldPassword" type="password" className="form-control textInput"
                                        placeholder="Confirm New Password" autoComplete="off" value={this.state.confirmNewText} />
                                    {/* <div className="errorMsg">{this.state.errors.confirmNewText}</div> */}
                                </div>



                                <div className="row">
                                    <div className="col" style={{ marginLeft: '25%' }}>
                                        <button className="btn btn-display" onClick={() => {
                                            if (this.validation()) {
                                                this.checkuser()
                                            }
                                        }} >Update</button>
                                        <button className="btn btn-display" style={{ marginLeft: '20px' }} data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}