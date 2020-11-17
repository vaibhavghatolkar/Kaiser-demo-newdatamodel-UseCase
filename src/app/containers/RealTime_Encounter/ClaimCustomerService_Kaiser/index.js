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
import { getProviders } from '../../../../helpers/getDetails';
import { AutoComplete } from '../../../components/AutoComplete';
import { StateDropdown } from '../../../components/StateDropdown';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Strings from '../../../../helpers/Strings';
import { Filters } from '../../../components/Filters';


var val = ''
var controller = new AbortController()
const $ = window.$;
export class ClaimCustomerService_Kaiser extends React.Component {

    constructor(props) {
        super(props);
        let condition = props.location.state && props.location.state.data && props.location.state.data != undefined
        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineCount: 0,
            HL20: 0,
            HL22: 0,
            HL23: 0,
            showClaims: false,
            lineData: [],
            file: [],
            fileDetails: [],
            claimStageDetails: [],
            memberInfo: {},
            subscriberNo: '',
            molina_claimId: '',
            file_id: '',
            type: condition && props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: condition && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: condition && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: condition && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            gridflag: condition && props.location.state.data[0] && props.location.state.data[0].gridflag ? props.location.state.data[0].gridflag : '',
            fileStatus: condition && props.location.state.data[0] && props.location.state.data[0].fileStatus != '' && props.location.state.data[0].fileStatus != undefined ? props.location.state.data[0].fileStatus : '',
            generalStatus: condition && props.location.state.data[0] && props.location.state.data[0].generalStatus ? props.location.state.data[0].generalStatus : '',
            mcgStatus: condition && props.location.state.data[0] && props.location.state.data[0].mcgStatus ? props.location.state.data[0].mcgStatus : '',
            incoming_fileId: condition && props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            subtitle: condition && props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            status277CA: condition && props.location.state.data[0] && props.location.state.data[0].status277CA ? props.location.state.data[0].status277CA : '',
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
            inner_orderby: '',
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
            claimIdRotation: 180,
            claimStatusRotation: 180,
            subsciberRotation: 180,
            claimAmountRotation: 180,
            errorRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,

            seqID: '',
            fileDataDetails: '',
            page1: 1,

            gridType: 1,
            paginationPageSize: 5,
            domLayout: 'autoHeight',
            filterClaimId: "",
            MolinaClaimID: "",
            EncounterId: "",
            EncounterDate: "",
            SubscriberFirstName: "",
            SubscriberLastName: "",
            AdmissionDate: "",
            Claim_Amount: "",
            BillingProviderAddress: "",
            ClaimStatus: "",
            ICDCode: "",
            AccidentDate: "",


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
        // this.getData()
        // this.getListData()
        this.getTransactions()
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


        fetch(Urls._transaction837_kaiser, {
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
            Claim837RTDashboardFileDetails(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.Firstgridpage + ` , OrderBy:"${this.state.orderby}", RecType: "Kaiser", GridType:${this.state.gridType} ,LoadStatus:"${this.state.gridflag}", Status:"${this.state.generalStatus}", MCGStatus:"${this.state.mcgStatus}", FileID: "${this.state.incoming_fileId}", Status277CA:"${this.state.status277CA}") {
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
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.Claim837RTDashboardFileDetails) {

                    if (res.data.Claim837RTDashboardFileDetails.length > 0) {

                        count = Math.floor(res.data.Claim837RTDashboardFileDetails[0].RecCount / 10)
                        if (res.data.Claim837RTDashboardFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;
                    }

                    this.setState({
                        rowData: this.state.gridType == 1 ? res.data.Claim837RTDashboardFileDetails : [],
                        intakeClaims: res.data.Claim837RTDashboardFileDetails,
                        recount: count,


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
        process.env.NODE_ENV == 'development' && console.log(files)
        this.setState({
            claimsObj: files,
            page: 1
        })
    }

    getTransactions = (fileId) => {
        controller.abort()
        controller = new AbortController()
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        if (!fileId) {
            fileId = ""
        }

        let query = `{OutboundEncounterProcessingSummary(FileID:"${this.state.file_id}",F99Status:"",F277Status:"",,PaymentStatus:"",MolinaClaimID:"${this.state.filterClaimId}") {
            RefID
            FileID
            FileName_Outbound
            FileDate_Outbound
            FileStatus_Outbound
            ClaimID
            MolinaClaimID
            EncounterDate
            Encounter99_Status
            Encounter277CA_Status
            F999
            F277CA
            PaymentStatus
            BatchName
            BatchDate
            BatchClaimStatus
            BatchCreated
            FileName_Inbound
            FileCreated
            Subscriber_ID
            SubscriberLastName
            SubscriberFirstName 
            ClaimStatus
            ReceivedDate835
          }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.OutboundEncounterProcessingSummary

                if (this.state.gridType) {
                    this.setState({
                        claims_rowData: data,
                        // Ag_grid_FileName: res.data.OutboundEncounterProcessingSummary[0].FileName,
                        // Ag_grid_fileDate: res.data.OutboundEncounterProcessingSummary[0].FileCrDate,
                    })
                } else {
                    this.sortData(fileId, data)
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
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
        fetch(Urls._transaction837_kaiser, {
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


                fetch(Urls._transaction837_kaiser, {
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
                fetch(Urls._transaction837_kaiser, {
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

    handlePageClickLine = (data) => {
        let page = data.selected + 1
        this._getHLDetails(this.state.fileid)
        this.getDetails(this.state.claimid, this.state.fileid, this.state.seqID, this.state.fileDataDetails, page)

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

    getDatePicker = () => {
        return (
            <DatePicker
                className="form-control list-header-dashboard"
                selected={this.state.Accidentdate ? new Date(this.state.Accidentdate) : ''}
                onChange={this.handleAccidentdate}
            />
        )
    }

    getDetails(claimId, fileId, ClaimRefId, fileData, page) {
        let Claim_Icdcode = ""
        let AccidentDate = ""
        let url = Urls._transaction837_kaiser
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
                            { key: 'X12 Claim Id', value: data.ClaimID },
                            { key: 'Claim Date', value: data.ClaimDate },
                            { key: 'Subscriber First Name', value: data.SubscriberFirstName },
                            { key: 'Subscriber Last Name', value: data.SubscriberLastName },
                            { key: 'Admission Date', value: data.AdmissionDate },
                            { key: 'Claim Amount', value: data.Claim_Amount },
                            { key: 'Provider Address', value: data.BillingProviderAddress },
                            { key: 'Claim Status', value: data.ClaimStatus },
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
                        Aggrid_Claim_Info_data: res.data.Claim837RTDetails
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimStages(claimId, fileId, seqId) {
        let url = Urls._transaction837_kaiser
        let query = `{
            EncounterStagesDet(SeqID:${seqId}) {
                EncounterStage
                CreateDateTime
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
                if (res && res.data && res.data.EncounterStagesDet) {
                    this.setState({
                        claimStageDetails: res.data.EncounterStagesDet,
                        Aggrid_ClaimStage: res.data.EncounterStagesDet,
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
                    {item.isDate ? this.getDatePicker() : <div>{(moment.utc(item.value).format('MM/DD/YYYY, hh:mm a') != "Invalid date" && item.key == 'Claim Date') ? moment.utc(item.value).format('MM/DD/YYYY, hh:mm a') : item.value}</div>}
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

    handleAccidentdate = (date) => {
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
                    <td>{d.MolinaClaimID}</td>
                    <td>{d.ServiceLineCount}</td>
                    <td>{d.ServiceDate}</td>
                    <td>{d.ProcedureDate}</td>
                    <td>{d.PaidServiceUnitCount}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding">
                        <a href={'#' + 'event'} data-toggle="collapse">Claim Line Data</a>
                        <div className="right-aligned">Line count : {this.state.lineCount}</div>
                    </div>
                    <div id={'event'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style">
                                        <a>X12 Claim Id</a>
                                    </td>
                                    <td className="table-head-text list-item-style">
                                        <a>Claim Id</a>
                                    </td>
                                    <td className="table-head-text list-item-style">Service Line No.</td>
                                    <td className="table-head-text list-item-style">Service Date</td>
                                    <td className="table-head-text list-item-style">Procedure Code</td>
                                    <td className="table-head-text list-item-style">Unit</td>
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
                            pageRangeDisplayed={5}
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

    renderClaimStageDetails() {
        let row = []
        const data = this.state.claimStageDetails ? this.state.claimStageDetails : []

        data.forEach((d) => {
            let date = d.Createdatetime ? moment.utc((d.Createdatetime)).format("MM/DD/YYYY hh:mm a") : ''
            row.push(
                <tr>
                    <td className="list-item-style">{d.Stage}</td>
                    <td className="list-item-style">{date}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event1'} data-toggle="collapse">Claim Stages</a></div>
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
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.MolinaClaimID", this.state.claimIdRotation, 'claimIdRotation', fileId) }}>Molina Claim Id</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.ClaimStatus", this.state.claimStatusRotation, 'claimStatusRotation', fileId) }}>Claim Status</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.Subscriber_ID", this.state.subsciberRotation, 'subsciberRotation', fileId) }}>Subscriber Id</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.Claim_Amount", this.state.claimAmountRotation, 'claimAmountRotation', fileId) }}>Claim Amount</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.ClaimLevelErrors", this.state.errorRotation, 'errorRotation', fileId) }}>Error</a></td>
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
            this.getTransactions()
        }, 50);
    }

    handleInnerSort = (e, rotation, key, fileId) => {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            inner_orderby: e,
            [key]: rotation == 0 ? 180 : 0
        })
        setTimeout(() => {
            this.getTransactions(fileId)
        }, 50);
    }

    renderTableHeader() {
        return (
            <div className="row">
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>File Name</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By State", this.state.stateRotation, 'stateRotation')}>State</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By ProcessID", this.state.processIdRotation, 'processIdRotation')}>Process Id</a>
                </div>
                {/* <div className="col-1 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Type", this.state.typeRotation, 'typeRotation')} src={require('../../../components/Images/up_arrow.png')}>Type</a>
                </div> */}
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by FileDate", this.state.dateRotation, 'dateRotation')} src={require('../../../components/Images/up_arrow.png')}>File Date</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By FileStatus", this.state.statusRotation, 'statusRotation')} src={require('../../../components/Images/up_arrow.png')}>File Status</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By FileLevelError", this.state.submitterRotation, 'submitterRotation')} src={require('../../../components/Images/up_arrow.png')}>Error Description</a>
                </div>
            </div>
        )
    }

    _getHLDetails = async (fileId) => {
        let query = `{
            Claim837RTHLCount(FileID: "${fileId}") {
              FileID
              HL22
              HL20
              HL23
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data && res.data.Claim837RTHLCount && res.data.Claim837RTHLCount.length > 0) {
                    let fileData = this.state.fileDataDetails
                    let fileDetails = [
                        { key: 'File Name', value: fileData.FileName },
                        { key: 'File Date', value: moment.utc(fileData.FileDate).format('MM/DD/YYYY') + moment.utc(fileData.FileDate).format(' h:m A') },
                        { key: 'Receiver', value: fileData.Receiver },
                        { key: 'HL20 Count', value: this.state.HL20 },
                        { key: 'HL22 Count', value: this.state.HL22 },
                        { key: 'HL23 Count', value: this.state.HL23 },
                        { key: '', value: '' },
                        { key: '', value: '' },
                    ]
                    this.setState({
                        HL20: res.data.Claim837RTHLCount[0].HL20,
                        HL22: res.data.Claim837RTHLCount[0].HL22,
                        HL23: res.data.Claim837RTHLCount[0].HL23,
                        fileDetails: fileDetails
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        let count = 0

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
                    <div className="col-2 col-small-style border-left small-font left-align"><a href={'#' + keys}
                        onClick={() => {
                            this.getTransactions(data[keys].value.FileID)
                        }} style={{ color: "var(--light-blue)" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.State}</div>
                    <div className="col-2 col-small-style small-font" style={{ wordBreak: 'break-all' }}>{data[keys].value.ProcessID}</div>
                    {/* <div className="col-1 col-small-style small-font">{data[keys].value.Type}</div> */}
                    <div className="col-2 col-small-style small-font">{moment.utc(data[keys].value.FileDateTime).format('MM/DD/YYYY')}<br />{moment.utc(data[keys].value.FileDate).format('hh:mm a')}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileStatus}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileLevelError}</div>
                </div>
            )

            {
                col = []
                data[keys].array.forEach((d) => {

                    col.push(
                        <tr>
                            <td className="list-item-style"><a className="clickable" onClick={() => {
                                this.setState({
                                    claimId: d.ClaimID,
                                    showDetails: false,
                                    molina_claimId: d.MolinaClaimID
                                }, () => {
                                    this._getHLDetails(d.FileID)
                                    this.getDetails(d.ClaimID, d.FileID, d.ClaimRefId, data[keys].value, 1)
                                    this.getClaimStages(d.ClaimID, d.FileID, d.ClaimRefId)
                                })
                            }} style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>{d.MolinaClaimID}</a></td>
                            <td className="list-item-style">{d.ClaimStatus}</td>
                            <td className="list-item-style">{d.Subscriber_ID}</td>
                            <td className="style-left"> ${d.Claim_Amount}</td>
                            <td className="list-item-style" style={{ wordBreak: 'break-all' }}>{d.ClaimLevelErrors}</td>
                        </tr>
                    )
                })
            }

            row.push(
                <div id={keys} className="collapse">
                    <table id="" className="table table-bordered claim-details" style={{ tableLayout: 'fixed' }}>
                        {this.renderClaimsHeader(data[keys].value.FileID)}
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
                <table className="table claim-details">
                    {row}
                </table>
                <div style={{ marginLeft: '-14px' }}>
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={0}
                        pageCount={this.state.recount}
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

    _renderList = () => {


        // let setwidth=this.state.generalStatus =="File Rejected" || this.state.claimStatus =="Rejected"? defaultColDef_AgFirstgrid  : this.state.defaultColDef
        let columnDefs = this.state.generalStatus == "File Rejected" || this.state.claimStatus == "Rejected" ? [
            { headerName: "File Name", field: "FileName", width: 250, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "State", field: "State", width: 60, cellStyle: { 'vertical-align': 'middle', wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Type", field: "Type", width: 50, cellStyle: { wordBreak: 'break-all', textAlign: 'center', 'white-space': 'normal' } },
            { headerName: "File Date", field: "FileDateTime", width: 100 },
            { headerName: "File Status", field: "FileStatus", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Submitter", field: "Sender", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Total Claims", field: "Claimcount", width: 80, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Rejected Claims", field: "Rejected", width:80 , cellStyle: { wordBreak: 'break-all',   'white-space': 'normal' }},
            { headerName: "Error Description", field: "FileLevelError", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "Load Status", field: "Status", width:90,cellStyle: { wordBreak: 'break-all',   'white-space': 'normal' }},
            // { headerName: "MCG Status", field: "MCGStatus" , width:90,cellStyle: { wordBreak: 'break-all',   'white-space': 'normal' }},
        ] : [

                { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State", width: 60, cellStyle: { wordBreak: 'break-all', textAlign: 'center', 'white-space': 'normal' } },
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

    _renderClaims() {
        let columnDefs = [
            // { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "State", field: "State", width: 80 },
            { headerName: "Molina Claim Id", field: "MolinaClaimID", width: 150, cellStyle: {   'white-space': 'normal',color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Claim Date", field: "EncounterDate", width:100, },
            { headerName: "Subscriber Id", field: "Subscriber_ID", width:130, cellStyle: {   'white-space': 'normal' } },
            { headerName: "Inbound File Name", field: "FileName_Inbound", width:150, },
            { headerName: "Claims Status", field: "ClaimStatus", width:100, cellStyle: {   'white-space': 'normal' } },
            { headerName: "Subscriber FirstName", field: "SubscriberFirstName", width:100, },
            { headerName: "Subscriber LastName", field: "SubscriberLastName", width:100,  },
            
            // { headerName: "Batch Name", field: "BatchName", width:140, cellStyle: {   'white-space': 'normal' } },
            // { headerName: "Batch Date", field: "BatchDate", width:100, cellStyle: {   'white-space': 'normal' } },
            // { headerName: "Batch Claim Status", field: "BatchClaimStatus", width:100, cellStyle: {   'white-space': 'normal' } },
            { headerName: "FileName Sent To State", field: "FileName_Outbound", width:200, cellStyle: {   'white-space': 'normal' } },
            { headerName: "FileDate Sent To State", field: "FileDate_Outbound", width:100, cellStyle: {   'white-space': 'normal' } },
            { headerName: "File Status Sent To State", field: "FileStatus_Outbound", width:100, cellStyle: {   'white-space': 'normal' } },
            // { headerName: "Payment Status", field: "PaymentStatus", width:100, cellStyle: {   'white-space': 'normal' } },
            { headerName: "999 Status", field: "Encounter99_Status", width:100, cellStyle: {   'white-space': 'normal' } },
            { headerName: "277CA Status", field: "Encounter277CA_Status", width:100, cellStyle: {   'white-space': 'normal' } },
            { headerName: "Payment Status", field: "PaymentStatus", width:150, cellStyle: {   'white-space': 'normal' } },
            // { headerName: "999", field: "F999", width:150, cellStyle: {   'white-space': 'normal' } },
            // { headerName: "277CA", field: "F277CA", width:150, cellStyle: {   'white-space': 'normal' } },
            
            
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
                            if (event.colDef.headerName == 'Molina Claim Id') {
                                this.setState({

                                    showerror: true,
                                    claimError_Status: event.data.ClaimStatus,
                                    Error_data: [],
                                    Aggrid_ClaimLineData: [],
                                    Aggrid_Claim_Info_data: [],
                                    Aggrid_ClaimStage: [],

                                })
                                // this.get_Error(event.data.ClaimID, event.data.ClaimRefId, event.data.FileID)
                                this.getDetails(event.data.ClaimID, event.data.FileID, event.data.RefID, "", 1)
                                this.getClaimStages(event.data.ClaimID, event.data.FileID, event.data.RefID)
                            }
                        }}
                    >
                    </AgGridReact>
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
            { headerName: "Molina Claim ID", field: "MolinaClaimID" , cellStyle: {wordBreak: 'break-all',   'white-space': 'normal',color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Claim Id", field: "ClaimID" },

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
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == "Molina Claim ID") {
                                this.setState({
                                  Encounter_Linedata:true,                                  
                                  LineData_MolinaClaimID:event.data.MolinaClaimID,
                                  Line_DataClaimID:event.data.ClaimID,
                                  ServiceLineCount:event.data.ServiceLineCount,
                                  ServiceDate:event.data.ServiceDate,
                                  ProcedureDate:event.dataProcedureDate,
                                  PaidServiceUnitCount:event.data.PaidServiceUnitCount,
                                }, () => {
                                    $('#Encounter_LineDataDialogbox').modal('show')
                                })

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
            // { headerName: " File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Receiver", field: "Receiver", width: 100 },
            // { headerName: " HL20 Count", field: "HL20Count", width: 80 },
            // { headerName: "HL22 Count", field: "HL22Count", width: 80 },
            // { headerName: "HL23 Count", field: "HL23Count", width: 80 },
            { headerName: "Molina Claim Id", field: "MolinaClaimID", width: 150,  cellStyle: { wordBreak: 'break-all', 'white-space': 'normal',color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Claim Id", field: "ClaimID", width: 100 },
            { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
            { headerName: "Subscriber First Name", field: "SubscriberFirstName", width: 100 },
            { headerName: "Subscriber Last Name", field: "SubscriberLastName", width: 100 },
            { headerName: "Admission Date", field: "AdmissionDate", width: 100 },
            { headerName: "Claim Amount", field: "Claim_Amount", width: 100 },
            { headerName: "Provider Address", field: "BillingProviderAddress", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Status", field: "ClaimStatus", width: 100 },
            { headerName: "ICD Code", field: "ICDCode", width: 100 },
            { headerName: "Error Description", field: "ClaimLevelErrors",  width: 200 ,cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Accident Date", field: "AccidentDate",  width: 150  },
            
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
                            if (event.colDef.headerName == "Molina Claim Id" ) {
                                this.setState({
                                    MolinaClaimID: event.data.MolinaClaimID,
                                    EncounterId: event.data.ClaimID,
                                    EncounterDate: event.data.ClaimDateTime,
                                    SubscriberFirstName: event.data.SubscriberFirstName,
                                    SubscriberLastName: event.data.SubscriberLastName,
                                    AdmissionDate: event.data.AdmissionDate,
                                    Claim_Amount: event.data.Claim_Amount,
                                    BillingProviderAddress: event.data.BillingProviderAddress,
                                    ClaimStatus: event.data.ClaimStatus,
                                    ICDCode: event.data.ICDCode,
                                    AccidentDate: event.data.AccidentDate,
                                }, () => {
                                    $('#MemberInfoDialogbox1').modal('show')
                                })

                            }
                            else if (event.colDef.headerName == "Error Description" && event.data.ClaimLevelErrors) {
                                this.setState({
                                 clickedError: event.data.ClaimLevelErrors
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

    _ClaimStage() {
       
        let columnDefs = [
            { headerName: "Stage", field: "EncounterStage", flex:1},
            { headerName: "Date", field: "CreateDateTime", flex:1 },
        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Claim Stages</h6>
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
                        paginationPageSize={6}
                        onGridReady={this.onGridReady}
                        rowData={this.state.Aggrid_ClaimStage}
                        removeGrid={true}



                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    
    renderMemberinfo() {

        let Error_Field =this.state.Error_Field
        return (
           
            <div>
                 <h2 style={{fontSize:"18px"}}>Claim Details</h2>
                <div class="form-row">
               
                    <br></br>
                    <div class="form-group col-md-3">
                        <label>Molina Claim Id</label>
                        <input  value={this.state.MolinaClaimID == null ? '' : this.state.MolinaClaimID} onChange={(e) => this.onChangeName(e, 'MolinaClaimID')}   class="form-control"  placeholder=""></input>
                    </div> 
                    <div class="form-group col-md-3">
                        <label>Claim Id</label>
                        <input  value={this.state.EncounterId == null ? '' : this.state.EncounterId} onChange={(e) => this.onChangeName(e, 'EncounterId')}   class="form-control"  placeholder=""></input>
                    </div> 
                    <div class="form-group col-md-3">
                        <label>Claim Date</label>
                        <input  value={this.state.EncounterDate == null ? '' : this.state.EncounterDate} onChange={(e) => this.onChangeName(e, 'EncounterDate')}class="form-control"   placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Subscriber First Name</label>
                        <input value={this.state.SubscriberFirstName == null ? '' : this.state.SubscriberFirstName} onChange={(e) => this.onChangeName(e, 'SubscriberFirstName')} class="form-control"  placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Subscriber Last Name</label>
                        <input value={this.state.SubscriberLastName == null ? '' : this.state.SubscriberLastName} onChange={(e) => this.onChangeName(e, 'SubscriberLastName')} class="form-control"  placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Admission Date</label>
                        <input value={this.state.AdmissionDate == null ? '' : this.state.AdmissionDate} onChange={(e) => this.onChangeName(e, 'AdmissionDate')}  class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Claim Amount</label>
                        <input value={this.state.Claim_Amount == null ? '' : this.state.Claim_Amount} onChange={(e) => this.onChangeName(e, 'Claim_Amount')} class="form-control"  placeholder=""></input>
                    </div>
                   
                    <div class="form-group col-md-3">
                        <label>Claim Status</label>    
                           
                        <input value={this.state.ClaimStatus == null ? '' : this.state.ClaimStatus} onChange={(e) => this.onChangeName(e, 'ClaimStatus')} class="form-control" placeholder=""></input>                
                      
                    </div>
                    <div class="form-group col-md-3">
                        <label>ICD Code</label>
                        <select  className="form-control" onChange={(e) => this.ChangeVal(e, 'ICDCode')}>
                                            <option value="0"></option>
                                            {this.getIcdcodeoptions()}
                                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Accident Date</label>
                        <input value={this.state.AccidentDate == null ? '' : this.state.AccidentDate} onChange={(e) => this.onChangeName(e, 'AccidentDate')} class="form-control"  placeholder="" />
                    </div>
                    <div class="form-group col-md-3">
                        <label> Provider Address</label>
                        <textarea value={this.state.BillingProviderAddress == null ? '' : this.state.BillingProviderAddress} onChange={(e) => this.onChangeName(e, 'BillingProviderAddress')} class="form-control"  placeholder=""></textarea>
                    </div>
                    {/* <div class="form-group col-md-3">
                        <label>Dob</label>
                       <DatePicker  readOnly={this.state.Error_Field=="dob" ? "" : "readOnly"} className="form-control" value={this.state.dob == null ? '' : this.state.dob}
                            selected={this.state.dob ? new Date(moment(this.state.dob).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handle_dob}></DatePicker>
                       
                       
                    </div> */}
                  
                   
                </div>

                <button onClick={this.Saved} type="submit" style={{margin:"0px"}} class="btn btn-display">Save</button>
            </div>
        );
    }
    renderEncounterLineData() {

        return (
           
            <div>
                 <h2 style={{fontSize:"18px"}}>Claim Line Data</h2>
                <div class="form-row">
               
                    <br></br>
                    <div class="form-group col-md-3">
                        <label>Molina Claim Id</label>
                        <input  value={this.state.LineData_MolinaClaimID == null ? '' : this.state.LineData_MolinaClaimID} onChange={(e) => this.onChangeName(e, 'MolinaClaimID')}   class="form-control"  placeholder=""></input>
                    </div> 
                    <div class="form-group col-md-3">
                        <label>Claim Id</label>
                        <input  value={this.state.Line_DataClaimID == null ? '' : this.state.Line_DataClaimID} onChange={(e) => this.onChangeName(e, 'EncounterId')}   class="form-control"  placeholder=""></input>
                    </div> 
                    <div class="form-group col-md-3">
                        <label>Service Line No</label>
                        <input  value={this.state.ServiceLineCount == null ? '' : this.state.ServiceLineCount} onChange={(e) => this.onChangeName(e, 'ServiceLineCount')}class="form-control"   placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Service Date</label>
                        <input value={this.state.ServiceDate == null ? '' : this.state.ServiceDate} onChange={(e) => this.onChangeName(e, 'ServiceDate')} class="form-control"  placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Procedure Code</label>
                        <input value={this.state.ProcedureDate == null ? '' : this.state.ProcedureDate} onChange={(e) => this.onChangeName(e, 'ProcedureDate')} class="form-control"  placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Unit</label>
                        <input value={this.state.PaidServiceUnitCount == null ? '' : this.state.PaidServiceUnitCount} onChange={(e) => this.onChangeName(e, 'PaidServiceUnitCount')}  class="form-control" placeholder=""></input>
                    </div>
               
                  
                   
                </div>

                <button type="submit" style={{margin:"0px"}} class="btn btn-display">Save</button>
            </div>
        );
    }
    MemberInfoDialogbox1 = () => {
      
        return (
            <div class="modal" id="MemberInfoDialogbox1" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-Memberinfo">
                    <div className="error-dialog">
                        <div
                            onClick={() => {
                                // this.memberDetails(this.state.RefID, this.state.subscriberNo)
                                this.setState({
                                    showDetailsEnrollment: true,
                                    textbox: false

                                })
                                $('#MemberInfoDialogbox1').modal('hide')

                            }}>
                            <span class="close clickable">&times;</span>
                        </div>
                       
                        <div>
                            {this.state.Aggrid_Claim_Info_data ? this.renderMemberinfo() : null}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    Encounter_LineDataDialogbox= () => {
      
        return (
            <div class="modal" id="Encounter_LineDataDialogbox" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-Memberinfo">
                    <div className="error-dialog">
                        <div
                            onClick={() => {
                                // this.memberDetails(this.state.RefID, this.state.subscriberNo)
                                this.setState({
                                   

                                })
                                $('#Encounter_LineDataDialogbox').modal('hide')

                            }}>
                            <span class="close clickable">&times;</span>
                        </div>
                       
                        <div>
                            {this.state.Encounter_Linedata ? this.renderEncounterLineData():""}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
    _refreshScreen = () => {
        this.getTransactions()
    }

    onGridChange = (event) => {
  
        this.setState({
            page: 1,
            rowData: [],
            claimsAudit: [],
            showerror: false,
            showClaims: false,
            showDetails: false,
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            if (this.state.gridType == 1) {
                this.getTransactions()
            } else {
                this.getTransactions()
            }
        })
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
                showClaimId={true}
                setData={this.setData}
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
                <h5 className="headerText">Claim Customer Service {this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}  </h5>
                {this._renderTopbar()}
                {
                    this.state.gridType
                        ?
                        <div>
                            {/* {this._renderList()} */}
                            {this._renderClaims()}
                            {this.MemberInfoDialogbox1()}
                            {this.Encounter_LineDataDialogbox()}
                            
                            {/* {this.state.showerror && (this.state.claimError_Status == "Rejected" || this.state.status277CA == "Rejected") ? this._renderError() : null} */}
                            
                            {this.state.showerror ? this._ClaimStage() : null}
                            {this.state.showerror ? this._ClaimView_Info_Table() : null}
                           
                            {this.state.showerror ? this._ClaimLineTable() : null}

                        </div>
                        :
                        <div className="row padding-left">
                            <div className="col-6 claim-list file-table">
                                {this.state.claimsObj ? this.renderList() : null}
                            </div>

                            <div className="col-6">
                                {
                                    this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                        <div>
                                            <h6 style={{ marginTop: '20px', color: "#424242" }}>Claim Data</h6>
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
                                            {this.renderHeader('Claim #' + this.state.molina_claimId)}
                                            {this.renderRows(this.state.claimDetails)}
                                            <br></br>
                                            {this.state.Icdcodepresent == "Icdcode" || this.state.Icdcodepresent == "AccidentDt" ? this.renderButton() : ""}
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