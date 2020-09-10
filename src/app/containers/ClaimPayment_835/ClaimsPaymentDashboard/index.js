import React from 'react';
import '../../RealTime_837_Claim/RealTimeDashboard/styles.css';
import '../../color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { PieChart } from '../../../components/PieChart';
import { ServersideGrid } from '../../../components/ServersideGrid';
import { Filters } from '../../../components/Filters';
import { Common_835 } from '../../../components/Common_835';

export class ClaimPaymentDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            summaryCount: [],
            totalFiles: [],
            second_data: {},
            pie_data: {},
            complaince_data: {},
            availitySent: '',
            progress_exception: 0,
            TotalException: 0,
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            pielabels: [],
            pievalues: [],
            startDate: moment().subtract(180, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            incoming_fileId: '',
            State: '',
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            ClaimBarChart: [],
            claimLabels: [],
            complience: [],
            Filter_ClaimId: '',
            //////////----------table----
            Organization: '',
            Service_startDate: '',
            Service_endDate: '',
            Sender: '',
            page: 1,
            count: 1,
            orderby: '',
            providerChartLabel: ['Provider Name 1', 'Provider Name 2', 'Provider Name 3', 'Provider Name 4', 'Provider Name 5'],
            providerChartData: [4, 5, 1, 2, 3],
            ErrorChartLabel: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            ErrorChartData: [9, 5, 1, 3, 4, 8, 7, 11, 2, 6, 10, 12],
            EFTData: 0,
            CheckData: 0,
            Rejected: 0,
            Accepted: 0,
            QNXT_Generated: 0,
            Hipaas_Received: 0,
            TotalCountQnxt: 0,
            progress_Validated: 0,
            progress_Error: 0,
            AvailitySent: 0,
            TotalError: 0,
            gridType: 1,
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
            columnDefs: [
                { headerName: "Process Id", field: "ProcessID", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Received Date", field: "FileDate", width: 100 },
                { headerName: "State", field: "State", width: 70 },
                { headerName: "File Status", field: "Status", width: 100 },
                { headerName: "Remittance File Name", field: "RemittanceFileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Remittance Sent Date", field: "RemittanceSentDate", width: 100 },
                { headerName: "Organization", field: "Organization", width: 150 },
                { headerName: "Payment Method", field: "CHECKEFTFlag", width: 70 },
                { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 100 },
                { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 100 },
                { headerName: "Total", field: "TotalClaim", width: 100 },
                { headerName: "Rejected", field: "Rejected", width: 100 },
            ],

        }
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
        setTimeout(() => {

        }, 50);
    }

    componentDidMount() {
        this._refreshScreen()
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

    getProgressData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            ERA835DashboardProgressBar(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                Rejected
                Accepted
                Exception
            } 
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction835, {
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
                let progress_data = res.data.ERA835DashboardProgressBar
                let progress_condition = progress_data && progress_data.length > 0
                let Validated = progress_condition ? Number(progress_data[0].Accepted).toFixed(2) : 0
                let Error = progress_condition ? Number(res.data.ERA835DashboardProgressBar[0].Rejected).toFixed(2) : 0
                let exception = progress_condition ? Number(res.data.ERA835DashboardProgressBar[0].Exception).toFixed(2) : 0

                this.setState({
                    progress_Validated: Validated,
                    progress_Error: Error,
                    progress_exception: exception
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

    _getPieChartData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            file_piechart:Dashboard835PieChart(State:"${this.state.State}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "FileErrorwise", RecType: "Outbound") {
                X_axis
                Y_axis
            }
            CompliancePieChart835(State:"${this.state.State}",StartDt:"${startDate}",EndDt:"${endDate}",RecType:"Outbound") {
                Type
                TotalCount
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction835, {
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
                console.log(res)
                let array = []
                // let ClaimBarChart = res.data.barchart
                let claimLabels = []
                let second_data = res.data.file_piechart && res.data.file_piechart.length > 0 ? this.getPieChartData(res.data.file_piechart) : ''
                // let second_data = ""
                // let pie_data = ""
                let complience = res.data.CompliancePieChart835 ? res.data.CompliancePieChart835 : []
                let complaince_data = res.data.CompliancePieChart835 ? this.getComplianceChartData(res.data.CompliancePieChart835) : {}

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data,
                    complience: complience,
                    complaince_data: complaince_data
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    getComplianceChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.Type)
            pieData.push(d.TotalCount)
        })
        let data = {
            labels: pieLabel,
            datasets: [{
                data: pieData,
                backgroundColor: [
                    '#139DC9',
                    '#daea00',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#daea00',
                ]
            }],
            flag: ''
        }

        return data
    }


    renderPieChart = (header, piechart_data) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let addon = ''
        let claimStatus = ''
        let subtitle = ''
        if (header == 'Top 10 File Level Errors') {
            claimStatus = 'Error'
            subtitle = "Files in Error"
        } else if (header == 'Top 10 Claim Level Errors') {
            addon = '/reject'
        }

        let sendData = [
            {
                flag: addon,
                State: State,
                selectedTradingPartner: selectedTradingPartner,
                startDate: startDate,
                endDate: endDate,
                transactionId: 'n',
                status: claimStatus,
                type: type,
                subtitle: subtitle
            },
        ]

        return (
            <PieChart
                header={header}
                piechart_data={piechart_data}
                data={sendData}
                onClick={header == 'Top 10 File Level Errors' ? this.gotoClaimDetails : ''}
            />
        )
    }

    renderAllPieCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderPieChart('Top 10 File Level Errors', this.state.second_data)}
                    </div>
                    {this.renderCompliance()}
                    {/* <div className="col-6" style={{ padding: '8px' }}>
                        {this.renderPieChart('Top 10 Payment Level Errors', this.state.pie_data)}
                    </div> */}
                </div>
            </div>
        )
    }

    renderCompliance = () => {
        return (
            <div className="col-6" style={{ padding: '6px' }}>
                {this.renderPieChart('Compliance Ratio', this.state.complaince_data)}
            </div>
        )
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

        this.props.history.push('/' + Strings.claimPayment_835_details, {
            data: sendData
        })
    }
    progressBar() {

        let Validated = this.state.progress_Validated + "%"
        let Error = this.state.progress_Error + "%"
        let exception = this.state.progress_exception + "%"
        return (
            <div className="progress">
                {/* <div className="progress-bar" role="progressbar" style={{ width: k }}>Total Sent To Availity ({k})</div> */}
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style={{ width: Validated, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Vaildated (" + Validated + ")"}
                >Vaildated ({Validated})</div>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style={{ width: Error, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Files in Error (" + Error + ")"}
                >Files in Error ({Error})</div>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style={{ width: exception, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Exception (" + exception + ")"}
                >Exception ({exception})</div>
            </div>
        )
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
    clickNavigation = (event) => {
        if (event.colDef.headerName == 'Process Id') {
            this.setState({
                incoming_fileId: event.data.FileID
            }, () => {
                this.gotoClaimDetails()
            })
        }
    }


    _renderList() {
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            Dashboard835FileDetailsNew(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",EndDt: "${endDate}",
            page:1,OrderBy:"${this.state.orderby}" ,Status:"" , FileID:"" ,RecType:"Outbound", 
            AvailitySent:"${this.state.availitySent}", EFTCHK:"",ClaimID:"",
            sorting:[{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
            startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter:${filter}) {
              RecCount
              Sender
              Organization
              FileID
              FileName
              CheckEFTNo
              FileDate
              PayerName
              PayerID
              AccountNo
              CHECKEFTFlag
              CheckEFTDt
              Receiver
              ProcessID
              State
              RemittanceFileName
              RemittanceSentDate
              TotalClaim
              Rejected
              Status
            }
          }
          `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls.transaction835}
                    fieldType={'FileDate'}
                    index={'Dashboard835FileDetailsNew'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    _refreshScreen = () => {
        this._getPieChartData()
        this.getProgressData()
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
                removeSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                changeDefault={true}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}

            />
        )
    }

    renderCommonGroup = () => {
        return (
            <Common_835
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                selectedTradingPartner={this.state.selectedTradingPartner}
                providerName={this.state.providerName}
                State={this.state.State}
                fileHeader={true}
                claimHeader={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText"> Payment Dashboard</h5>
                <div className="row">
                    <div className="col-12">
                        {this._renderTopbar()}
                        {this.state.progress_Validated || this.state.progress_Error || this.state.progress_exception ? this.progressBar() : null}
                        {this.renderCommonGroup()}
                        {this.renderAllPieCharts()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {this._renderList()}
                    </div>
                </div>
            </div>
        );
    }
}
