import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';
import { CommonNestedTable } from '../../../components/CommonNestedTable';
import { StateDropdown } from '../../../components/StateDropdown';
import { Filters } from '../../../components/Filters';
import { AgGridReact } from 'ag-grid-react';
import Strings from '../../../../helpers/Strings';

var val = ''
const $ = window.$;
export class Outbound_Claim_Batch_Details_837 extends React.Component {

    constructor(props) {
        super(props);
        console.log('these are the props', props)
        let condition = props.location.state && props.location.state.data && props.location.state.data.length > 0
        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineData: [],
            file: [],
            fileDetails: [],
            memberInfo: {},
            subscriberNo: '',
            type: condition && props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: condition && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: condition && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: condition && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
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
            providerName: '',

            State: condition && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status: condition && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            transactionId: condition && props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus: condition && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            errorcode: '',
            BatchID: condition && props.location.state.data[0] && props.location.state.data[0].BatchID ? props.location.state.data[0].BatchID : '',
            BatchStatus: condition && props.location.state.data[0] && props.location.state.data[0].BatchStatus ? props.location.state.data[0].BatchStatus : '',
            BatchClaimStatus: condition && props.location.state.data[0] && props.location.state.data[0].BatchClaimStatus ? props.location.state.data[0].BatchClaimStatus : '',
            page: 1,
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag: condition && props.location.state.data[0].apiflag,

            pieArray: [],
            labelArray: [],
            orderby: '',
            Icdcode: [],
            fileid: '',
            selectedICdCode: '',
            claimid: '',
            Icdcodepresent: '',
            Accidentdate: '',
            nameRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            gridType: 1,
            paginationPageSize: 5,
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
                // editable: false,
                // enableRowGroup: true,
                // enablePivot: true,
                // enableValue: true,
                // sortable: true,
                // resizable: true,
                // filter: true,
                // flex: 1,
                // minWidth: 100,
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,
            },



        
            rowData: [],
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            showerror: '',
            rowData: [],
            Aggrid_ClaimLineData: ''
        }

        this.handleAccidentdate = this.handleAccidentdate.bind(this)
        this.Saved = this.Saved.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.getIcdCode()
    }

    getIcdCode() {
        let query = `{
            ClaimsICDCODE  {
                SeqId
                ICD_CODE
                Year
                ExtraField1
            }
        }`


        // fetch(Urls.real_time_claim_details, {
        fetch('http://10.0.1.248:30506/real_time_claim_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {

                if (res.data) {
                    this.setState({
                        Icdcode: res.data.ClaimsICDCODE ? res.data.ClaimsICDCODE : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    getData = () => {
        let query = `{BatchDashboardDetails(BatchID:"${this.state.BatchID}",BatchStatus:"${this.state.BatchStatus}",BatchClaimStatus:"${this.state.BatchClaimStatus}") {
            BatchName
            BatchStatus
            BatchDate
            BatchID
            Count
            Error
          }}`
        process.env.NODE_ENV == 'development' && console.log(query)
        fetch(Urls._Encounter, {
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
                    rowData: res.data.BatchDashboardDetails,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    ChangeVal(event, key) {
        this.state.selectedICdCode = event.target.options[event.target.selectedIndex].text;
        this.setState({
            Updatefild: this.state.Error_Field == key ? event.target.options[event.target.selectedIndex].text : ''

        });

    }
    sortData(fileId, data) {
        let files = {}
        let intakeClaims = this.state.intakeClaims

        if (fileId && data) {
            files = this.state.claimsObj
            if ('sort_' + fileId in files) {
                files['sort_' + fileId].array = []
                data.forEach(item => {
                    files['sort_' + fileId].array.push(item)
                });
            }
        } else {
            intakeClaims.forEach(item => {
                files['sort_' + item.FileID] = {
                    value: item,
                    array: []
                }
            })
        }

        this.setState({
            claimsObj: files
        })
    }

    getTransactions = (batchId) => {
        let query = `{OutboundEncounterBatchProcessingSummary(BatchID:"${batchId}",BatchStatus:"${this.state.BatchStatus}",BatchClaimStatus:"${this.state.BatchClaimStatus}") {
            RefID
            FileID
            BatchName
            BatchDate
            BatchStatus
            ClaimID
            MolinaClaimID
            EncounterDate
            BatchID
            BatchClaimStatus
            Error_Field
            Error_Description
          }}`
        process.env.NODE_ENV == 'development' && console.log(query)
        fetch(Urls._Encounter, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.OutboundEncounterBatchProcessingSummary
                this.setState({
                    claims_rowData: data,

                    // Ag_grid_FileName: res.data.OutboundEncounterBatchProcessingSummary[0].FileName,
                    // Ag_grid_fileDate: res.data.OutboundEncounterBatchProcessingSummary[0].FileCrDate,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    renderButton() {

        return (

            <div>

                <button className="btn light_blue1 btn-xs" style={{ marginLeft: "20px" }}>Save</button>

            </div>
        )
    }

    Saved() {

        if (this.state.Updatefild != undefined && this.state.Updatefild != "") {
            var query = `mutation{
                UpdateErrorField837Encounter( RefID:`+ this.state.RefID + `  ErrorField:"` + this.state.Error_Field + `" ResubmitValue:"` + this.state.Updatefild + `" )
          }`

            process.env.NODE_ENV == 'development' && console.log(query);
            fetch(Urls._Encounter, {
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
                    alert(data.data.UpdateErrorField837Encounter),
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)


                );
        }
    }
    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search Claim" />
            </div>
        )
    }

    showDetails() {
        this.setState({
            showDetails: true
        })
    }

    handlePageClick = (data, fileId) => {

        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getTransactions(fileId)
        })
    }

    getIcdcodeoptions() {
        let row = []
        this.state.Icdcode.forEach(element => {

            row.push(<option value="">{element.ICD_CODE}</option>)
        })
        return row
    }
    onChangeName(event, key) {
        this.setState({
            [key]: event.target.value,
            Updatefild: this.state.Error_Field == key ? event.target.value : ''
        });
    }

    getDetails(claimId, fileId, ClaimRefId, fileData, page) {
        let Claim_Icdcode = ""
        let AccidentDate = ""
        let url = Urls._Encounter
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


                if (res.data.Claim837RTDetails && res.data.Claim837RTDetails.length > 0) {
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
                            { key: 'Claims Id', value: data.ClaimID },
                            { key: 'Claims Date', value: data.ClaimDate },
                            { key: 'First Name', value: data.SubscriberFirstName },
                            { key: 'Last Name', value: data.SubscriberLastName },
                            { key: 'Admission Date', value: data.AdmissionDate },
                            { key: 'Claims Amount', value: data.Claim_Amount },
                            { key: 'Provider Address', value: data.BillingProviderAddress },
                            // { key: 'Claim Status', value: data.ClaimStatus },
                            { key: 'ICD Code', value: Claim_Icdcode },
                            { key: 'Accident Date', value: isDate ? "" : AccidentDate, isDate: isDate },
                            { key: '', },
                            { key: '', },
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
                        lineCount: data ? data.LXCount : 0,
                        Aggrid_ClaimLineData: res.data.Claim837RTLineDetails,
                        Aggrid_Claim_Info_data: res.data.Claim837RTDetails,
                        ClaimDate: data.ClaimDate,
                        SubscriberFirstName: data.SubscriberFirstName,
                        SubscriberLastName: data.SubscriberLastName,
                        AdmissionDate: data.AdmissionDate,
                        Claim_Amount: data.Claim_Amount,
                        BillingProviderAddress: data.BillingProviderAddress,
                        Claim_Icdcode: data.Claim_Icdcode,
                        AccidentDate: data.AccidentDate,
                    })
                }
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
                <div className="col">
                    <div className="header">{item.key}</div>
                    <div>{(moment(item.value).format('MM/DD/YYYY, hh:mm a') != "Invalid date" && item.key == 'Claim Date') ? moment(item.value).format('MM/DD/YYYY, hh:mm a') : item.value}</div>
                </div>
            )

            if (col.length % 4 == 0) {
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

    renderDetails(flag) {
        return (
            <div className="row">
                {this.state.status != 'n' ? <div className="col-1"></div> : null}
                <div className={this.state.status == 'n' ? "col-12" : "col-11"}>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{flag ? 'Transaction Response' : 'Transaction Request'}</a></div>
                    <div className="border-view collapse" id={'hello' + flag}>{flag ? this.state.message_271 : this.state.message_270}</div>
                </div>
            </div>
        )
    }

    getErrorOptions() {
        let row = []
        this.state.errorList.forEach(element => {
            row.push(<option value="" selected={this.state.errorcode == element.ErrorType ? "selected" : ""}>{element.ErrorType}</option>)
        })
        return row
    }

    handleAccidentdate(date) {
        this.setState({
            Accidentdate: date,

        });
    }

    renderPieChart() {
        const data = {
            labels: this.state.labelArray,
            datasets: [{
                data: this.state.pieArray,
                backgroundColor: [
                    'var(--main-bg-color)',
                    'var(--cyan-color)',
                    'var(--hex-color)',
                    'var(--pacific-blue-color)',
                ],
                hoverBackgroundColor: [
                    'var(--main-bg-color)',
                    'var(--cyan-color)',
                    'var(--hex-color)',
                    'var(--pacific-blue-color)',
                ]
            }],
            flag: ''
        };
        return (
            <div>
                <Pie data={data}
                    options={{
                        elements: {
                            arc: {
                                borderWidth: 0
                            }
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }}
                    width={80}
                    height={40} />
            </div>
        )
    }

    renderClaimDetails() {
        let row = []
        const data = this.state.claimLineDetails ? this.state.claimLineDetails : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.ClaimID}</td>
                    <td>{d.ServiceLineCount}</td>
                    {/* <td>{d.ProviderPaidAmount}</td> */}
                    <td>{d.ServiceDate}</td>
                    <td>{d.ProcedureDate}</td>
                    <td>{d.PaidServiceUnitCount}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event'} data-toggle="collapse">Encounter Line Data</a></div>
                    <div id={'event'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style">Encounter Id</td>
                                    <td className="table-head-text list-item-style">Service line No.</td>
                                    {/* <td className="table-head-text list-item-style">Provider paid amount</td> */}
                                    <td className="table-head-text list-item-style">Service date</td>
                                    <td className="table-head-text list-item-style">Procedure code</td>
                                    <td className="table-head-text list-item-style">Unit</td>
                                </tr>
                            </thead>
                            <tbody>
                                {row}
                            </tbody>
                        </table>
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

    renderClaimsHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text">Encounter Id<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                {/* <td className="table-head-text list-item-style">Claim Date<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td> */}
                <td className="table-head-text list-item-style">Encounter Status<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">State Status<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Encounter Amount<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Error<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
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
    renderTableHeader() {
        return (
            <div className="row">
                <div className="col-3 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By EncounterOutBatchDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img> */}
                    Batch Name<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By EncounterOutBatchDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img> */}
                    Type<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by EncounterOutBatchDetails.FileDate", this.state.dateRotation, 'dateRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.dateRotation}deg)`, marginRight: '4px' }}></img> */}
                    Batch Date<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-3 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By EncounterOutBatchDetails.FileStatus", this.state.statusRotation, 'statusRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.statusRotation}deg)`, marginRight: '4px' }}></img> */}
                    Batch Status<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By EncounterOutBatchDetails.Sender", this.state.submitterRotation, 'submitterRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.submitterRotation}deg)`, marginRight: '4px' }}></ */}
                    Sender<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
            </div>
        )
    }

    get_Error = (ClaimID, seqid, fileID) => {
        let query = `{            
            BatchErrorStages  (ClaimID:"` + ClaimID + `",SeqID:` + seqid + `,FileID:"` + fileID + `") {
                FileID
                ClaimID
                Stage
                StageFileID
                ErrorDesc
                SeqID
                FileName
                FileDate
                MolinaClaimID
                Error_277CA
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._Encounter, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.BatchErrorStages

                if (this.state.gridType) {
                    this.setState({
                        Error_data: data
                    })
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    errorDialog = () => {

        return (
            <div class="modal" id="error_modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Error Description</div>
                        <div className="scroll-div">
                            {this.state.clickedError}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#error_modal').modal('hide')
                            }}>
                            Close
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        )
    }
    _renderError() {
        if (this.state.Error_data == undefined) { this.state.Error_data = [] }
        process.env.NODE_ENV == 'development' && console.log("_renderError", this.state.Error_data);

        let columnDefs = this.state.status277CA == "Rejected" ?
            [
                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claims ID", field: "MolinaClaimID", width: 170 },
                // { headerName: "X12 Encounter ID", field: "ClaimID", width: 170 },
                { headerName: "Error Description", field: "Error_277CA", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ] : [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claims ID", field: "MolinaClaimID", width: 170 },
                // { headerName: "X12 Encounter ID", field: "ClaimID", width: 170 },
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

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        let count = 0

        process.env.NODE_ENV == 'development' && console.log(data)
        try {
            count = data[Object.keys(data)[0]].value.Claimcount / 10
            if (data[Object.keys(data)[0]].value.Claimcount % 10 > 0) {
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
                    <div className="col-2 col-small-style small-font">{data[keys].value.Type}</div>
                    <div className="col-2 col-small-style small-font">{moment(data[keys].value.FileDate).format('MM/DD/YYYY')}<br />{moment(data[keys].value.FileDate).format('hh:mm a')}</div>
                    <div className="col-3 col-small-style small-font">{data[keys].value.FileStatus}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.Sender}</div>
                </div>
            )

            {
                col = []
                data[keys].array.forEach((d) => {
                    process.env.NODE_ENV == 'development' && console.log(d)
                    col.push(
                        <tr>
                            <td className="list-item-style"><a className="clickable" onClick={() => {
                                this.setState({
                                    claimId: d.ClaimID
                                }, () => {
                                    this.getDetails(d.ClaimID, d.FileID, data[keys].value)
                                })
                            }} style={{ color: "var(--light-blue)" }}>{d.ClaimID}</a></td>
                            {/* <td className="list-item-style">{moment(d.ClaimDate).format('MM/DD/YYYY') != "Invalid date" ? moment(d.ClaimDate).format('MM/DD/YYYY') : d.ClaimDate}</td> */}
                            <td className="list-item-style">{d.ClaimStatus}</td>
                            <td className="list-item-style">{d.adjudication_status}</td>
                            <td className="style-left"> ${d.Claim_Amount}</td>
                            <td className="list-item-style">{d.ClaimLevelErrors}</td>
                        </tr>
                    )
                })
            }

            row.push(
                <div id={keys} className="collapse">
                    <table id="" className="table table-bordered claim-details">
                        {this.renderClaimsHeader()}
                        {col}
                    </table>

                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={this.state.initialPage}
                        pageCount={Math.floor((data[keys].value.Claimcount / 10) + (data[keys].value.Claimcount % 10 > 0 ? 1 : 0))}
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

    renderTable() {
        const data = this.state.claimsObj
        let headerArray = []
        let rowArray = []
        headerArray.push(
            { value: 'Batch Name', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation'), key: this.state.transactionRotation, upScale: 1 },
            { value: 'Batch Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation'), key: this.state.dateRotation },
            { value: 'Batch Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation'), key: this.state.statusRotation },
            { value: 'Submitter', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation'), key: this.state.submitterRotation },
        )

        rowArray.push(
            { value: 'FileName' },
            { value: 'FileDate' },
            { value: 'FileStatus' },
            { value: 'Sender' }
        )

        return (
            <CommonNestedTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
            />
        )
    }

    _refreshScreen = () => {
        this.getData()
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
                update={this.update}
                removeSubmitter={true}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
            />
        )
    }

    _renderClaims() {
        let columnDefs = [
            { headerName: "Molina Claims Id", field: "MolinaClaimID", width:200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Claims Id", field: "ClaimID", width:150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claims Date", field: "EncounterDate", width:150 },
            { headerName: "Claims Status", field: "BatchClaimStatus", width:150 },
            { headerName: "Error Description", field: "Error_Description", flex:1  ,cellStyle: { color: '#139DC9', cursor: 'pointer' } },
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    {/* <h6 className="font-size">Encounter Information For <label style={{ color: 'var(--main-bg-color)' }}>(File Name:-{this.state.Ag_grid_FileName} , File Date:-{this.state.Ag_grid_fileDate})</label></h6> */}
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
                            if (event.colDef.headerName == 'Molina Claims Id') {
                                this.setState({
                                    showerror: true,
                                    claimError_Status: event.data.ClaimStatus,
                                    claimId: event.data.ClaimID,
                                    Error_data: [],
                                    Aggrid_ClaimLineData: [],
                                    Aggrid_Claim_Info_data: [],
                                    Aggrid_ClaimStage: [],
                                    RefID: event.data.RefID,
                                    Error_Field: event.data.Error_Field,
                                    showMemberInfo: true,
                                    textbox: true
                                }, () => {
                                    if (event.data.Error_Field != "") { $('#MemberInfoDialogbox').modal('show') }
                                    this.getDetails(event.data.ClaimID, event.data.FileID, event.data.RefID, "", 1)
                                    this.get_Error(event.data.ClaimID, event.data.RefID, event.data.FileID)
                                })
                            }
                            else if (event.colDef.headerName == "Error Description"  && event.data.Error_Description) {
                                this.setState({
                                    clickedError: event.data.Error_Description
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

    _renderList = () => {
        let columnDefs = [
            { headerName: "Batch Name", field: "BatchName", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Batch Date", field: "BatchDate", flex: 1 },
            { headerName: "Batch Status", field: "BatchStatus", flex: 1 },
            { headerName: "Total Claims", field: "Count", flex: 1 },
            { headerName: "Errored Claims", field: "Error", flex: 1 },
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
                            if (event.colDef.headerName == 'Batch Name') {
                                this.setState({
                                    showClaims: true,
                                    showerror: false,
                                    claims_rowData: [],
                                    Ag_grid_FileName: '',
                                    Ag_grid_fileDate: ''
                                }, () => {
                                    this.getTransactions(event.data.BatchID)
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
        if (this.state.claimLineDetails == undefined) { this.state.claimLineDetails = [] }
        let columnDefs = [
            { headerName: "Claims Id", field: "ClaimID" },
            { headerName: "Service line No.", field: "ServiceLineCount" },
            { headerName: "Service date.", field: "ServiceDate" },
            { headerName: "Procedure code", field: "ProcedureDate" },
            { headerName: "Unit", field: "PaidServiceUnitCount", flex: 1 },
        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Claims Line Data</h6>
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
                        rowData={this.state.claimLineDetails}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    renderMemberinfo() {

        let Error_Field = this.state.Error_Field
        return (

            <div>
                <h2 style={{ fontSize: "18px" }}>Claims Details</h2>
                <div class="form-row">

                    <br></br>
                    <div class="form-group col-md-3">
                        <label>Claims Id</label>
                        <input readOnly value={this.state.claimid == null ? '' : this.state.claimid} onChange={(e) => this.onChangeName(e, 'claimid')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Claims Date</label>
                        <input readOnly value={this.state.ClaimDate == null ? '' : this.state.ClaimDate} onChange={(e) => this.onChangeName(e, 'ClaimDate')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>First Name</label>
                        <input readOnly value={this.state.SubscriberFirstName == null ? '' : this.state.SubscriberFirstName} onChange={(e) => this.onChangeName(e, 'SubscriberFirstName')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Last Name</label>
                        <input readOnly value={this.state.SubscriberLastName == null ? '' : this.state.SubscriberLastName} onChange={(e) => this.onChangeName(e, 'SubscriberLastName')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Admission Date</label>
                        <input readOnly value={this.state.AdmissionDate == null ? '' : this.state.AdmissionDate} onChange={(e) => this.onChangeName(e, 'AdmissionDate')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Claims Amount</label>
                        <input readOnly value={this.state.Claim_Amount == null ? '' : this.state.Claim_Amount} onChange={(e) => this.onChangeName(e, 'Claim_Amount')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Accident Date</label>
                        <input readOnly value={this.state.AccidentDate == null ? '' : this.state.AccidentDate} onChange={(e) => this.onChangeName(e, 'AccidentDate')} class="form-control" placeholder=""></input>

                    </div>
                    <div class="form-group col-md-3">
                        <label>ICD Code</label>
                        <select disabled={this.state.Error_Field == "DiagnosisCodes" ? "" : "readOnly"} className="form-control" onChange={(e) => this.ChangeVal(e, 'DiagnosisCodes')}>
                            <option value="0"></option>
                            {this.getIcdcodeoptions()}
                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Provider Address</label>
                        <textarea readOnly={this.state.Error_Field == "BillingProviderAddress" ? "" : "readOnly"} value={this.state.BillingProviderAddress == null ? '' : this.state.BillingProviderAddress} onChange={(e) => this.onChangeName(e, 'BillingProviderAddress')} class="form-control" placeholder=""></textarea>
                    </div>
                    {/* <div class="form-group col-md-3">
                        <label>Dob</label>
                       <DatePicker  readOnly={this.state.Error_Field=="dob" ? "" : "readOnly"} className="form-control" value={this.state.dob == null ? '' : this.state.dob}
                            selected={this.state.dob ? new Date(moment(this.state.dob).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handle_dob}></DatePicker>
                       
                       
                    </div> */}


                </div>

                <button onClick={this.Saved} type="submit" style={{ margin: "0px" }} class="btn btn-display">Resubmit</button>
            </div>
        );
    }
    MemberInfoDialogbox = () => {

        return (
            <div class="modal" id="MemberInfoDialogbox" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-Memberinfo">
                    <div className="error-dialog">
                        <div
                            onClick={() => {
                                // this.memberDetails(this.state.RefID, this.state.subscriberNo)
                                this.setState({
                                    showDetailsEnrollment: true,
                                    textbox: false

                                })
                                $('#MemberInfoDialogbox').modal('hide')

                            }}>
                            <span class="close clickable">&times;</span>
                        </div>

                        <div>
                            {this.state.showMemberInfo ? this.renderMemberinfo() : null}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    render() {

        return (
            <div>
                <h5 className="headerText">Claims Batch Details (Outbound)</h5>
                {this._renderTopbar()}
                {this.MemberInfoDialogbox()}

                {this.state.gridType
                    ?
                    <div>
                        {this._renderList()}
                        {this.state.showClaims ? this._renderClaims() : null}
                        {this.state.showerror ? this._renderError() : null}
                        {this.state.showerror ?
                            <table className="table claim-Details border">
                                {this.renderHeader('Claims #' + this.state.claimId)}

                                {this.state.Error_Field != "" ?
                                    <div>
                                        <label onClick={() => {
                                            this.setState({
                                                showMemberInfo: true,
                                                textbox: true

                                            })
                                            $('#MemberInfoDialogbox').modal('show')

                                        }} className="clickable underline-label" style={{ float: 'right', marginRight: '20px', color: "#139DC9", fontWeight: 'bold' }}> Edit</label><br></br> </div> : ""}
                                {this.renderRows(this.state.claimDetails)}

                                {this.state.Icdcodepresent == "ICDCode" || this.state.Icdcodepresent == "AccidentDt" ? this.renderButton() : ""}
                            </table>
                            : null}
                        {this.state.showerror ? this._ClaimLineTable() : null}
                        {this.state.showDetails && this.state.claimStageDetails && this.state.claimStageDetails.length > 0 ? this._renderClaimStageDetails() : null}
                    </div> :
                    <div className="row padding-left">
                        <div className="col-6 claim-list file-table">
                            {this.state.claimsObj ? this.renderList() : null}
                            {/* {this.state.claimsObj ? this.renderTable() : null} */}
                        </div>

                        <div className="col-6">
                            {
                                this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                    <div>
                                        <h6 style={{ marginTop: '20px', color: "#424242" }}>Claims Data</h6>
                                        <hr />
                                    </div> : null
                            }
                            {
                                this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                    <table className="table claim-Details border">
                                        {this.renderHeader('Batch #' + this.state.fileid)}
                                        {this.renderRows(this.state.fileDetails)}
                                    </table>
                                    : null
                            }
                            {
                                this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                    <table className="table claim-Details border">
                                        {this.renderHeader('Claims #' + this.state.claimId)}
                                        {this.renderRows(this.state.claimDetails)}
                                        <br></br>
                                        {this.state.Icdcodepresent == "ICDCode" || this.state.Icdcodepresent == "AccidentDt" ? this.renderButton() : ""}
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