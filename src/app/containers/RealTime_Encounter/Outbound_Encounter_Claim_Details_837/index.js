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

var val = ''
const $ = window.$;
export class Outbound_Encounter_ClaimDetails837 extends React.Component {
    constructor(props) {
        super(props);
        let condition = props.location.state && props.location.state.data && props.location.state.data.length > 0
        this.state = {
            intakeClaims: [],
            page: 1,
            gridType: 1,
            initialPage: 0,
            lineData: [],
            file: [],
            claimStageDetails: [],
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



            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
          
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
        let count = 1
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            EncounterFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.Firstgridpage + ` , OrderBy:"` + this.state.orderby + `", RecType: "Outbound") {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                Claimcount
                FileStatus
                Receiver
                Rejected
                Type
            }
        }`
        process.env.NODE_ENV == 'development' && console.log(query)
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
                if (res && res.data && res.data.EncounterFileDetails) {

                    if (res.data.EncounterFileDetails.length > 0) {

                        count = Math.floor(res.data.EncounterFileDetails[0].RecCount / 10)
                        if (res.data.EncounterFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;

                    }

                    this.setState({
                        intakeClaims: res.data.EncounterFileDetails,
                        rowData: res.data.EncounterFileDetails,
                    }, () => {
                        this.sortData()
                    })


                }


            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    ChangeVal(event, key) {
        this.state.selectedICdCode = event.target.options[event.target.selectedIndex].text;

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

    getTransactions = (fileId) => {

        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            EncounterProcessingSummary (page:${this.state.page},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", FileID : "` + fileId + `", Type : "` + this.state.type + `" , OrderBy:"", RecType: "Outbound") {
                RecCount
                ClaimID
                ClaimDate
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
            }
        }`
        process.env.NODE_ENV == 'development' && console.log(query)
        // fetch(Urls.claim_processing, {
        fetch('http://10.0.1.248:30506/claim_processing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.EncounterProcessingSummary
                if (data && data.length > 0) {
                    this.setState({
                        claims_rowData: data,
                        Ag_grid_FileName: res.data.EncounterProcessingSummary[0].FileName,
                        Ag_grid_fileDate: res.data.EncounterProcessingSummary[0].FileCrDate,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    renderButton() {
        return (
            <div>
                <button onClick={this.Saved} className="btn light_blue1 btn-xs" style={{ marginLeft: "20px" }}>Save</button>
            </div>
        )
    }

    Saved() {
        if (this.state.Icdcodepresent == "Icdcode") {
            if (this.state.selectedICdCode != "") {
                let query = `mutation{updateICDCode(
                    ClaimID:"`+ this.state.claimid + `" 
                    FileID:"`+ this.state.fileid + `"  
                    ICDCode:"`+ this.state.selectedICdCode + `"     
                    )
                  }`


                fetch(Urls._base_url, {
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
                        alert(data.data.updateICDCode),
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)

                    );

            }
        }
        else if (this.state.Icdcodepresent == "AccidentDt") {
            if (this.state.Accidentdate != "") {
                let query = `mutation{updateAccidentDate(
                    ClaimID:"`+ this.state.claimid + `"
                    FileID:"`+ this.state.fileid + `"  
                    AccidentDate:"`+ this.state.Accidentdate + `"     
                    )
                  }`
                process.env.NODE_ENV == 'development' && console.log("sdlnskjggsdj", query);
                fetch(Urls._base_url, {
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
                        alert(data.data.updateAccidentDate),
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)

                    );
            }

        }
        else if (this.checkError == "ICD Code not found") {
            if (this.state.selectedICdCode != "") {
                var query = 'mutation{ updateICDCode(SeqID :' + this.state.SelectFileID + ' ' + 'ICDCode :"' + this.state.selectedICdCode + '"' +
                    ')' +
                    '}'
                process.env.NODE_ENV == 'development' && console.log(query);
                fetch(Urls._base_url, {
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
                        alert(data.data.updateICDCode),
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)

                    );

            }
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
            Accidentdate: event.target.value

        });
    }
    getDetails(claimId, fileId, fileData) {
        let Claim_Icdcode = ""
        let AccidentDate = ""
        let url = Urls.real_time_claim_details
        let query = `{
            EncounterDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `") {
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
            }
            EncounterLineDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `") {
              ClaimID
              ServiceLineCount
              ProviderPaidAmount
              ServiceDate
              ProcedureDate
              PaidServiceUnitCount
            }
          }
          `

        process.env.NODE_ENV == 'development' && console.log(query)

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
                process.env.NODE_ENV == 'development' && console.log("sdfdsss", res.data.EncounterDetails[0].FieldToUpdate)
                if (res.data.EncounterDetails && res.data.EncounterDetails.length > 0) {
                    if (res.data.EncounterDetails[0].FieldToUpdate == "ICDCode") {
                        Claim_Icdcode = <select id="fao1" className="form-control" style={{ width: "100px" }} onChange={(e) => this.ChangeVal(e)}>
                            <option value="0" ></option>
                            {this.getIcdcodeoptions()}
                        </select>
                    }
                    else {
                        Claim_Icdcode = res.data.EncounterDetails[0].ICDCode;
                    }
                    if (res.data.EncounterDetails[0].FieldToUpdate == "AccidentDt") {
                        AccidentDate = <input onChange={(e) => this.onChangeName(e, 'Accidentdate')} type='text' style={{ width: "80px" }}></input>
                    }
                    else {

                        AccidentDate = res.data.EncounterDetails[0].AccidentDate;
                    }
                    let data = res.data.EncounterDetails[0]
                    let fileDetails = []
                    if (fileData) {
                        fileDetails = [
                            { key: 'File Name', value: fileData.FileName },
                            { key: 'File Date', value: moment(fileData.FileDate).format('MM/DD/YYYY') + moment(fileData.FileDate).format(' h:m A') },
                            { key: 'Receiver', value: fileData.Receiver }
                        ]
                    }

                    let claimDetails =
                        [
                            { key: 'Encounter HiPaaS Id', value: data.ClaimTMTrackingID },
                            { key: 'Encounter Date', value: data.ClaimDate },
                            { key: 'Subscriber first name', value: data.SubscriberFirstName },
                            { key: 'Subscriber last name', value: data.SubscriberLastName },
                            { key: 'Admission date', value: data.AdmissionDate },
                            { key: 'Encounter amount', value: data.Claim_Amount },
                            { key: 'Provider address', value: data.BillingProviderAddress },
                            { key: 'Encounter Status', value: data.ClaimStatus },
                            { key: 'ICD Code', value: Claim_Icdcode },
                            { key: 'Accident Date', value: AccidentDate },
                            { key: '', },
                            { key: '', },
                        ]
                    this.setState({
                        showDetails: true,
                        claimDetails: claimDetails,
                        claimLineDetails: res.data.EncounterLineDetails,
                        fileDetails: fileDetails,
                        fileid: data.FileID,
                        claimid: data.ClaimID,
                        Icdcodepresent: data.FieldToUpdate
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
                    <td>{d.ServiceDate}</td>
                    <td>{d.ProcedureDate}</td>
                    <td>{d.PaidServiceUnitCount}</td>
                    {/* <td>{d.ProviderPaidAmount}</td> */}
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
                                    <td className="table-head-text list-item-style">Service date</td>
                                    <td className="table-head-text list-item-style">Procedure code</td>
                                    <td className="table-head-text list-item-style">Unit</td>
                                    {/* <td className="table-head-text list-item-style">Provider paid amount</td> */}
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
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By EncounterFileDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img> */}
                    File Name<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By EncounterFileDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img> */}
                    Type<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by EncounterFileDetails.FileDate", this.state.dateRotation, 'dateRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.dateRotation}deg)`, marginRight: '4px' }}></img> */}
                    File Date<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-3 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By EncounterFileDetails.FileStatus", this.state.statusRotation, 'statusRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.statusRotation}deg)`, marginRight: '4px' }}></img> */}
                    File Status<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By EncounterFileDetails.Sender", this.state.submitterRotation, 'submitterRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.submitterRotation}deg)`, marginRight: '4px' }}></ */}
                    Sender<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right', marginRight: '4px' }}></img>
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
                                    this.getClaimStages(d.ClaimID, d.FileID)
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
            { value: 'File Name', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation'), key: this.state.transactionRotation, upScale: 1 },
            { value: 'File Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation'), key: this.state.dateRotation },
            { value: 'File Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation'), key: this.state.statusRotation },
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

    getClaimStages(claimId, fileId) {
        let url = Urls.real_time_claim_details
        let query = `{
            EncounterStagesOutbound(FileID:"${fileId}", ClaimID: "${claimId}") {
              Stage
              Createdatetime
            }
          }
          `

        process.env.NODE_ENV == 'development' && console.log(query)

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
                if (res && res.data && res.data.EncounterStagesOutbound) {
                    this.setState({
                        claimStageDetails: res.data.EncounterStagesOutbound
                    })

                    process.env.NODE_ENV == 'development' && console.log('claim stage', res.data.EncounterStagesOutbound)
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderClaimStageDetails() {
        let row = []
        const data = this.state.claimStageDetails ? this.state.claimStageDetails : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.Stage}</td>
                    <td>{Number(d.Createdatetime) ? moment(Number(d.Createdatetime)).format('MM/DD/YYYY, hh:mm a') : d.Createdatetime}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event1'} data-toggle="collapse"></a></div>
                    <div id={'event1'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style">Stage</td>
                                    <td className="table-head-text list-item-style">Date</td>
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
    
    _renderClaimStageDetails() {
        let columnDefs = [
            { headerName: "Stage", field: "Stage", flex: 1},
            { headerName: "Date", field: "Createdatetime", flex: 1 },
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Encounter Stages</h6>
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
                        rowData={this.state.claimStageDetails}
                        enableCellTextSelection={true}
                    >
                    </AgGridReact>
                </div>
            </div>
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
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
                
            />
        )
    }

    _renderClaims() {
        let columnDefs = [
            { headerName: "Encounter Id", field: "ClaimID", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Encounter Status", field: "ClaimStatus", flex: 1 },
            { headerName: "State Status", field: "adjudication_status", flex: 1 },
            { headerName: "Encounter Amount", field: "Claim_Amount", flex: 1 },
            { headerName: "Error", field: "ClaimLevelErrors", flex: 1 },
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Encounter Information For <label style={{ color: 'var(--main-bg-color)' }}>(File Name:-{this.state.Ag_grid_FileName} , File Date:-{this.state.Ag_grid_fileDate})</label></h6>
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
                            if (event.colDef.headerName == 'Encounter Id') {
                                this.setState({
                                    showerror: true,
                                    claimError_Status: event.data.ClaimStatus,
                                    claimId: event.data.ClaimID,
                                    Error_data: [],
                                    Aggrid_ClaimLineData: [],
                                    Aggrid_Claim_Info_data: [],
                                    Aggrid_ClaimStage: [],
                                })
                                this.getDetails(event.data.ClaimID, event.data.FileID)
                                this.getClaimStages(event.data.ClaimID, event.data.FileID)
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
            { headerName: "File Name", field: "FileName", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Type", field: "Type", flex: 1, cellStyle: { 'vertical-align': 'middle', wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "File Date", field: "FileDate", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "File Status", field: "FileStatus", flex: 1, cellStyle: { wordBreak: 'break-all', textAlign: 'center', 'white-space': 'normal' } },
            { headerName: "Sender", field: "Sender", flex: 1 },
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
                            } else if (event.colDef.headerName == "Error Description" && event.data.FileLevelError) {
                                this.setState({
                                    clickedError: event.data.FileLevelError
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
        if (this.state.claimLineDetails == undefined) { this.state.claimLineDetails = [] }
        let columnDefs = [
            { headerName: "Encounter Id", field: "ClaimID" },
            { headerName: "Service line No.", field: "ServiceLineCount" },
            { headerName: "Service date.", field: "ServiceDate" },
            { headerName: "Procedure code", field: "ProcedureDate" },
            { headerName: "Unit", field: "PaidServiceUnitCount", flex: 1 },
        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Encounter Line Data</h6>
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

    render() {

        return (
            <div>
                <h5 className="headerText">Encounter Details (Outbound)</h5>
                {this._renderTopbar()}
                {this.state.gridType
                    ?
                    <div>
                        {this._renderList()}
                        {this.state.showClaims ? this._renderClaims() : null}
                        {this.state.showerror && (this.state.claimError_Status == "Rejected" || this.state.status277CA == "Rejected") ? this._renderError() : null}
                        {this.state.showerror ?
                            <table className="table claim-Details border">
                                {this.renderHeader('Encounter #' + this.state.claimId)}
                                {this.renderRows(this.state.claimDetails)}
                                <br></br>
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
                                        <h6 style={{ marginTop: '20px', color: "#424242" }}>Encounter Data</h6>
                                        <hr />
                                    </div> : null
                            }
                            {
                                this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                    <table className="table claim-Details border">
                                        {this.renderHeader('File #' + this.state.fileid)}
                                        {this.renderRows(this.state.fileDetails)}
                                    </table>
                                    : null
                            }
                            {
                                this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                    <table className="table claim-Details border">
                                        {this.renderHeader('Encounter #' + this.state.claimId)}
                                        {this.renderRows(this.state.claimDetails)}
                                        <br></br>
                                        {this.state.Icdcodepresent == "ICDCode" || this.state.Icdcodepresent == "AccidentDt" ? this.renderButton() : ""}
                                    </table>
                                    : null
                            }
                            {this.state.showDetails && this.state.claimLineDetails && this.state.claimLineDetails.length > 0 ? this.renderClaimDetails() : null}
                            {this.state.showDetails && this.state.claimStageDetails && this.state.claimStageDetails.length > 0 ? this.renderClaimStageDetails() : null}
                        </div>
                    </div>
                }
            </div>
        );
    }
}