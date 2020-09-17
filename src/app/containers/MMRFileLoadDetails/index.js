import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import '../color.css'
import '../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import Strings from '../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../components/Filters';

var val = ''
const $ = window.$;
export class MMRFileLoadDetails extends React.Component {

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
            type: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            incoming_fileId: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            subtitle: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            availitySent: props.location.state == undefined ? '' : props.location.state && props.location.state.data[0] && props.location.state.data[0].availitySent ? props.location.state.data[0].availitySent : '',
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
            State: props.location.state == undefined ? '' : props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            transactionId: props.location.state == undefined ? '' : props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus: props.location.state == undefined ? '' : props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            errorcode: '',

            page: 1,
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag: props.location.state == undefined ? '' : props.location.state.data[0].apiflag,

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
            defaultColDef: {
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,

            },
        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.Service_StartChange = this.Service_StartChange.bind(this)
        this.Service_EndChange = this.Service_EndChange.bind(this)

    }

    componentDidMount() {

        this.getData()
        this.getState()

    }


    getData = () => {

        let count = 1
        let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.Service_endDate ? moment(this.state.Service_endDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.Organization
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            MMRFileDetails (FileID: "${this.state.incoming_fileId}"){
                FileID
                FileName
                FileDate
                Remittance_Amt
                State
                Total
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch('http://10.0.1.248:30542/mmrdetails', {
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
                    rowData: res.data.MMRFileDetails,

                })



            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }



    getTransactions = (fileId) => {


        let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.ServiceEndDate ? moment(this.state.ServiceEndDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            MMRDetails  (FileID : "` + fileId + `") {
                Beneficiary_ID
                Surname
                First_initial
                GenderCode
                DateofBirth
                ContractNumber
                Payment_Date
                State_County_Code
                Risk_Adjustment_Factor_A
                Risk_Adjustment_Factor_B
                Number_of_Payment_Adjustment_Months_Part_A
                Number_of_Payment_Adjustment_Months_Part_B
                MMR_Adjustment_Reason_Code
                Payment_Adjustment_startDate
                Payment_Adjustment_EndDate
                Demographic_Payment_Adjustment_Rate_A
                Demographic_Payment_Adjustment_Rate_B
                Monthly_Payment_Adjustment_Amount_Rate_A
                Monthly_Payment_Adjustment_Amount_Rate_B
                LIS_Premium_Subsidy
                ESRD_MSP_Flag
                Medication_Therapy_Management_MTM_Add_On
                Filer1
                Medicaid_Status
                Risk_Adjustment_Age_Group_RAAG
                Previous_Disable_Ratio
                De_Minimis
                Beneficiary_Dual_and_Part_D_Enrollment_Status_Flag
                Plan_Benefit_Package_ID
                Race_Code
                Risk_Adjustment_Factor_Type_Code
                Frailty_Indicator
                Original_Reason_for_Entitlement_Code_OREC
                Lag_Indicator
                Segment_Number
                Enrollment_Source
                EGHP_Flag
                Part_C_Basic_Premium_Part_A_Amount
                Part_C_Basic_Premium_Part_B_Amount
                Rebate_for_Part_A_Cost_Sharing_Reduction
                Rebate_for_Part_B_Cost_Sharing_Reduction
                Rebate_for_Other_Part_A_Mandatory_Supplemental_Benefits
                Rebate_for_Other_Part_B_Mandatory_Supplemental_Benefits
                Rebate_for_Part_B_Premium_Reduction_Part_A_Amount
                Rebate_for_Part_B_Premium_Reduction_Part_B_Amount
                Rebate_for_Part_D_Supplemental_Benefits_Part_A_Amount
                Rebate_for_Part_D_Supplemental_Benefits_Part_B_Amount
                Rebate_for_Part_D_Basic_Premium_Reduction
                Total_Part_A_MA_Payment
                Total_Part_B_MA_Payment
                Total_MA_Payment_Amount
                Total_Part_D_Payment
                Part_D_RA_Factor
                Part_D_Low_Income_Indicator
                Part_D_Low_Income_Multiplier
                Part_D_Long_Term_Institutional_Indicator
                Part_D_Long_Term_Institutional_Multiplier
                Part_D_Basic_Premium_Amount
                Part_D_Direct_Subsidy_Monthly_Payment_Amount
                Reinsurance_Subsidy_Amount
                Low_Income_Subsidy_Cost_Sharing_Amount
                Number_of_Payment_Adjustment_Months_Part_D
                PACE_Premium_Add_On
                PACE_Cost_Sharing_Add_on
                Part_C_Frailty_Score_Factor
                MSP_Factor
                MSP_Reduction_Reduction_Adjustment_Amount_Part_A
                MSP_Reduction_Reduction_Adjustment_Amount_Part_B
                Medicaid_Dual_Status_Code
                Part_D_Coverage_Gap_Discount_Amount
                Part_D_Risk_Adjustment_Factor_Type
                Default_Part_D_Risk_Adjustment_Factor_Code
                Part_A_Risk_Adjusted_Monthly_Rate_Amount_for_Payment_Adjustment
                Part_B_Risk_Adjusted_Monthly_Rate_Amount_for_Payment_Adjustment
                Part_D_Direct_Subsidy_Monthly_Rate_Amount_for_Payment_Adjustment
                Cleanup_ID
                FileID
                FileName
                FileDate
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch('http://10.0.1.248:30542/mmrdetails', {
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
                    claims_rowData: res.data.MMRDetails,
                    Ag_grid_FileName: res.data.MMRDetails[0].FileName,
                    Ag_grid_fileDate: res.data.MMRDetails[0].FileDate

                });

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }



    showDetails() {
        this.setState({
            showDetails: true,
            orderby: ''
        })
    }



    getDetails(claimId, fileId, RefID, fileData, page) {
        let url = Urls.real_time_claim_details
        let query = `{
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

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(Urls.transaction835, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let count = 1
                let data = res.data
                this.setState({
                    showDetails: true,
                    Aggrid_Service_Line_Info: res.data.RemittanceViewerClaimServiceDetails,
                    Aggrid_Claim_Info_data: res.data.RemittanceViewerClaimDetails,


                })
                if (data && data.RemittanceViewerClaimServiceDetails[0].length > 0) {

                    count = Math.floor(data.RemittanceViewerClaimServiceDetails[0].RecCount / 10)
                    if (data.RemittanceViewerClaimServiceDetails[0].RecCount % 10 > 0) {
                        count = count + 1
                    }
                }
                let fileDetails = []
                if (res.data.RemittanceViewerClaimDetails && res.data.RemittanceViewerClaimDetails.length > 0) {

                    let data = res.data.RemittanceViewerClaimDetails[0]

                    let fileDetails = [
                        { key: 'File Name', value: fileData.FileName },
                        { key: 'File Date', value: moment(fileData.FileDate).format('MM/DD/YYYY') + moment(fileData.FileDate).format(' h:m A') },
                        { key: 'Receiver', value: fileData.Receiver }
                    ]

                    let claimDetails =
                        [
                            { key: 'Claim Id', value: data.ClaimID },
                            { key: 'Claim Received Date', value: moment((data.ClaimReceivedDate)).format("MM/DD/YYYY") },
                            { key: 'Patient Name', value: data.PatientName },
                            // { key: '835 Response (RAW)',value: "" },
                            { key: 'Days Aged', value: "" },
                            { key: 'Payment Method Code', value: data.CHECKEFTFlag },
                            { key: 'Total Billed Amount', value: "" },
                            { key: 'Total Adjusted Amount', value: res.data.RemittanceViewerClaimServiceDetails[0].AdjAmt },
                            { key: 'Payer Name', value: data.PayerName },
                            { key: 'Payer claim control No.', value: data.PayerClaimControl },
                            { key: 'Claim Status Code', value: data.ClaimStatusCode },
                            { key: 'Claim Filling Indicator', },

                            { key: 'Patient ID', },

                            { key: 'Provider ID', },
                            { key: 'Provider Name', },
                            { key: 'Rendering Provider ID', },
                            { key: 'Facility Code Value', value: data.FacilityCode },
                            { key: 'Patient Control Number', value: data.PatientControlNo },

                            { key: 'DRG Code', value: data.DigonisCode },
                            { key: 'Total Patient Resp', value: data.PatietResAMT },

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
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderRows(dictionary) {
        let row = []
        let col = []
        let count = 0

        dictionary.forEach(item => {
            col.push(
                <div className="col-4">
                    <div className="header">{item.key}</div>
                    <div>{(moment(item.value).format('MM/DD/YYYY, hh:mm a') != "Invalid date" && item.key == 'Claim Date') ? moment(item.value).format('MM/DD/YYYY, hh:mm a') : item.value}</div>
                </div>
            )

            if (col.length % 3 == 0) {
                row.push(<div className="row">{col}</div>)
                col = []
            }
            count++
            if (count == dictionary.length && col.length > 0) {
                row.push(<div className="row">{col}</div>)
            }
        });

        return (
            <div className="summary-style">
                {row}
            </div>
        )
    }
    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Organization' || event.target.options[event.target.selectedIndex].text == 'Submitter') {
            this.setState({
                [key]: '',
                showDetails: false
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text,
                showDetails: false
            })
        }

        setTimeout(() => {
            this.getData()
        }, 50);
    }
    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails: false,
            showerror: false,
            showClaims: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }
    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false,
            showerror: false,
            showClaims: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    Service_StartChange(date) {
        this.setState({
            Service_startDate: date,
            showDetails: false,
            showerror: false,
            showClaims: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }
    Service_EndChange(date) {
        this.setState({
            Service_endDate: date,
            showDetails: false,
            showerror: false,
            showClaims: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }
    onHandleChange(e) {
        let providerName = e.target.value
        clearTimeout(val)
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            })
            this.getData()
        }, 300);
    }
    getoptions() {

        let row = []
        this.state.StateList.forEach(element => {
            row.push(<option selected={this.state.Statecode == element.StateCode ? element.StateCode : ''} value={element.StateCode}>{element.State}</option>)
        })
        return row

    }
    getState() {
        let query = `{
                  StateList  (UserId:0 Flag:0) {
                  State
                StateCode
            }
       }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._common_data, {
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
                    StateList: res.data.StateList

                })
            })

            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
            showDetails: false,
            showerror: false,
            showClaims: false
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderFilters() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">

                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-header-dashboard" va id="fao1"
                            onChange={(event) => {
                                this.ChangeVal(event, 'State')
                                setTimeout(() => {
                                    this.getData()
                                }, 50);
                            }} >
                                            <option value="" ></option>
                            {this.getoptions()}

                        </select>

                    </div>

                    <div className="form-group col-2">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                            onChange={this.handleStartChange}
                            maxDate={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                            onChange={this.handleEndChange}
                            minDate={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                </div>
            </div>
        )
    }
    handlePageClickLine = (data) => {
        let page = data.selected + 1

        this.getDetails(this.state.claimid, this.state.fileid, this.state.seqID, this.state.fileDataDetails, page)

    }


    renderClaimDetails() {
        let row = []
        const data = this.state.claimLineDetails ? this.state.claimLineDetails : []
        data.forEach((d) => {
            row.push(

                <tr>
                    <td> {moment((d.ServiceStartDate)).format("MM/DD/YYYY")}-{moment((d.ServiceEndDate)).format("MM/DD/YYYY")} </td>
                    {/* <td>  </td> */}
                    <td>{d.LineControlNo}</td>
                    <td>{d.AdjudicatedCPT}</td>
                    <td>{d.SubmittedCPT}</td>
                    <td></td><td></td><td></td>
                    <td>${d.ChargeAmount}</td>
                    <td>${d.AdjAmt}</td><td>${d.PaidAmt}</td>


                    {/* <td>{d.ServiceSupplementalAmount}</td>
                    <td>{d.OriginalUnitsofServiceCount}</td>
                    <td>{d.UnitsofServicePaidCount}</td> */}
                    {/* To be filled with approproate data */}

                </tr>



            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event'} data-toggle="collapse">Service Line Information</a></div>
                    <div id={'event'} style={{ overflow: "auto" }} >
                        <table className="table table-bordered background-color" style={{ marginBottom: "0px" }}>
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style">Service Dates</td>
                                    {/* <td className="table-head-text list-item-style">Service End Date</td> */}
                                    <td className="table-head-text list-item-style">Line Item Control #</td>
                                    <td className="table-head-text list-item-style">Adjudicated CPT</td>
                                    <td className="table-head-text list-item-style">Submitted CPT</td>
                                    <td className="table-head-text list-item-style">Submitted Units</td>
                                    <td className="table-head-text list-item-style">Paid Units</td>
                                    <td className="table-head-text list-item-style">Allowed Actual</td>
                                    <td className="table-head-text list-item-style">Charge Amount</td>
                                    <td className="table-head-text list-item-style">Adj Amount</td>
                                    <td className="table-head-text list-item-style">Paid Amount</td>



                                </tr>
                            </thead>
                            <tbody>
                                {row}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'page-link'}
                            initialPage={0}
                            pageCount={this.state.count}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            onPageChange={(page) => { this.handlePageClickLine(page) }}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            previousClassName={'page-link'}
                            nextClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderHeader(header) {
        return (
            <tr className="table-head">
                <td className="table-head-text">{header}</td>
            </tr>
        )
    }

    renderClaimsHeader(fileId) {
        return (

            <tr className="table-head">
                {/* <td className="table-head-text list-item-style clickable" onClick={() => this.handleSortNestedTable((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerPatientDetails.ClaimID", this.state.nameRotation, 'nameRotation', fileId)} src={require('../../../components/Images/up_arrow.png')} >Claim Id</td>
                <td className="table-head-text list-item-style" >Claim Received Date</td>
                <td className="table-head-text list-item-style clickable" onClick={() => this.handleSortNestedTable((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerPatientDetails.PatientName", this.state.nameRotation, 'nameRotation', fileId)} src={require('../../../components/Images/up_arrow.png')}>Patient Name</td>


              
                <td className="table-head-text list-item-style clickable" onClick={() => this.handleSortNestedTable((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerPatientDetails.TotalChargeAmt", this.state.nameRotation, 'nameRotation', fileId)} src={require('../../../components/Images/up_arrow.png')}>Total Charge Amount</td>

                <td className="table-head-text list-item-style clickable" onClick={() => this.handleSortNestedTable((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerPatientDetails.TotalClaimPaymentAmt", this.state.nameRotation, 'nameRotation', fileId)} src={require('../../../components/Images/up_arrow.png')}>Total Paid Amount</td>
                <td className="table-head-text list-item-style">Error</td> */}
            </tr>

        )

    }
    handleSort(e, rotation, key) {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            orderby: e,
            [key]: rotation == 0 ? 180 : 0
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    handleSortNestedTable(e, rotation, key, fileId) {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            nested_orderby: e,
            [key]: rotation == 0 ? 180 : 0
        })
        setTimeout(() => {
            this.getTransactions(fileId)
        }, 50);
    }
    renderTableHeader() {
        return (
            <div className="row">

                {/* s */}

            </div>
        )
    }

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        let count = 0


        try {
            count = data[Object.keys(data)[0]].value.RecCount / 10
            if (data[Object.keys(data)[0]].value.RecCount % 10 > 0) {
                count = count + 1
            }
        } catch (error) {

        }


        Object.keys(data).map((keys) => {

            row.push(
                <div className="row">

                    <div className="col-3 col-small-style border-left small-font left-align"><a href={'#' + keys}
                        onClick={() => {
                            this.getTransactions(data[keys].value.FileID)
                        }} style={{ color: "var(--light-blue)" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-2 col-small-style small-font">{moment((data[keys].value.FileDate)).format("MM/DD/YYYY hh:mm A")}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.Organization}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.CheckEFTNo}</div>
                    <div className="col-3 col-small-style small-font">{moment((data[keys].value.CheckEFTDt)).format("MM/DD/YYYY")}</div>

                </div>
            )

            {
                col = []
                data[keys].array.forEach((d) => {

                    col.push(
                        <tr>
                            <td className="list-item-style"><a className="clickable" onClick={() => {
                                this.setState({
                                    claimId: d.ClaimID
                                }, () => {
                                    this.getDetails(d.ClaimID, d.FileID, data[keys].value, 1)
                                })
                            }} style={{ color: "var(--light-blue)" }}>{d.ClaimID}</a></td>
                            <td className="list-item-style">  {moment(d.ClaimReceivedDate).format('MM/DD/YYYY')}</td>
                            {/* <td className="list-item-style">{moment(d.ClaimDate).format('MM/DD/YYYY') != "Invalid date" ? moment(d.ClaimDate).format('MM/DD/YYYY') : d.ClaimDate}</td> */}
                            <td className="list-item-style">{d.PatientName}</td>



                            <td className="style-left">${d.TotalChargeAmt} </td>
                            <td className="list-item-style">${d.TotalClaimPaymentAmt}</td>


                        </tr>
                    )
                })
            }

            row.push(
                <div id={keys} className="collapse">
                    <table id="" className="table table-bordered claim-details">
                        {this.renderClaimsHeader(data[keys].value.FileID)}
                        {col}
                    </table>

                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={this.state.initialPage}
                        pageCount={Math.floor((data[keys].value.RecCount / 10) + (data[keys].value.RecCount % 10 > 0 ? 1 : 0))}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(page) => { this.handlePageClick(page, data[keys].value.FileID) }}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        pageLinkClassName={'page-link'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />

                </div>
            )
        });

        return (
            <div>
                {this.renderTableHeader()}
                {row}
                <div style={{ marginLeft: '-14px' }}>  <br></br>
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={0}
                        pageCount={this.setState.recount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(page) => { this.handlePageClick1(page) }}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        pageLinkClassName={'page-link'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                </div>
            </div>
        );
    }
    handlePageClick1(data) {

        let page = data.selected + 1
        this.setState({
            Firstgridpage: page
        })

        setTimeout(() => {
            this.getData()
        }, 50);
    }
    _renderList = () => {
        let columnDefs = [

            { headerName: "File Name", field: "FileName", flex:1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' }, pinned: 'left' },
            { headerName: "File Date", field: "FileDate", flex:1, pinned: 'left'},
            { headerName: "State", field: "State", flex:1, },
            // { headerName: "Remittance No.", field: "RemittanceFileName",flex:1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Remittance Date", field: "RemittanceSentDate",flex:1, },
            { headerName: "Remittance Amount", field: "Remittance_Amt",  flex:1, },
            // { headerName: "Invoice No.", field: "InvoiceNo", width: 100, },
            // { headerName: "Payment Method", field: "CHECKEFTFlag", width: 120, },
            // { headerName: "Premium Receiver's Name", field: "Receiver_Name", width: 120, },
            // { headerName: "Premium Payer Name", field: "Payer_Name", width: 150, },
            // { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total", field: "Total",  flex:1, },


            // { headerName: "Process Id", field: "ProcessID", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "Received Date", field: "FileDate", width: 100 },
            // { headerName: "State", field: "State", width: 70 },
            // { headerName: "File Status", field: "Status", width: 100 },
            // { headerName: "Remittance File Name", field: "RemittanceFileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Remittance Sent Date", field: "RemittanceSentDate", width: 100 },
            // { headerName: "Organization", field: "Organization", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 100 },
            // { headerName: "Error Description", field: "ErrorDescription", width: 400, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
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
                        rowData={this.state.rowData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'File Name') {
                                this.setState({
                                    showClaims: true,
                                    showerror: false,
                                    claims_rowData: [],
                                    Ag_grid_FileName: '',
                                    Ag_grid_fileDate: ''
                                }, () => {
                                    this.getTransactions(event.data.FileID)
                                })
                            } else if (event.colDef.headerName == "Error Description" && event.data.ErrorDescription) {
                                this.setState({
                                    clickedError: event.data.ErrorDescription
                                }, () => {
                                    $('#payment_error_modal').modal('show')
                                })

                            }

                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    errorDialog = () => {
        return (
            <div class="modal" id="payment_error_modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-error">
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

    _renderClaims() {

        let columnDefs = [           
        
            // { headerName: "File Id", field: "FileID", width:100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' },pinned: 'left' },
            // { headerName: "Invoice Date", field: "ClaimReceivedDate", flex:1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Beneficiary Id", field: "Beneficiary_ID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } , pinned: 'left'},
            { headerName: "Last Name", field: "Surname", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } , pinned: 'left'},
            { headerName: "First Name", field: "First_initial", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            // { headerName: "Middle Name", field: "MiddleName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

           

            { headerName: "Gender Code ", field: "GenderCode", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "DOB", field: "DateofBirth", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Contract Number", field: "ContractNumber", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "Payment Date", field: "Payment_Date", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "State County Code", field: "State_County_Code", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "Risk Adjustment Factor A", field: "Risk_Adjustment_Factor_A", width: 180, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "Risk Adjustment Factor B", field: "Risk_Adjustment_Factor_B", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Number of Payment Adjustment Months Part A", field: "Number_of_Payment_Adjustment_Months_Part_A", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Number of Payment Adjustment Months Part B", field: "Number_of_Payment_Adjustment_Months_Part_B", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "MMR_Adjustment_Reason_Code", field: "MMR_Adjustment_Reason_Code", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Payment_Adjustment_startDate", field: "Payment_Adjustment_startDate", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Payment Date", field: "Payment_Date", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Payment_Adjustment_EndDate", field: "Payment_Adjustment_EndDate", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Demographic Payment Adjustment Rate A", field: "Demographic_Payment_Adjustment_Rate_A", width: 180, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Demographic Payment Adjustment Rate B", field: "Demographic_Payment_Adjustment_Rate_B", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Monthly Payment Adjustment Amount Rate A", field: "Monthly_Payment_Adjustment_Amount_Rate_A", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Monthly Payment Adjustment Amount Rate B", field: "Monthly_Payment_Adjustment_Amount_Rate_B", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "LIS Premium Subsidy", field: "LIS_Premium_Subsidy", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "ESRD MSP Flag", field: "ESRD_MSP_Flag", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Medication Therapy Management MTM Add On", field: "Medication_Therapy_Management_MTM_Add_On", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Filer1", field: "Filer1", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Medicaid Status", field: "Medicaid_Status", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Risk Adjustment Age Group RAAG", field: "Risk_Adjustment_Age_Group_RAAG", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Previous Disable Ratio", field: "Previous_Disable_Ratio", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "De Minimis", field: "De_Minimis", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Beneficiary Dual and Part D Enrollment Status Flag", field: "Beneficiary_Dual_and_Part_D_Enrollment_Status_Flag", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Plan Benefit Package ID", field: "Plan_Benefit_Package_ID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Race Code", field: "Race_Code", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Risk Adjustment Factor Type Code", field: "Risk_Adjustment_Factor_Type_Code", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },        
            { headerName: "Frailty Indicator", field: "Frailty_Indicator", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },        
              
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">MMR File Load Information For <label style={{ color: 'var(--main-bg-color)' }}>(File Name:-{this.state.Ag_grid_FileName} , File Date:-{this.state.Ag_grid_fileDate})</label></h6>
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
                        rowData={this.state.claims_rowData}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
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
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _ClaimView_Info_Table() {
        if (this.state.Aggrid_Claim_Info_data == undefined) { this.state.Aggrid_Claim_Info_data = [] }
        let columnDefs = [
            { headerName: "Claim Id", field: "ClaimID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
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
                        enableCellTextSelection={true}                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _ClaimServiceLineInfo() {
        if (this.state.Aggrid_Service_Line_Info == undefined) { this.state.Aggrid_Service_Line_Info = [] }
        let columnDefs = [
            { headerName: "Service Start Date", width: 120, field: "ServiceStartDate" },
            { headerName: "Service End Date", width: 120, field: "ServiceEndDate" },
            { headerName: "Line Item Control #", width: 120, field: "LineControlNo" },
            { headerName: "Adjudicated CPT", width: 120, field: "AdjudicatedCPT" },
            { headerName: "	Submitted CPT", width: 120, field: "SubmittedCPT" },
            { headerName: "Submitted Units", width: 120, field: "" },
            { headerName: "Allowed Actual", width: 120, field: "" },
            { headerName: "Paid Units", width: 120, field: "" },
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

    _refreshScreen() {
        this.getData()
    }

    update = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                removeSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                changeDefault={true}
                State={'CA'}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }


    render() {

        return (
            <div>
                <h5 className="headerText">MMR File Load Details {this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {/* {this.renderFilters()} */}
                {this._renderTopbar()}
                {
                    this.state.gridType
                        ?
                        <div>
                            {this._renderList()}
                            {this.state.showClaims ? this._renderClaims() : null}
                            {this.state.showerror ? this._ClaimView_Info_Table() : null}
                            {this.state.showerror ? this._ClaimServiceLineInfo() : null}

                        </div>
                        :
                        <div className="row padding-left">
                            <div className="col-6 claim-list file-table">
                                {this.state.claimsObj ? this.renderList() : null}
                                {/* {this.state.claimsObj ? this.renderTable() : null} */}
                            </div>

                            <div className="col-6">
                                {
                                    this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                        <div>
                                            <h6 style={{ marginTop: '20px', color: "#424242" }}>Remittance Information</h6>
                                            <hr />
                                        </div> : null
                                }
                                {

                                    this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                        <table className="table claim-Details border">
                                            {this.renderHeader('Claim #' + this.state.claimId)}
                                            {/* {this.renderHeader('Claim Information ')} */}
                                            {this.renderRows(this.state.claimDetails)}


                                        </table>

                                        : null
                                }

                                {this.state.showDetails && this.state.claimLineDetails && this.state.claimLineDetails.length > 0 ? this.renderClaimDetails() : null}
                            </div>
                        </div>
                }
                {this.errorDialog()}
            </div>
        );
    }
}