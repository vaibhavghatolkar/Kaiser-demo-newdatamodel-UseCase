import React from 'react'
import DatePicker from "react-datepicker";
import Urls from '../../../helpers/Urls';
import moment from 'moment';
// import './style.css'
// import { AgGridReact } from 'ag-grid-react';
import 'react-datepicker/dist/react-datepicker.css';
import person from '../../assets/Images/person.svg';
import { AgGridReact } from 'ag-grid-react';
import { Tiles } from '../../components/Tiles';
import { ServersideGrid } from '../../components/ServersideGrid';
import Strings from '../../../helpers/Strings';
const $ = window.$;
export class PatientDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            patientId_id: '8100',
            patientId: "10019",
            medicationList: [],
            observationList: [],
            claimList: [],
            eligibilityList: [],
            Eligibilty: false,
            Claim: true,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
            paginationPageSize: 10,
            selectedFileId: '2825123507869164533',
            domLayout: 'autoHeight',
            inner_orderby: '',
            gridType: 1,
            page: 1,
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

            type: '',
            selectedTradingPartner: '',
            startDate: '',
            endDate: '',
            gridflag: '',
            fileStatus: '',
            generalStatus: '',
            mcgStatus: '',
            incoming_fileId: '',
            subtitle: '',
            status277CA: '',
            Filter_ClaimId: '',
            State: '',
            status: '',
            transactionId: '',
            claimStatus: '',
            apiflag: '',
            providerName: ''
        }
    }

    componentDidMount() {
        this.getData()
        this.getpatientdetails()
    }

    get_Error = (ClaimID, seqid, fileID) => {
        let query = `{            
            ClaimErrorStages  (ClaimID:"` + ClaimID + `",SeqID:` + seqid + `,FileID:"` + fileID + `") {
            FileID
            ClaimID
            Stage
            StageFileID
            ErrorDesc
            FileName
            FileDate
            MolinaClaimID
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.real_time_claim_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.ClaimErrorStages

                if (this.state.gridType) {
                    this.setState({
                        Error_data: data

                    })
                } else {
                    this.sortData(fileID, data)
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getDetails(claimId, fileId, ClaimRefId, fileData, page) {
        let Claim_Icdcode = ""
        let AccidentDate = ""
        let url = Urls.real_time_claim_details
        let query = `{
            Claim837RTDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `", SeqID: ${ClaimRefId}) {
              ClaimID
              ClaimDate
              ClaimTMTrackingID
              Subscriber_ID
              Claim_Amount
              ClaimStatus
              ProviderLastName
              ProviderFirstName
              SubscriberLastName
              SubscriberFirstName
              adjudication_status
              ClaimLevelErrors
              AdmissionDate
              BillingProviderAddress
              BillingProviderCity_State_Zip
              ICDCode
              AccidentDate
              FileID
              FieldToUpdate
              MolinaClaimID
              LXCount
              FileName
              FileDate
              HL20Count
              HL22Count
              HL23Count
              Receiver
              ClaimDateTime
            }
            Claim837RTLineDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `", page: ${page} , GridType:${this.state.gridType}) {
              ClaimID
              ServiceLineCount
              ProviderPaidAmount
              ServiceDate
              ProcedureDate
              PaidServiceUnitCount
              RecCount
              MolinaClaimID
            }
          }
          `

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = res.data
                let count = 1

                if (data && data.Claim837RTLineDetails.length > 0) {

                    count = Math.floor(data.Claim837RTLineDetails[0].RecCount / 10)
                    if (data.Claim837RTLineDetails[0].RecCount % 10 > 0) {
                        count = count + 1
                    }
                }


                if (data && res.data.Claim837RTDetails && res.data.Claim837RTDetails.length > 0) {
                    if (res.data.Claim837RTDetails[0].FieldToUpdate == "Icdcode") {
                        Claim_Icdcode = <select id="fao1" className="form-control" style={{ width: "100px" }} onChange={(e) => this.ChangeVal(e)}>
                            <option value="0" ></option>
                            {this.getIcdcodeoptions()}
                        </select>
                    }
                    else {
                        Claim_Icdcode = res.data.Claim837RTDetails[0].ICDCode;
                    }
                    let isDate = 0
                    if (res.data.Claim837RTDetails[0].FieldToUpdate == "AccidentDt") {
                        isDate = 1
                        AccidentDate = this.getDatePicker()
                    }
                    else {

                        AccidentDate = res.data.Claim837RTDetails[0].AccidentDate;
                    }
                    let data = res.data.Claim837RTDetails[0]

                    let claimDetails =
                        [
                            { field_name: 'X12 Claim Id', value: data.ClaimID },
                            { field_name: 'Claim Date', value: data.ClaimDate },
                            { field_name: 'Subscriber First Name', value: data.SubscriberFirstName },
                            { field_name: 'Subscriber Last Name', value: data.SubscriberLastName },
                            { field_name: 'Admission Date', value: data.AdmissionDate },
                            { field_name: 'Claim Amount', value: data.Claim_Amount },
                            { field_name: 'Provider Address', value: data.BillingProviderAddress },
                            { field_name: 'Claim Status', value: data.ClaimStatus },
                            { field_name: 'ICD Code', value: Claim_Icdcode },
                            { field_name: 'Accident Date', value: isDate ? "" : AccidentDate, isDate: isDate },
                            { field_name: '', },
                            { field_name: '', },
                        ]
                    this.setState({
                        showDetails: true,
                        claimDetails: claimDetails,
                        claimLineDetails: res.data.Claim837RTLineDetails,
                        fileid: data.FileID,
                        claimid: data.ClaimID,
                        Icdcodepresent: data.FieldToUpdate,
                        count: count,
                        seqID: ClaimRefId,
                        fileDataDetails: fileData,
                        //  lineCount: data ? data.LXCount : 0,
                        Aggrid_ClaimLineData: res.data.Claim837RTLineDetails,
                        Aggrid_Claim_Info_data: res.data.Claim837RTDetails
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimStages(claimId, fileId, seqId) {
        let url = Urls.real_time_claim_details
        let query = `{
            ClaimStagesInbound(FileID:"${fileId}", ClaimID: "${claimId}", SeqID: ${seqId}) {
              Stage
              Createdatetime
            }
          }
          `

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.ClaimStagesInbound) {
                    this.setState({
                        claimStageDetails: res.data.ClaimStagesInbound,
                        Aggrid_ClaimStage: res.data.ClaimStagesInbound,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
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

    rendersepsis = () => {
        return (
            <div className="chart chart-container-full" style={{backgroundColor: 'white'}}>
                <img src={require('../../components/Images/sepsis.png')} alt="logo" className="hl7_image_style" align="center" />
            </div>
        )
    }

    Eligibilty() {
        let data = this.state.eligibilityList
        let columnDefs = [
            { headerName: "Insurance Id", field: "InsuranceId", flex: 1 },
            { headerName: "Coverage", field: "Coverage", flex: 1 },
            { headerName: "Effective From", field: "Effective", flex: 1 },
            { headerName: "Allowed Money", field: "AllowedMoney", flex: 1 },
            { headerName: "Status", field: "Status", flex: 1 }
        ]
        // let row = []
        // data.forEach(element => {
        //     row.push(
        //         <tr>
        //             <td>{element.InsuranceId}</td>
        //             <td>{element.Coverage}</td>
        //             <td>{element.Effective}</td>
        //             <td>{element.AllowedMoney}</td>
        //             <td>{element.Status}</td>
        //         </tr>
        //     )
        // })
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Eligibility</h6>
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
                    rowData={this.state.eligibilityList}
                    enableCellTextSelection={true}
                />
            </div>

            // <div style={{ paddingTop: '12px' }}>
            //     <h6>Eligibility</h6>
            //     <table class="table table-striped border">
            //         <thead>
            //             <tr>
            //                 <th className="color-style" scope="col">Insurance Id</th>
            //                 <th className="color-style" scope="col">Coverage</th>
            //                 <th className="color-style" scope="col">Effective From</th>
            //                 <th className="color-style" scope="col">Allowed Money</th>
            //                 <th className="color-style" scope="col">Status</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {row}
            //         </tbody>
            //     </table>
            // </div>
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
        let columnDefs = [
            { headerName: "Medication Code Display", field: "MedicationCodeDisplay", flex: 1 },
            { headerName: "Authored On", field: "AuthoredOn", flex: 1 },
            { headerName: "Reason Code Display", field: "ReasonCodeDisplay", flex: 1 },
            { headerName: "Note Time DateTime", field: "NoteTimeDatTime", flex: 1 },
            { headerName: "Status", field: "Status", flex: 1 }
        ]
        // let row = []
        // data.forEach(element => {
        //     row.push(
        //         <tr>
        //             <td>{element.MedicationCodeDisplay}</td>
        //             <td>{element.AuthoredOn}</td>
        //             <td>{element.ReasonCodeDisplay}</td>
        //             <td>{element.NoteTimeDatTime}</td>
        //             <td>{element.Status}</td>
        //         </tr>
        //     )
        // })

        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Medication Request</h6>
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
                    rowData={this.state.medicationList}
                    enableCellTextSelection={true}
                />
            </div>
            // <div style={{ paddingTop: '12px' }}>
            //     <h6>Medication Request</h6>
            //     <table class="table table-striped border">
            //         <thead>
            //             <tr>
            //                 <th className="color-style" scope="col">Medication Code Display</th>
            //                 <th className="color-style" scope="col">Authored On</th>
            //                 <th className="color-style" scope="col">Reason Code Display</th>
            //                 <th className="color-style" scope="col">Note Time DateTime</th>
            //                 <th className="color-style" scope="col">Status</th>
            //             </tr>
            //         </thead>

            //         <tbody>
            //             {row}
            //         </tbody>
            //     </table>
            // </div>
        )
    }

    showObservationTable() {
        let data = this.state.observationList
        let columnDefs = [
            { headerName: "Observation Code Display", field: "ObservationCodeDisplay", flex: 1 },
            { headerName: "Effective Date(s", field: "EffectiveDate", flex: 1 },
            { headerName: "Value", field: "Value", flex: 1 },
            { headerName: "Category Code Display", field: "CategoryCodeDisplay", flex: 1 },
            { headerName: "Interpretation Code Display", field: "InterpretationCodeDisplay", flex: 1 }
        ]
        // let row = []
        // data.forEach(element => {
        //     row.push(
        //         <tr>
        //             <td>{element.ObservationCodeDisplay}</td>
        //             <td>{element.EffectiveDate}</td>
        //             <td>{element.Value}</td>
        //             <td>{element.CategoryCodeDisplay}</td>
        //             <td>{element.InterpretationCodeDisplay}</td>
        //         </tr>
        //     )
        // })

        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Observation</h6>
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
                    rowData={this.state.observationList}
                    enableCellTextSelection={true}
                />
            </div>
            // <div style={{ paddingTop: '12px' }}>
            //     <h6>Observation</h6>
            //     <table class="table table-striped border">
            //         <thead>
            //             <tr>
            //                 <th className="color-style" scope="col">Observation Code Display</th>
            //                 <th className="color-style" scope="col">Effective Date(s)</th>
            //                 <th className="color-style" scope="col">Value</th>
            //                 <th className="color-style" scope="col">Category Code Display</th>
            //                 <th className="color-style" scope="col">Interpretation Code Display</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {row}
            //         </tbody>
            //     </table>
            // </div>
        )
    }

    Immunization() {
        let array = [
            { vaccine: 'Influenza, seasonal, injectable, preservative free', date: '2017-06-20 02:53', status: 'completed' },
            { vaccine: 'HPV, quadrivalent', date: '2017-06-20 02:53', status: 'completed' },
            { vaccine: 'MMR', date: '2010-08-03 16:15', status: 'completed' },
        ]
        let columnDefs = [
            { headerName: "Vaccine Code Code Display", field: "vaccine", flex: 1 },
            { headerName: "DateTime", field: "date", flex: 1 },
            { headerName: "Status", field: "status", flex: 1 },
        ]
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Immunization</h6>
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
                    rowData={array}
                    enableCellTextSelection={true}
                />
            </div>
            // <div style={{ paddingTop: '12px' }}>
            //     <h6>Immunization</h6>
            //     <table class="table table-striped border">
            //         <thead>
            //             <tr>
            //                 <th className="color-style" scope="col">Vaccine Code Code Display</th>
            //                 <th className="color-style" scope="col">DateTime</th>
            //                 <th className="color-style" scope="col">Status</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             <tr>
            //                 <td>Influenza, seasonal, injectable, preservative free</td>
            //                 <td>2017-06-20 02:53</td>
            //                 <td>completed</td>
            //             </tr>
            //             <tr>
            //                 <td>HPV, quadrivalent</td>
            //                 <td>2017-06-20 02:53</td>
            //                 <td>completed</td>
            //             </tr>
            //             <tr>
            //                 <td>MMR</td>
            //                 <td>2010-08-03 16:15</td>
            //                 <td>completed</td>
            //             </tr>
            //         </tbody>
            //     </table>
            // </div>
        )
    }

    showAllergyIntoleranceTable() {
        let array = [
            { allergy: 'Allergy to bee venom', date: '', onset: '', date: '1974-01-16 00:20', criticality: 'low', category: '["food"]', clinical: 'active' },
            { allergy: 'House dust mite allergy', date: '', onset: '', date: '1974-01-16 00:20', criticality: 'high', category: '["food"]', clinical: 'active' },
            { allergy: 'Allergy to grass pollen', date: '', onset: '', date: '1974-01-16 00:20', criticality: 'high', category: '["food"]"]', clinical: 'active' },
        ]
        let columnDefs = [
            { headerName: "Allergy/Intolerance Code Display", field: "allergy", flex: 1 },
            { headerName: "Note Time Date Time", field: "date", flex: 1 },
            { headerName: "Onset", field: "onset", flex: 1 },
            { headerName: "Asserted Date", field: "date", flex: 1 },
            { headerName: "Criticality ", field: "criticality", flex: 1 },
            { headerName: "Category", field: "category", flex: 1 },
            { headerName: "ClinicalStatus", field: "clinical", flex: 1 },
        ]
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Allergy Intolerance</h6>
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
                    rowData={array}
                    enableCellTextSelection={true}
                />
            </div>
            // return (

            //     <div style={{ paddingTop: '12px' }}>
            //         <h6>Allergy Tolerance</h6>
            //         <table class="table table-striped border">
            //             <thead>
            //                 <tr>
            //                     <th className="color-style" scope="col">Allergy/Intolerance Code Display</th>
            //                     <th className="color-style" scope="col">Note Time Date Time</th>
            //                     <th className="color-style" scope="col">Onset</th>
            //                     <th className="color-style" scope="col">Asserted Date</th>
            //                     <th className="color-style" scope="col">Criticality </th>
            //                     <th className="color-style" scope="col">Category</th>
            //                     <th className="color-style" scope="col">ClinicalStatus</th>
            //                 </tr>
            //             </thead>
            //             <tbody>
            //                 <tr>
            //                     <td>Allergy to bee venom</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>1974-01-16 00:20</td>
            //                     <td>low</td>
            //                     <td>["food"]</td>
            //                     <td>active</td>
            //                 </tr>
            //                 <tr>
            //                     <td>House dust mite allergy</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>1974-01-16 00:20</td>
            //                     <td>high</td>
            //                     <td>["food"]</td>
            //                     <td>active</td>
            //                 </tr>
            //                 <tr>
            //                     <td>Allergy to grass pollen</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>1974-01-16 00:20</td>
            //                     <td>high</td>
            //                     <td>["food"]"]</td>
            //                     <td>active</td>
            //                 </tr>
            //             </tbody>
            //         </table>
            //     </div>
        )
    }

    showConditionTable() {
        let array = [
            { condition: 'Thiopurine methyltransferase deficiency', onset: '2009-07-18 11:30', date: '', code: '', severity: '', time: '2017-12-26 23:22', verification: 'confirmed' },
            { condition: 'Needs influenza immunization', onset: '2008-08-08 11:30', date: '', code: '', severity: '', time: '2017-12-26 23:22', verification: 'confirmed' },
            { condition: 'Dementia associated with another disease', onset: '2008-08-08 11:30', date: '', code: '', severity: '', time: '', verification: 'confirmed' },
        ]
        let columnDefs = [
            { headerName: "Condition Code Display", field: "condition", flex: 1 },
            { headerName: "Onset", field: "onset", flex: 1 },
            { headerName: "Asserted Date Time", field: "date", flex: 1 },
            { headerName: "Category Code Display", field: "code", flex: 1 },
            { headerName: "Severity Code Display", field: "severity", flex: 1 },
            { headerName: "Note Time DateTime", field: "time", flex: 1 },
            { headerName: "Verification Status", field: "verification", flex: 1 },
        ]
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Condition</h6>
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
                    rowData={array}
                    enableCellTextSelection={true}
                />
            </div>

            // return (

            //     <div style={{ paddingTop: '12px' }}>
            //         <h6>Condition</h6>
            //         <table class="table table-striped border">
            //             <thead>
            //                 <tr>
            //                     <th className="color-style" scope="col">Condition Code Display</th>
            //                     <th className="color-style" scope="col">Onset</th>
            //                     <th className="color-style" scope="col">Asserted Date Time</th>
            //                     <th className="color-style" scope="col">Category Code Display</th>
            //                     <th className="color-style" scope="col">Severity Code Display</th>
            //                     <th className="color-style" scope="col">Note Time DateTime</th>
            //                     <th className="color-style" scope="col">Verification Status</th>
            //                 </tr>
            //             </thead>
            //             <tbody>
            //                 <tr>
            //                     <td>Thiopurine methyltransferase deficiency</td>
            //                     <td>2009-07-18 11:30</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>2017-12-26 23:22</td>
            //                     <td>confirmed</td>
            //                 </tr>
            //                 <tr>
            //                     <td>Needs influenza immunization</td>
            //                     <td>2008-08-08 11:30</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>2017-12-26 23:22</td>
            //                     <td>confirmed</td>
            //                 </tr><tr>
            //                     <td>Dementia associated with another disease</td>
            //                     <td>2008-08-08 11:30</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>,</td>
            //                     <td>confirmed</td>
            //                 </tr>
            //             </tbody>
            //         </table>
            //     </div>
        )
    }

    onClickEligibilty = (key) => {
        this.setState({
            Eligibilty: true,
            Claim: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
        })
    }
    onClickClaim = (key) => {
        this.setState({
            Claim: true,
            Eligibilty: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
        })
    }
    onClickshowMedicationTable = (key) => {
        this.setState({
            showMedicationTable: true,
            Eligibilty: false,
            Claim: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
        })
    }
    onClickshowObservationTable = (key) => {
        this.setState({
            showObservationTable: true,
            Eligibilty: false,
            Claim: false,
            showMedicationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
        })
    }
    onClickImmunization = (key) => {
        this.setState({
            Immunization: true,
            Eligibilty: false,
            Claim: false,
            showMedicationTable: false,
            showObservationTable: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
        })
    }
    onClickshowAllergyIntoleranceTable = (key) => {
        this.setState({
            showAllergyIntoleranceTable: true,
            Eligibilty: false,
            Claim: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showConditionTable: false,
        })
    }
    onClickshowConditionTable = (key) => {
        this.setState({
            showConditionTable: true,
            Eligibilty: false,
            Claim: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
        })
    }

    _renderSummaryDetails = () => {
        let row = []
        let summary = []
        summary = [
            { name: 'Observation', value: 2, color: '#00C0EF' },
            { name: 'Immunization', value: 3, color: '#DD4B39' },
            { name: 'Allergy Intolerance', value: 3, color: '#615CA8' },
            { name: 'Eligibility', value: 2, color: '#39CCCC' },
            { name: 'Claims', value: 1, color: '#F39C12' },
            { name: 'Medication Request', value: 1, color: '#01A65A' },
            { name: 'Condition', value: 3, color: '#8FEA7C' },
        ]
        let array = summary
        array.forEach(item => {
            row.push(
                // <div className="col-3 clickable nopadding" style={{ backgroundColor: item.color, margin: '6px', paddingLeft: '20px' }}
                //     onClick={() => {
                //         if (item.name == 'Observation') { this.onClickshowObservationTable() }
                //         else if (item.name == 'Immunization') { this.onClickImmunization() }
                //         else if (item.name == 'Allergy Tolerance') { this.onClickshowAllergyIntoleranceTable() }
                //         else if (item.name == 'Eligibility') { this.onClickEligibilty() }
                //         else if (item.name == 'Claims') { this.onClickClaim() }
                //         else if (item.name == 'Medication Request') { this.onClickshowMedicationTable() }
                //         else if (item.name == 'Condition') { this.onClickshowConditionTable() }
                //     }}>
                //     <div className="summary-header white">{item.name}</div>
                //     <div className="summary-title white">
                //         {item.value}
                //     </div>
                // </div>
                <Tiles
                    isClickable={true}
                    header_text={item.name}
                    value={item.value}
                    count_color={item.color}
                    differentTile={true}
                    onClick={() => {
                        this.setState({
                            showClaims: false,
                            claimError_Status: false,
                            showerror: false,
                        }, () => {
                            if (item.name == 'Observation') { this.onClickshowObservationTable() }
                            else if (item.name == 'Immunization') { this.onClickImmunization() }
                            else if (item.name == 'Allergy Intolerance') { this.onClickshowAllergyIntoleranceTable() }
                            else if (item.name == 'Eligibility') { this.onClickEligibilty() }
                            else if (item.name == 'Claims') { this.onClickClaim() }
                            else if (item.name == 'Medication Request') { this.onClickshowMedicationTable() }
                            else if (item.name == 'Condition') { this.onClickshowConditionTable() }
                        })
                    }}
                />
            )
        });
        return (
            <div className="row padding-left" style={{ marginTop: '24px' }}>
                {row}
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
                <img src={person} style={{ fontWeight: "500", marginTop: "10px", marginBottom: "5px", fontSize: '20px' }} alt="" width="40" height="40" title="person" />
                <label style={{ color: "#139dc9", fontWeight: "500", fontSize: '20px' }}> {this.state.FirstName} {this.state.LastName}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Dob : {this.formatDate(this.state.DOB)}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Gender : {this.state.Gender}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Identifier : {this.state.patientId_id}
                </label>
                <hr style={{ margin: '8px' }}></hr>
            </div>
        )
    }

    clickNavigation = (event) => {
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                showClaims: true,
                showerror: false,
                claims_rowData: [],
                Ag_grid_FileName: event.data.FileName,
                Ag_grid_fileDate: moment(event.data.FileDateTime).format('YYYY-MM-DD') != 'Invalid date' ? moment(event.data.FileDateTime).format('YYYY-MM-DD') : '',
                selectedFileId: event.data.FileID
            })
        } else if (event.colDef.headerName == "Error Description" && event.data.FileLevelError) {
            this.setState({
                clickedError: event.data.FileLevelError
            }, () => {
                $('#error_modal').modal('show')
            })

        }
    }

    clickNavigationClaims = (event) => {
        if (event.colDef.headerName == 'Molina Claim Id') {
            this.setState({
                showerror: true,
                claimError_Status: event.data.ClaimStatus,
                Error_data: [],
                Aggrid_ClaimLineData: [],
                Aggrid_Claim_Info_data: [],
                Aggrid_ClaimStage: [],
            })
            this.get_Error(event.data.ClaimID, event.data.ClaimRefId, event.data.FileID)
            this.getDetails(event.data.ClaimID, event.data.FileID, event.data.ClaimRefId, "", 1)
            this.getClaimStages(event.data.ClaimID, event.data.FileID, event.data.ClaimRefId)
        }
    }

    updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
        this.setState({
            fieldType: fieldType,
            sortType: sortType,
            startRow: startRow,
            endRow: endRow,
            filterArray: filterArray,
        })
    }

    _renderList = () => {
        let columnDefs = this.state.generalStatus == "File Rejected" || this.state.claimStatus == "Rejected" ? [
            { headerName: "File Name", field: "FileName", width: 250, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "State", field: "State", width: 60, cellStyle: { 'vertical-align': 'middle', wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Type", field: "Type", width: 50, cellStyle: { wordBreak: 'break-all', textAlign: 'center', 'white-space': 'normal' } },
            { headerName: "File Date", field: "FileDateTime", width: 100 },
            { headerName: "File Status", field: "FileStatus", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Submitter", field: "Sender", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total Claims", field: "Claimcount", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Error Description", field: "FileLevelError", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
        ] : [
                { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "State", field: "State", width: 60, cellStyle: { wordBreak: 'break-all', textAlign: 'center', 'white-space': 'normal' } },
                { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Type", field: "Type", width: 50, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "File Date", field: "FileDateTime", width: 100 },
                { headerName: "File Status", field: "FileStatus", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Submitter", field: "Sender", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Load Status", field: "Status", width: 80 },
                { headerName: "MCG Status", field: "MCGStatus", width: 80 },
                { headerName: "Total Claims", field: "Claimcount", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Rejected Claims", field: "Rejected", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Error Description", field: "FileLevelError", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
                Claim837RTDashboardFileDetailsNew(
                        sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                        startRow: 0, endRow: 9,Filter: ${filter},
                        
                        Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : 'FL'}",
                        Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",
                        Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , 
                        page: 1 , OrderBy:"", 
                        RecType: "Inbound", GridType:1,
                        LoadStatus:"${this.state.gridflag}", Status:"${this.state.generalStatus}", 
                        MCGStatus:"${this.state.mcgStatus}", FileID: "${this.state.incoming_fileId}", 
                        Status277CA:"${this.state.status277CA}",ClaimID:"${this.state.Filter_ClaimId}"
                ) {
                    RecCount
                    FileID
                    FileName
                    Sender
                    FileDate
                    Claimcount
                    FileStatus
                    Rejected
                    Type
                    Status
                    State
                    ProcessID
                    FileLevelError
                    MCGStatus
                    FileDateTime
                  }
                }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls.base_url}
                    paginationPageSize={5}
                    index={'Claim837RTDashboardFileDetailsNew'}
                    State={this.state.State}
                    fieldType={'FileDateTime'}
                    postData={this.postData}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    filterClaim={this.state.Filter_ClaimId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                    defaultRecCount={10}
                />
            </div>
        )
    }

    _renderClaims() {
        let columnDefs = [
            { headerName: "Molina Claim Id", field: "MolinaClaimID", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "X12 Claim Id", field: "ClaimID", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
            { headerName: "Claim Status", field: "ClaimStatus", width: 140 },
            { headerName: "Subscriber Id", field: "Subscriber_ID", width: 140 },
            { headerName: "277CA Status", field: "Status277CA", width: 100 },
            // { headerName: "HiPaaS Status", field: "Transaction_Status", width: 100 },
            // { headerName: "Adjudication Status", field: "adjudication_status", width: 140 },
            { headerName: "Claim Amount", field: "Claim_Amount", flex: 1 },
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{
            Claim837RTProcessingSummaryNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: 0, endRow: 9,Filter: ${filter},
                    
                    page:${this.state.page},Sender:"${this.state.selectedTradingPartner}",
                    State:"${this.state.State ? this.state.State : ''}",Provider:"${this.state.providerName}",
                    StartDt:"",EndDt:"",Claimstatus:"${this.state.generalStatus}", FileID : "` + this.state.selectedFileId + `", 
                    Type : "` + this.state.type + `" , OrderBy:"${this.state.inner_orderby}", 
                    RecType: "Inbound", GridType:${this.state.gridType}, 
                    FileStatus : "${this.state.claimStatus ? this.state.claimStatus : ''}", 
                    LoadStatus:"${this.state.gridflag}", MCGStatus: "${this.state.mcgStatus}", 
                    Status277CA:"${this.state.status277CA}" ,ClaimID:"${this.state.Filter_ClaimId}"
            ) {
              RecCount
              ClaimID
              ClaimDate
              ClaimTMTrackingID
              Subscriber_ID
              Claim_Amount
              ClaimStatus
              ProviderLastName
              ProviderFirstName
              SubscriberLastName
              SubscriberFirstName
              adjudication_status
              ClaimLevelErrors
              ClaimUniqueID
              FileID
              FileName
              FileCrDate
              FileStatus
              F277
              F999
              TotalLine
              TotalLinewise835
              BatchName
              BatchStatus
              Transaction_Status
              ClaimRefId
              MolinaClaimID
              FileDate
              ProcessID
              State
              FileDateTime
              ClaimDateTime
              Status277CA
            }
          }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6>Claim  Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls.claim_processing}
                    index={'Claim837RTProcessingSummaryNew'}
                    State={this.state.State}
                    fieldType={'ClaimDateTime'}
                    paginationPageSize={5}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    selectedFileId={this.state.selectedFileId}
                    filterClaim={this.state.Filter_ClaimId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigationClaims}
                    // defaultRecCount={10}
                />
            </div>
        )
    }

    _renderError() {
        if (this.state.Error_data == undefined) { this.state.Error_data = [] }
        process.env.NODE_ENV == 'development' && console.log("_renderError", this.state.Error_data);

        let columnDefs = this.state.status277CA == "Rejected" ?
            [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claim ID", field: "MolinaClaimID", width: 170 },
                { headerName: "X12 Claim ID", field: "ClaimID", width: 170 },
                { headerName: "277CA Error", field: "Error_277CA", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ] : [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claim ID", field: "MolinaClaimID", width: 170 },
                { headerName: "X12 Claim ID", field: "ClaimID", width: 170 },
                { headerName: "Error Description", field: "ErrorDesc", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    {/* <h6 className="font-size">Claim Error Description</h6> */}
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
                        rowData={this.state.Error_data}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == "Error Description" && event.data.ErrorDesc) {
                                this.setState({
                                    clickedError: event.data.ErrorDesc
                                }, () => {
                                    $('#error_modal').modal('show')
                                })

                            }
                        }}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _ClaimLineTable() {
        if (this.state.Aggrid_ClaimLineData == undefined) { this.state.Aggrid_ClaimLineData = [] }
        let columnDefs = [
            { headerName: "Molina Claim ID", field: "MolinaClaimID" },
            { headerName: "X12 Claim ID", field: "ClaimID" },

            { headerName: "Service Line No.", field: "ServiceLineCount" },
            { headerName: " Service Date", field: "ServiceDate" },
            { headerName: "Procedure Code", field: "ProcedureDate" },
            { headerName: "Unit", field: "PaidServiceUnitCount", flex: 1 },

        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Claim Line Data</h6>
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
                        rowData={this.state.Aggrid_ClaimLineData}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _ClaimView_Info_Table() {
        if (this.state.Aggrid_Claim_Info_data == undefined) { this.state.Aggrid_Claim_Info_data = [] }
        let columnDefs = [
            // { headerName: " File Name", field: "FileName" },
            // { headerName: "Receiver", field: "Receiver", width: 100 },
            { headerName: "Molina Claim Id", field: "MolinaClaimID", width: 120 },
            { headerName: "X12 Claim Id", field: "ClaimID", width: 100 },
            { headerName: " HL20 Count", field: "HL20Count", width: 80 },
            { headerName: "HL22 Count", field: "HL22Count", width: 80 },
            { headerName: "HL23 Count", field: "HL23Count", width: 80 },
            { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
            { headerName: "Subscriber First Name", field: "SubscriberFirstName", width: 100 },
            { headerName: "Subscriber Last Name", field: "SubscriberLastName", width: 100 },
            { headerName: "Admission Date", field: "AdmissionDate", width: 100 },
            { headerName: "Claim Amount", field: "Claim_Amount", width: 100 },
            { headerName: "Provider Address", field: "BillingProviderAddress", width: 140 },
            { headerName: "Claim Status", field: "ClaimStatus", width: 100 },
            { headerName: "ICD Code", field: "ICDCode", width: 100 },
            { headerName: "Accident Date", field: "AccidentDate", width: 120 },
        ]

        return (
            <div>
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
                        rowData={this.state.Aggrid_Claim_Info_data}
                        enableCellTextSelection={true}                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    renderClaims = () => {
        return (
            <div>
                {/* {this._renderList()} */}
                {this._renderClaims()}
                {this.state.showerror && (this.state.claimError_Status == "Rejected" || this.state.status277CA == "Rejected") ? this._renderError() : null}
                {this.state.showerror ? this._ClaimView_Info_Table() : null}
                {this.state.showerror ? this._ClaimLineTable() : null}
            </div>
        )
    }

    render() {
        return (
            <div style={{ height: $(window).height() }}>
                {this.renderHeader()}
                {this._renderSummaryDetails()}
                {this.rendersepsis()}
                {this.state.Eligibilty ? this.Eligibilty(this.state.conditionArray) : null}
                {/* {this.state.Claim ? this.Claim() : null} */}
                {this.state.Claim ? this.renderClaims() : null}
                {this.state.showMedicationTable ? this.showMedicationTable() : null}
                {this.state.showObservationTable ? this.showObservationTable() : null}
                {this.state.Immunization ? this.Immunization() : null}
                {this.state.showAllergyIntoleranceTable ? this.showAllergyIntoleranceTable() : null}
                {this.state.showConditionTable ? this.showConditionTable() : null}
            </div>
        )
    }
}