import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
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
export class AuditSummary835 extends React.Component {

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
            startDate: moment().subtract(180, 'd').format('YYYY-MM-DD'),
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
            columnDefs: [
                { headerName: "Process Id", field: "ProcessID", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "QNXT File Name", field: "QNXTFileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Received Date", field: "Date" },
                { headerName: "State", field: "State" },
                { headerName: "File Status", field: "Status" },
                { headerName: "Remittance File Name", field: "RemittanceFileName" },
                { headerName: "Remittance File Date	", field: "RemittanceSentDate" },
                { headerName: "QNXT Generated", field: "Received" },
                { headerName: "HiPaaS Received", field: "InHipaas" },
                // { headerName: "Error in PreProcess", field: "" },
                { headerName: "Accepted", field: "Accepted" },
                { headerName: "Rejected", field: "Rejected" },
                { headerName: "999", field: "F999", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "In MCG	", field: "SentToQNXT" },
                // { headerName: "277CA", field: "F277", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
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
                editable: false,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100,
            },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
        }
    }

    componentDidMount() {
        this._getCounts()
        this._getCountsNew()
    }

    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            
                AuditSummary835(StartDt: "${startDate}", EndDt: "${endDate}", State: "${this.state.State}", FileID:"",Status:"",RecType:"Outbound") {
                  FileID
                  RecCount
                  QNXTFileName
                  Date
                  State
                  ProcessID
                  F999
                  RemittanceFileName
                  RemittanceSentDate
                  Status
                  Received
                  InHipaas
                  Accepted
                  Rejected
                }
              
        }`
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
                let data = res.data
                if (res.data) {

                    let count = 1
                    if (data && data.AuditSummary835.length > 0) {

                        count = Math.floor(data.AuditSummary835[0].RecCount / 10)
                        if (data.AuditSummary835[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                    }

                    this.setState({
                        claimsAudit: res.data.AuditSummary835,
                        rowData: this.state.gridType == 1 ? res.data.AuditSummary835 : [],
                        count: count
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
            ERA835DashboardCountNew(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                TotalCount
                Rejected
                Accepted
                AvailitySent
                Exception
                EFT
                CHK
              }
              Total999Response835(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                Total999
              }
              
        }`
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
                let data = res.data.ERA835DashboardCountNew[0]
                // this.setState({
                //     totalCount: data[0].TotalCount,
                //     accepted_Files: data[0].Accepted,
                //     acceptedwithErrors: data[0].AcceptedwithErrors,
                //     rejected_Files: data[0].Rejected
                // })
                let summary = []

                summary = [
                    { name: 'Received From QNXT', value: data.TotalCount },
                    { name: 'Vaildated', value: data.Accepted },
                    { name: 'Files in Error', value: data.Rejected },
                    { name: 'EFT', value: data.EFT },
                    { name: 'Check', value: data.CHK },
                    { name: 'Total Sent To Availity', value: data.AvailitySent },
                    { name: '999 Received', value: res.data.Total999Response835[0].Total999 },
                ]

                this.setState({
                    summaryList: summary,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }


    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryList
        let apiflag = this.state.apiflag
        let availitySent = ''
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''
        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let subtitle = ''
            let url = ''
            let EFTCHK = ''
            let data = []
            if (item.name == 'Vaildated') {
                addon = '/accept'
                claimStatus = 'Validated'
                subtitle = "Validated Files"
            } else if (item.name == 'Files in Error') {
                claimStatus = 'Error'
                subtitle = "Files in Error"
            } else if (item.name == 'EFT') {
                EFTCHK = 'ACH'
            } else if (item.name == 'Check') {
                EFTCHK = 'CHK'
            } else if (item.name == 'Total Sent To Availity') {
                availitySent = 'Y'
                subtitle = "Sent to Availity"
            } else {
                addon = '/other'
            }
            data = [
                { flag: addon, State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, transactionId: 'n', status: claimStatus, type: type, subtitle: subtitle, availitySent: availitySent, EFTCHK: EFTCHK },
            ]

            if (item.name == '999 Received') {
                data = [{ flag999: '0' }]
                url = Strings.Inbound_response_999
            }
            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Received From QNXT' &&
                        item.name != 'Error Resolved'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    url={url ? url : Strings.claimPayment_835_details}
                />

            )
        });

        return (
            <div className="row padding-left">
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
        this.props.history.push('/' + Strings.Inbound_response_999, {
            fileId: fileId,
            data: [{ flag999: '0' }]
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
                    <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.QNXTFileName}</td>
                    <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.Date}</td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style">{d.ProcessID}</td>
                    <td className="list-item-style">{d.Status}</td>
                    <td className="list-item-style">{d.RemittanceFileName}</td>
                    <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.RemittanceSentDate}</td>
                    <td className="list-item-style">{d.Received}</td>
                    <td className="list-item-style">{d.InHipaas}</td>
                    <td className="list-item-style"></td>
                    <td className="list-item-style">{d.F999}</td>
                </tr>
            )
        });
        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    <tr className="table-head">
                        <td className="table-head-text list-item-style">QNXT File Name</td>
                        <td className="table-head-text list-item-style">File Date</td>
                        <td className="table-head-text list-item-style">State</td>
                        <td className="table-head-text list-item-style">Process Id</td>
                        <td className="table-head-text list-item-style">File Status</td>
                        <td className="table-head-text list-item-style">Remittance File Name</td>
                        <td className="table-head-text list-item-style">Remittance File Date	</td>
                        <td className="table-head-text list-item-style">Received</td>
                        <td className="table-head-text list-item-style">In HiPaaS</td>
                        <td className="table-head-text list-item-style">Error in PreProcess</td>
                        <td className="table-head-text list-item-style">999</td>
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
            this._getCounts()
        }, 50);
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
                            if (event.colDef.headerName == '999' && event.data.F999) {
                                this.goto999(event.data.FileID)
                            }
                            if (event.colDef.headerName == 'Process Id') {
                                this.props.history.push('/' + Strings.ClaimPayment_835_ProcessingSummary, {
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
        this._getCounts()
        this._getCountsNew()
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
                removeSubmitter={true}
                removeGrid={true}
                changeDefault={true}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Payment Audit Summary</h5>
                {this._renderTopbar()}
                {this._renderSummaryDetails()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && !this.state.gridType ? this.renderTransactions() : null}
                </div>
            </div>
        );
    }
}