import React from 'react'
import DatePicker from "react-datepicker";
import Urls from '../../../helpers/Urls';
// import './style.css'
import { AgGridReact } from 'ag-grid-react';
import 'react-datepicker/dist/react-datepicker.css';
import person from '../../assets/Images/person.svg';
import { Tiles } from '../../components/Tiles';
const $ = window.$;
export class PatientDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            patientId_id: '71553',
            patientId: "10019",
            medicationList: [],
            observationList: [],
            claimList: [],
            eligibilityList: [],
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
                editable: false,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
        }
    }

    componentDidMount() {
        this.getData()
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
                console.log(";fksdlfjsjfs", r.data.FHIRPatientDetails[0].FirstName)
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

    getData = () => {
        let identifier = this.state.patientId_id
        let query = `{
                MedicationList(PatientID: "${identifier}") {
                    PatientID
                    MedicationCodeDisplay
                    AuthoredOn
                    ReasonCodeDisplay
                    NoteTimeDatTime
                    Status
                }
                ObservationList (PatientID:"${identifier}") {
                    PatientID
                    ObservationCodeDisplay
                    EffectiveDate
                    Value
                    CategoryCodeDisplay
                    InterpretationCodeDisplay
                }
                FHIRClaimList(PatientID: "${identifier}") {
                    PatientID
                    ClaimID
                    ClaimDate
                    ClaimAmount
                    ICDCode
                    ServiceDate
                    ServiceLineCount
                }
                FHIREligibilityList (PatientID:"${identifier}") {
                    PatientID
                    InsuranceId
                    GroupNo
                    Coverage
                    Effective
                    Status
                    AllowedMoney
                }
            }`

        console.log(query);
        fetch('http://10.0.1.248:30514/FHIRpatients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data) {
                    this.setState({
                        medicationList: res.data.MedicationList,
                        observationList: res.data.ObservationList,
                        claimList: res.data.FHIRClaimList,
                        eligibilityList: res.data.FHIREligibilityList
                    })

                    console.log('Claim list ', res.data.FHIRClaimList)
                }
            })

            .catch(err => {
                console.log(err)
            })
    }

    renderHL7 = () => {
        return (
            <img src={require('../../components/Images/hl7.png')} alt="logo" className="hl7_image_style" align="center" />
        )
    }

    Eligibilty() {
        let data = this.state.eligibilityList
        // let columnDefs = [
        //     { headerName: "Insurance Id", field: "InsuranceId" },
        //     { headerName: "Coverage", field: "Coverage", },
        //     { headerName: "Effective From", field: "Effective", },
        //     { headerName: "Allowed Money", field: "AllowedMoney", },
        //     { headerName: "Status", field: "Status", }

        // ]
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.InsuranceId}</td>
                    <td>{element.Coverage}</td>
                    <td>{element.Effective}</td>
                    <td>{element.AllowedMoney}</td>
                    <td>{element.Status}</td>
                </tr>
            )
        })
        return (
            // <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
            //     <AgGridReact
            //         modules={this.state.modules}
            //         columnDefs={columnDefs}
            //         autoGroupColumnDef={this.state.autoGroupColumnDef}
            //         defaultColDef={this.state.defaultColDef}
            //         suppressRowClickSelection={true}
            //         groupSelectsChildren={true}
            //         debug={true}
            //         rowSelection={this.state.rowSelection}
            //         rowGroupPanelShow={this.state.rowGroupPanelShow}
            //         pivotPanelShow={this.state.pivotPanelShow}
            //         enableRangeSelection={true}
            //         paginationAutoPageSize={false}
            //         pagination={true}
            //         domLayout={this.state.domLayout}
            //         paginationPageSize={this.state.paginationPageSize}
            //         onGridReady={this.onGridReady}
            //         rowData={this.state.eligibilityList}
            //         enableCellTextSelection={true}
            //     />
            // </div>

            <div style={{ paddingTop: '12px' }}>
                <h6>Eligibility</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Insurance Id</th>
                            <th className="color-style" scope="col">Coverage</th>
                            <th className="color-style" scope="col">Effective From</th>
                            <th className="color-style" scope="col">Allowed Money</th>
                            <th className="color-style" scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>
        )
    }

    Claim() {
        let data = this.state.claimList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.ClaimID}</td>
                    <td>{element.ClaimDate}</td>
                    <td>{element.ServiceDate}</td>
                    <td>{element.ClaimAmount}</td>
                    <td>{element.ICDCode}</td>
                    <td>{element.ServiceLineCount}</td>
                </tr>
            )
        })
        return (
            <div style={{ paddingTop: '12px' }}>
                <h6>Claim</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Claim Id</th>
                            <th className="color-style" scope="col">Claim Date</th>
                            <th className="color-style" scope="col">Service Date</th>
                            <th className="color-style" scope="col">Amount</th>
                            <th className="color-style" scope="col">Diagnosis Code</th>
                            <th className="color-style" scope="col">Service Line Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>
        )
    }

    showMedicationTable() {
        let data = this.state.medicationList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.MedicationCodeDisplay}</td>
                    <td>{element.AuthoredOn}</td>
                    <td>{element.ReasonCodeDisplay}</td>
                    <td>{element.NoteTimeDatTime}</td>
                    <td>{element.Status}</td>
                </tr>
            )
        })

        return (
            <div style={{ paddingTop: '12px' }}>
                <h6>Medication Request</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Medication Code Display</th>
                            <th className="color-style" scope="col">Authored On</th>
                            <th className="color-style" scope="col">Reason Code Display</th>
                            <th className="color-style" scope="col">Note Time DateTime</th>
                            <th className="color-style" scope="col">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>
        )
    }

    showObservationTable() {
        let data = this.state.observationList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.ObservationCodeDisplay}</td>
                    <td>{element.EffectiveDate}</td>
                    <td>{element.Value}</td>
                    <td>{element.CategoryCodeDisplay}</td>
                    <td>{element.InterpretationCodeDisplay}</td>
                </tr>
            )
        })

        return (
            <div style={{ paddingTop: '12px' }}>
                <h6>Observation</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Observation Code Display</th>
                            <th className="color-style" scope="col">Effective Date(s)</th>
                            <th className="color-style" scope="col">Value</th>
                            <th className="color-style" scope="col">Category Code Display</th>
                            <th className="color-style" scope="col">Interpretation Code Display</th>
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>
        )
    }

    Immunization() {



        return (
            <div style={{ paddingTop: '12px' }}>
                <h6>Immunization</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Vaccine Code Code Display</th>
                            <th className="color-style" scope="col">DateTime</th>
                            <th className="color-style" scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Influenza, seasonal, injectable, preservative free</td>
                            <td>2017-06-20 02:53</td>
                            <td>completed</td>
                        </tr>
                        <tr>
                            <td>HPV, quadrivalent</td>
                            <td>2017-06-20 02:53</td>
                            <td>completed</td>
                        </tr>
                        <tr>
                            <td>MMR</td>
                            <td>2010-08-03 16:15</td>
                            <td>completed</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    showAllergyIntoleranceTable() {
        return (

            <div style={{ paddingTop: '12px' }}>
                <h6>Allergy Tolerance</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Allergy/Intolerance Code Display</th>
                            <th className="color-style" scope="col">Note Time Date Time</th>
                            <th className="color-style" scope="col">Onset</th>
                            <th className="color-style" scope="col">Asserted Date</th>
                            <th className="color-style" scope="col">Criticality </th>
                            <th className="color-style" scope="col">Category</th>
                            <th className="color-style" scope="col">ClinicalStatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Allergy to bee venom</td>
                            <td></td>
                            <td></td>
                            <td>1974-01-16 00:20</td>
                            <td>low</td>
                            <td>["food"]</td>
                            <td>active</td>
                        </tr>
                        <tr>
                            <td>House dust mite allergy</td>
                            <td></td>
                            <td></td>
                            <td>1974-01-16 00:20</td>
                            <td>high</td>
                            <td>["food"]</td>
                            <td>active</td>
                        </tr>
                        <tr>
                            <td>Allergy to grass pollen</td>
                            <td></td>
                            <td></td>
                            <td>1974-01-16 00:20</td>
                            <td>high</td>
                            <td>["food"]"]</td>
                            <td>active</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    showConditionTable() {
        return (

            <div style={{ paddingTop: '12px' }}>
                <h6>Condition</h6>
                <table class="table table-striped border">
                    <thead>
                        <tr>
                            <th className="color-style" scope="col">Condition Code Display</th>
                            <th className="color-style" scope="col">Onset</th>
                            <th className="color-style" scope="col">Asserted Date Time</th>
                            <th className="color-style" scope="col">Category Code Display</th>
                            <th className="color-style" scope="col">Severity Code Display</th>
                            <th className="color-style" scope="col">Note Time DateTime</th>
                            <th className="color-style" scope="col">Verification Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Thiopurine methyltransferase deficiency</td>
                            <td>2009-07-18 11:30</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>2017-12-26 23:22</td>
                            <td>confirmed</td>
                        </tr>
                        <tr>
                            <td>Needs influenza immunization</td>
                            <td>2008-08-08 11:30</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>2017-12-26 23:22</td>
                            <td>confirmed</td>
                        </tr><tr>
                            <td>Dementia associated with another disease</td>
                            <td>2008-08-08 11:30</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>confirmed</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    _renderSummaryDetails = () => {
        let row = []
        let summary = []
        summary = [
            { name: 'Eligibility', value: 2 },
            { name: 'Claims', value: 2 },
            { name: 'Medication Request', value: 1 },
            { name: 'Observation', value: 2 },
            { name: 'Immunization', value: 3 },
            { name: 'Allergy Tolerance', value: 3 },
            { name: 'Condition', value: 3 },
        ]
        let array = summary
        array.forEach(item => {
            row.push(
                <Tiles
                    isClickable={true}
                    header_text={item.name}
                    value={item.value}
                />
            )
        });
        return (
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    renderHeader() {
        return (
            <div style={{ color: "#4290F0" }}>
                <br></br>
                <img src={person} style={{ fontWeight: "500", marginTop: "10px", marginBottom: "5px", fontSize: '20px' }} alt="" width="40" height="40" title="person" />
                <label style={{ color: "#139dc9", fontWeight: "500", fontSize: '20px' }}> {this.state.FirstName} {this.state.LastName}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Dob : {this.formatDate(this.state.DOB)}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Gender : {this.state.Gender}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Identifier : {this.state.patientId_id}
                </label>
                <hr></hr>
            </div>
        )
    }

    render() {
        return (
            <div style={{ height: $(window).height() }}>
                {this._renderSummaryDetails()}
                {this.Eligibilty(this.state.conditionArray)}
                {this.Claim()}
                {this.showMedicationTable()}
                {this.showObservationTable()}
                {this.Immunization()}
                {this.showAllergyIntoleranceTable()}
                {this.showConditionTable()}
            </div>
        )
    }
}