import React from 'react';
import './styles.css';
import '../../Files/files-styles.css';
import { Pie, Bar, Line } from 'react-chartjs-2';
import '../../color.css'
import moment from 'moment';
import { Files } from '../../Files';
import { Topbar } from '../../../components/Topbar';
import { Files_837 } from '../../Files_837';
import DatePicker from "react-datepicker";
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

export class RealTimeDashboard_New extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
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
                { headerName: "MCG Load Status", field: "MCGStatus", width: 100 },
                { headerName: "Submitter", field: "Sender", width: 80 },
                { headerName: "Total Claims", field: "Claimcount", width: 100 },
                { headerName: "Rejected Claims", field: "Rejected", flex: 1 },
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

            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
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

    getClaimCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Claim837RTDashboardCountClaimStatus(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Inbound") {
                X12Count
                HiPaaSCount
                MCGLoadCount
            }
            Claim837RTDashboardTable(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Inbound") {
                Accepted_Claims
                Rejected_Claims
                FileReject_Claims
                Processing_Claims
                ReconciledError_Claims
                LoadingClaims
                LoadedErrorClaims
                Accepted_277CA
                Rejected_277CA
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.common_data, {
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
                        X12Count: data ? data.X12Count : 0,
                        HiPaaSCount: data ? data.HiPaaSCount : 0,
                        LoadingClaims: _data ? _data.LoadingClaims : 0,
                        Accepted_Claims: _data ? _data.Accepted_Claims : 0,
                        Rejected_Claims: _data ? _data.Rejected_Claims : 0,
                        FileReject_Claims: _data ? _data.FileReject_Claims : 0,
                        Processing_Claims: _data ? _data.Processing_Claims : 0,
                        ReconciledError_Claims: _data ? _data.ReconciledError_Claims : 0,
                        LoadedErrorClaims: _data ? _data.LoadedErrorClaims : 0,
                        Accepted_277CA: _data ? _data.Accepted_277CA : 0,
                        Rejected_277CA: _data ? _data.Rejected_277CA : 0,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getRejectedFile = async () => {

        let query = `{
            Claim837RTRejectedFile (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Inbound") {
              TotalRejectedFiles
              TotalAcceptedFiles
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.common_data, {
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
                    let data = res.data
                    this.setState({
                        rejectedFileCount: data.Claim837RTRejectedFile[0].TotalRejectedFiles ? data.Claim837RTRejectedFile[0].TotalRejectedFiles : '',
                        acceptedFileCount: data.Claim837RTRejectedFile[0].TotalAcceptedFiles ? data.Claim837RTRejectedFile[0].TotalAcceptedFiles : '',
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
                    { name: '999', value: this.state.total_999 },
                    { name: 'Reconciled Files | Error', value: reconciled, second_val: reconciledError },
                    // { name: 'Reconciled Error', value: reconciledError },
                    { name: 'Load in MCG | Error', value: loaded, second_val: loadedError },
                    // { name: 'Load Error', value: loadedError,  },
                    // { name: 'Load in MCG', value: loaded },
                    { name: 'HiPaaS | MCG', value: processing, second_val: MCGLoadingFiles },
                    { name: '277CA', value: this.state.total277CA },
                ]

                this.setState({
                    summaryList: summary,
                    rejectedCount: rejected,
                    totalFiles: totalCount
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
            pieLabel.push(d.X_axis)
            pieData.push(d.Y_axis)
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
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            barchart : Claim837RTClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
            }
            file_piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "FileErrorwise", Type : "` + this.state.type + `", RecType: "Inbound") {
                X_axis
                Y_axis
            }
            piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "Errorwise", Type : "` + this.state.type + `", RecType: "Inbound") {
                X_axis
                Y_axis
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
                let array = []
                let ClaimBarChart = res.data.barchart
                let claimLabels = []
                let second_data = this.getPieChartData(res.data.file_piechart)
                let pie_data = this.getPieChartData(res.data.piechart)

                let count = 0
                ClaimBarChart.forEach((d) => {
                    count++;
                    array.push(
                        d.Y_axis ? parseFloat(d.Y_axis) : 0
                    )
                    if (chartType == 'Weekwise') {
                        claimLabels.push('week' + count)
                    } else {
                        claimLabels.push(d.X_axis)
                    }
                })

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data,
                    pie_data: pie_data,
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
        } else if (header == 'Top 10 Claim Level Errors') {
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
                        {this.renderPieChart('Top 10 File Level Errors', this.state.second_data)}
                    </div>
                    <div className="col-6" style={{ paddingRight: '9px' }}>
                        {this.renderPieChart('Top 10 Claim Level Errors', this.state.pie_data)}
                    </div>
                </div>
                <div className="row chart-container-full chart">
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
                </div>
            </div>
        )
    }

    handleSort(e) {
        this.setState({
            type: e
        })
        setTimeout(() => {
            this._refreshScreen()
        }, 50);
    }

    tab() {
        return (
            <div style={{ marginLeft: '2px' }}>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Total</a>
                        <a class="nav-item nav-link" id="nav-profile-tab" onClick={() => this.handleSort('I')} data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Institutional</a>
                        <a class="nav-item nav-link" id="nav-contact-tab" onClick={() => this.handleSort('P')} data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Professional</a>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"></div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"></div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"></div>
                </div>
            </div>
        )
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
                    incoming_fileId: this.state.incoming_fileId,

                },
            ]
        }

        this.props.history.push('/' + Strings.Claim_Details_837_Grid, {
            data: sendData
        })
    }

    _renderList() {
        return (
            <div>
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
                            if (event.colDef.headerName == 'File Name') {
                                this.setState({
                                    incoming_fileId: event.data.FileID
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

    getListData = () => {
        let count = 1
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            Claim837RTDashboardFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.page + ` , OrderBy:"${this.state.orderby}", RecType: "Inbound", GridType:${this.state.gridType}, LoadStatus:"", Status:"", MCGStatus:"", FileID: "", Status277CA:"") {
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
                MCGStatus
                FileDateTime
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.real_time_claim_details, {
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
                        claimsList: res.data.Claim837RTDashboardFileDetails,
                        rowData: this.state.gridType == 1 ? res.data.Claim837RTDashboardFileDetails : []
                    })
                }
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
        this._get999Count()
        this.getRejectedFile()
        this.getClaimCounts()
        this.getData()
        this._getCounts()
        this.getListData()
    }

    _get999Count = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
              Total999
              NotSent999
            }
            Total277CAResponse(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
                Total277CA
                NotSent277CA
            }
         }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.claims_837, {
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
            } else if (notSent == 'CA') {
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
                <h5 className="headerText">Claims Dashboard</h5>
                {this._renderTopbar()}
                {this.tab()}
                <div className="general-header" style={{ marginBottom: "-6px" }}>File Status</div>
                {this._renderSummaryDetails()}
                <div className="general-header">Claim Status</div>
                {this.renderClaimDetails()}
                {this.renderCharts()}
                {this.state.claimsList && this.state.claimsList.length > 0 && this.state.gridType ? this._renderList() : null}
                {this.state.claimsList && this.state.claimsList.length > 0 && !this.state.gridType ? this.renderList() : null}
            </div>
        );
    }
}