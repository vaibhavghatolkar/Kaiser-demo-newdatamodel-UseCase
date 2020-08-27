import React from 'react';
import '../Files/files-styles.css';
import '../color.css'
import moment from 'moment';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "react-datepicker/dist/react-datepicker.css";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class ConsentManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            selectedTradingPartner: '',
            State: '',
            userlist: [],
            paginationPageSize: 10,
            row_number: 0,
            reload: true,
            domLayout: 'autoHeight',
            autoGroupColumnDef: {
                headerName: 'Group',
                minWidth: 170,
                field: 'athlete',
                valueGetter: function (params) {
                    if (params.node.group) {
                        return params.node.key;
                    } else {
                        return params.data[params.colDef.field];
                    }
                },
                headerCheckboxSelection: true,
                cellRenderer: 'agGroupCellRenderer',
                cellRendererParams: { checkbox: true },
            },
            defaultColDef: {

                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
            patientId: '10011',
            page: 1
        }

    }

    componentDidMount() {
        this.getpatientdetails()
    }

    getpatientdetails() {
        let query1 = `{
            NewPortalRegisterdUserList(page: `+ this.state.page + `) {
              RecCount
              UserID
              PatientID
              FirstName
              LastName
              DOB
              Gender
              Verify
            }
        }`


        fetch('http://10.0.1.248:30514/FHIRpatients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query1 })
        })
            .then(res => res.json())
            .then(r => {
                this.setState({
                    FirstName: r.data.NewPortalRegisterdUserList[this.state.row_number].FirstName,
                    LastName: r.data.NewPortalRegisterdUserList[this.state.row_number].LastName,
                    DOB: r.data.NewPortalRegisterdUserList[this.state.row_number].DOB,
                    Gender: r.data.NewPortalRegisterdUserList[this.state.row_number].Gender,
                    patientId_id: r.data.NewPortalRegisterdUserList[this.state.row_number].Gender,
                    userlist: r.data.NewPortalRegisterdUserList
                })

            })
            .catch(err => {
                console.log(err)
            })

    }


    _renderList() {
        let rowData = [
            { "Provider": 'Outreach Health', "Address": '', "Application Name": '', "Privacy": 'Demographics', "Status": 'Connected', "Delegate": 'Paul Smith' },
            { "Provider": 'Outreach Health', "Address": '', "Application Name": '', "Privacy": 'Research', "Status": 'Connected', "Delegate": 'Paul Smith' },
            { "Provider": 'Molina Healthcare ID', "Address": '', "Application Name": '', "Privacy": 'Demographics', "Status": 'Connected', "Delegate": 'Paul Smith' },
            { "Provider": 'Molina Healthcare CA', "Address": '', "Application Name": '', "Privacy": 'Claims', "Status": 'Disconnected', "Delegate": 'Paul Smith' },
            { "Provider": 'Kaiser Oakland', "Address": '', "Application Name": '', "Privacy": 'Demographics', "Status": 'Connected', "Delegate": 'Paul Smith' },
            { "Provider": 'Kaiser Oakland', "Address": '', "Application Name": '', "Privacy": 'Eligibility', "Status": 'Connected', "Delegate": 'Paul Smith' }
        ]

        let columnDefs = [
            { headerName: "Provider", field: "Provider", flex: 1, },
            { headerName: "Address", field: "Address", flex: 1, },
            { headerName: "Application Name", field: "Application Name", flex: 1, },
            { headerName: "Privacy", field: "Privacy", flex: 1, },
            { headerName: "Status", field: "Status", flex: 1, },
            { headerName: "Delegate", field: "Delegate", flex: 1 },
            {
                headerName: "", field: "pencil", width: 70, cellRenderer: (data) => {
                    return '<i class="fa fa-cog"></i>'
                }, cellStyle: { cursor: 'pointer', marginLeft: '12px' }
            },

        ]

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={rowData}
                        enableCellTextSelection={true}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    formatDate(date) {
        return moment(Number(date)).format("MM/DD/YYYY");
    }

    getoptions() {
        let row = []
        let count = 0
        this.state.userlist.forEach(element => {
            row.push(<option value={count}>{element.FirstName} {element.LastName}</option>)
            count++;
        })
        return row
    }

    ChangeVal(event, key) {
        this.setState({
            reload: false,
            row_number: event.target.value
        },() => {
            this.getpatientdetails()
        });

        setTimeout(() => {
            this.setState({
                reload: true
            });
        }, 1000);
    }

    renderTopbar() {
        return (
            <div className="row" style={{ padding: '0' }}>
                <div className="form-group col-3">
                    <div className="list-header-dashboard">Select User</div>
                    <select className="form-control list-header-dashboard" id="state" onChange={(e) => this.ChangeVal(e, 'userroleID')}>
                        {this.getoptions()}
                    </select>
                </div>
            </div>
        )
    }

    renderHeader() {
        return (
            <div style={{ color: "#4290F0" }}>
                <br></br>
                <label style={{ color: "#139dc9", fontWeight: "500", fontSize: '16px' }}> {this.state.FirstName} {this.state.LastName}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '12px' }}>  Dob : {this.formatDate(this.state.DOB)}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '12px' }}>  Gender : {this.state.Gender}
                </label>

                {/* <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '12px', marginBottom: '12px' }}>  Identifier : {this.state.patientId_id}
                </label> */}
                {this.renderTopbar()}
                <hr style={{ margin: '8px' }}></hr>
            </div>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-text">List</td>
                <td className="table-text list-item-style">Enable / Disable</td>
                {/* <td className="table-text list-item-style">Third Party Application</td> */}
            </tr>
        )
    }

    renderList() {
        let row = []
        const data = [
            { Request: "Allergies", isChecked : true, thirdParty: 'Apple Health' },
            { Request: "Immunization", isChecked : true, thirdParty: 'Apple Health' },
            { Request: "Medications", isChecked : true, thirdParty: 'Google Health' },
            { Request: "Labs", isChecked : true, thirdParty: 'Google Health' },
            { Request: "Problems", isChecked : true, thirdParty: 'Apple Health' },
            { Request: "Diagnostics", isChecked : true, thirdParty: 'Apple Health' },
            { Request: "Claims", isChecked : false, thirdParty: '' },
            { Request: "Claims Data for another Insurance Companies", isChecked : false, thirdParty: '' },
            { Request: "Encounters", isChecked : true, thirdParty: 'Google Health' },
            { Request: "Remittances", isChecked : false, thirdParty: '' },
            { Request: "Coverage", isChecked : true, thirdParty: 'Google Health' },
            { Request: "Devices", isChecked : true, thirdParty: 'Google Health' },
            { Request: "Authorizations", isChecked : false, thirdParty: '' },
        ]

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ fontWeight: "bold" }}>
                        {d.Request}
                    </td>
                    <td className="list-item-style"><input checked={d.isChecked} type="checkbox" onChange={(event) => { }} /></td>
                    {/* <td className="list-item-style">{d.thirdParty}</td> */}
                </tr>
            )



        });


        return (
            <div className="col-8" style={{padding:'0'}}>
                <table className="table table-bordered" id="userList" align="center">
                    {this.renderTableHeader()}
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>


        );
    }


    renderTableHeader1() {
        return (
            <tr className="table-head">
                <td className="table-text">Third Party Application</td>
                <td className="table-text list-item-style">Token</td>
                {/* <td className="table-text list-item-style">Third Party Application</td> */}
            </tr>
        )
    }

    renderList1() {
        let row = []
        const data = [
            // { thirdParty: 'Google Health', token:"" },
            { thirdParty: 'Apple Health', token:"b4de3833-178e-47c4-9486-a80e79ff05f6"},
            
        ]

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ fontWeight: "bold" }}>
                        {d.thirdParty}
                    </td>
            <td className="list-item-style">{d.token}</td>
                    {/* <td className="list-item-style">{d.thirdParty}</td> */}
                </tr>
            )



        });


        return (
            <div className="col-8" style={{padding:'0'}}>
                <table className="table table-bordered" id="userList" align="center">
                    {this.renderTableHeader1()}
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>


        );
    }



    render() {
        return (
            <div>
                <h5 className="headerText">Consent Management</h5>
                {this.renderHeader()}
                {this.state.reload ? this.renderList() : false}
                <h6 style={{color:"#139DC9", paddingBottom: '12px', marginTop : '24px', marginLeft: '0px'}}><b>Grant Access to Third Party Apps</b></h6>
                {this.state.reload ? this.renderList1() : false}
            </div>
        );
    }
}