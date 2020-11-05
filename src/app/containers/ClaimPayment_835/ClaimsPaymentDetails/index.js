import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';

var val = ''
const $ = window.$;
let isOutbound;
export class ClaimPaymentDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineData: [],
            file: [],
            fileDetails: [],
            memberInfo: {},
            subscriberNo: '',
            clickedError: '',
            type: props.location.state && props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            incoming_fileId: props.location.state && props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            subtitle: props.location.state && props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            availitySent: props.location.state && props.location.state.data[0] && props.location.state.data[0].availitySent ? props.location.state.data[0].availitySent : '',
            EFTCHK: props.location.state && props.location.state.data[0] && props.location.state.data[0].EFTCHK ? props.location.state.data[0].EFTCHK : '',
            Service_startDate: '',
            Service_endDate: '',
            coverage_data: [],
            tradingpartner: [],
            claimsList: [],
            summaryList: [],
            showDetails: false,
            files_list: [],
            errorList: [],
            eventLog: [],
            claimDetails: [],
            claimLineDetails: [],
            Transaction_Compliance: '',
            Organization: '',
            State: props.location.state && props.location.state.data[0] && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            transactionId: props.location.state && props.location.state.data[0] && props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            errorcode: '',
            Filter_ClaimId: props.location.state && props.location.state.data[0] && props.location.state.data[0].Filter_ClaimId ? props.location.state.data[0].Filter_ClaimId : '',
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag: props.location.state && props.location.state.data[0] && props.location.state.data[0].apiflag,

            pieArray: [],
            labelArray: [],
            orderby: '',
            fileid: '',
            claimid: '',
            nameRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            StateList: [],
            Statecode: '',
            Sender: '',
            Servicelinepage: 1,
            nested_orderby: '',
            gridType: 1,
            domLayout: 'autoHeight',
            paginationPageSize: 5,
            selectedFileId: '',
            defaultColDef: {
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,

            },
        }
    }
    componentWillMount() {
        isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
    }
    showDetails() {
        this.setState({
            showDetails: true,
            orderby: ''
        })
    }

    getDetails(claimId, fileId, RefID, fileData, page) {
        let query = ''
        if(isOutbound){
             query = `{
                RemittanceViewerClaimDetails (RefID:`+ RefID + `, FileID: "` + fileId + `") {
                    FileID
                    FileName
                    FileDate
                    Organization
                    Payee_IdentificationQL
                    Payee_IdentificationCode
                    CheckEFTNo
                    PayerIdentifier
                    PayerName
                    PayerID
                    CheckEFTDt
                    AccountNo
                    CHECKEFTFlag
                    ClaimID
                    PayerClaimControl
                    ClaimReceivedDate
                    PatientName
                    PatientControlNo
                    TotalChargeAmt
                    TotalClaimPaymentAmt
                    PatietResAMT
                    DigonisCode
                    DGNQty
                    ClaimStatusCode
                    FacilityCode
                    AdjustmentAmt
                }
                RemittanceViewerClaimServiceDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `" ,page:${page}) {
                    FileID
                    ClaimID
                    ServiceEndDate
                    ServiceStartDate
                    AdjudicatedCPT
                    ChargeAmount
                    PaidAmt
                    AdjAmt
                    SubmittedCPT
                    LineControlNo
                    ServiceSupplementalAmount
                    OriginalUnitsofServiceCount
                    UnitsofServicePaidCount
                    RecCount
                }
              }
              `
        }else{
            query = `{ RemittanceViewerClaimServiceDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `" ,page:${page}, RefID:${RefID}) {
                FileID
                ClaimID
                ServiceEndDate
                ServiceStartDate
                AdjudicatedCPT
                ChargeAmount
                PaidAmt
                AdjAmt
                SubmittedCPT
                LineControlNo
                ServiceSupplementalAmount
                OriginalUnitsofServiceCount
                UnitsofServicePaidCount
                RecCount
            }}`
        }
