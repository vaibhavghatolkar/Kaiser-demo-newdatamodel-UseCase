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

let val = ''
const second_data = {
    labels: [
        'ICD Code not found',
        'Accident Date not present',
        'Member Not Found',
        'Newborn Setup Pending',
        'Provider Setup Pending',
        'Misdirected Claims'
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
};



export class RealTimeDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
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
            rejectedFileCount: 0,
            acceptedFileCount: 0,
            page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            providers: [],
            second_data: {},
            search: '',
            nameRotation: 180,
            typeRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            _statusRotation: 180,
            orderby: "",
            submitterRotation: 180,
            gridType : 0,
            gridflag:'',

            columnDefs: [
                { headerName: "File Name", field: "FileName" },
                { headerName: "Type", field: "Type" },
                { headerName: "File Date", field: "FileDate" },
                { headerName: "File Status", field: "FileStatus" },
                { headerName: "Submitter", field: "Sender" },
                { headerName: "Status", field: "Status" },
                { headerName: "Total Claims", field: "Claimcount" },
                { headerName: "Rejected Claims", field: "Rejected" },
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
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.showFile = this.showFile.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
    }

    componentDidMount() {
        this.getRejectedFile()
        this.getCommonData()
        this.getData()
        this._getCounts()
        this.getListData()
    }

    getRejectedFile = async () => {

        let query = `{
            Claim837RTRejectedFile (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Inbound") {
              TotalRejectedFiles
              TotalAcceptedFiles
            }
        }`

        console.log(query)
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
                console.log(err)
            });
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(RecType :"Inbound", Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`

        console.log(query)
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
                    this.setState({
                        tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    _getCounts = async () => {
        let query = `{
            Claim837RTDashboardCount (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", Type : "` + this.state.type + `", RecType: "Inbound") {
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
                RejectedFileCount
            }
        }`
        console.log(query)
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
                let data = res.data
                let Accepted_per1 = 0
                let rejected_per1 = 0
                let accepted = 0
                let rejected = 0
                let inProgress = 0

                if (data.Claim837RTDashboardCount && data.Claim837RTDashboardCount.length > 0) {
                    summary = [
                        { name: 'Total Accepted Files', value: this.state.acceptedFileCount },
                        { name: 'Total Claims', value: data.Claim837RTDashboardCount[0].TotalClaims ? data.Claim837RTDashboardCount[0].TotalClaims : '' },
                        { name: 'Rejected Files', value: this.state.rejectedFileCount },
                        { name: 'Accepted Claims', value: data.Claim837RTDashboardCount[0].Accepted ? data.Claim837RTDashboardCount[0].Accepted : '' },
                        { name: 'Rejected Claims', value: data.Claim837RTDashboardCount[0].Rejected ? data.Claim837RTDashboardCount[0].Rejected : '' },
                        { name: 'Accepted Percent', value: data.Claim837RTDashboardCount[0].Accepted_Per ? Math.round(data.Claim837RTDashboardCount[0].Accepted_Per * 100) / 100 : '' },
                        { name: 'Rejected Percent', value: data.Claim837RTDashboardCount[0].Rejected_Per ? Math.round(data.Claim837RTDashboardCount[0].Rejected_Per * 100) / 100 : '' },
                    ]
                    Accepted_per1 = data.Claim837RTDashboardCount[0].Accepted_Per
                    rejected_per1 = data.Claim837RTDashboardCount[0].Rejected_Per
                    accepted = data.Claim837RTDashboardCount[0].Accepted
                    rejected = data.Claim837RTDashboardCount[0].Rejected
                    inProgress = data.Claim837RTDashboardCount[0].InProgress
                }

                this.setState({
                    summaryList: summary,
                    Accepted_per: Accepted_per1,
                    rejected_per: rejected_per1,
                    accepted: accepted,
                    rejected: rejected,
                    inProgress: inProgress,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    getData = async () => {
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            barchart : Claim837RTClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
            }
            piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "Errorwise", Type : "` + this.state.type + `", RecType: "Inbound") {
                X_axis
                Y_axis
            }
        }`
        console.log(query)
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
                let pieChart = res.data.piechart
                let claimLabels = []

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
                        ],
                        hoverBackgroundColor: [
                            '#139DC9',
                            '#83D2B4',
                            '#9DC913',
                            '#EC6236',
                            '#C9139D',
                            'blue',
                        ]
                    }]
                }

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data
                })
            })
            .catch(err => {
                console.log(err)
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
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Type", this.state.typeRotation, 'typeRotation')}>Type</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by FileDate", this.state.dateRotation, 'dateRotation')}>File Date</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By FileStatus", this.state.statusRotation, 'statusRotation')}>File Status</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By Sender", this.state.submitterRotation, 'submitterRotation')}>Submitter</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By Status", this.state._statusRotation, '_statusRotation')}>Status</a></td>
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

    renderCharts() {
        return (
            <div className="chart-div">
                {
                    this.state.second_data && this.state.second_data.labels && this.state.second_data.labels.length > 0
                        ?
                        <div className="row chart-container-full chart">
                            <div className="col-9 nopadding">
                                <div className="chart-header">Error Chart</div>
                                {this.state.second_data && this.state.second_data.labels && this.state.second_data.labels.length > 0 ? this.renderValues() : null}
                            </div>
                            <div className="col-3 chart-align">
                                {this.renderChart()}
                            </div>
                        </div> :
                        <div className="chart-container-full chart" style={{ textAlign: 'center' }}>
                            No Data Present
                        </div>
                }
                <div className="row chart-container-full chart">
                    <div className="chart-header">Total Claims</div>
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
            this.getRejectedFile()
            this.getData()
            this._getCounts()
            this.getListData()
        }, 50);
    }

    tab() {
        return (
            <div>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Total Claims</a>
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
                    <td style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}><Link to={{ pathname: '/ClaimDetails837', state: { data: sendData } }}>{d.FileName}</Link></td>
                    <td className="list-item-style">{d.Type}</td>
                    <td className="list-item-style">{moment(d.FileDate).format('MM/DD/YYYY ')}<br />{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className={"list-item-style " + (d.FileStatus == 'Accepted' ? 'green ' : (d.FileStatus == 'FullFileReject' ? 'red ' : (d.FileStatus == 'In Progress' ? 'grey ' : ' ')))}>{d.FileStatus}</td>
                    <td className="list-item-style">{d.Sender}</td>
                    <td className="list-item-style">{d.Status}</td>
                    <td className="list-item-style">{d.Claimcount} | {d.Rejected}</td>
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed', marginTop : '30px' }}>
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

    _renderList() {
        return (
            <div>
                <div className="ag-theme-balham" style={{ height: '430px', padding: '0', marginTop: '24px' }}>
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
                        paginationAutoPageSize={true}
                        pagination={true}
                        onGridReady={this.onGridReady}
                        rowData={this.state.rowData}
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
            Claim837RTDashboardFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.page + ` , OrderBy:"${this.state.orderby}", RecType: "Inbound", GridType:${this.state.gridType}) {
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
            }
        }`
        console.log(query)
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
                console.log(err)
            });
    }

    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this.getRejectedFile()
            this.getData()
            this._getCounts()
            this.getListData()
        })
    }

    handleStartChange(date) {
        this.setState({
            startDate: date
        });
        setTimeout(() => {
            this.getRejectedFile()
            this.getData()
            this._getCounts()
            this.getListData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {
            this.getRejectedFile()
            this.getData()
            this._getCounts()
            this.getListData()
        }, 50);
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.setState({
                [key]: ''
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getRejectedFile()
            this.getData()
            this._getCounts()
            this.getListData()
        }, 50);
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
            let gridflag=''
            let data = []
            if (item.name == 'Accepted Claims') {
                addon = '/accept'
                claimStatus = 'Accepted'
                gridflag="Accepted"
            } else if (item.name == 'Rejected Claims') {
                addon = '/reject'
                claimStatus = 'Rejected'
                gridflag="Rejected"
            } else if (item.name == 'Resubmit Queue') {
                claimStatus = 'Resubmit'
                gridflag= 'Resubmit'
            } else if (item.name == 'Rejected Files') {
                claimStatus = 'RejectedFile'
                gridflag= 'RejectedFile'
            }
            else if (item.name == 'Total Claims') {
               
                gridflag= 'Total Claims'
            }
            else if (item.name == 'Total Accepted Files') {
                   gridflag= 'Total Accepted Files'
            }
             else {
                addon = '/other'
            }
            data = [
                { flag: addon, State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: claimStatus, type: type,gridflag:gridflag },
            ]
            row.push(
                <Tiles
                    isClickable={(item.name == 'Accepted Claims' || item.name == 'Rejected Claims' || item.name == 'Total Claims' || item.name == 'Total Accepted Files' || item.name == 'Resubmit Queue' || item.name == "Rejected Files")}
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    url={'/ClaimDetails837'}
                />

            )
        });

        return (
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    onHandleChange = (e) => {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            getProviders("Inbound", providerName)
                .then(list => {
                    this.setState({
                        providers: list
                    })
                }).catch(error => {
                    console.log(error)
                })
        }, 300);
    }

    onSelected = (value) => {
        this.setState({
            providerName: value
        }, () => {
            this.getRejectedFile()
            this.getData()
            this._getCounts()
            this.getListData()
        })
    }

    renderTopbar = () => {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
                        />
                    </div>

                    <div className="form-group col">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Time Range</div>
                        <select
                            className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                let day = 0
                                let chartType = ''
                                let selected_val = event.target.options[event.target.selectedIndex].text

                                if (selected_val == 'Last week') {
                                    day = 7
                                    chartType = 'Datewise'
                                } else if (selected_val == 'Last 30 days') {
                                    day = 30
                                    chartType = 'Weekwise'
                                } else if (selected_val == 'Last 90 days') {
                                    day = 90
                                } else if (selected_val == 'Last 180 days') {
                                    day = 180
                                } else if (selected_val == 'Last year') {
                                    day = 365
                                }

                                let startDate = moment().subtract(day, 'd').format('YYYY-MM-DD')
                                let endDate = moment().format('YYYY-MM-DD')

                                if (!selected_val) {
                                    startDate = ''
                                    endDate = ''
                                }

                                this.setState({
                                    startDate: startDate,
                                    endDate: endDate,
                                    selected_val: selected_val,
                                    chartType: chartType
                                })

                                setTimeout(() => {
                                    this.getRejectedFile()
                                    this.getData()
                                    this._getCounts()
                                    this.getListData()
                                }, 50);
                            }}
                        >
                            <option value="1">Last week</option>
                            <option value="2">Last 30 days</option>
                            <option value="2">Last 90 days</option>
                            <option value="2">Last 180 days</option>
                            <option selected="selected" value="2">Last year</option>
                        </select>
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={new Date(this.state.startDate)}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={new Date(this.state.endDate)}
                            onChange={this.handleEndChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Grid Type</div>
                        <select className="form-control list-dashboard" id="Grid"
                            onChange={(event) => {
                                this.setState({
                                    page: 1,
                                    rowData : [],
                                    gridType : event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
                                }, () => {
                                    this.getListData()
                                })
                            }}>
                            <option value="select">Default</option>
                            <option value="select">Classic</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }

    renderChart() {
        return (
            <Pie data={this.state.second_data}
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
                width={20}
                height={17} />
        )
    }

    renderValues() {
        let row = []
        let data = this.state.second_data.labels
        let colors = this.state.second_data.datasets[0].backgroundColor
        let count = 0
        data.forEach(item => {
            row.push(
                <div className="row" style={{ paddingLeft: '12px', fontSize: '11px', marginTop: '4px', color: '#8598aa', alignItems: 'center' }}>
                    <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '6px' }}></div><div>{item}</div>
                </div>
            )
            count++
        })
        return (
            <div>
                {row}
            </div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Dashboard</h5>
                {this.renderTopbar()}
                {this.tab()}
                {this._renderSummaryDetails()}
                {this.renderCharts()}
                {this.state.claimsList && this.state.claimsList.length > 0 && this.state.gridType ? this._renderList() : null}
                {this.state.claimsList && this.state.claimsList.length > 0 && !this.state.gridType ? this.renderList() : null}
            </div>
        );
    }
}