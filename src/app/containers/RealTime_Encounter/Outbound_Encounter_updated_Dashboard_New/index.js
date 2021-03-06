import React from 'react';
import './styles.css';
import '../../Files/files-styles.css';
import { Pie, Bar, Line } from 'react-chartjs-2';
import '../../color.css'
import moment from 'moment';
// import { Files } from '../../Files';
// import { Topbar } from '../../../components/Topbar';
// import { Files_837 } from '../../Files_837';
// import DatePicker from "react-datepicker";
import ReactPaginate from 'react-paginate';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import Strings from '../../../../helpers/Strings';
import { AutoComplete } from '../../../components/AutoComplete';
import { getProviders } from '../../../../helpers/getDetails';
import { StateDropdown } from '../../../components/StateDropdown';
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { TableTiles } from '../../../components/TableTiles';
import { PieChart } from '../../../components/PieChart';
import { Filters } from '../../../components/Filters';

export class Outbound_Encounter_updated_Dashboard_New extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            batchList: [],
            summaryList: [],
            stage_1: [],
            stage_2: [],
            stage_3: [],
            stage_4: [],
            stage_5: [],
            type: "",
            apiflag: this.props.apiflag,
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            State: '',
            incoming_fileId: '',
            totalFiles: 0,
            LoadingClaims: 0,
            total277CA: 0,
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            rejectedFileCount: 0,
            acceptedFileCount: 0,
            LoadedErrorClaims: 0,
            total_999: 0,
            rejectedCount: 0,
            Accepted_277CA: 0,
            Rejected_277CA: 0,

            X12Count: 0,
            HiPaaSCount: 0,
            Accepted_Claims: 0,
            Rejected_Claims: 0,
            FileReject_Claims: 0,
            Processing_Claims: 0,
            ReconciledError_Claims: 0,

            page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            providers: [],
            second_data: {},
            pie_data: {},
            search: '',
            nameRotation: 180,
            typeRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            _statusRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,
            orderby: "",
            submitterRotation: 180,
            gridType: 1,
            gridflag: '',

            summary_1: [],
            summary_2: [],
            summary_3: [],

            paginationPageSize: 10,
            domLayout: 'autoHeight',
            defaultColDef: {

                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            columnDefs: [
                { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State", width: 70 },
                { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Type", field: "Type", width: 50 },
                { headerName: "File Date", field: "FileDateTime", width: 100 },
                { headerName: "File Status", field: "FileStatus", width: 80 },
                { headerName: "Load Status", field: "Status", width: 80 },
                // { headerName: "MCG Load Status", field: "MCGStatus", width: 100 },
                { headerName: "Submitter", field: "Sender", width: 80 },
                { headerName: "Total Encounters", field: "Claimcount", width: 100 },
                { headerName: "Rejected Encounters", field: "Rejected", flex: 1 },
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

            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
           
        }

        this.showFile = this.showFile.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
    }

    componentDidMount() {
        this._refreshScreen()
    }

    _getTableData = async () => {
        let query = `{
            OutboundDashboardBatchTable {
              TotalBatch
              ValidatedBatch
              ValidatedWithErrorsBatch
              ReadyToSendToState
            }
            OutboundDashboardFileTable {
                TotalEncounterSent
                Accepted999
                Rejected999
                Accepted277CA
                Rejected277CA
            }
          }
          `
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
                let data = res.data.OutboundDashboardBatchTable
                let _data = res.data.OutboundDashboardFileTable
                let condition = data && data.length > 0 ? true : false
                let _condition = _data && _data.length > 0 ? true : false

                let stage_1 = [
                    { 'header': '' },
                    { 'name': 'HiPaaS generated', 'value': condition ? data[0].TotalBatch : 0 },
                ]
                let stage_2 = [
                    { 'header': 'L1-L2 Status' },
                    { 'name': 'Validated', 'value': condition ? data[0].ValidatedBatch : 0, isClick: true },
                    { 'name': 'Error', 'value': condition ? data[0].ValidatedWithErrorsBatch : 0, isClick: true },
                ]
                let stage_3 = [
                    { 'header': '' },
                    { 'name': 'ReadyToSendToState', 'value': condition ? data[0].ReadyToSendToState : 0 },
                ]

                let stage_4 = [
                    { 'header': '' },
                    { 'name': 'Sent', 'value': _condition ? _data[0].TotalEncounterSent : 0 },
                ]
                let stage_5 = [
                    { 'header': '' },
                    { 'name': '999 Accepted', 'value': _condition ? _data[0].Accepted999 : 0 },
                    { 'name': '277CA Accepted', 'value': _condition ? _data[0].Accepted277CA : 0 },
                    { 'name': '277CA Rejected', 'value': _condition ? _data[0].Rejected277CA : 0 },
                ]


                this.setState({
                    stage_1: stage_1,
                    stage_2: stage_2,
                    stage_3: stage_3,
                    stage_4: stage_4,
                    stage_5: stage_5,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    _getCounts = async () => {
        let query = `{
            OutboundDashboardCountReadyForBatch {
              ReadyForBatch
            }
            OutboundDashboardBatchCount {
              TotalBatch
              ValidatedBatch
              ValidatedWithErrorsBatch
            }
            OutboundDashboardFileCount {
                TotalEncounterSent
                Accepted999
                Rejected999
                Accepted277CA
                Rejected277CA
            }
            OutboundResubmit {
                Resubmit
            }
          }
          `
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
                let data = res.data.OutboundDashboardCountReadyForBatch
                let _data = res.data.OutboundDashboardBatchCount
                let _new_data = res.data.OutboundDashboardFileCount
                let condition = data && data.length > 0 ? true : false
                let _condition = _data && _data.length > 0 ? true : false
                let _new_condition = _new_data && _new_data.length > 0 ? true : false
                let resubmit = res.data.OutboundResubmit
                let resubmit_condition = resubmit && resubmit.length > 0 ? true : false

                let summary_1 = [
                    { name: 'Ready For Batch', value: condition ? data[0].ReadyForBatch : 0, onClick: this.onClick },
                    { name: 'Ready To Resubmit Queue', value: resubmit_condition ? resubmit[0].Resubmit : 0 },
                ]

                let summary_2 = [
                    { name: 'Ready For Batch', value: condition ? data[0].ReadyForBatch : 0, onClick: this.onClick },
                    { name: 'Ready To Resubmit Queue', value: resubmit_condition ? resubmit[0].Resubmit : 0 },
                    { name: 'Batches', value: _condition ? _data[0].TotalBatch : 0 },
                    { name: 'Validated', value: _condition ? _data[0].ValidatedBatch : 0 },
                    { name: 'Validated with Errors', value: _condition ? _data[0].ValidatedWithErrorsBatch : 0 },
                ]

                let summary_3 = [
                    { name: 'Files', value: _new_condition ? _new_data[0].TotalEncounterSent : 0 },
                    { name: 'Sent To State', value: _new_condition ? _new_data[0].TotalEncounterSent : 0 },
                    { name: '999 Accepted', value: _new_condition ? _new_data[0].Accepted999 : 0 },
                    { name: '999 Rejected', value: _new_condition ? _new_data[0].Rejected999 : 0 },
                    { name: '277CA Received', value: _new_condition ? _new_data[0].Accepted999 : 0 },
                    // { name: '277CA Rejected', value: _new_condition ? _new_data[0].Rejected277CA : 0 },
                ]

                this.setState({
                    summary_1: summary_1,
                    summary_2: summary_2,
                    summary_3: summary_3,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    getPieChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.X_Axis)
            pieData.push(d.Y_Axis)
        })

        let second_data = {
            labels: pieLabel,
            datasets: [{
                data: pieData,
                backgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DC913',
                    '#EC6236',
                    '#C9139D',
                    'blue',
                    '#5369e7',
                    '#b7bf11',
                    '#8459af',
                    '#cb662c',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DC913',
                    '#EC6236',
                    '#C9139D',
                    'blue',
                    '#5369e7',
                    '#b7bf11',
                    '#8459af',
                    '#cb662c',
                ]
            }]
        }

        return second_data
    }

    getData = async () => {
        let query = `{BatchDetailErrorPieChart {
            X_Axis
            Y_Axis
          }}`
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
                let array = []
                let ClaimBarChart = res.data.BatchDetailErrorPieChart
                let claimLabels = []
                let second_data = this.getPieChartData(res.data.BatchDetailErrorPieChart)
                // let pie_data = this.getPieChartData(res.data.piechart)

                let count = 0
                ClaimBarChart.forEach((d) => {
                    count++;
                    array.push(
                        d.Y_axis ? parseFloat(d.Y_axis) : 0
                    )
                    claimLabels.push(d.X_axis)
                })

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data,
                    // pie_data: pie_data,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    updateSearch = search => {
        this.setState({ search });
    };

    handleToggle = (e, rotation, key) => {
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
            this.getListData()
        }, 50);
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By FileName", this.state.nameRotation, 'nameRotation')}>File Name</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By State", this.state.stateRotation, 'stateRotation')}>State</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By ProcessID", this.state.processIdRotation, 'processIdRotation')}>Process Id</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Type", this.state.typeRotation, 'typeRotation')}>Type</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by FileDate", this.state.dateRotation, 'dateRotation')}>File Date</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By FileStatus", this.state.statusRotation, 'statusRotation')}>File Status</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By Status", this.state._statusRotation, '_statusRotation')}>Load Status</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By MCGStatus", this.state.mcg_statusRotation, 'mcg_statusRotation')}>MCG Load Status</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By Sender", this.state.submitterRotation, 'submitterRotation')}>Submitter</a></td>
                <td className="table-head-text list-item-style">Total Claims | Rejected Claims</td>
            </tr>
        )
    }

    getBarData(labelArray, dataArray, color) {
        let bardata = {
            labels: labelArray,
            showFile: false,
            datasets: [
                {
                    label: 'Total Claims',
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                    hoverBackgroundColor: color,
                    hoverBorderColor: color,
                    data: dataArray
                }
            ],
            legend: {
                display: false
            }
        }

        return bardata
    }

    getLineChart(labelArray, dataArray, color) {
        let _data = {
            labels: labelArray,
            datasets: [
                {
                    label: '',
                    fill: true,
                    cubicInterpolationMode: 'default',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: color,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'round',
                    pointBorderColor: color,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 1,
                    data: dataArray
                }
            ]
        }
        return _data
    }

    renderPieChart = (header, piechart_data) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let addon = ''
        let claimStatus = ''
        let loadStatus = ''
        let generalStatus = ''

        if (header == 'Top 10 File Level Errors') {
            addon = '/accept'
            claimStatus = 'Rejected'
        } else if (header == 'Top 10 Encounter Level Errors') {
            addon = '/reject'
            generalStatus = 'Rejected'
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
                generalStatus: generalStatus
            },
        ]

        return (
            <PieChart
                header={header}
                piechart_data={piechart_data}
                data={sendData}
                onClick={this.gotoClaimDetails}
            />
        )
    }

    renderCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ paddingRight: '5px' }}>
                        {this.renderPieChart('Batch Errors', this.state.second_data)}
                    </div>
                    {/* <div className="col-6" style={{ paddingRight: '9px' }}>
                        {this.renderPieChart('Top 10 Encounter Level Errors', this.state.pie_data)}
                    </div> */}
                </div>
                {/* <div className="row chart-container-full chart">
                    <div className="chart-header">Volume Analysis</div>
                    <Line
                        data={this.getLineChart(this.state.claimLabels, this.state.ClaimBarChart, "#139DC9")}
                        width={20}
                        height={4}
                        options={{
                            legend: {
                                position: 'bottom',
                                display: false
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        fontSize: 10,
                                    },
                                }]
                            }
                        }} />
                </div> */}
            </div>
        )
    }

    createBatch = async () => {
        let query = `mutation{
            CreateBatch
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
                if (res.data.CreateBatch && res.data.CreateBatch.length > 0) {
                    alert(res.data.CreateBatch[0]);
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            }).catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    sendToState = async () => {
        let query = `mutation {
            CreateFile
          }
          `
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
                console.log('This is the response', res)
                if (res.data.CreateFile && res.data.CreateFile.length > 0) {
                    alert(res.data.CreateFile[0]);
                    this._refreshScreen()
                }
            }).catch(err => {
                console.log('This is the error', err)
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    onClick = () => {
        console.log('tile button clicked')
        this.createBatch()
    }

    handlePageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getListData()
        })
    }

    renderList() {
        let row = []
        const data = this.state.claimsList;

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>
                        <a style={{ color: "#6AA2B8", cursor: "pointer" }}
                            onClick={() => {
                                this.setState({
                                    incoming_fileId: d.FileID
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            }}>
                            {d.FileName}
                        </a>
                    </td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style" style={{ wordBreak: 'break-all' }}>{d.ProcessID}</td>
                    <td className="list-item-style">{d.Type}</td>
                    <td className="list-item-style">{moment(d.FileDateTime).format('MM/DD/YYYY ')}<br />{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className={"list-item-style " + (d.FileStatus == 'Accepted' ? 'green ' : (d.FileStatus == 'FullFileReject' ? 'red ' : (d.FileStatus == 'In Progress' ? 'grey ' : ' ')))}>{d.FileStatus}</td>
                    <td className="list-item-style">{d.Status}</td>
                    <td className="list-item-style">{d.MCGStatus}</td>
                    <td className="list-item-style">{d.Sender}</td>
                    <td className="list-item-style">{d.Claimcount} | {d.Rejected}</td>
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed', marginTop: '30px' }}>
                    {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderTableHeader() : null}
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
                    pageCount={Math.floor(this.state.claimsList[0].RecCount / 10) + (this.state.claimsList[0].RecCount % 10 > 0 ? 1 : 0)}
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
        );
    }

    gotoClaimDetails = (data) => {
        let sendData = []
        if (data && data.length > 0) {
            sendData = data
        } else {
            let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
            let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
            let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
            let State = this.state.State ? this.state.State : 'n'
            let type = this.state.type ? this.state.type : ''

            sendData = [
                {
                    flag: '',
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: "",
                    type: type,
                    BatchID: this.state.incoming_fileId,
                    BatchStatus: "",
                    BatchClaimStatus: ""
                },
            ]
        }

        this.props.history.push('/' + Strings.Outbound_Encounter_BatchDetails837, {
            data: sendData
        })
    }

    renderButton = () => {
        return (
            <div className="btnDesign button-resubmit" style={{ width: '96px', marginTop: '12px', marginRight: '20px' }}
                onClick={() => {
                    this.sendToState()
                }}
            >
                Send to State
            </div>
        )
    }

    getListData = async () => {
        let query = `{
            OutboundDashboardFileDetails  (FileID :"" , F99Status :"" ,F277Status:""){
              FileID
              FileName_Outbound
              FileDate_Outbound
              FileStatus_Outbound
              TotalEncounterSent
            }
          }
          `
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
                console.log('Look here', res.data.OutboundDashboardFileDetails)
                this.setState({
                    claimsList: res.data.OutboundDashboardFileDetails
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getBatchListData = async () => {
        let query = `{
            BatchDashboardDetails (BatchID:"",BatchStatus:"",BatchClaimStatus: ""){
              BatchName
              BatchStatus
              BatchDate
              BatchID
              Count
              Error
            }
          }
          `
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
                    batchList: res.data.BatchDashboardDetails
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    _refreshScreen = () => {
        this.getData()
        this._getCounts()
        this._getTableData()
        this.getListData()
        this.getBatchListData()
    }

    _renderSummary_(array) {
        let row = []
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

            let BatchID = ''
            let BatchStatus = ''
            let BatchClaimStatus = ''

            let data = []
            if (item.name == 'Validated') {
                BatchStatus = 'Validated'
            } else if (item.name == 'Validated with Errors') {
                BatchStatus = 'ValidatedWithErrors'
            } else if(item.name == 'Ready To Resubmit Queue'){
                BatchClaimStatus = 'Resubmit'
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

                    BatchID: BatchID,
                    BatchStatus: BatchStatus,
                    BatchClaimStatus: BatchClaimStatus,
                },
            ]

            let geturl = Strings.Outbound_Encounter_BatchDetails837
            row.push(
                <Tiles
                    isenrollment={true}
                    isClickable={item.name == 'Ready For Batch' ? false : true}
                    header_text={item.name}
                    value={item.value}
                    _data={data}
                    url={geturl}
                    onClick={item.onClick ? item.onClick : ''}
                />

            )
        });

        return (
            <div className="row padding-left" style={{ marginLeft: '-14px', marginTop: '16px' }}>
                {row}
            </div>
        )
    }

    _renderSummary(array) {
        let row = []
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

            let BatchID = ''
            let BatchStatus = ''
            let BatchClaimStatus = ''

            let data = []
            if (item.name == 'Validated') {
                BatchStatus = 'Validated'
            } else if (item.name == 'Validated with Errors') {
                BatchStatus = 'ValidatedWithErrors'
            } else if(item.name == 'Ready To Resubmit Queue'){
                BatchClaimStatus = 'Resubmit'
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

                    BatchID: BatchID,
                    BatchStatus: BatchStatus,
                    BatchClaimStatus: BatchClaimStatus,
                },
            ]

            let geturl = Strings.Outbound_Encounter_BatchDetails837
            row.push(
                <Tiles
                    isenrollment={true}
                    isClickable={item.name == 'Ready For Batch' ? false : true}
                    header_text={item.name}
                    value={item.value}
                    _data={data}
                    url={geturl}
                    onClick={item.onClick ? item.onClick : ''}
                />

            )
        });

        return (
            <div className="row padding-left" style={{ marginLeft: '-14px', marginTop: '16px' }}>
                {row}
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

            let BatchID = ''
            let BatchStatus = ''
            let BatchClaimStatus = ''

            if (item.name == 'Validated') {
                BatchClaimStatus = 'Validated'
                color = "var(--green)"
            } else if (item.name == 'Error') {
                BatchClaimStatus = 'Rejected'
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
                    status277CA: status277CA,

                    BatchID: BatchID,
                    BatchStatus: BatchStatus,
                    BatchClaimStatus: BatchClaimStatus,
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Outbound_Encounter_BatchDetails837}
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

    _renderBatch() {
        let columnDefs = [
            { headerName: "Batch Name", field: "BatchName", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Batch Date", field: "BatchDate", flex: 1 },
            { headerName: "Batch Status", field: "BatchStatus", flex: 1 },
            { headerName: "Total Encounter", field: "Count", flex: 1 },
            { headerName: "Errored Encounter", field: "Error", flex: 1 },
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
                        rowData={this.state.batchList}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'Batch Name') {
                                this.setState({
                                    incoming_fileId: event.data.BatchID,
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _renderList() {
        let columnDefs = [
            { headerName: "File Name", field: "FileName_Outbound", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "File Date", field: "FileDate_Outbound", flex: 1 },
            { headerName: "File Status", field: "FileStatus_Outbound", flex: 1 },
            { headerName: "Total Encounter", field: "TotalEncounterSent", flex: 1 },
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
                        rowData={this.state.claimsList}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'File Name') {
                                let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
                                let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
                                let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
                                let State = this.state.State ? this.state.State : 'n'
                                let type = this.state.type ? this.state.type : ''

                                let sendData = [
                                    {
                                        flag: '',
                                        State: State,
                                        selectedTradingPartner: selectedTradingPartner,
                                        startDate: startDate,
                                        endDate: endDate,
                                        status: "",
                                        type: type,
                                        FileID: event.data.FileID,
                                        F99Status: "",
                                        F277Status: ""
                                    },
                                ]

                                this.props.history.push('/' + Strings.Outbound_Encounter_ClaimDetails837, {
                                    data: sendData
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    renderBatchEncounterDetails = () => {
        return (
            <div className="row col-12 nopadding" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(this.state.stage_1)}
                {this._renderClaimTables(this.state.stage_2)}
                {this._renderClaimTables(this.state.stage_3)}
            </div>
        )
    }

    renderEncounterDetails = () => {
        return (
            <div className="row col-8 nopadding" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(this.state.stage_4)}
                {this._renderClaimTables(this.state.stage_5)}
            </div>
        )
    }

    setData = (startDate, endDate, selected_val, chartType) => {
        this.setState({
            startDate,
            endDate,
            selected_val,
            chartType
        }, () => {
            this._refreshScreen()
        })
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            this.getListData()
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
                isTimeRange={true}
                removeSubmitter={true}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                State={'CA'}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Encounter Batch Dashboard (Outbound)</h5>
                {this._renderTopbar()}
                {/* {this._renderSummary_(this.state.summary_1)} */}
                <h6 style={{ marginTop: '20px', color: "#424242", flex: 1 }}>Batch Status</h6>
                {this._renderSummary(this.state.summary_2)}
                <h6 style={{ marginTop: '20px', color: "#424242", flex: 1 }}>Batch Encounter Status</h6>
                {this.renderBatchEncounterDetails()}
                {/* <h6 style={{ marginTop: '20px', color: "#424242", flex: 1 }}>File Status</h6>
                {this._renderSummary(this.state.summary_3)}
                <h6 style={{ marginTop: '20px', color: "#424242", flex: 1 }}>Encounter Status</h6>
                {this.renderEncounterDetails()} */}
                {this.renderCharts()}
                <div>
                    <div className="row">
                        <h6 style={{ marginTop: '20px', marginLeft: '20px', color: "#424242", flex: 1 }}>Batch status</h6>
                        {this.renderButton()}
                    </div>
                    <hr />
                    {this._renderBatch()}
                </div>
                <div>
                    <h6 style={{ marginTop: '20px', color: "#424242" }}>Submission status</h6>
                    <hr />
                    {this._renderList()}
                </div>
            </div>
        );
    }
}