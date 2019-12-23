import React from 'react';
import './UserList.css';
import Urls from '../../../helpers/Urls';

export class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNo: '',
            userRole: '',
            userRoleList: [],
            userListDisplay: []
        }
        this.onHandleChange = this.onHandleChange.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.getUserRole = this.getUserRole.bind(this);
        this.clearState = this.clearState.bind(this)
    }

    componentWillReceiveProps() {

    }

    componentDidMount() {
        this.getUserRole();
    }
    saveUser() {
        let query = `mutation{updateuser(
            Id:`+ 0 + ` 
            roleid:`+ this.state.userRole + `  
            FirstName:"`+ this.state.firstName + `" 
            LastName:"`+ this.state.lastName + `" 
            Email:"`+ this.state.email + `" 
            PhoneNumber:"`+ this.state.phoneNo + `" 
            PasswordHash:"`+ this.state.password + `" 
            is_Active:`+ 1 + `
            )
          }`
        console.log(query)
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
                alert(res.data.updateuser);
                setTimeout(() => {
                    this.getUserRole()
                }, 50);

            }).catch(err => {
                console.log(err)
            })
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
                this.setState({
                    userRoleList: res.data.Userrole,
                    userListDisplay: res.data.User
                })
            }).catch(err => {
                console.log(err)
            })
    }
    getoptions() {
        let row = []
        this.state.userRoleList.forEach(element => {
            row.push(<option value={element.Role_id}>{element.role_description}</option>)
        })
        return row
    }

    onHandleChange(e, key) {

        this.setState({
            [key]: e.target.value
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
                    <td><img src={require('../../components/Images/pencil.png')} onClick={this.displayUser} data-value={d.Id} style={{ width: '20px' }}></img></td>
                    <td><img src={require('../../components/Images/trash.png')} style={{ width: '20px' }}></img></td>
                </tr>
            )
        });

        return (
            <table className="table table-bordered" id="userList" style={{ fontSize: "10px" }}>
                <tr>
                    <th >Email</th>
                    <th>User Role</th>
                    <th>Name</th>
                    <th></th>
                    <th></th>
                </tr>
                <tbody>
                    {row}
                </tbody>
            </table>
        );


    }
    displayUser(event) {
        console.log(event.target.dataset.value)
    }
    clearState(){
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNo: '',
            userRole: 0,
        })
    }

    UserList() {
        return (
            <div>

                <div className="row">
                    <h5 style={{ color: '#139DC9', padding: '20px' }}>HiPaaS User List</h5>
                    <button type="button" class="btn btn-demo" data-toggle="modal" onClick={this.clearState} data-target="#myModal2">
                        Add New
                    </button>
                </div>
                <div className="row" style={{ marginTop: '30px' }}>
                    <div className="col-7">
                        {this.RenderUserList()}
                    </div>
                </div>


                <div class="modal right fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content" style={{paddingRight: "45px"}}> 
                            <div class="modal-header">
                                <h5 class="modal-title" id="myModalLabel2" style={{ color: 'white' }}>Create User</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style={{ color: 'white', marginRight: "10px" }}>&times;</span></button>

                            </div>

                            <div class="modal-body">
                                <div className="row">
                                    <div class="form-group col-6">
                                        <label for="FirstName">First Name</label>
                                        <input onChange={(e) => this.onHandleChange(e, 'firstName')} type="text" className="form-control width1" name="firstName" id="FirstName"
                                            placeholder="Enter First Name" value={this.state.firstName} />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="LastName">Last Name</label>
                                        <input onChange={(e) => this.onHandleChange(e, 'lastName')} name="lastName" type="text" className="form-control width1" id="LastName"
                                            placeholder="Enter Last Name" value={this.state.lastName} />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="Email">Email address</label>
                                    <input onChange={(e) => this.onHandleChange(e, 'email')} name="email" type="text" className="form-control width1" id="Email"
                                        placeholder="Enter email" value={this.state.email} />
                                </div>
                                <div class="form-group">
                                    <label for="Password">Password</label>
                                    <input onChange={(e) => this.onHandleChange(e, 'password')} name="password" type="password" className="form-control width1" id="Password"
                                        placeholder="Enter Password" value={this.state.password} />
                                </div>
                                <div class="form-group">
                                    <label for="PhoneNo">Phone No.</label>
                                    <input onChange={(e) => this.onHandleChange(e, 'phoneNo')} name="phoneNo" type="text" className="form-control width1" id="phoneno"
                                        placeholder="Enter Phone Number" value={this.state.phoneNo} />
                                </div>
                                <div class="form-group">
                                    <label for="UserRole">User Role</label>
                                    <select className="form-control width1" name="userRole" onChange={(e) => this.onHandleChange(e, 'userRole')} value={this.state.userRole}>
                                        <option value="0">Select User Role</option>
                                        {this.getoptions()}
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-demo" data-dismiss="modal" onClick={this.saveUser} >Create User</button>
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