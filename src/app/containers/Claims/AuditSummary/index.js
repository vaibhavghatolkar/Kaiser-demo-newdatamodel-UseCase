import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';

let val = ''
export class AuditSummary extends React.Component {

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
                { headerName: "File Name", field: "filename", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State", width: 80 },
                { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "File Status", field: "FileStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "Load Status", field: "LoadStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "MCG Load Status	", field: "MCGStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "X12 Count", field: "Submitted", width: 90 },
                { headerName: "HiPaaS Count", field: "InHiPaaS", width: 90 },
                { headerName: "Accepted PreProcess", field: "Accepted", width: 90 },
                { headerName: "Rejected PreProcess", field: "Rejected", width: 90 },
                { headerName: "Load in MCG", field: "LoadMCG", width: 90 },
                { headerName: "Load Error", field: "LoadError", width: 90 },

                { headerName: "277CA Accepted", field: "Accepted_277CA", width: 90 },
                { headerName: "277CA Rejected", field: "Rejected_277CA", width: 90 },
                // { headerName: "Error in PreProcess", field: "Error", width: 90 },
                // { headerName: "In MCG	", field: "SentToQNXT", width: 80 },
                { headerName: "999", field: "F999", width: 240, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "277CA", field: "F277", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
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

    }

    componentDidMount() {
        this._refreshScreen()
    }

    _getCountsNew = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Claim837RTDashboardCountNew(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                TotalCount
                Accepted
                Rejected
                AcceptedwithErrors
                Processing
            }
            Claim837RTDashboardCountFileStatuswise(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                Reconciled
                ReconciledError
                Loaded
                LoadedError
                ProcessingFiles
                MCGLoadingFiles
            }
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
                Total999
                NotSent999
              }
            Total277CAResponse(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type:"${this.state.type}") {
                Total277CA
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.real_time_claim, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let summary = []
                let data = res.data.Claim837RTDashboardCountNew
                let _data = res.data.Claim837RTDashboardCountFileStatuswise
                let reconciled = ''
                let reconciledError = ''
                let loaded = ''
                let loadedError = ''
                let totalCount = ''
                let accepted = ''
                let rejected = ''
                let acceptedwithErrors = ''
                let processing = ''
                let MCGLoadingFiles = ''
                let Total999 = res.data.Total999Response && res.data.Total999Response.length > 0 ? res.data.Total999Response[0].Total999 : 0
                let Total277CA = res.data.Total277CAResponse && res.data.Total277CAResponse.length > 0 ? res.data.Total277CAResponse[0].Total277CA : ''


                if (data && data.length > 0) {
                    totalCount = data[0].TotalCount
                    accepted = data[0].Accepted
                    rejected = data[0].Rejected
                    acceptedwithErrors = data[0].AcceptedwithErrors
                }

                if (_data && _data.length > 0) {
                    reconciled = _data[0].Reconciled
                    reconciledError = _data[0].ReconciledError
                    loaded = _data[0].Loaded
                    loadedError = _data[0].LoadedError
                    processing = _data[0].ProcessingFiles
                    MCGLoadingFiles = _data[0].MCGLoadingFiles
                }

                summary = [
                    { name: 'Total Files', value: totalCount },
                    { name: 'Accepted Files', value: accepted },
                    { name: 'Accepted with Errors', value: acceptedwithErrors },
                    { name: 'Rejected Files', value: rejected },
                    { name: '999', value: Total999 },
                    { name: 'Reconciled Files | Error', value: reconciled, second_val: reconciledError },
                    // { name: 'Reconciled Error', value: reconciledError },
                    { name: 'Load in MCG | Error', value: loaded, second_val: loadedError },
                    // { name: 'Load Error', value: loadedError,  },
                    // { name: 'Load in MCG', value: loaded },
                    { name: 'HiPaaS | MCG', value: processing, second_val: MCGLoadingFiles },
                    { name: '277CA', value: Total277CA },
                ]

                this.setState({
                    summaryList: summary,
                    totalFiles: totalCount
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }


    _renderSummaryDetails() {
        let row = []
        let array = this.state.summaryList
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
            let isDual = false
            let data = []
            let _second_data = []
            if (item.name == 'Accepted Files') {
                addon = '/accept'
                claimStatus = 'Accepted'
            } else if (item.name == 'Accepted with Errors') {
                addon = '/reject'
                claimStatus = 'Accepted with Errors'
            } else if (item.name == 'Processing Files') {
                addon = '/reject'
                claimStatus = 'Received'
            } else if (item.name == 'Rejected Files') {
                claimStatus = 'Rejected'
            } else if (item.name == 'Reconciled Files') {
                loadStatus = 'Reconciled'
            } else if (item.name == 'Reconciled Error') {
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load Error') {
                mcgStatus = 'Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
            } else if (item.name == '999') {
                notSent = 'Y'
            } else if (item.name == '277CA') {
                notSent = 'CA'
            } else if (item.name == 'Reconciled Files | Error') {
                loadStatus = 'Reconciled'
                isDual = true
            } else if (item.name == 'Load in MCG | Error') {
                mcgStatus = 'Loaded'
                isDual = true
            } else {
                addon = '/other'
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
                    subtitle: (item.name == 'Total Files') ? '' : (item.name == 'Reconciled Files | Error') ? 'Reconciled Files' : (item.name == 'Load in MCG | Error') ? 'Load in MCG' : item.name,
                    notSent: notSent
                },
            ]

            if (isDual) {
                if (item.name == 'Reconciled Files | Error') {
                    _second_data = [{
                        flag: addon,
                        State: State,
                        selectedTradingPartner: selectedTradingPartner,
                        startDate: startDate,
                        endDate: endDate,
                        status: claimStatus,
                        type: type,
                        gridflag: 'Reconcile Exception',
                        subtitle: 'Reconciled Error',
                        mcgStatus: mcgStatus,
                        notSent: notSent
                    }]
                } else {
                    _second_data = [{
                        flag: addon,
                        State: State,
                        selectedTradingPartner: selectedTradingPartner,
                        startDate: startDate,
                        endDate: endDate,
                        status: claimStatus,
                        type: type,
                        gridflag: loadStatus,
                        subtitle: 'Load Error',
                        mcgStatus: 'Exception',
                        notSent: notSent
                    }]
                }
            }

            let geturl = Strings.Claim_Details_837_Grid
            if (notSent == 'Y') {
                geturl = Strings.Outbound_response_999
                data = [
                    { flag999: '1' },
                ]
            } else if(notSent == 'CA'){
                geturl = Strings.Outbound_277CAResponse
                data = []
            }

            row.push(
                <Tiles
                    isClickable={
                        item.name != 'HiPaaS | MCG'
                    }
                    // uniformWidth={true}
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    isDualTile={
                        item.name == 'Reconciled Files | Error' ||
                        item.name == 'Load in MCG | Error'
                    }
                    first_arg_style={item.name == 'Reconciled Files | Error' ? 'blue' : 'green'}
                    first_data={data}
                    second_data={_second_data}
                    url={geturl}
                    second_url={item.name == 'Load in MCG | Error' ? Strings.Load_Exception : ''}
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
        this.props.history.push('/' + Strings.Outbound_277CAResponse, {
            fileId: fileId
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
    }

    goto999 = (fileId) => {
        // sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_response_999, {
            fileId: fileId,
            data : [
                { flag999: '1' },
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
            this.getClaimCounts()
        }, 50);
    }

    renderTransactions() {
        let row = []
        const data = this.state.claimsAudit;

        data.forEach((d) => {
            row.push(
                <tr>
                    <td className="list-item-style"><a onClick={() => { this.props.history.push('/' + Strings.ClaimProcessingSummary, { file_id: d.FileID }) }} style={{ color: "#6AA2B8", cursor: "pointer", wordBreak: 'break-all' }}>{d.filename}</a></td>
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
            this.getClaimCounts()
        }, 50);
    }

    clickNavigation = (event) => {
        if (event.colDef.headerName == '999') {
            this.goto999(event.data.FileID)
        }
        if (event.colDef.headerName == '277CA') {
            this.goto277(event.data.FileID)
        }
        if (event.colDef.headerName == 'File Name') {
            this.props.history.push('/' + Strings.ClaimProcessingSummary, {
                file_id: event.data.FileID
            })
        }
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

    _renderTransactions() {
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            ClaimsDailyAuditNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                    
                    submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  
                    RecType:"Inbound", page: ${this.state.page}, Provider:"${this.state.providerName}", 
                    OrderBy:"${this.state.orderby}", State:"${this.state.State}", GridType:${this.state.gridType}, NotSent999:"${this.state.NotSent999}"
            ) {
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
                  RecCount
                  Error
                  InHiPaaS
                  State
                  ProcessID
                  LoadStatus
                  MCGStatus
                  Accepted_277CA
                  Rejected_277CA
                  LoadMCG
                  LoadError
                }
              }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls.claims_837}
                    fieldType={'FileDate'}
                    index={'ClaimsDailyAuditNew'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    _refreshScreen = () => {
        this._getCountsNew()
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            claimsAudit: [],
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            // this._getCounts()
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
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Audit Summary</h5>
                {this._renderTopbar()}
                {/* {this._renderStats()} */}
                {this._renderSummaryDetails()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this._renderTransactions()}
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && !this.state.gridType ? this.renderTransactions() : null}
                </div>
            </div>
        );
    }
}