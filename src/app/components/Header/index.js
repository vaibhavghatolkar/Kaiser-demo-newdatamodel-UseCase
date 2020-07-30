import React from 'react'
import './styles.css'
import "../../containers/color.css";
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
const $ = window.$;

export class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            oldPwd: '',
            newPwd: '',
            confirmNewPwd: ''

        };
        this.updatePwd = this.updatePwd.bind(this);


    }

    updatePwd() {
        let userId = localStorage.getItem("UserId")
        let { newPwd, oldPwd, confirmNewPwd } = this.state;
        // perform all neccassary validations
        if (!oldPwd || !newPwd || !confirmNewPwd) {
            alert("Please enter the fields");
        } else if (newPwd !== confirmNewPwd) {
            alert("Passwords don't match");
        } else {
            $("#myModal10").modal("hide");
            let query = `mutation{
            ChangePassword(Id:`+ userId + ` OldPassword:"` + this.state.oldPwd + `" NewPassword:"` + this.state.newPwd + `" ForgotOrNot:0)
          }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            fetch(Urls.base_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: query })
            })
                .then(res => res.json())
                .then(res => {
                    let message = res.data.ChangePassword
                    alert(message);
                    window.location.reload()
                }).catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                })
        }
    }

    onHandleChange = (event, name) => {
        this.setState({
            [name]: event.target.value
        });
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload()
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
                </h2> */}
                    <div style={{ marginLeft: "20px" }}>
                        <img src={require('../Images/header_logo.png')} style={{ width: '70px', backgroundColor: 'white' }} />
                        <span className="Sidebar_drawer" onClick={this.siderbar} id="sidebarCollapse">&#9776; </span>
                    </div>
                    <label style={{ color: "white", marginLeft: "20px", fontSize: "10px", marginBottom: '0px' }}>Powered by HiPaaS</label>

                    {
                        localStorage.getItem('UserId') ?
                            <div className="dropdown" style={{ float: 'right', marginTop: "-24px" }}>
                                <img src={require('../Images/user.png')} style={{ width: '25px' }} />
                                <div className="dropdown-content">
                                    <a onClick={this.changePwd} data-toggle="modal" data-target="#myModal10">Change Password</a>
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
                                    <input onChange={(event) => this.onHandleChange(event, 'oldPwd')} name="OldPassword" type="password" className="form-control textInput"
                                        placeholder="Enter Old Password" autoComplete="new-password" value={this.state.oldPwd} />
                                </div>
                                <div className="form-group col-12">
                                    <label className="list-header2">New Password</label>
                                    <input onChange={(event) => this.onHandleChange(event, 'newPwd')} name="OldPassword" type="password" className="form-control textInput"
                                        placeholder="Enter New Password" autoComplete="off" value={this.state.newPwd} />
                                </div>
                                <div className="form-group col-12">
                                    <label className="list-header2">Confirm New Password</label>
                                    <input onChange={(event) => this.onHandleChange(event, 'confirmNewPwd')} name="OldPassword" type="password" className="form-control textInput"
                                        placeholder="Confirm New Password" autoComplete="off" value={this.state.confirmNewPwd} />
                                </div>



                                <div className="row">
                                    <div className="col" style={{ marginLeft: '25%' }}>
                                        <button className="btn btn-display" onClick={this.updatePwd} >Update</button>
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