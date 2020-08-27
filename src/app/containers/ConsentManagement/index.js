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
            paginationPageSize: 10,
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
            patientId: '10011'
        }

    }

    componentDidMount() {
        this.getpatientdetails()
    }

    getpatientdetails() {
        let query1 = `{
            NewPortalRegisterdUserList(page: `+this.state.page+`) {
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
                    FirstName: r.data.NewPortalRegisterdUserList[0].FirstName,
                    LastName: r.data.NewPortalRegisterdUserList[0].LastName,
                    DOB: r.data.NewPortalRegisterdUserList[0].DOB,
                    Gender: r.data.NewPortalRegisterdUserList[0].Gender,
                    patientId_id : r.data.NewPortalRegisterdUserList[0].Gender,
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
        // let row = []
        // this.state.userlist.forEach(element => {
        //     row.push(<option>{element.name}</option>)
        // })
        // return row
    }

    renderTopbar() {
        return (
            <div className="row" style={{ padding: '0' }}>
                <div className="form-group col-3">
                    <div className="list-header-dashboard">Select User</div>
                    <select className="form-control list-header-dashboard" id="state" onChange={(e) => this.ChangeVal(e, 'userroleID')}>
                        <option value="0">Select User</option>
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

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '12px', marginBottom: '12px' }}>  Identifier : {this.state.patientId_id}
                </label>
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
                <td className="table-text list-item-style">Third Party Integration</td>
            </tr>
        )
    }

    renderList() {
        let row = []
        const data = [
            { Request: "Allergies", thirdParty : 'Apple'},
            { Request: "Immunization", thirdParty : 'Apple'},
            { Request: "Medications", thirdParty : 'Google'},
            { Request: "Labs", thirdParty : 'Google'},
            { Request: "Problems", thirdParty : 'Apple'},
            { Request: "Diagnostics", thirdParty : 'Apple'},
            { Request: "Claims", thirdParty : 'Google'},
            { Request: "Encounters", thirdParty : 'Google'},
            { Request: "Remittances", thirdParty : 'Apple'},
            { Request: "Coverage", thirdParty : 'Google'},
            { Request: "Devices", thirdParty : 'Google'},
            { Request: "Authorizations", thirdParty : 'Apple'},
        ]

        let menuOptions = {}
        data.forEach((d) => {

            row.push(

                <tr>
                    <td style={{ fontWeight: "bold" }}>
                        {d.Request}
                    </td>
                    <td className="list-item-style"><input checked={d.isChecked} type="checkbox" onChange={(event) => { }} /></td>
                    <td className="list-item-style">{d.thirdParty}</td>
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


    render() {
        return (
            <div>
                <h5 className="headerText">Consent Management</h5>
                {this.renderHeader()}
                {this.renderList()}
            </div>
        );
    }
}