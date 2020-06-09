import React from 'react';
import './UserList.css';
import '../color.css'
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
const $ = window.$;

export class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            pwd: '',
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
    }

    componentWillReceiveProps() {

    }

    componentDidMount() {
        this.getUserRole();
    }
    saveUser() {
        let { firstName, lastName, email, pwd, userRole } = this.state;
        if (!firstName || !lastName || !email || !pwd || !userRole) {
            alert("Please enter the fields");
        }else{

        let query = `mutation{updateuser(
            Id:`+ this.state.id + ` 
            roleid:`+ this.state.userRole + `  
            FirstName:"`+ this.state.firstName + `" 
            LastName:"`+ this.state.lastName + `" 
            Email:"`+ this.state.email + `" 
            PhoneNumber:"`+ this.state.phoneNo + `" 
            PasswordHash:"`+ this.state.pwd + `" 
            is_Active:`+ 1 + `
            )
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
                    }, 50);
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
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = res.data.User[0]

                this.setState({
                    firstName: data.FirstName,
                    lastName: data.LastName,
                    email: data.Email,
                    pwd: data.PasswordHash,
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
            firstName: '',
            lastName: '',
            email: '',
            pwd: '',
            phoneNo: '',
            userRole: 0,
            disabled: false,
            UserStatus: 'Create User',
            id: 0
        })
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
            <div style={{padding:"10px"}}>
                <div className="row">
                    <h5 className="headerText">HiPaaS User List</h5>
                    <button type="button" className="btn btn-design" data-toggle="modal" onClick={this.clearState} data-target="#myModal2">
                        Add New
                    </button>
                </div>
                <div className="row" style={{ marginTop: '30px'}}>
                    <div className="col-7" style={{padding: '0'}}>
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
                                        <input onChange={(e) => this.onHandleChange(e, 'firstName')} type="text" className="form-control width1" name="firstName" id="FirstName"
                                            placeholder="Enter First Name" value={this.state.firstName} />
                                    </div>
                                    <div className="form-group col-6">
                                        <label>Last Name</label>
                                        <input onChange={(e) => this.onHandleChange(e, 'lastName')} name="lastName" type="text" className="form-control width1" id="LastName"
                                            placeholder="Enter Last Name" value={this.state.lastName} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email address</label>
                                    <input onChange={(e) => this.onHandleChange(e, 'email')} name="email" type="text" className="form-control width1" id="Email"
                                        disabled={(this.state.disabled) ? "disabled" : ""} placeholder="Enter email" value={this.state.email} />
                                </div>
                                <br/><br/>

                                <div className="form-group">
                                    <label >Password</label>
                                    <input onChange={(e) => this.onHandleChange(e, 'pwd')} type="password" className="form-control width1"
                                        disabled={(this.state.disabled) ? "disabled" : ""} placeholder="Enter Password" value={this.state.pwd} />
                                </div>
                                <div className="form-group">
                                    <label >Phone No.</label>
                                    <input onChange={(e) => this.onHandleChange(e, 'phoneNo')} name="phoneNo" type="text" className="form-control width1" id="phoneno"
                                        placeholder="Enter Phone Number" value={this.state.phoneNo} />
                                </div>
                                <br/><br/>
                                <div className="form-group">
                                    <label >User Role</label>
                                    <select className="form-control width1" name="userRole" onChange={(e) => this.onHandleChange(e, 'userRole')} value={this.state.userRole}>
                                        <option value="0">Select User Role</option>
                                        {this.getoptions()}
                                    </select>
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