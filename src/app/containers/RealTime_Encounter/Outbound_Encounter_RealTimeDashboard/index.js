import React from 'react';
import './styles.css';
import '../../Files/files-styles.css';
import { Pie, Bar } from 'react-chartjs-2';
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
import { StateDropdown } from '../../../components/StateDropdown';
import { AgGridReact } from 'ag-grid-react';
import { PieChart } from '../../../components/PieChart';
import { Filters } from '../../../components/Filters';
import { Tiles } from '../../../components/Tiles';
import { TableTiles } from '../../../components/TableTiles';

let val = ''
const second_data = {
    labels: [
        'ICD Code not found',
        'Accident Date not present',
        'Member Not Found',
        'Newborn Setup Pending',
        'Provider Setup Pending',
        'Misdirected Encounter'
    ],
    datasets: [{
        data: [100, 100, 70, 20, 50, 20],
        backgroundColor: [
            '#139DC9',
            '#83D2B4',
            '#9DC913',
            '#EC6236',
            '#C9139D',
            'blue',
        ],
        hoverBackgroundColor: [
            '#139DC9',
            '#83D2B4',
            '#9DC913',
            '#EC6236',
            '#C9139D',
            'blue',
        ]
    }],
    flag: ''
}

export class Outbound_Encounter_RealTimeDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            batchList: [],
            summaryList: [],
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            State: '',
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            page: 1,
            batch_page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            search: '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            defaultColDef: {

                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
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
      
            rowData: [],
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',

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
        this.getData()
        this.getListData()
    }

    getData() {
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
            EncounterClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `", RecType: "Outbound") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
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
                    summaryList: summary,
                    Accepted_per: Accepted_per1,
                    rejected_per: rejected_per1,
                    ClaimBarChart: array,
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

    updateSearch = search => {
        this.setState({ search });
    };

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style">File Name<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Type<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">File Date<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">File Status<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Sender<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Total Encounter | Error Encounter<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
            </tr>
        )
    }

    getBarData(labelArray, dataArray, color) {
        let bardata = {
            labels: labelArray,
            showFile: false,
            datasets: [
                {
                    label: 'Total Encounter',
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

    renderCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6">
                        <PieChart
                            header={'Top 10 Batch Errors'}
                            piechart_data={second_data}
                        />
                    </div>
                    {/* <div className="chart-container chart">
                    <img src={require('../../../components/Images/chart.png')} style={{ width: '100%', height: '260px', marginLeft: '-2px' }}></img>
                </div> */}
                </div>
            </div>
        )
    }

    handleSort(e) {
        this.setState({
            type: e
        })
        setTimeout(() => {
            this.getData()
            this.getListData()
        }, 50);
    }

    tab() {
        return (
            <div>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Total Encounter</a>
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

    handleBatchPageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            batch_page: page
        }, () => {
            this.getListData()
        })
    }

    renderList() {
        let row = []
        const data = this.state.claimsList;
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type },
        ]
        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ color: "var(--light-blue)" }}><Link to={{ pathname: Strings.Outbound_Encounter_ClaimDetails837, state: { data: sendData } }}>{d.FileName}</Link></td>
                    <td className="list-item-style">{d.Type}</td>
                    <td className="list-item-style">{moment(d.FileDate).format('MM/DD/YYYY, ')}{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className={"list-item-style " + (d.FileStatus == 'Accepted' ? 'green ' : (d.FileStatus == 'FullFileReject' ? 'red ' : (d.FileStatus == 'In Progress' ? 'grey ' : ' ')))}>{d.FileStatus}</td>
                    <td className="list-item-style">{d.Sender}</td>
                    <td className="list-item-style">{d.Claimcount} | {d.Rejected}</td>
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list">
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

    getListData = () => {
        let count = 1
        let batch_count = 1
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            EncounterFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.page + ` , OrderBy:"", RecType: "Outbound") {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                Claimcount
                FileStatus
                Rejected
                Type
            }
            EncounterBatchDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.batch_page + ` , OrderBy:"", RecType: "Outbound") {
                Claimcount
                RecCount
                FileID
                BatchName
                Sender
                BatchStatus
                BatchDate
                Receiver
                Rejected
                Type
                ReadytoSend
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
                if (res && res.data) {

                    if (res.data.EncounterFileDetails && res.data.EncounterFileDetails.length > 0) {

                        count = Math.floor(res.data.EncounterFileDetails[0].RecCount / 10)
                        if (res.data.EncounterFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;
                    }

                    if (res.data.EncounterBatchDetails && res.data.EncounterBatchDetails.length > 0) {
                        batch_count = Math.floor(res.data.EncounterBatchDetails[0].RecCount / 10)
                        if (res.data.EncounterBatchDetails[0].RecCount % 10 > 0) {
                            batch_count = batch_count + 1
                        }
                        this.setState.recount = batch_count;
                    }

                    this.setState({
                        claimsList: res.data.EncounterFileDetails,
                        batchList: res.data.EncounterBatchDetails
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

    MonthsEvent(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {
            this.getData()
        }, 50);
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

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text,
        }, () => {
            this.getData()
            this.getListData()
        })
    }

    renderChart() {
        return (
            <Pie data={second_data}
                options={{
                    elements: {
                        arc: {
                            borderWidth: 0
                        }
                    },
                    legend: {
                        display: false,
                    }
                }}

                width={60}
                height={30} />
        )
    }

    renderBatchTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style">Batch Name<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Type<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Batch Date<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Batch Status<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Sender<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Total Encounter | Errored Encounter<img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
            </tr>
        )
    }

    renderBatch() {
        let row = []
        const data = this.state.batchList;
        let startDate = ""
        let endDate = ""
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type },
        ]

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ color: "var(--light-blue)" }}><Link to={{ pathname: Strings.Outbound_Encounter_BatchDetails837, state: { data: sendData } }}>{d.BatchName}</Link></td>
                    <td className="list-item-style">{d.Type}</td>
                    <td className="list-item-style">{moment(d.BatchDate).format('MM/DD/YYYY, ')}{moment(d.BatchDate).format('hh:mm a')}</td>
                    <td className={"list-item-style " + (d.BatchStatus == 'Accepted' ? 'green ' : (d.BatchStatus == 'FullFileReject' ? 'red ' : (d.BatchStatus == 'In Progress' ? 'grey ' : ' ')))}>{d.BatchStatus}</td>
                    <td className="list-item-style">{d.Sender}</td>
                    <td className="list-item-style">{d.Claimcount} | {d.Rejected}</td>
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list">
                    {this.state.batchList && this.state.batchList.length > 0 ? this.renderBatchTableHeader() : null}
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
                    pageCount={Math.floor(this.state.batchList[0].RecCount / 10) + (this.state.batchList[0].RecCount % 10 > 0 ? 1 : 0)}
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

    renderValues() {
        let row = []
        let data = second_data.labels
        let colors = second_data.datasets[0].backgroundColor
        let count = 0
        data.forEach(item => {
            row.push(
                <div className="row" style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', marginLeft: '24px', color: 'slategrey', alignItems: 'center' }}>
                    <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '12px' }}></div><div>{item}</div>
                </div>
            )
            count++
        })
        return (
            <div style={{ marginTop: '20px' }} className="row">
                {row}
            </div>
        )
    }

    setBatch = () => {
        let batchName = this.state.batchList[0].BatchName
        let query = `mutation{
            SP_EncounterBatchSent(BatchName:"${batchName}")
        }`

        process.env.NODE_ENV == 'development' && console.log(query)
        fetch(Urls.base_url, {
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
                    this.getData()
                    this.getListData()
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderButton = () => {
        return (
            <div className="btnDesign button-resubmit" style={{ width: '96px', marginTop: '12px', marginRight: '20px' }}
                onClick={() => {
                    this.setBatch()
                }}
            >
                Send to State
            </div>
        )
    }

    _renderBatch() {
        let columnDefs = [
            { headerName: "Batch Name", field: "BatchName", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Type", field: "Type", flex: 1 },
            { headerName: "Batch Date", field: "BatchDate", flex: 1 },
            { headerName: "Batch Status", field: "BatchStatus", flex: 1 },
            { headerName: "Sender", field: "Sender", flex: 1 },
            { headerName: "Total Encounter | Errored Encounter", field: "Claimcount", flex: 1 },
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
            { headerName: "File Name", field: "FileName", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Type", field: "Type", flex: 1 },
            { headerName: "File Date", field: "FileDate", flex: 1 },
            { headerName: "File Status", field: "FileStatus", flex: 1 },
            { headerName: "Sender", field: "Sender", flex: 1 },
            { headerName: "Total Encounter | Error Encounter", field: "Claimcount", flex: 1 },
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
                            if (event.colDef.headerName == 'Batch Name') {

                            }
                        }}
                    >
                    </AgGridReact>
                </div>
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

    _refreshScreen = () => {
        this.getData()
        this.getListData()
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
                transaction={"Encounter"}
                removeGrid={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Encounter Dashboard (Outbound)</h5>
                {this._renderTopbar()}
                {this.tab()}
                {this.renderSummaryDetails()}
                {this.renderClaimDetails()}
                {this.renderCharts()}
                <div className="col-10">
                    {this.state.batchList && this.state.batchList.length > 0 ?
                        <div>
                            <div className="row">
                                <h6 style={{ marginTop: '20px', marginLeft: '20px', color: "#424242", flex: 1 }}>Batch status</h6>
                                {this.renderButton()}
                            </div>
                            <hr />
                            {this._renderBatch()}
                            {/* {this.renderBatch()} */}
                        </div>
                        : null}
                    {this.state.claimsList && this.state.claimsList.length > 0 ?
                        <div>
                            <h6 style={{ marginTop: '20px', color: "#424242" }}>Transmission status</h6>
                            <hr />
                            {this._renderList()}
                            {/* {this.renderList()} */}
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}