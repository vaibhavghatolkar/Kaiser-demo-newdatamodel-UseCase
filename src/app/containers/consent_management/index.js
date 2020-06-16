import React from 'react';
import Urls from '../../../helpers/Urls';
import '../color.css'
import Strings from '../../../helpers/Strings';

export class consent_management extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customList: [],
            apiflag: this.props.apiflag,
            userrole: [],
            fileId: '',
            UpdateCheckBox: '',
            checked: [],
            unchecked: [],
            Menucheckall: '',
            isChecked: '',
            menuType: "I"
        }

        this.showFile = this.showFile.bind(this)
        this.Update = this.Update.bind(this)
        this.ChangeVal = this.ChangeVal.bind(this)
        this.ChangeFunAccess = this.ChangeFunAccess.bind(this)
        this.ChangeMenuAcces = this.ChangeMenuAcces.bind(this)
        this.RenderUserRoleList = this.RenderUserRoleList.bind(this)
        this.AddUserRole = this.AddUserRole.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag,

        })

    }

    componentDidMount() {
        this.getData()
        this.getbinduser()
    }
    AddUserRole() {
        var query = `mutation{
         updateuserrole(roleid: 0 role_description:"`+ this.state.userRoleName + `" is_Active:0 ) {
           Role_id
           role_description
           is_active
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
                alert("User Role Saved Successfully");
                let userrole = this.state.userrole
                userrole.push(res.data.updateuserrole[0])

                this.setState({
                    userrole: [...userrole],
                    userRoleName: ''
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    onHandleChange(event, key) {

        this.setState({
            [key]: event.target.value
        });
    }

    getData() {
        this.setState({
            customList: [],
            UserAccess: [],
            Menucheckall: '',

        })

        let query = '{UserwiseMenu (role_id:' + 0 + ` menutype:"${this.state.menuType}" For:"A") {
            role_id
            menu_id
            menu_description
            sequence_id
            parent_node
            menuflag
            usermenuflag
            is_editor      
            is_editable
          }}`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
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
                let array = []
                let summary = []
                let data = res.data.UserwiseMenu
                let iterator = data
                iterator.forEach(item => {
                    array.push({
                        loopid: item.menu_description,
                        parent_node: item.parent_node,
                        menu_id: item.menu_id,
                        isChecked: item.menuflag,
                        // isAccessValue: item.is_editor,
                        is_editable: item.is_editable


                    })
                })

                this.setState({
                    customList: array,



                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })



    }

    getbinduser() {

        let query = `{
      
            Userrole(role_id:0){
                Role_id
                role_description
                is_active
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
                    userrole: res.data.Userrole,

                })

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }
    getoptions() {
        let row = []

        this.state.userrole.forEach(element => {
            row.push(<option value={element.Role_id}>{element.role_description}</option>)
        })
        return row
    }
    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-text">List</td>
                <td className="table-text list-item-style">Enable / Disable

                {/* <input style={{ marginLeft: "10px" }} type="checkbox" onChange={this.ChangeMenuAcces}></input> */}
                </td>
                <td className="table-text list-item-style">Editable
                {/* <input style={{ marginLeft: "10px" }} type="checkbox" onChange={this.ChangeFunAccess}></input> */}
                </td>


            </tr>
        )
    }


    ChangeFunAccess(event) {

        const data = this.state.customList;
        let checkboxValue = event.target.checked;
        if (checkboxValue == true) {

            data.forEach((d) => {

                d.is_editable = true



            })
            this.setState({
                customList: [...data],
            })
        }
        else {
            data.forEach((d) => {
                d.is_editable = false

            })
            this.setState({
                customList: [...data],
            })
        }
    }

    ChangeMenuAcces(event) {
        const data = this.state.customList;
        let checkboxValue = event.target.checked;
        if (checkboxValue == true) {

            data.forEach((d) => {
                d.isChecked = true

            })
            this.setState({
                customList: [...data],
            })
        }
        else {
            data.forEach((d) => {
                d.isChecked = false

            })
            this.setState({
                customList: [...data],
            })
        }
    }
    renderList() {


        let row = []
        const data = [
            {
                Request: "Citrus Valley Health Partners",

            },
            {
                Request: "Idaho Health Data Exchange",

            },

            {
                Request: "MyHealth Access Network",

            },
            {
                Request: "NC HealthConnex",

            },
            {
                Request: "Immunization Registry",

            },

            {
                Request: "ABC Labs (American Bio-clinical Labs)",

            },
            {
                Request: "Bako Pathology",

            },

            {
                Request: "CAMC Memorial Hospital",

            },
            {
                Request: "CMB Laboratories",

            },
            {
                Request: "Diagnostic Imaging of Salem",

            },
            {
                Request: "Alaska Immunization Information System (VacTrAK)",

            },
            {
                Request: "California Immunization Registry (CAIR)",

            },
            {
                Request: "Maryland Immunization Registry (IMMUNET)",

            },
        ]

        let menuOptions = {}
        data.forEach((d) => {

            row.push(

                <tr>
                    <td style={{ fontWeight: "bold" }}>
                        {d.Request}
                    </td>
                    <td className="list-item-style"><input checked={d.isChecked} type="checkbox" onChange={(event) => {

                    }} /></td>
                    <td className="list-item-style">{<input checked={d.is_editable} type="checkbox" onChange={(event) => {
                        d.is_editable = event.target.checked
                        d.isChecked = true
                        this.setState({
                            customList: [...data]
                        })
                    }} />}</td>



                </tr>

            )



        });


        return (
            <div>



                <table className="table table-bordered" id="userList" align="center">
                    {this.renderTableHeader()}
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>


        );
    }

    changeCheckbox(event, key) {
        let checkboxValue = event.target.checked;
        if (checkboxValue == true) {
            this.state.checked.push(event.target.value)
        } else {
            this.state.unchecked.push(event.target.value)
        }
        this.setState({
            checkedCheckbox: this.state.checked,
            uncheckCheckbox: this.state.unchecked
        })
    }
    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    ChangeVal(event, key) {
        this.setState({
            [key]: event.target.value
        });
        setTimeout(() => {
            this.getData()
        }, 50);
    }


    Update() {

        let data = this.state.customList
        let true_val = ''
        let false_val = ''
        let str1 = ''
        let str2 = ''
        data.forEach(element => {
            if (element.isChecked) {
                true_val = true_val + element.menu_id + ','
                str1 = true_val.replace(/,(?=\s*$)/, '');

            } else {
                false_val = false_val + element.menu_id + ','
                str2 = false_val.replace(/,(?=\s*$)/, '');
            }
        });
        let access_Val = ''
        let falseaccess_Val = ''
        let access_Val_str1 = ''
        let falseaccess_Val_str2 = ''
        data.forEach(element => {
            if (element.is_editable) {
                access_Val = access_Val + element.menu_id + ','
                access_Val_str1 = access_Val.replace(/,(?=\s*$)/, '');

            } else {
                falseaccess_Val = falseaccess_Val + element.menu_id + ','
                falseaccess_Val_str2 = falseaccess_Val.replace(/,(?=\s*$)/, '');
            }
        });

        var query = 'mutation{ MenuMasterUpdate(' +
            'uncheck :"' + str2 + '"' +
            'check :"' + str1 + '"' +
            'unchkeditor :"' + falseaccess_Val_str2 + '"' +
            'chkeditor :"' + access_Val_str1 + '"' +
            ')' +
            '}'

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) };
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query

            })
        })
            .then(r => r.json())
            .then(data =>
                alert(data.data.MenuMasterUpdate),
                setTimeout(() => {
                    window.location.reload()
                }, 2000)

            )
            .catch(err =>
                process.env.NODE_ENV == 'development' && console.log(err)
            )
    }

    RenderUserRoleList() {
        let row = []
        const data = this.state.userrole;
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.role_description}</td>
                    <td><img src={require('../../components/Images/trash.png')} style={{ width: '20px' }}></img></td>
                </tr>
            )
        });
        return (
            <table className="table table-bordered" id="userList" style={{ fontSize: "11px" }}>
                <tr>
                    <th style={{ width: "85%" }}>User Role List</th>
                    <th></th>
                </tr>
                <tbody>
                    {row}
                </tbody>
            </table>
        );


    }





    renderTopbar() {
        return (
            <div className="row">

                <div className="form-group col-3" style={{ marginLeft: "25px" }}>
                    <div className="list-header-dashboard">Select Menu Type</div>
                    <select defaultValue={"I"} className="form-control list-header-dashboard" id="state" onChange={(e) => this.ChangeVal(e, 'menuType')}>
                        <option value="I">Inbound</option>
                        <option value="O">Outbound</option>
                        <option value="B">Both</option>
                    </select>
                </div>

                <div className="form-group col-sm-1">
                    <button type="submit" className="btn btn-display" onClick={this.Update}>Save</button>
                </div>

                <div className="modal right fade" id="myModal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{ paddingRight: "25px" }}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel2" style={{ color: 'white' }}>User Role</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style={{ color: 'white', marginRight: "20px" }}>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group col-6">
                                        <label>User Role</label>
                                        <input onChange={(e) => this.onHandleChange(e, 'userRoleName')} type="text" className="form-control width1" name="userRoleName" id="userRoleName"
                                            placeholder="Enter User Role Name" value={this.state.userRoleName} />
                                    </div>
                                    <div className="form-group col-6">
                                        <button type="submit" className="btn btn-display" style={{ marginTop: "20px" }} onClick={this.AddUserRole} >Save User Role</button>
                                    </div>
                                </div>

                                {this.RenderUserRoleList()}




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
                <div>
                    <div className="form-group col-6 row">
                        <h5 className="headerText">Consent Management</h5>
                        <div type="submit" className="btnDesign" style={{ marginLeft: "20px", marginTop : '12px' }} onClick={() => {}} >Save</div>
                    </div>
                </div>
                {

                    <div>
                        <p style={{ color: 'var(--main-bg-color)', fontWeight: 'bold' }}></p>
                        {/* {this.renderTopbar()} */}
                        <div className="row">
                            <div className="col-12">
                                {this.renderList()}
                            </div>

                        </div>
                    </div>
                }
            </div>
        );
    }
}