//         Submitted Units
// Allowed Actual
// Paid Units
       

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(isOutbound ? Urls.transaction835 : Urls._transaction835, {
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
                let count = 1
                let _data = res.data
                if (_data) {
                    this.setState({
                        showDetails: true,
                        Aggrid_Service_Line_Info: res.data.RemittanceViewerClaimServiceDetails,
                        Aggrid_Claim_Info_data: res.data.RemittanceViewerClaimDetails,
                    })
                    if (_data.RemittanceViewerClaimServiceDetails[0].length > 0) {

                        count = Math.floor(_data.RemittanceViewerClaimServiceDetails[0].RecCount / 10)
                        if (_data.RemittanceViewerClaimServiceDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                    }
                    if (res.data.RemittanceViewerClaimDetails && res.data.RemittanceViewerClaimDetails.length > 0) {

                        let data = res.data.RemittanceViewerClaimDetails[0]

                        let fileDetails = [
                            { field_name: 'File Name', value: fileData.FileName },
                            { field_name: 'File Date', value: moment(fileData.FileDate).format('MM/DD/YYYY') + moment(fileData.FileDate).format(' h:m A') },
                            { field_name: 'Receiver', value: fileData.Receiver }
                        ]

                        let claimDetails =
                            [
                                { field_name: 'Claim Id', value: data.ClaimID },
                                { field_name: 'Claim Received Date', value: moment((data.ClaimReceivedDate)).format("MM/DD/YYYY") },
                                { field_name: 'Patient Name', value: data.PatientName },
                                // { field_name: '835 Response (RAW)',value: "" },
                                { field_name: 'Days Aged', value: "" },
                                { field_name: 'Payment Method Code', value: data.CHECKEFTFlag },
                                { field_name: 'Total Billed Amount', value: "" },
                                { field_name: 'Total Adjusted Amount', value: res.data.RemittanceViewerClaimServiceDetails[0].AdjAmt },
                                { field_name: 'Payer Name', value: data.PayerName },
                                { field_name: 'Payer claim control No.', value: data.PayerClaimControl },
                                { field_name: 'Claim Status Code', value: data.ClaimStatusCode },
                                { field_name: 'Claim Filling Indicator', },

                                { field_name: 'Patient ID', },

                                { field_name: 'Provider ID', },
                                { field_name: 'Provider Name', },
                                { field_name: 'Rendering Provider ID', },
                                { field_name: 'Facility Code Value', value: data.FacilityCode },
                                { field_name: 'Patient Control Number', value: data.PatientControlNo },

                                { field_name: 'DRG Code', value: data.DigonisCode },
                                { field_name: 'Total Patient Resp', value: data.PatietResAMT },

                            ]
                        this.setState({
                            showDetails: true,
                            claimDetails: claimDetails,
                            claimLineDetails: res.data.RemittanceViewerClaimServiceDetails,
                            fileDetails: fileDetails,
                            fileid: data.FileID,
                            claimid: data.ClaimID,
                            count: count,

                        })
                    }
                    process.env.NODE_ENV == 'development' && console.log("sdnsajhsfjf", this.state.claimLineDetails)
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    errorDialog = () => {
        return (
            <div className="modal" id="payment_error_modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Error Description</div>
                        <div className="scroll-div">
                            {this.state.clickedError}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#payment_error_modal').modal('hide')
                            }}>
                            Close
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        )
    }

    clickNavigationClaims = (event) => {
        if (event.colDef.headerName == 'Claim Id') {
            this.setState({

                showerror: true,
                Error_data: [],
                Aggrid_ClaimLineData: [],
                Aggrid_Claim_Info_data: [],
                Aggrid_Service_Line_Info: [],

            })
            this.getDetails(event.data.ClaimID, event.data.FileID, event.data.RefID, "", 1)
        }
    }

    _renderClaims = () => {
        let columnDefs=[]
        let outboundPage = JSON.parse(sessionStorage.getItem('isOutbound'))

    if(outboundPage){
        columnDefs = [
            { headerName: "Claim Id", field: "ClaimID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Claim Received Date", field: "ClaimReceivedDate", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Patient Name", field: "PatientName", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total Charge Amount", field: "TotalChargeAmt", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total Paid Amount", field: "TotalClaimPaymentAmt", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total Adjusted Amount", field: "TotalAdjustmentAmount", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Days Aged", field: "Days", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        ]
    }else{
        columnDefs = [
            { headerName: "Claim Id", field: "ClaimID", width: 150, cellStyle: {color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Claim Received Date", field: "ClaimReceivedDate", width: 140,  },
            { headerName: "Patient Name", field: "PatientName", width: 200,  },
            { headerName: "Total Charge Amount", field: "TotalChargeAmt", width: 120,  },
            { headerName: "Total Paid Amount", field: "TotalClaimPaymentAmt", width: 120,  },
            { headerName: "Total Adjusted Amount", field: "TotalAdjustmentAmount", width: 130,  },
            { headerName: "Days Aged", field: "Days", width: 120  },
            { headerName: "Claim Filling Indicator", field: "Claim_Filing_Indicator_Code", width: 120,},
            // { headerName: "Provider ID", field: "providerID", width: 120,  },
            { headerName: "Rendering Provider ID", field: "Rendering_ProviderID", width: 120,  },
            { headerName: "Rendering Provider Name", field: "ProviderName", width: 120,  },
            { headerName: "Facility Code Value", field: "FacilityCode", width: 120,  },
            { headerName: "DRG Code", field: "DGNQty", width: 120,  },
        ]
        
    }
        
        
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = ''
        if(outboundPage){
             query = `{
                PaymentProcessingSummaryNew(
                    StartDt:"` + startDate + `",EndDt:"` + endDate + `" , State:"${this.state.State}",FileID:"${this.state.selectedFileId}",Status:"${this.state.claimStatus}",
                    RecType:"${recType}", AvailitySent:"${this.state.availitySent}", EFTCHK:"${this.state.EFTCHK}",ClaimID:"${this.state.Filter_ClaimId}",
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                       startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter}
                ) {
                    RefID
                    RecCount
                    FileID
                    FileName
                    FileDate
                    ClaimID
                    ClaimReceivedDate
                    PatientName
                    PatientControlNo
                    PayerName
                    TotalChargeAmt
                    TotalClaimPaymentAmt
                    Sender
                    Organization
                    TransactionType
                    CheckEFTNo
                    TRN03
                    PayerID
                    CheckEFTDt
                    AccountNo
                    CHECKEFTFlag
                    Receiver
                    TotalAdjustmentAmount
                    TotalBillAmount
                    Days
                    RemittanceFileName
                    RemittanceSentDate
                    State
                    Status
                    ProcessID
                    }
                  }`
        }else{
            query = `{
                PaymentProcessingSummaryNew(
                    StartDt:"` + startDate + `",EndDt:"` + endDate + `" , State:"${this.state.State}",FileID:"${this.state.selectedFileId}",Status:"${this.state.claimStatus}",
                    RecType:"${recType}", AvailitySent:"${this.state.availitySent}", EFTCHK:"${this.state.EFTCHK}",ClaimID:"${this.state.Filter_ClaimId}",
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                       startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter}
                ) {
                    RefID
                    RecCount
                    FileID
                    FileName
                    FileDate
                    ClaimID
                    ClaimReceivedDate
                    PatientName
                    PatientControlNo
                    PayerName
                    TotalChargeAmt
                    TotalClaimPaymentAmt
                    Sender
                    Organization
                    TransactionType
                    CheckEFTNo
                    TRN03
                    PayerID
                    CheckEFTDt
                    AccountNo
                    CHECKEFTFlag
                    Receiver
                    TotalAdjustmentAmount
                    TotalBillAmount
                    Days
                    RemittanceFileName
                    RemittanceSentDate
                    State
                    Status
                    ProcessID
                    Claim_Filing_Indicator_Code
                    ProviderName
                    Rendering_ProviderID
                    DGNQty
                    FacilityCode
                    providerID
                    }
                  }` 
        }
       
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Remittance Information For <label style={{ color: 'var(--main-bg-color)' }}>{outboundPage ?  this.state.Ag_grid_ProcessId == null ? '(Process Id:- )' : '(Process Id:- ' +this.state.Ag_grid_ProcessId + ')' : '(File Name:-' + this.state.Ag_grid_FileName+ ')'}</label></h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    paginationPageSize={5}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    fieldType={'FileDate'}
                    index={'PaymentProcessingSummaryNew'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    selectedFileId={this.state.selectedFileId}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigationClaims}
                    handleColWidth = {140}
                />
            </div>
        )
    }


    _ClaimView_Info_Table() {
        if (this.state.Aggrid_Claim_Info_data == undefined) { this.state.Aggrid_Claim_Info_data = [] }
        let columnDefs = [
            { headerName: "Claim Id", field: "ClaimID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: (isOutbound ? '' : '#139DC9'), cursor: (isOutbound ? '' : 'pointer') } },
            { headerName: "Claim Received Date", field: "ClaimReceivedDate", width: 120 },
            { headerName: "Patient Name", field: "PatientName", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "835 Response (RAW)", field: "", width: 120 , cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }},
            // { headerName: "Days Aged", field: "", width: 100 , cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }},
            { headerName: "Payment Method Code", field: "CHECKEFTFlag", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Patient Control Number", field: "PatientControlNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total Patient Resp", field: "PatietResAMT", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Payer Name", field: "PayerName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Payer claim control No.", field: "PayerClaimControl", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Status Code", field: "ClaimStatusCode", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Filling Indicator", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Patient ID", field: "", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Provider ID", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Provider Name", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Rendering Provider ID", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Facility Code Value", field: "FacilityCode", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "DRG Code", field: "DigonisCode", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

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
                        enableCellTextSelection={true}

                        onCellClicked={(event) => {

                            if (event.colDef.headerName == "Claim Id" && !isOutbound) {

                                this.setState({
                                    Filter_ClaimId: event.data.ClaimID
                                }, () => {
                                    this.goClaimOutbound()
                                })
                            }


                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    goClaimOutbound = (fileId) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''
        sessionStorage.setItem('isOutbound', true)
        let sendData = [
            {
                flag: '',
                State: State,
                selectedTradingPartner: selectedTradingPartner,
                startDate: startDate,
                endDate: endDate,
                status: "",
                type: type,
                Filter_ClaimId: this.state.Filter_ClaimId,
                incoming_fileId: fileId ? fileId : this.state.incoming_fileId
            },
        ]

        this.props.history.push('/' + Strings.Outbound_Claim_updated_Details_837_Grid, {
            data: sendData
        })

        window.location.reload()
    }
    _ClaimServiceLineInfo() {
        if (this.state.Aggrid_Service_Line_Info == undefined) { this.state.Aggrid_Service_Line_Info = [] }
        let columnDefs = [
            { headerName: "Service Start Date", width: 120, field: "ServiceStartDate" },
            { headerName: "Service End Date", width: 120, field: "ServiceEndDate" },
            { headerName: "Line Item Control #", width: 120, field: "LineControlNo" },
            { headerName: "Adjudicated CPT", width: 120, field: "AdjudicatedCPT" },
            { headerName: "Submitted CPT", width: 120, field: "SubmittedCPT" },
            { headerName: "Service Supplemental Amount", width: 120, field: "ServiceSupplementalAmount" },
            { headerName: "Original Units of Service Count", width: 120, field: "OriginalUnitsofServiceCount" },
            { headerName: "Claim Adjustment Reason Code", width: 120, field: "UnitsofServicePaidCount" },
            { headerName: "Charge Amount", width: 120, field: "ChargeAmount" },
            { headerName: "Adj Amount", width: 120, field: "AdjAmt" },
            { headerName: "Paid Amount", field: "PaidAmt" },

        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Service Line Information</h6>
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
                        rowData={this.state.Aggrid_Service_Line_Info}



                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
        this.setState({
            fieldType: fieldType,
            sortType: sortType,
            startRow: startRow,
            endRow: endRow,
            filterArray: filterArray
        })
    }
    clickNavigation = (event) => {

            if (isOutbound ? event.colDef.headerName == 'Process Id' : event.colDef.headerName == 'File Name') {
                this.setState({
                    showClaims: true,
                    showerror: false,
                    claims_rowData: [],
                    Ag_grid_FileName: event.data.FileName,
                    Ag_grid_fileDate: event.data.FileDate,
                    Ag_grid_ProcessId: event.data.ProcessID,
                    selectedFileId: event.data.FileID,
                })
            } else if (event.colDef.headerName == "Error Description" && event.data.ErrorDescription) {
                this.setState({
                    clickedError: event.data.ErrorDescription
                }, () => {
                    $('#payment_error_modal').modal('show')
                })
    
            }
       
        
    }

    postData = (data) => {
        console.log(data)
        this.setState({
            showClaims: true,
            Ag_grid_FileName: data && data.length > 0 ? data[0].RemittanceFileName : '',
            Ag_grid_fileDate: data && data.length > 0 ? data[0].RemittanceSentDate : '',
            Ag_grid_ProcessId: data && data.length > 0 ? data[0].ProcessID : '',
            selectedFileId: data && data.length > 0 ? data[0].FileID : ''
        })
    }
    _renderList = () => {

        let columnDefs =[]
        let outbound = JSON.parse(sessionStorage.getItem('isOutbound'))
      if(outbound){
          columnDefs=[
              { headerName: "Process Id", field: "ProcessID", width: 200, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
              { headerName: "Received Date", field: "FileDate", width: 100 },
              { headerName: "State", field: "State", width: 70 },
              { headerName: "File Status", field: "Status", width: 100 },
              { headerName: "Remittance File Name", field: "RemittanceFileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
              { headerName: "Remittance Sent Date", field: "RemittanceSentDate", width: 100 },
              { headerName: "Organization", field: "Organization", width: 150 },
              { headerName: "Payment Method", field: "CHECKEFTFlag", width: 70 },
              { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 100 },
              { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 100 },
              { headerName: "Total Billed Amount", field: "TotalBillAmount", width: 100 },
              { headerName: "Error Description", field: "ErrorDescription", width: 400, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
          ]
      
      }else{
          columnDefs=[
              { headerName: "File Name", field: "RemittanceFileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer'  } },
              { headerName: "File Date", field: "RemittanceSentDate", width: 100 },
              { headerName: "State", field: "State", width: 70 },
              { headerName: "File Status", field: "Status", width: 100 },
              { headerName: "Organization", field: "Organization", width: 150 },
              { headerName: "Payment Method", field: "CHECKEFTFlag", width: 70 },
              { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 100 },
              { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 100 },
              { headerName: "Total Billed Amount", field: "TotalBillAmount", width: 100 },
              { headerName: "Error Description", field: "ErrorDescription", width: 400, cellStyle: { color: '#139DC9', cursor: 'pointer' } },      
          ]
      }

        // controller.abort()
        // controller = new AbortController()
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
            Dashboard835FileDetailsNew(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",
            EndDt: "${endDate}",page:1,OrderBy:"${this.state.orderby}" ,
            Status:"${this.state.claimStatus}" , FileID:"${this.state.incoming_fileId}" ,
            RecType:"${recType}", AvailitySent:"${this.state.availitySent}", EFTCHK:"${this.state.EFTCHK}",
            ClaimID:"${this.state.Filter_ClaimId}"
            sorting:[{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
            startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter:${filter}) {
              RecCount
              Sender
              Organization
              FileID
              FileName
              CheckEFTNo
              FileDate
              PayerName
              PayerID
              AccountNo
              CHECKEFTFlag
              CheckEFTDt
              Receiver
              ProcessID
              State
              TotalBillAmount
              RemittanceFileName
              RemittanceSentDate
              TotalClaim
              Rejected
              Status
              ErrorDescription
            }
          }
          `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    paginationPageSize={5}
                    fieldType={'FileDate'}
                    index={'Dashboard835FileDetailsNew'}
                    filterClaim={this.state.Filter_ClaimId}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    postData={this.postData}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }
    _refreshScreen = () => {

    }
    update = (key, value) => {
        this.setState({
            [key]: value,
            showDetails: false,
            showerror: false,
            showClaims: false
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                removeSubmitter={true}
                State={this.state.State}
                removeGrid={true}
                changeDefault={true}
                Filter_ClaimId={this.state.Filter_ClaimId}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                showclaimId={true}
            />
        )
    }

    render() {

        return (
            <div>
                <h5 className="headerText">Payment Details {this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {this._renderTopbar()}
                <div>
                    {this._renderList()}
                    {this.state.showClaims && this.state.selectedFileId ? this._renderClaims() : null}
                    {this.state.showerror && isOutbound ? this._ClaimView_Info_Table() : null}
                    {this.state.showerror ? this._ClaimServiceLineInfo() : null}

                </div>

                {this.errorDialog()}
            </div>
        );
    }
}