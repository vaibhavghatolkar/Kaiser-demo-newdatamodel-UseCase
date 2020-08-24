import React from 'react'
import '../../Claims/Dashboard/styles.css'
import './style.css'
import '../../color.css'
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import { Filters } from '../../../components/Filters';
import { PieChart } from '../../../components/PieChart';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { ServersideGrid } from '../../../components/ServersideGrid';
import { Common_270 } from '../../../components/Common_270';

let val = ''
export class RealTime276 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [
                { name: 'TOTAL TRANSACTION', value: 0 },
                { name: 'INVALID TRANSACTIONS', value: 0 },
                { name: 'ERROR PERCENTAGE', value: 0 },
                { name: 'AVG RESPONSE TIME (sec)', value: 0 },
            ],
            showDetails: false,
            files_list: [],
            tradingpartner: [],
            summaryCount: [],
            pieArray: [],
            pieLabels: [],
            tradingChartLabel: [],
            tradingChartData: [],
            providerChartLabel: ['Provider Name 1', 'Provider Name 2', 'Provider Name 3', 'Provider Name 4', 'Provider Name 5'],
            providerChartData: [4, 5, 1, 2, 3],
            dateChartLabel: [],
            dateChartData: [],
            errorPieArray: [],
            errorLabelArray: [],
            errorArray: [],
            inComplaince: '',
            outComplaince: '',
            thisMonth: '',
            lastMonth: '',
            State: '',
            realTimePercent: '',
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            transactionId: '',
            selected_val: '',
            averageResponseTime: '',
            selectedTradingPartner: '',
            progress_valid: 0,
            progress_invalid: 0,
            progress_noResponse: 0,
            incoming_fileId: '',
            noResponsePercent: '',
            second_data: [],
            chartType: 'Monthwise',
            colorArray: [
                'var(--main-bg-color)',
                'var(--cyan-color)'
            ],
            errorColorArray: [
                'var(--main-bg-color)',
                'var(--cyan-color)',
                'var(--hex-color)',
                'var(--pacific-blue-color)',
            ],
            apiflag: Number(this.props.location.state.data[0].apiflag == 1 ? this.props.location.state.data[0].apiflag : 0),
            paginationPageSize: 10,
            domLayout: 'autoHeight',

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
        this.getCommonData = this.getCommonData.bind(this)
    }



    componentDidMount() {
        this._refreshScreen()
    }


    _refreshScreen = () => {
        this.getData()
        this.getCommonData()
    }

    getCommonData = async(chartType) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        chartType = this.state.chartType
        if (!this.state.chartType) {
            chartType = "Monthwise"
        }

        process.env.NODE_ENV == 'development' && console.log('I am here check me out ' + this.state.chartType)
        let query = `{
            datewise : DashboardBarChartData276(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `", ChartType: "` + chartType + `") {
                X_axis
                Y_axis
            }
            ErrorDescriptionPieChart276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                X_Axis
                Y_Axis
            }
        }`


        if (this.state.apiflag == 1) {
            query = `{
                datewise : DashboardBarChartData(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `", ChartType: "` + chartType + `") {
                    X_axis
                    Y_axis
                }
                ErrorDescriptionPieChart(State: "${this.state.State}", Sender: "${this.state.selectedTradingPartner}", StartDt: "${startDate}", EndDt: "${endDate}") {
                    X_Axis
                    Y_Axis
                }
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.transaction270, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    'user-id' : sessionStorage.getItem('user-id'),
'Cache-Control': 'no-cache, no-store',
'Expires': 0,
'Pragma': 'no-cache',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    if (this.state.apiflag == 1) {
                        let pieData = res.data.ErrorDescriptionPieChart
                        let second_data = res.data.ErrorDescriptionPieChart && res.data.ErrorDescriptionPieChart.length > 0 ? this.getPieChartData(pieData) : ''
                        this.setState({
                            second_data: second_data
                        })
                    } else {
                        let pieData = res.data.ErrorDescriptionPieChart276
                        let second_data = res.data.ErrorDescriptionPieChart276 && res.data.ErrorDescriptionPieChart276.length > 0 ? this.getPieChartData(pieData) : ''
                        this.setState({
                            second_data: second_data
                        })
                    }
                    this.performCommonOperations(res, chartType)
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getData = async() => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let url = Urls.transaction270
        let query = `{   ProgressBar276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                Valid_Per
                InValid_Per
                NoResponse_Per
                TotalNumOfReq
                Success
                Error
                Total_NoResponse
            }
        }`

        if (this.state.apiflag == 1) {
            query = `{   ProgressBar270(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                    Valid_Per
                    InValid_Per
                    NoResponse_Per
                    TotalNumOfReq
                    Success
                    Error
                    Total_NoResponse
                } 
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    'user-id' : sessionStorage.getItem('user-id'),
'Cache-Control': 'no-cache, no-store',
'Expires': 0,
'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let progress_data = ""

                if (this.state.apiflag == 1) {
                    progress_data = res.data.ProgressBar270 && res.data.ProgressBar270.length > 0 ? res.data.ProgressBar270 : []
                } else {
                    progress_data = res.data.ProgressBar276
                }

                let progress_condition = progress_data && progress_data.length > 0
                let Valid_Per = progress_condition ? Number(progress_data[0].Valid_Per).toFixed(2) : 0
                let InValid_Per = progress_condition ? Number(progress_data[0].InValid_Per).toFixed(2) : 0
                let NoResponse_Per = progress_condition ? Number(progress_data[0].NoResponse_Per).toFixed(2) : 0

                this.setState({
                    progress_valid: Valid_Per,
                    progress_invalid: InValid_Per,
                    progress_noResponse: NoResponse_Per,
                    noResponsePercent: NoResponse_Per,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    async performCommonOperations(res, flag) {
        let tradingChartData = []
        let tradingChartLabel = []
        let dateChartData = []
        let dateChartLabel = []

        if (res.data.tradingPartnerwise && res.data.tradingPartnerwise.length > 0) {
            res.data.tradingPartnerwise.forEach(item => {
                tradingChartLabel.push(item.X_axis)
                tradingChartData.push(item.Y_axis)
            })
        }

        if (res.data.datewise && res.data.datewise.length > 0) {
            let count = 1
            res.data.datewise.forEach(item => {
                try {
                    if (flag == 'Weekwise') {
                        dateChartLabel.push('week ' + count)
                    } else {
                        dateChartLabel.push(item.X_axis)
                    }
                    dateChartData.push(item.Y_axis)
                } catch (error) { }
                count++
            })
        }

        this.setState({
            tradingChartLabel: tradingChartLabel,
            tradingChartData: tradingChartData,
            dateChartLabel: dateChartLabel,
            dateChartData: dateChartData,
            tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
        })
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
            <div className="row chart-div col-12">
                {
                    this.state.dateChartLabel && this.state.dateChartLabel.length > 0
                        ?
                        <div className="chart-container chart col-12">
                            <div className="chart-header">Volume Analysis</div>
                            <Line
                                data={this.getLineChart(this.state.dateChartLabel, this.state.dateChartData, '#139DC9')}
                                width={100}
                                height={35}
                                options={{
                                    legend: {
                                        display: false,
                                    },
                                }}
                            />
                        </div>
                        :
                        <div className="chart-container-full chart col-12" style={{ textAlign: 'center' }}>
                            No Data Present
                        </div>
                }
            </div>


        )
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
                    '#448dce',
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
                    '#448dce',
                    '#cb662c',
                ]
            }]
        }



        return second_data
    }


    renderPieChart = (header, piechart_data) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''
        let apiflag = this.state.apiflag

        let addon = ''
        let claimStatus = ''
        let subtitle = ''
        if (header == 'Top 10 Transaction Level Errors') {
            claimStatus = 'Fail'
            subtitle = "Invalid Transaction"
        }

        let sendData = [
            {
                flag: addon,
                State: State,
                selectedTradingPartner: selectedTradingPartner,
                startDate: startDate,
                endDate: endDate,
                transactionId: 'n',
                transactionStatus: claimStatus,
                type: type,
                subtitle: subtitle,
                apiflag: apiflag
            },
        ]

        return (
            <PieChart
                header={header}
                piechart_data={piechart_data}
                data={sendData}
                onClick={header == 'Top 10 Transaction Level Errors' ? this.gotoTransactionDetails : ''}
            />
        )
    }

    _renderAllPieCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderPieChart('Top 10 Transaction Level Errors', this.state.second_data)}
                    </div>
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderCharts()}
                    </div>
                </div>
            </div>
        )
    }

    clickNavigation = (event) => {

        if (event.colDef.headerName == 'Transaction Id') {
            this.setState({
                incoming_fileId: event.data.HiPaaSUniqueID
            }, () => {
                this.gotoTransactionDetails()
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

    _renderList() {
        let columnDefs = [
            { headerName: "Transaction Id", field: "Trans_ID", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Transaction Date", field: "Date", flex: 1 },
            { headerName: "Status", field: "Trans_type", flex: 1 },
            { headerName: "Submitter", field: "Submiter", flex: 1 },
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = ''
        let chartQuery = ''
        let passquery = ''
        query = `{
            ClaimRequest_DatewiseNew(TypeID:"" page: 1 State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"" OrderBy:"", HiPaaSUniqueID:""
            ,sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
            startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter},
            TransactionStatus: ""
            ) {
                RecCount
                HiPaaSUniqueID
                Date
                Trans_type
                Submiter
                Trans_ID
                Error_Type
                Error_Code
                ErrorDescription
            }`+ chartQuery + `
        }`

        if (this.state.apiflag == 1) {
            query = `{
                EligibilityAllDtlTypewiseNew(TypeID:"" page: 1  State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"" OrderBy:"", HiPaaSUniqueID:"" 
                ,sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter},
                TransactionStatus: ""
                ) {
                    RecCount
                    HiPaaSUniqueID
                    Date
                    Trans_type
                    Submiter
                    Trans_ID
                    Error_Type
                    Error_Code
                    ErrorDescription
                }`+ chartQuery + `
            }`
        }
        if (this.state.apiflag == 1) {
            passquery = 'EligibilityAllDtlTypewiseNew'
        } else {
            passquery = 'ClaimRequest_DatewiseNew'
        }

        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls.transaction270}
                    fieldType={'Date'}
                    index={passquery}
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

    gotoTransactionDetails = (data) => {

        let sendData = []
        if (data && data.length > 0) {
            sendData = data
        } else {
            let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
            let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
            let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
            let State = this.state.State ? this.state.State : 'n'
            let type = this.state.type ? this.state.type : ''
            let apiflag = this.state.apiflag

            sendData = [
                {
                    flag: '',
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: "",
                    type: type,
                    HiPaaSID: this.state.incoming_fileId,
                    apiflag: apiflag,
                    transactionId: this.state.transactionId
                },
            ]
        }

        let url = ''
        if (this.state.apiflag == 1) {
            url = Strings.ElilgibilityDetails270
        } else {
            url = Strings.ElilgibilityDetails276
        }

        this.props.history.push('/' + url, {
            data: sendData
        })
    }


    progressBar() {

        let valid = this.state.progress_valid + "%"
        let invalid = this.state.progress_invalid + "%"
        let noResponse = this.state.progress_noResponse + "%"

        return (
            <div className="progress">
                {/* <div className="progress-bar" role="progressbar" style={{ width: k }}>Total Sent To Availity ({k})</div> */}
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style={{ width: valid, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Vaild Transaction (" + valid + ")"}
                >Vaild Transaction ({valid})
                </div>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style={{ width: invalid, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Invalid Transaction (" + invalid + ")"}
                >Invalid Transaction ({invalid})
                </div>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style={{ width: noResponse, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"No Response (" + noResponse + ")"}
                >No Response ({noResponse})</div>
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
                isSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                submitter_key={this.state.apiflag == 1 ? "EligibilityStatus" : "ClaimRequest"}
            />
        )
    }

    renderCommonGroup = () => {
        return (
            <Common_270
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                type={this.state.type}
                selectedTradingPartner={this.state.selectedTradingPartner}
                providerName={this.state.providerName}
                State={this.state.State}
                apiflag={this.state.apiflag}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">{this.state.apiflag == 0 ? 'Claim Status Real Time' : 'Eligibility Real Time'}</h5>
                {this._renderTopbar()}
                {this.progressBar()}
                {this.renderCommonGroup()}
                {this._renderAllPieCharts()}
                {this._renderList()}
            </div>
        );
    }
}