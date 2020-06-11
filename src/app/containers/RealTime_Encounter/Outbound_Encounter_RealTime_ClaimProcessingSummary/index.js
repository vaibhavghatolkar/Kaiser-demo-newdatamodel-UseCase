import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import Strings from '../../../../helpers/Strings'
import { CommonTable } from '../../../components/CommonTable';
import { StateDropdown } from '../../../components/StateDropdown';
import { AgGridReact } from 'ag-grid-react';
import { Filters } from '../../../components/Filters';
import { TableTiles } from '../../../components/TableTiles';

let val = ''
export class Outbound_Encounter_ClaimProcessingSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            EncounterProcessingSummary: [],
            recCount: 0,
            pageCount: 1,
            Months: 0,
            selectedTradingPartner: "",
            State: "",
            providerName: "",
            startDate: "",
            endDate: "",
            TotalClaims: 0,
            Accepted: 0,
            Rejected: 0,
            TotalSentToQNXT: 0,
            Total999: 0,
            Total277CA: 0,
            Paid: 0,
            Pending: 0,
            Denide: 0,
            wip90: 0,
            orderby: '',

            fileNameFlag: 180,
            fileDateFlag: 180,
            extraField2Flag: 180,
            claimIDFlag: 180,
            createDateTimeFlag: 180,
            claimStatusFlag: 180,
            subscriber_IDFlag: 180,
            subscriberLastNameFlag: 180,
            subscriberFirstNameFlag: 180,
            file_id: props && props.location.state && props.location.state.file_id ? props.location.state.file_id : '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "File Name", field: "FileName", width : 170, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "File Date", field: "FileCrDate", flex: 1 },
                { headerName: "File Status", field: "FileStatus", flex: 1 },
                { headerName: "Batch Name", field: "BatchName", flex: 1 },
                { headerName: "Batch Status", field: "BatchStatus", flex: 1 },
                { headerName: "999", field: "F999", flex: 1 },
                { headerName: "Encounter Id", field: "ClaimID", flex: 1, },
                { headerName: "Encounter Date", field: "ClaimDate", flex: 1 },
                { headerName: "Encounter Status", field: "ClaimStatus", flex: 1 },
                { headerName: "State Status", field: "adjudication_status", flex: 1 },
                { headerName: "277CA", field: "F277", flex: 1 },
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
            rowSelection: 'multiple',
                  rowData: [],
            rowSelection: 'multiple',
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
        }

        this.getData = this.getData.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
    }

    componentDidMount() {
        this.getCountData()
        this.getData()
    }

    getCountData() {

        let query = `{EncounterFileInCnt(submitter:"${this.state.selectedTradingPartner}"  fromDt:"${this.state.startDate}" ToDt:"${this.state.endDate}" RecType:"Outbound") {
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
          } }`

        process.env.NODE_ENV == 'development' && console.log(query)

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
                var data = res.data.EncounterFileInCnt
                if (data && data.length > 0) {
                    let Accepted = data[0].Accepted
                    let Rejected = data[0].Rejected
                    let TotalSentToQNXT = data[0].TotalSentToQNXT
                    let Total999 = data[0].Total999
                    let Total277CA = data[0].Total277CA

                    this.setState({
                        Accepted: Accepted,
                        Rejected: Rejected,
                        TotalSentToQNXT: TotalSentToQNXT,
                        Total999: Total999,
                        Total277CA: Total277CA,
                        Paid: data[0].Paid,
                        Pending: data[0].Pending,
                        Denide: data[0].denied,
                        wip90: data[0].WIP,
                        TotalBatch: data[0].TotalBatch,
                        ReadytoSend: data[0].ReadytoSend,
                        Valid: data[0].Valid,
                        Error: data[0].Error,
                        ClaimSent: data[0].ClaimSent,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getData() {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{            
            EncounterProcessingSummary (page:${this.state.pageCount},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", FileID: "" , OrderBy:"` + this.state.orderby + `",Type:"", RecType:"Outbound") {
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
                F999
				F277
                TotalLinewise835
                TotalLine
                BatchName
                BatchStatus
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
                let count = 0
                if (data && data.length > 0) {
                    let recCount = data[0].RecCount
                    try {
                        count = recCount / 10
                        count = count.floor(count)
                        if (recCount % 10 > 0) {
                            count = count + 1
                        }
                    } catch (error) {

                    }

                }

                this.setState({
                    EncounterProcessingSummary: data,
                    recCount: count,
                })
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

    handlePageClick(data, fileId) {
        let page = data.selected + 1
        this.setState({
            pageCount: page
        })

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderTransactions() {
        let row = []
        const data = this.state.EncounterProcessingSummary;

        data.forEach((d) => {
            var providerName = d.ProviderFirstName ? d.ProviderFirstName : '' + " " + d.ProviderLastName ? d.ProviderLastName : ''
            row.push(
                <tr>
                    <td className="list-item-style">{d.FileName}</td>
                    <td className="list-item-style">{moment(d.FileCrDate).format('MMM D YYYY hh:mm a')}</td>
                    <td className="list-item-style">{d.FileStatus}</td>
                    <td className="list-item-style">{d.ClaimID}</td>
                    <td className="list-item-style">{moment(d.ClaimDate).format('MMM D YYYY hh:mm a') != 'Invalid date' ? moment(d.ClaimDate).format('MMM D YYYY hh:mm a') : d.ClaimDate}</td>
                    <td className="list-item-style">{d.ClaimStatus}</td>
                    <td className="list-item-style">{d.Subscriber_ID}</td>
                    <td className="list-item-style">{d.SubscriberLastName}</td>
                    <td className="list-item-style">{d.SubscriberFirstName}</td>
                    <td className="list-item-style">{d.ProviderLastName}</td>
                    <td className="list-item-style">{d.ProviderFirstName}</td>
                    <td className="list-item-style">{d.Claim_Amount}</td>


                </tr>
            )
        })


        return (
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head">
                            <td className="table-head-text"><small>File Name</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName asc" : "Order By EncounterProcessingSummary.FileName asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName desc" : "Order By EncounterProcessingSummary.FileName desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>File Date</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate asc" : "Order By EncounterProcessingSummary.FileCrDate asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate desc" : "Order By EncounterProcessingSummary.FileCrDate desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>File Status</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2 asc" : "Order By EncounterProcessingSummary.FileStatus asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2 desc" : "Order By EncounterProcessingSummary.FileStatus desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Encounter Id</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID asc" : "Order By EncounterProcessingSummary.ClaimID asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID desc" : "Order By EncounterProcessingSummary.ClaimID desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Encounter Date</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime asc" : "Order By EncounterProcessingSummary.ClaimDate asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime desc" : "Order By EncounterProcessingSummary.ClaimDate desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Encounter Status</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus asc" : "Order By EncounterProcessingSummary.ClaimStatus asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus desc" : "Order By EncounterProcessingSummary.ClaimStatus desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Subscriber Id</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.Subscriber_ID asc" : "Order By EncounterProcessingSummary.Subscriber_ID asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.Subscriber_ID desc" : "Order By EncounterProcessingSummary.Subscriber_ID desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Subscriber Last Name</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberLastName asc" : "Order By EncounterProcessingSummary.SubscriberLastName asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberLastName desc" : "Order By EncounterProcessingSummary.SubscriberLastName desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Subscriber First Name</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberFirstName asc" : "Order By EncounterProcessingSummary.SubscriberFirstName asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberFirstName desc" : "Order By EncounterProcessingSummary.SubscriberFirstName desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Provider Last Name</small></td>
                            <td className="table-head-text"><small>Provider First Name</small></td>
                            <td className="table-head-text"><small>Encounter Amount</small></td>

                        </tr>
                    </thead>

                    {row}

                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
                    pageCount={this.state.recCount}
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

    goto277 = () => {
        sessionStorage.setItem('isOutbound', false)
        this.props.history.push('/' + Strings._277CAResponse, {
            flag: 1
        })
        setTimeout(() => {
            window.location.reload()
        }, 50);
    }

    goto999 = () => {
        sessionStorage.setItem('isOutbound', false)
        this.props.history.push('/' + Strings.response_999, {
            flag: 1
        })
        setTimeout(() => {
            window.location.reload()
        }, 50);
    }

    renderTransactionsNew() {
        const data = this.state.EncounterProcessingSummary ? this.state.EncounterProcessingSummary : []
        let headerArray = []
        let rowArray = []

        headerArray.push(
            { value: 'File Name', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By EncounterProcessingSummary.FileName", this.state.fileNameFlag, 'fileNameFlag'), key: this.state.fileNameFlag },
            { value: 'File Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate" : "Order By EncounterProcessingSummary.FileCrDate", this.state.fileDateFlag, 'fileDateFlag'), key: this.state.fileDateFlag },
            { value: 'File Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2" : "Order By EncounterProcessingSummary.FileStatus", this.state.extraField2Flag, 'extraField2Flag'), key: this.state.extraField2Flag },
            { value: 'Batch Name' },
            { value: 'Batch Status' },
            { value: '999' },
            { value: 'Encounter Id', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID" : "Order By EncounterProcessingSummary.ClaimID", this.state.claimIDFlag, 'claimIDFlag'), key: this.state.claimIDFlag },
            { value: 'Encounter Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime" : "Order By EncounterProcessingSummary.ClaimDate", this.state.createDateTimeFlag, 'createDateTimeFlag'), key: this.state.createDateTimeFlag },
            { value: 'Encounter Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus" : "Order By EncounterProcessingSummary.ClaimStatus", this.state.claimStatusFlag, 'claimStatusFlag'), key: this.state.claimStatusFlag },
            { value: 'State Status' },
            { value: '277CA' },
            // {value : 'Total Line count | 835 Received'},
        )

        rowArray.push(
            { value: 'FileName' },
            { value: 'FileCrDate', isDate: 1 },
            { value: 'FileStatus' },
            { value: 'BatchName' },
            { value: 'BatchStatus' },
            { value: 'F999', isClick: 1, method: this.goto999 },
            { value: 'ClaimID' },
            { value: 'ClaimDate', isDate: 1 },
            { value: 'ClaimStatus' },
            { value: 'adjudication_status' },
            { value: 'F277', isClick: 1, method: this.goto277 },
            // { value: 'TotalLine', secondVal: 'TotalLinewise835', isBar: 1 },
        )

        return (
            <CommonTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
                count={this.state.recCount}
                handlePageClick={this.handlePageClick}
            />
        )
    }

    handleSort = (e, rotation, key) => {
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

    renderStats() {
        process.env.NODE_ENV == 'development' && console.log(this.state.Accepted)
        return (

            <div className="row padding-left" style={{ marginBottom: '10px' }}>

                <div className="col summary-container">
                    <div className="summary-header">READY TO SEND</div>
                    <div className="blue summary-title">{this.state.ReadytoSend}</div>
                </div>

                <div className="col summary-container">
                    <div className="summary-header">ERRORS</div>
                    <div className="red summary-title">{this.state.Error}</div>
                </div>

                <div className="col summary-container">
                    <div className="summary-header">SENT TO STATE</div>
                    <div className="green summary-title">{this.state.ClaimSent}</div>
                </div>

                <div className="col summary-container">
                    <div className="summary-header">ACCEPTED ENCOUNTER </div>
                    <div className="green summary-title">{this.state.Accepted}</div>
                </div>

                <div className="col summary-container">
                    <div className="summary-header">REJECTED ENCOUNTER </div>
                    <div className="red summary-title">{this.state.Rejected}</div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">999</div>
                    <div className="red summary-title">{this.state.Total999}</div>
                </div>

                {/* <div className="col summary-container">
                    <div className="summary-header">SENT TO STATE</div>
                    <div className="green summary-title">{this.state.TotalSentToQNXT}</div>
                </div> */}
                {/* <div className="col summary-container">
                    <div className="summary-header">REJECTED BY STATE</div>
                    <div className="red summary-title">0</div>
                </div> */}

                <div className="col summary-container">
                    <div className="summary-header">277 CA</div>
                    <div className="red summary-title">{this.state.Total277CA}</div>
                </div>
                {/* <div className="col summary-container">
                            <div className="summary-header">PAID</div>
                            <div className="green summary-title">{this.state.Paid}</div>
                        </div> 
                
                        <div className="col summary-container">
                            <div className="summary-header">PENDING</div>
                            <div className="orange summary-title">{this.state.Pending}</div>
                        </div>
              
                        <div className="col summary-container">
                            <div className="summary-header">DENIED</div>
                            <div className="red summary-title">{this.state.Denide}</div>
                        </div>  */}


            </div>

        )
    }

    _renderTransactions() {
        return (
            <div className="ag-theme-balham" style={{ height: '400px', padding: '0px', marginLeft: '1px' }}>
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
                    rowData={this.state.EncounterProcessingSummary}
                    enableCellTextSelection={true}
                    onCellClicked={(event) => {
                        if (event.colDef.headerName == '999') {
                            this.goto999(event.data.FileID)
                        }
                        if (event.colDef.headerName == '277CA') {
                            this.goto277(event.data.FileID)
                        }
                        if (event.colDef.headerName == 'File Name') {
                            this.setState({
                                incoming_fileId: event.data.FileID
                            }, () => {
                                // this.gotoDetails()
                            })
                        }
                    }}
                >
                </AgGridReact>
            </div>
        )
    }

    _renderClaimTables = (array) => {
        let row = []
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let loadStatus = ''
            let generalStatus = ''
            let mcgStatus = ''
            let notSent = ''
            let subtitle = ''
            let status277CA = ''
            let color = "var(--red)"

            if (item.name == 'Accepted') {
                generalStatus = 'Accepted'
                subtitle = 'Accepted Claims'
                color = "var(--green)"
            } else if (item.name == 'Rejected') {
                generalStatus = 'Rejected'
                subtitle = "Rejected Claims"
            } else if (item.name == 'File Rejected') {
                generalStatus = 'File Rejected'
                subtitle = item.name
            } else if (item.name == 'Reconciled Error') {
                subtitle = item.name
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
                subtitle = item.name
                color = "var(--main-bg-color)"
            } else if (item.name == 'Load Error') {
                subtitle = item.name
                mcgStatus = 'Exception'
            } else if (item.name == '999 Not Sent') {
                notSent = 'Y'
            }

            if (item.name == 'Accepted' && item.is277CA) {
                subtitle = '277CA Accepted Claims'
                generalStatus = ''
                status277CA = 'Accepted'
            }

            if (item.name == 'Rejected' && item.is277CA) {
                subtitle = '277CA Rejected Claims'
                generalStatus = ''
                status277CA = 'Rejected'
            }

            let sendData = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: claimStatus,
                    type: type,
                    gridflag: loadStatus,
                    generalStatus: generalStatus,
                    mcgStatus: mcgStatus,
                    notSent: notSent,
                    subtitle: subtitle,
                    status277CA: status277CA
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Claim_Details_837_Grid}
                    data={sendData}
                    color={color}
                />
            )
        })

        return (
            <div className="col chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }

    renderClaimDetails = () => {
        let stage_1 = [
            { 'header': 'HiPaaS Load Status' },
            { 'name': 'X12 Count', 'value': this.state.X12Count },
            { 'name': 'HiPaaS Count', 'value': this.state.HiPaaSCount },
            { 'name': 'Reconciled Error', 'value': this.state.ReconciledError_Claims, 'isClick': 1 },
        ]
        let stage_2 = [
            { 'header': 'L1 - L2 Status' },
            { 'name': 'Accepted', 'value': this.state.Accepted_Claims, 'isClick': 1 },
            { 'name': 'Rejected', 'value': this.state.Rejected_Claims, 'isClick': 1 },
            { 'name': 'File Rejected', 'value': this.state.FileReject_Claims, 'isClick': 1 },
        ]
        let stage_3 = [
            { 'header': 'MCG Load Status' },
            { 'name': 'Load in MCG', 'value': this.state.LoadingClaims, 'isClick': 1 },
            { 'name': 'Load Error', 'value': this.state.LoadedErrorClaims, 'isClick': 1 },
        ]

        let stage_4 = [
            { 'header': 'L3 - L7 Status' },
            { 'name': 'Accepted', 'value': this.state.Accepted_277CA, 'isClick': 1, 'is277CA': 1 },
            { 'name': 'Rejected', 'value': this.state.Rejected_277CA, 'isClick': 1, 'is277CA': 1 },
        ]

        return (
            <div className="row" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
                {this._renderClaimTables(stage_4)}
            </div>
        )
    }

    _refreshScreen = () => {
        this.getCountData()
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
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Encounter Processing Summary(Outbound)</h5>
                {this._renderTopbar()}
                {/* {this.renderStats()} */}
                {this.renderClaimDetails()}
                {this.state.EncounterProcessingSummary && this.state.EncounterProcessingSummary.length > 0 ? this._renderTransactions() : null}
                {/* {this.state.EncounterProcessingSummary && this.state.EncounterProcessingSummary.length > 0 ? this.renderTransactionsNew() : null} */}
            </div>
        );
    }
}