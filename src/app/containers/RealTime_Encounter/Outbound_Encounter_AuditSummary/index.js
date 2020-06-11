import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import { getDetails } from '../../../../helpers/getDetails';
import DatePicker from "react-datepicker";
import { StateDropdown } from '../../../components/StateDropdown';
import { Filters } from '../../../components/Filters';
import { AgGridReact } from 'ag-grid-react';
import { Tiles } from '../../../components/Tiles';

export class Outbound_Encounter_Audit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartne837: [],
            summaryList: [],
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            type: '',
            State: '',
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            selectedTradingPartner: '',
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0,
            TotalClaims: '',
            Accepted: '',
            Rejected: '',
            InProgress: '',
            Total999: '',
            Total277CA: '',
            TotalSentToQNXT: '',
            Paid: '',
            denied: '',
            WIP: '',
            Pending: '',
            TotalBatch: '',
            ReadytoSend: '',
            Valid: '',
            Error: '',
            ClaimSent: '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            NotSent999: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].notSent ? props.location.state.data[0].notSent : '',
            columnDefs: [
                { headerName: "File Name", field: "filename", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "File Status", field: "FileStatus", flex: 1 },
                { headerName: "Batch Name", field: "BatchName", flex: 1 },
                { headerName: "Batch Status", field: "BatchStatus", flex: 1 },
                { headerName: "In HiPaaS", field: "Submitted", flex: 1 },
                { headerName: "Valid", field: "Valid", flex: 1 },
                { headerName: "Error", field: "Error", flex: 1 },
                { headerName: "Sent to State", field: "ClaimSent", flex: 1 },
                { headerName: "999", field: "F999", flex: 1 },
                { headerName: "277 CA", field: "F277", flex: 1 },
                { headerName: "Accepted", field: "Accepted", flex: 1 },
                { headerName: "Rejected", field: "Rejected", flex: 1 },
            ],
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
          
        }

        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.getCounts()
    }

    getCounts() {
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }

        let query = `{
            EncounterDashboardCount (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", Type : "` + this.state.type + `", RecType: "Outbound") {
                TotalFiles
                TotalClaims
                Accepted
                Rejected
                Accepted_Per
                Rejected_Per
                Total999
                Total277CA
                TotalSentToQNXT
                InProgress
                Resubmit
                TotalBatch
                ReadytoSend
                Valid
                Error
                ClaimSent
            }
        }`
        process.env.NODE_ENV == 'development' && console.log(query)
        // fetch(Urls.real_time_claim, {
        fetch('http://10.0.1.248:30506/real_time_claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let array = []
                let summary = []
                let data = res.data
                let Accepted_per1 = 0
                let rejected_per1 = 0
                let accepted = 0
                let rejected = 0
                let inProgress = 0
                let ClaimBarChart = res.data.EncounterClaimBarchart
                let claimLabels = []

                if (data.EncounterDashboardCount && data.EncounterDashboardCount.length > 0) {
                    summary = [
                        { name: 'Total Batch | Total Files', value: (data.EncounterDashboardCount[0].TotalBatch ? data.EncounterDashboardCount[0].TotalBatch : "") + (data.EncounterDashboardCount[0].TotalFiles ? " | " + data.EncounterDashboardCount[0].TotalFiles : ''), isText: 1 },
                        { name: 'Ready to Send', value: data.EncounterDashboardCount[0].ReadytoSend ? data.EncounterDashboardCount[0].ReadytoSend : '' },
                        { name: 'Error Encounter', value: data.EncounterDashboardCount[0].Error ? data.EncounterDashboardCount[0].Error : '' },
                        { name: 'Encounter Sent', value: data.EncounterDashboardCount[0].ClaimSent ? data.EncounterDashboardCount[0].ClaimSent : '' },
                        { name: 'Accepted Encounter', value: data.EncounterDashboardCount[0].Accepted ? data.EncounterDashboardCount[0].Accepted : '' },
                        { name: 'Rejected Encounter', value: data.EncounterDashboardCount[0].Rejected ? data.EncounterDashboardCount[0].Rejected : '' },
                        { name: 'Resubmit Queue', value: data.EncounterDashboardCount[0].Resubmit ? Math.round(data.EncounterDashboardCount[0].Resubmit * 100) / 100 : '' },
                    ]
                    Accepted_per1 = data.EncounterDashboardCount[0].Accepted_Per
                    rejected_per1 = data.EncounterDashboardCount[0].Rejected_Per
                    accepted = data.EncounterDashboardCount[0].Accepted
                    rejected = data.EncounterDashboardCount[0].Rejected
                    inProgress = data.EncounterDashboardCount[0].InProgress
                }
                this.setState({
                    summaryList: summary,
                    Accepted_per: Accepted_per1,
                    rejected_per: rejected_per1,
                    claimLabels: claimLabels,
                    accepted: accepted,
                    rejected: rejected,
                    inProgress: inProgress
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    getData() {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            EncounterClaimsDailyAudit(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Outbound"){
                 FileID
                filename
                Submitted
                Accepted
                Rejected
                SentToQNXT
                Paid
                denied
                WIP
                Pending
                F277
                F999
                FileStatus
                BatchName
                BatchStatus
                Error
                ClaimSent
                Valid
                ReadytoSend
            }
            ClaimsDailyAuditCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:""){
                SubTotal
                VeriTotal
                InBizstockTotal
                PenTotal
                RejTotal
                errTotal
            }
            EncounterFileInCnt(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:"",RecType:"Outbound"){
                totalFile
                TotalClaims
                Accepted
                Rejected
                InProgress
                Total999
                Total277CA
                TotalSentToQNXT
                Paid
                denied
                WIP
                Pending
                TotalBatch
                ReadytoSend
                Valid
                Error
                ClaimSent
            }
        }`
        process.env.NODE_ENV == 'development' && console.log("sa,f.hdsfkfdhg", query)
        // fetch(Urls.claims_837, {
        fetch('http://10.0.1.248:30506/claims_837', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                process.env.NODE_ENV == 'development' && console.log(res)
                if (res.data) {
                    let totalFile = 0
                    try {
                        totalFile = res.data.EncounterFileInCnt[0].totalFile
                    } catch (error) {

                    }
                    process.env.NODE_ENV == 'development' && console.log("sdghusighsjgn", res.data.EncounterFileInCnt[0])
                    this.setState({
                        claimsAudit: res.data.EncounterClaimsDailyAudit,
                        SubTotal: res.data.ClaimsDailyAuditCount[0].SubTotal,
                        VeriTotal: res.data.ClaimsDailyAuditCount[0].VeriTotal,
                        InBizstockTotal: res.data.ClaimsDailyAuditCount[0].InBizstockTotal,
                        PenTotal: res.data.ClaimsDailyAuditCount[0].PenTotal,
                        RejTotal: res.data.ClaimsDailyAuditCount[0].RejTotal,
                        errTotal: res.data.ClaimsDailyAuditCount[0].errTotal,
                        totalFile: totalFile,
                        TotalClaims: res.data.EncounterFileInCnt[0].TotalClaims,
                        Accepted: res.data.EncounterFileInCnt[0].Accepted,
                        Rejected: res.data.EncounterFileInCnt[0].Rejected,
                        InProgress: res.data.EncounterFileInCnt[0].InProgress,
                        Total999: res.data.EncounterFileInCnt[0].Total999,
                        Total277CA: res.data.EncounterFileInCnt[0].Total277CA,
                        TotalSentToQNXT: res.data.EncounterFileInCnt[0].TotalSentToQNXT,
                        Paid: res.data.EncounterFileInCnt[0].Paid,
                        denied: res.data.EncounterFileInCnt[0].denied,
                        WIP: res.data.EncounterFileInCnt[0].WIP,
                        Pending: res.data.EncounterFileInCnt[0].Pending,

                        TotalBatch: res.data.EncounterFileInCnt[0].TotalBatch,
                        ReadytoSend: res.data.EncounterFileInCnt[0].ReadytoSend,
                        Valid: res.data.EncounterFileInCnt[0].Valid,
                        Error: res.data.EncounterFileInCnt[0].Error,
                        ClaimSent: res.data.EncounterFileInCnt[0].ClaimSent,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    goto277 = (fileId) => {
        sessionStorage.setItem('isOutbound', false)
        this.props.history.push('/' + Strings._277CAResponse, {
            flag: 1,
            fileId: fileId
        })
    }

    goto999 = (fileId) => {
        sessionStorage.setItem('isOutbound', false)
        this.props.history.push('/' + Strings.response_999, {
            flag: 1,
            fileId: fileId
        })
    }


    renderTransactions() {
        let row = []
        const data = this.state.claimsAudit;
        process.env.NODE_ENV == 'development' && console.log("sd,fmsdjkdsjh", data)

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.filename}</td>
                    <td className="list-item-style">{d.FileStatus}</td>
                    <td className="list-item-style">{d.BatchName}</td>
                    <td className="list-item-style">{d.BatchStatus}</td>
                    {/* <td className="list-item-style">{d.Submitted}</td> */}
                    <td className="list-item-style">{d.Submitted}</td>
                    <td className="list-item-style">{d.Valid}</td>
                    <td className="list-item-style">{d.Error}</td>
                    <td className="list-item-style">{d.ClaimSent}</td>
                    <td className="list-item-style"><a style={{ color: "#6AA2B8", cursor: "pointer" }}
                        onClick={() => {
                            this.goto999()
                        }}>{d.F999}</a></td>
                    <td className="list-item-style"><a style={{ color: "#6AA2B8", cursor: "pointer" }}
                        onClick={() => {
                            this.goto277()
                        }}>{d.F277}</a></td>
                    <td className="list-item-style">{d.Accepted}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                </tr>
            )
        });
        return (
            <table className="table table-bordered claim-list">
                <tr className="table-head">
                    <td className="table-head-text list-item-style">File Name <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">File Status<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Batch Name<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Batch Status<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">In HiPaaS <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Valid <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Error<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Sent to State <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">999<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">277 CA<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Accepted <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Rejected <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    {/* <td className="table-head-text list-item-style">From Qnxt <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td> */}
                    {/* <td className="table-head-text list-item-style">Accepted in Preprocess</td> */}
                </tr>
                <tbody >
                    <tr>
                        {/* <td>Totals</td>
                        <td className="list-item-style">{this.state.SubTotal}</td>
                        <td colSpan={2} className="list-item-style">{this.state.InBizstockTotal}</td>
                        <td className="list-item-style">{this.state.RejTotal}</td>
                        <td className="list-item-style">0</td>
                        <td colSpan={2} className="list-item-style">{this.state.VeriTotal}</td>
                        <td></td>
                        <td></td> */}
                        {/* <td className="list-item-style">{this.state.PenTotal}</td>
                        <td className="list-item-style">{this.state.errTotal}</td> */}
                    </tr>
                    {row}
                </tbody>
            </table>
        )
    }


    renderStats() {
        return (
            <div className="row padding-left" >

                <div className="col summary-container">
                    <div className="summary-header">Total Files</div>
                    <div className="green summary-title">{this.state.totalFile}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">Ready to Send</div>
                    <div className="blue summary-title">{this.state.ReadytoSend}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">Valid</div>
                    <div className="green summary-title">{this.state.Valid}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">Errors</div>
                    <div className="red summary-title">{this.state.Error}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">Sent to State</div>
                    <div className="green  summary-title">{this.state.ClaimSent}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">Accepted</div>
                    <div className="green summary-title">{this.state.Accepted}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">Rejected</div>
                    <div className="orange summary-title">{this.state.Rejected}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">999</div>
                    <div className="green summary-title">{this.state.Total999}</div>
                </div>


                <div className="col summary-container">
                    <div className="summary-header">277 CA</div>
                    <div className="orange summary-title">{this.state.Total277CA}</div>
                </div>


            </div>

        )
    }

    _refreshScreen = () => {
        this.getData()
        this.getCounts()
    }

    update = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTransactions() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={this.state.columnDefs}
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
                        rowData={this.state.claimsAudit}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == '999') {
                                this.goto999(event.data.FileID)
                            }
                            if (event.colDef.headerName == '277CA') {
                                this.goto277(event.data.FileID)
                            }
                            if (event.colDef.headerName == 'File Name') {
                                this.props.history.push('/' + Strings.Outbound_Encounter_ClaimProcessingSummary, {
                                    file_id: event.data.FileID
                                })
                            }

                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    renderSummaryDetails() {
        let row = []
        let array = this.state.summaryList
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270 + '/' + apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let data = []
            let url = ''
            if (item.name == 'Accepted Encounter') {
                addon = '/accept'
                claimStatus = 'Accepted'
            } else if (item.name == 'Rejected Encounter' || item.name == 'Rejected Files') {
                addon = '/reject'
                claimStatus = 'Rejected'
            } else if (item.name == 'Resubmit Queue') {
                claimStatus = 'Resubmit'
            } else {
                addon = '/other'
            }
            data = [
                { flag: addon, State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: claimStatus, type: type },
            ]
            row.push(
                <Tiles
                    isClickable={
                        item.name == 'Accepted Encounter' ||
                        item.name == 'Rejected Encounter' ||
                        item.name == 'Total Encounter' ||
                        item.name == 'Total Batch | Total Files' ||
                        item.name == 'Rejected Files' ||
                        item.name == 'Resubmit Queue'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    url={url ? url : Strings.Outbound_Encounter_ClaimDetails837}
                />
            )
        })

        return (
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                transaction={"Encounter"}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Encounter Audit Summary(Outbound)</h5>
                {this._renderTopbar()}
                {/* {this.renderStats()} */}
                {this.renderSummaryDetails()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 ? this._renderTransactions() : null}
                    {/* {this.state.claimsAudit && this.state.claimsAudit.length > 0 ? this.renderTransactions() : null} */}
                </div>
            </div>
        );
    }
}