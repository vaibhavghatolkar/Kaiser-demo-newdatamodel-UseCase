import React from 'react';
import './UserList.css';
import '../color.css'
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
const bcrypt = require('bcryptjs');

const $ = window.$;

export class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            firstName: '',
            lastName: '',
            email: '',
            ChangeText: '',
            phoneNo: '',
            userRole: '',
            userRoleList: [],
            userListDisplay: [],
            disabled: false,
            UserStatus: 'Create User',
            id: 0
        }
        this.onHandleChange = this.onHandleChange.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.getUserRole = this.getUserRole.bind(this);
        this.clearState = this.clearState.bind(this);
        this.displayUser = this.displayUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this._onBlur = this._onBlur.bind(this)
    }

    componentWillReceiveProps() {

    }

    componentDidMount() {
        this.getUserRole();
    }

    validateForm(flag) {
        debugger;
        let formIsValid = true;
        if (this.state.firstName == "") {
            formIsValid = false;
            this.refs.firstName.focus();
            alert("Please Enter your First Name.");
        }
        else if (this.state.lastName == "") {
            formIsValid = false;
            this.refs.lastName.focus();
            alert("Please Enter your Last Name.");
        }
        else if (flag == 0) {
            if (this.state.email == "") {
                formIsValid = false;
                this.refs.email.focus();
                alert("Please Enter your Email Id.");
            }
            else if (this.state.email != "") {
                //regular expression for email validation
                var pattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
                if (!pattern.test(this.state.email)) {
                    formIsValid = false;
                    this.refs.email.focus();
                    alert("Please Enter Valid Email Id.");
                }

                else if (this.state.ChangeText == "") {
                    formIsValid = false;
                    this.refs.ChangeText.focus();
                    alert("Please Enter your Password.");
                }
                else if (this.state.ChangeText != "") {
                    let _pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/
                    if (!_pattern.test(this.state.ChangeText)) {
                        formIsValid = false;
                        this.refs.ChangeText.focus();
                        alert("Please Enter Valid Password.");
                    }

                    else if (this.state.phoneNo == "") {
                        formIsValid = false;
                        this.refs.phoneNo.focus();
                        alert("Please Enter your Phone No.");
                    }
                    else if (this.state.userRole == "") {
                        formIsValid = false;
                        this.refs.userRole.focus();
                        alert("Please Select your UserRole.");
                    }
                }
            }
        }
        else if (this.state.phoneNo == "") {
            formIsValid = false;
            this.refs.phoneNo.focus();
            alert("Please Enter your Phone No.");
        }
        else if (this.state.userRole == "") {
            formIsValid = false;
            this.refs.userRole.focus();
            alert("Please Select your UserRole.");
        }
        return formIsValid;

    }
    saveUser(event) {
        event.preventDefault();
        if (this.validateForm(this.state.id)) {
            var salt = bcrypt.genSaltSync(10);
            var encryptUserPass = bcrypt.hashSync(this.state.ChangeText, salt);

            let query = `mutation{updateuser(
            Id:`+ this.state.id + ` 
            roleid:`+ this.state.userRole + `  
            FirstName:"`+ this.state.firstName + `" 
            LastName:"`+ this.state.lastName + `" 
            Email:"`+ this.state.email + `" 
            PhoneNumber:"`+ this.state.phoneNo + `" 
            PasswordHash:"`+ encryptUserPass + `" 
            is_Active:`+ 1 + `
            )
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
                    if (res.errors) {
                        alert(res.errors[0].message)
                    } else {
                        $("#myModal2").modal("hide");
                        if (res.data.updateuser == "") {
                            alert("User Updated Successfully.")
                        } else {
                            alert(res.data.updateuser);
                        } setTimeout(() => {
                            this.getUserRole()
                        }, 200);
                    }
                }).catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                })

        }
    }
    getUserRole() {

        let query = `{
            Userrole(role_id:0) {
                Role_id
                role_description
                is_active
              }
              User(Userid:0 Email:"") {
                Id
                role_id
                FirstName
                LastName
                Email
                PhoneNumber
                PasswordHash
                is_active
                CreationDatetime
                role_description
              }
            }`
        fetch(Urls.users, {
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
                this.setState({
                    userRoleList: res.data.Userrole,
                    userListDisplay: res.data.User
                })
            }).catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    getoptions() {
        let row = []
        this.state.userRoleList.forEach(element => {
            row.push(<option value={element.Role_id}>{element.role_description}</option>)
        })
        return row
    }

    onHandleChange(event, key) {

        this.setState({
            [key]: event.target.value
        });
    }

    RenderUserList() {
        let row = []
        const data = this.state.userListDisplay;
        data.forEach((d) => {
            var FullName = d.FirstName + " " + d.LastName

            row.push(
                <tr>
                    <td>{d.Email}</td>
                    <td>{d.role_description}</td>
                    <td>{FullName}</td>
                    {
                        d.is_active == "1" ?
                            <td><img src={require('../../components/Images/pencil.png')} onClick={this.displayUser} data-value={d.Id} data-toggle="modal" data-target="#myModal2" style={{ width: '14px', marginLeft: '10px', cursor: 'pointer' }}></img></td>
                            : <td></td>
                    }
                    {d.is_active == "1" ?
                        <td><img src={require('../../components/Images/trash.png')} style={{ width: '14px', marginLeft: '10px', cursor: 'pointer' }} data-value={d.Id} onClick={this.displayUser} data-toggle="modal" data-target="#myModal" ></img></td>
                        : <td>InActive</td>
                    }

                </tr>
            )
        });

        return (
            <table className="table table-bordered" id="userList" style={{ fontSize: "10px", backgroundColor: 'white' }}>
                <tr>
                    <td className="table-text">Email</td>
                    <td className="table-text">User Role</td>
                    <td className="table-text">Name</td>
                    <td className="table-text"></td>
                    <td className="table-text"></td>
                </tr>
                <tbody>
                    {row}
                </tbody>
            </table>
        );


    }
    displayUser(event) {
        let query = `{
              User(Userid:${event.target.dataset.value} Email:"") {
                Id
                role_id
                FirstName
                LastName
                Email
                PhoneNumber
                PasswordHash
              }
            }`
        fetch(Urls.users, {
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
                let data = res.data.User[0]

                this.setState({
                    errors: {},
                    firstName: data.FirstName,
                    lastName: data.LastName,
                    email: data.Email,
                    ChangeText: data.PasswordHash,
                    phoneNo: data.PhoneNumber,
                    userRole: data.role_id,
                    disabled: true,
                    UserStatus: 'Update User',
                    id: data.Id
                })
            }).catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    clearState() {
        this.setState({
            errors: {},
            firstName: '',
            lastName: '',
            email: '',
            ChangeText: '',
            phoneNo: '',
            userRole: 0,
            disabled: false,
            UserStatus: 'Create User',
            id: 0
        })
    }

    _onBlur() {
        this.validateForm(this.state.id);
    }

    deleteUser() {
        let query = `
            mutation{InactiveUser(
                Id:${this.state.id}
                Email:"${this.state.email}"
                is_Active:0
                )
              }
          `
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
                alert(res.data.InactiveUser)
                setTimeout(() => {
                    this.getUserRole()
                }, 50);
            }).catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    UserList() {

        return (
            <div style={{ padding: "10px" }}>
                <div className="row">
                    <h5 className="headerText">HiPaaS User List</h5>
                    <button type="button" className="btn btn-design" data-toggle="modal" onClick={this.clearState} data-target="#myModal2">
                        Add New
                    </button>
                </div>
                <div className="row" style={{ marginTop: '30px' }}>
                    <div className="col-7" style={{ padding: '0' }}>
                        {this.RenderUserList()}
                    </div>
                </div>


                <div className="modal right fade widthHandling" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel2" style={{ color: 'white' }}>{this.state.UserStatus}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style={{ color: 'white', marginRight: "10px" }}>&times;</span></button>

                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group col-6">
                                        <label>First Name</label>
                                        <input ref="firstName" onChange={(e) => this.onHandleChange(e, 'firstName')} type="text" className="form-control width1" name="firstName" id="FirstName"
                                            placeholder="Enter First Name" value={this.state.firstName} />
                                        {/* <div className="errorMsg">{this.state.errors.firstName}</div> */}
                                    </div>
                                    <div className="form-group col-6">
                                        <label>Last Name</label>
                                        <input ref="lastName" onChange={(e) => this.onHandleChange(e, 'lastName')} name="lastName" type="text" className="form-control width1" id="LastName"
                                            placeholder="Enter Last Name" value={this.state.lastName} />
                                        {/* <div className="errorMsg">{this.state.errors.lastName}</div> */}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email address</label>
                                    <input ref="email" onChange={(e) => this.onHandleChange(e, 'email')} name="email" type="text" className="form-control width1" id="Email"
                                        disabled={(this.state.disabled) ? "disabled" : ""} placeholder="Enter email" value={this.state.email} />
                                    {/* <div className="errorMsg">{this.state.errors.email}</div> */}
                                </div><br /><br />
                                <div className="form-group">
                                    <label >Password</label>
                                    <input ref="ChangeText" onChange={(e) => this.onHandleChange(e, 'ChangeText')} type="password" className="form-control width1"
                                        disabled={(this.state.disabled) ? "disabled" : ""} placeholder="Enter Password" value={this.state.ChangeText} />
                                    {/* <div className="errorMsg">{this.state.errors.ChangeText}</div> */}
                                </div>
                                <div className="form-group">
                                    <label >Phone No.</label>
                                    <input ref="phoneNo" maxlength="15" onChange={(e) => this.onHandleChange(e, 'phoneNo')} name="phoneNo" type="text" className="form-control width1" id="phoneno"
                                        placeholder="Enter Phone Number" value={this.state.phoneNo} />
                                    {/* <div className="errorMsg">{this.state.errors.phoneNo}</div> */}
                                </div>
                                <br /><br />
                                <div className="form-group">
                                    <label >User Role</label>
                                    <select ref="userRole" className="form-control width1" name="userRole" onChange={(e) => this.onHandleChange(e, 'userRole')} value={this.state.userRole}>
                                        <option value="0">Select User Role</option>
                                        {this.getoptions()}
                                    </select>
                                    {/* <div className="errorMsg">{this.state.errors.userRole}</div> */}
                                </div>
                                <div style={{ color: '#3B3A39' }}>
                                    * Password must contain at least one English uppercase character (A through Z).<br></br>
                                    * Password must contain at least one English lowercase character (a through z).<br></br>
                                    * Password must contain at least one Base 10 digit (0 through 9).<br></br>
                                    * Password must contain one non-alphanuneric character (e.g.@,#,$,%).<br></br>
                                    * Password must contain atleast 8 characters.<br></br>
                                </div>
                                <button type="submit" className="btn btn-display" style={{ marginLeft: '0px' }} data-value={this.state.id} onClick={this.saveUser} >{this.state.UserStatus}</button>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-body">
                                <p>Are you sure you want to Inactivate this user!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-display" data-dismiss="modal" onClick={this.deleteUser} >Ok</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )
    }

    render() {
        return (
            <div>

                {this.UserList()}

            </div>
        );
    }
}