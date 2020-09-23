import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import { getDetails, getProviders } from '../../../../helpers/getDetails';
import DatePicker from "react-datepicker";
import ReactPaginate from 'react-paginate';
import { AutoComplete } from '../../../components/AutoComplete';
import { StateDropdown } from '../../../components/StateDropdown';
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';

let val = ''
export class Outbound_Claim_updated_AuditSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartne837: [],
            providers: [],
            summaryList: [],
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            acceptedFiles: 0,
            HiPaaSCount: 0,
            loaded: 0,
            gridType: 1,
            selectedTradingPartner: '',
            type: '',
            providerName: '',
            orderby: "",
            State: "",
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0,
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
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
            page: 1,
            count: 1,
            total_999: 0,
            nameRotation: 180,
            statusRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,
            totalCount: '',
            accepted_Files: '',
            acceptedwithErrors: '',
            rejected_Files: '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            NotSent999: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].notSent ? props.location.state.data[0].notSent : '',
            columnDefs: [
                { headerName: "File Name", field: "FileName_Outbound", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "File Date", field: "FileDate_Outbound", width: 100 },
                { headerName: "File Status", field: "FileStatus_Outbound", width: 120 },
                { headerName: "Total Claims Sent", field: "TotalEncounterSent", width: 140 },
                { headerName: "Batch Name", field: "BatchName", width: 120 },
                { headerName: "Accepted 999", field: "Accepted999", width: 120 },
                { headerName: "Rejected 999", field: "Rejected999", width: 120 },
                { headerName: "Acepted 277CA", field: "Acepted277CA", width: 130 },
                { headerName: "Rejected 277CA", field: "Rejected277CA", width: 130 },
                { headerName: "999", field: "F999", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "277CA", field: "F2777CA", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
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
           
            rowData: [],           
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
        }

        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this._refreshScreen()
    }

    _get999Count = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Claim837RTRejectedFile (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Outbound") {
                TotalAcceptedFiles
            }
         }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._claims_837, {
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
                    acceptedFiles: res.data.Claim837RTRejectedFile[0].TotalAcceptedFiles,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{
            Claim837RTDashboardCountClaimStatus(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Outbound") {
                HiPaaSCount
            }
            Claim837RTDashboardTable(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Outbound") {
                Accepted_Claims
                Rejected_Claims
                LoadingClaims
                Accepted_277CA
                Rejected_277CA
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
                if (res.data) {
                    let data = res.data.Claim837RTDashboardCountClaimStatus[0]
                    let _data = res.data.Claim837RTDashboardTable[0]

                    this.setState({
                        HiPaaSCount: data ? data.HiPaaSCount : 0,
                        Accepted: _data ? _data.Accepted_Claims : 0,
                        Rejected: _data ? _data.Rejected_Claims : 0,
                        loaded: _data ? _data.LoadingClaims : 0,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            OuboundEncounterAuditSummary {
                FileID
                FileName_Outbound
                FileDate_Outbound
                FileStatus_Outbound
                TotalEncounterSent
                BatchName
                Accepted999
                Rejected999
                Acepted277CA
                Rejected277CA
                F999
                F2777CA
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
                if (res.data) {

                    this.setState({
                        rowData: this.state.gridType == 1 ? res.data.OuboundEncounterAuditSummary : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _get999Count1 = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Outbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
              Total999
              NotSent999
            }
            Total277CAResponse(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Outbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
                Total277CA
                NotSent277CA
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
                this.setState({
                    total_999: res.data.Total999Response && res.data.Total999Response.length > 0 ? res.data.Total999Response[0].Total999 : 0,
                    total277CA: res.data.Total277CAResponse && res.data.Total277CAResponse.length > 0 ? res.data.Total277CAResponse[0].Total277CA : 0,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            FileInCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `",RecType:"Outbound", Provider:"${this.state.providerName}", State:"${this.state.State}"){
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
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._claims_837, {
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
                if (res.data) {
                    let totalFile = 0
                    try {
                        totalFile = res.data.FileInCount[0].totalFile
                    } catch (error) {

                    }

                    this.setState({
                        totalFile: totalFile,
                        TotalClaims: res.data.FileInCount[0].TotalClaims,
                        InProgress: res.data.FileInCount[0].InProgress,
                        Total277CA: res.data.FileInCount[0].Total277CA,
                        Paid: res.data.FileInCount[0].Paid,
                        denied: res.data.FileInCount[0].denied,
                        WIP: res.data.FileInCount[0].WIP,
                        Pending: res.data.FileInCount[0].Pending,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _getCountsNew = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            OutboundDashboardFileCount {
                TotalEncounterSent
                Accepted999
                Rejected999
                Accepted277CA
                Rejected277CA
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
                let _new_data = res.data.OutboundDashboardFileCount
                let _new_condition = _new_data && _new_data.length > 0 ? true : false


                let summary_3 = [
                    { name: 'Generated 837 Files', value: _new_condition ? _new_data[0].TotalEncounterSent : 0 },
                    { name: 'Sent To Payers', value: _new_condition ? _new_data[0].TotalEncounterSent : 0 },
                    { name: '999 Accepted', value: _new_condition ? _new_data[0].Accepted999 : 0 },
                    { name: '999 Rejected', value: _new_condition ? _new_data[0].Rejected999 : 0 },
                    { name: '277CA Received', value: _new_condition ? _new_data[0].Accepted999 : 0 },
                    // { name: '277CA Rejected', value: _new_condition ? _new_data[0].Rejected277CA : 0 },
                ]


                this.setState({
                    summaryList: summary_3,
                    totalFiles: 0
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }


    _renderSummaryDetails() {
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
            let loadStatus = ''
            let mcgStatus = ''
            let notSent = ''
            let data = []

            let FileID = ''
            let F99Status = ''
            let F277Status = ''
            let url = ''
            let noApiFlag = false

            if (item.name == '999 Accepted') {
                F99Status = 'Accepted'
                url = Strings.Inbound_Claim_999_response
            } else if (item.name == '999 Rejected') {
                F99Status = 'Rejected'
                noApiFlag = true
                url = Strings.Inbound_Claim_999_response
            } else if (item.name == '277CA Received') {
                F99Status = 'Accepted'
                url = Strings.Outbound_Claim_277CAResponse
            }

            data = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: claimStatus,
                    type: type,
                    gridflag: loadStatus,
                    mcgStatus: mcgStatus,
                    subtitle: (item.name == 'Total Files') ? '' : (item.name == 'Reconciled Files | Error') ? 'Reconciled Files' : (item.name == 'Load in QNXT | Error') ? 'Load in QNXT' : item.name,
                    notSent: notSent,

                    FileID: FileID,
                    F99Status: F99Status,
                    F277Status: F277Status,
                    noApiFlag: noApiFlag
                },
            ]

            let geturl = url ? url : Strings.Outbound_Claim_updated_Details_837_Grid

            row.push(
                <Tiles
                    isenrollment={true}
                    isClickable={true}
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    url={geturl}
                />

            )
        });

        return (
            <div className="row padding-left" style={{ marginLeft: '-14px', marginTop: '16px' }}>
                {row}
            </div>
        )
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    goto277 = (fileId) => {
        // sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_Claim_277CAResponse, {
            fileId: fileId
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
    }

    goto999 = (fileId) => {
        // sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_Claim_999_response, {
            fileId: fileId,
            data: [
                { flag999: '0' },
            ]
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
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
            this.getClaimCounts()
            this._getCounts()

        }, 50);
    }

    renderTransactions() {
        let row = []
        const data = this.state.claimsAudit;

        data.forEach((d) => {
            let count = 0
            try {
                count = (Number(d.Submitted) ? Number(d.Submitted) : 0) - (Number(d.InHiPaaS) ? Number(d.InHiPaaS) : 0)
            } catch (error) { }

            row.push(
                <tr>
                    <td className="list-item-style"><a onClick={() => { this.props.history.push('/' + Strings.Outbound_Claim_updated_ProcessingSummary, { file_id: d.FileID }) }} style={{ color: "#6AA2B8", cursor: "pointer", wordBreak: 'break-all' }}>{d.filename}</a></td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style" style={{ wordBreak: 'break-all' }}>{d.ProcessID}</td>
                    <td className="list-item-style">{d.FileStatus}</td>
                    <td className="list-item-style">{d.Submitted ? d.Submitted : 0}</td>
                    <td className="list-item-style">{d.InHiPaaS ? d.InHiPaaS : 0}</td>
                    <td className="list-item-style">{d.Accepted}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                    {/* <td className="list-item-style">{count}</td> */}
                    <td className="list-item-style">{d.LoadMCG}</td>
                    <td className="list-item-style">{d.LoadError}</td>
                    <td className="list-item-style">{d.Accepted_277CA}</td>
                    <td className="list-item-style">{d.Rejected_277CA}</td>
                    {/* <td className="list-item-style">{d.SentToQNXT}</td> */}
                    <td className="list-item-style">
                        <a style={{ color: "#6AA2B8", cursor: "pointer", wordBreak: 'break-all' }}
                            onClick={() => {
                                this.goto999(d.FileID)
                            }}>{d.F999}</a></td>
                    <td className="list-item-style"><a style={{ color: "#6AA2B8", cursor: "pointer" }}
                        onClick={() => {
                            this.goto277(d.FileID)
                        }}>{d.F277}</a></td>
                </tr>
            )
        });
        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    <tr className="table-head">
                        <td style={{ width: '14%' }} className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "ClaimsDailyAudit.filename", this.state.nameRotation, 'nameRotation')}>File Name</a></td>
                        <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "ClaimsDailyAudit.State", this.state.stateRotation, 'stateRotation')}>State</a></td>
                        <td style={{ wordBreak: 'break-all' }} className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "ClaimsDailyAudit.ProcessID", this.state.processIdRotation, 'processIdRotation')}>Process Id</a></td>
                        <td style={{ width: '6%', wordBreak: 'break-all' }} className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "ClaimsDailyAudit.FileStatus", this.state.statusRotation, 'statusRotation')}>File Status</a></td>
                        <td className="table-head-text list-item-style">X12 Count</td>
                        <td className="table-head-text list-item-style">HiPaaS Count </td>
                        <td className="table-head-text list-item-style">Accepted PreProcess </td>
                        <td className="table-head-text list-item-style">Rejected PreProcess </td>

                        <td className="table-head-text list-item-style">Load in MCG</td>
                        <td className="table-head-text list-item-style">Load Error</td>
                        <td className="table-head-text list-item-style">277CA Accepted</td>
                        <td className="table-head-text list-item-style">277CA Rejected</td>
                        {/* <td className="table-head-text list-item-style">Error in PreProcess </td> */}
                        {/* <td className="table-head-text list-item-style">Accepted in Preprocess</td> */}
                        {/* <td className="table-head-text list-item-style">In MCG </td> */}
                        <td className="table-head-text list-item-style">999</td>
                        <td className="table-head-text list-item-style">277 CA</td>
                    </tr>
                    <tbody >
                        <tr>
                        </tr>
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
                    onPageChange={(page) => { this.handlePageClick(page) }}
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
    }

    handlePageClick(data) {
        let page = data.selected + 1
        this.setState({
            page: page,

        })

        setTimeout(() => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()

        }, 50);
    }

    _renderStats() {
        let _summary = [
            // { header: 'Total Accepted Files', value: this.state.acceptedFiles, style: "green summary-title" },

            // { header: 'Total Files', value: this.state.totalCount },
            { header: 'Accepted Files', value: this.state.accepted_Files },
            { header: 'Accepted with Errors', value: this.state.acceptedwithErrors },
            { header: 'Rejected Files', value: this.state.rejected_Files },
            { header: 'Claims In HiPaaS', value: this.state.HiPaaSCount },
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            { header: '999', value: this.state.Total999, style: "green summary-title" },
            { header: 'Load in MCG', value: this.state.loaded, style: "green summary-title" },
            { header: '277 CA', value: this.state.Total277CA, style: "orange summary-title" }
        ]
        let row = []

        _summary.forEach(item => {
            row.push(
                <Tiles
                    header_text={item.header}
                    value={item.value}
                    isClickable={false}
                    _style={item.style}
                />
            )
        })

        return (
            <div className="row padding-left" >
                {row}
            </div>

        )
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
                        rowData={this.state.rowData}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == '999') {
                                this.goto999(event.data.FileID)
                            }
                            if (event.colDef.headerName == '277CA') {
                                this.goto277(event.data.FileID)
                            }
                            if (event.colDef.headerName == 'File Name') {
                                this.props.history.push('/' + Strings.Outbound_Claim_updated_ProcessingSummary, {
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

    _refreshScreen = () => {
        this.getData()
        this.getClaimCounts()
        this._getCounts()
        this._getCountsNew()
        this._get999Count1()
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            claimsAudit: [],
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            this._getCounts()
        })
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
                isPayer={true}
                removeSubmitter={true}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                State={''}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Audit Summary (Outbound)</h5>
                {this._renderTopbar()}
                {/* {this._renderStats()} */}
                {this._renderSummaryDetails()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {/* {this._renderTransactions()} */}
                    {this.state.rowData && this.state.rowData.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                </div>
            </div>
        );
    }
}