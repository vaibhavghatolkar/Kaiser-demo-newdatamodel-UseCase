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
        var patientId = this.state.patientId;

        let query1 = '{FHIRPatientDetails(UserID:' + patientId + `) {
            RecCount
            UserID
            PatientID
            FirstName
            LastName
            DOB
            Gender
            State
            PostalCode
            Address
            City
            MiddleName
            ExternalID
            SS
            LicenseID
            MaritalStatus
          }}`


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
                    FirstName: r.data.FHIRPatientDetails[0].FirstName,
                    LastName: r.data.FHIRPatientDetails[0].LastName,
                    DOB: r.data.FHIRPatientDetails[0].DOB,
                    Gender: r.data.FHIRPatientDetails[0].Gender,
                    State: r.data.FHIRPatientDetails[0].State,
                    PostalCode: r.data.FHIRPatientDetails[0].PostalCode,
                    Address: r.data.FHIRPatientDetails[0].Address,
                    City: r.data.FHIRPatientDetails[0].City,
                    MiddleName: r.data.FHIRPatientDetails[0].MiddleName,
                    ExternalID: r.data.FHIRPatientDetails[0].ExternalID,
                    SS: r.data.FHIRPatientDetails[0].SS,
                    LicenseID: r.data.FHIRPatientDetails[0].LicenseID,
                    MaritalStatus: r.data.FHIRPatientDetails[0].MaritalStatus
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
                headerName: "", field: "pencil", width : 70, cellRenderer: (data) => {
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

    renderHeader() {
        return (
            <div style={{ color: "#4290F0" }}>
                <br></br>
                <label style={{ color: "#139dc9", marginLeft: "12px", fontWeight: "500", fontSize: '16px' }}> {this.state.FirstName} {this.state.LastName}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '13px' }}>  Dob : {this.formatDate(this.state.DOB)}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '13px' }}>  Gender : {this.state.Gender}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '13px' }}>  Identifier : {this.state.patientId_id}
                </label>
                <hr style={{ margin: '8px' }}></hr>
            </div>
        )
    }


    render() {
        return (
            <div>
                <h5 className="headerText">Consent Management</h5>
                {this.renderHeader()}
                {this._renderList()}
            </div>
        );
    }
}