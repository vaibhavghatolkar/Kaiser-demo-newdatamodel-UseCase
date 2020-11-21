import React from 'react';
import './styles.css';
import '../../Files/files-styles.css';
import { Pie, Bar, Line } from 'react-chartjs-2';
import '../../color.css'
import moment from 'moment';

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
import { ServersideGrid } from '../../../components/ServersideGrid';

export class Outbound_Claim_updated_FileDashboard_Kaiser extends React.Component {

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
            stage_6: [],
            stage_7: [],
            type: "",
            apiflag: this.props.apiflag,
            startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
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
            Paid: 0,
            Denied: 0,
            Payment_Never_Submitted: 0,
            Payment_Adjustment: 0,

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
                { headerName: "File Name", field: "FileName", cellStyle: { 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State", width: 70 },
                { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Type", field: "Type", width: 50 },
                { headerName: "File Date", field: "FileDateTime", width: 100 },
                { headerName: "File Status", field: "FileStatus", width: 80 },
                { headerName: "Load Status", field: "Status", width: 80 },
                // { headerName: "MCG Load Status", field: "MCGStatus", width: 100 },
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
    // OutboundDashboardBatchTable {
    //   TotalBatch
    //   ValidatedBatch
    //   ValidatedWithErrorsBatch
    //   ReadyToSendToState
    // }

    _getTableData = async () => {
        let query = `{
  
            OutboundDashboardFileTable {
                TotalEncounterSent
                Accepted999
                Rejected999
                Accepted277CA
                Rejected277CA
                Resubmit277CA
                Line_Item_Count
            }
            OutboundPaymentDashboard {
                Paid
                Payment_Adjustment
                Payment_Never_Submitted
                Denied
              }
          }
          `
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = ""
                let _data = res.data.OutboundDashboardFileTable
                let _data1 = res.data.OutboundPaymentDashboard
                let condition = data && data.length > 0 ? true : false
                let _condition = _data && _data.length > 0 ? true : false
                let _condition1 = _data1 && _data1.length > 0 ? true : false

                // let stage_1 = [
                //     { 'header': '' },
                //     { 'name': 'HiPaaS generated', 'value': condition ? data[0].TotalBatch : 0 },
                // ]
                // let stage_2 = [
                //     { 'header': '' },
                //     { 'name': 'Validated', 'value': condition ? data[0].ValidatedBatch : 0 },
                //     { 'name': 'Error', 'value': condition ? data[0].ValidatedWithErrorsBatch : 0 },
                // ]
                // let stage_3 = [
                //     { 'header': '' },
                //     { 'name': 'ReadyToSendToState', 'value': condition ? data[0].ReadyToSendToState : 0 },
                // ]

                let stage_4 = [
                    { 'header': '' },
                    { 'name': 'X12 Claim Count', 'value': _condition ? _data[0].TotalEncounterSent : 0, isClick: true },
                    { 'name': 'X12 Claim Line Item Count', 'value': _condition ? _data[0].Line_Item_Count : 0, color: '#139DC9' },
                ]
                let stage_5 = [
                    { 'header': '' },
                    { 'name': '999 Accepted', 'value': _condition ? _data[0].Accepted999 : 0, isClick: true },
                    { 'name': '999 Rejected', 'value': _condition ? _data[0].Rejected999 : 0, isClick: true },
                    // { 'name': '277CA Accepted', 'value': _condition ? _data[0].Accepted277CA : 0, isClick: true },
                    // { 'name': '277CA Rejected', 'value': _condition ? _data[0].Rejected277CA : 0, isClick: true },
                ]

                let stage_6 = [
                    { 'name': '277CA Accepted', 'value': _condition ? _data[0].Accepted277CA : 0, color: '#2AC327' },
                    { 'name': '277CA Rejected', 'value': _condition ? _data[0].Rejected277CA : 0, color: '#FF3B41' },
                    { 'name': 'Resubmit', 'value': _condition ? _data[0].Resubmit277CA : 0, color: '#139DC9' },
                ]
                let stage_7 = [
                    { 'name': 'Paid', 'value': _condition1 ? 77 : 77, color: '#139DC9' },
                    { 'name': 'Denied', 'value': _condition1 ? 0 : 0, color: 'red' },
                    { 'name': 'Exact Match', 'value': _condition1 ? 5 : 5, color: '#139DC9' },
                    { 'name': 'Duplicate', 'value': _condition1 ? 72 : 72, color: 'orange' },
                    // { 'name': 'Payment Adjustment', 'value': _condition1 ? _data1[0].Payment_Adjustment : 0, color: '#FA731A' },
                    // { 'name': 'WIP 0-30', 'value': 500, color: '#139DC9' },
                    // { 'name': 'WIP 30-60', 'value': 350, color: '#139DC9' },
                    // { 'name': 'WIP >60', 'value': 430, color: '#139DC9' },
                ]


                this.setState({
                    // stage_1: stage_1,
                    // stage_2: stage_2,
                    // stage_3: stage_3,
                    stage_4: stage_4,
                    stage_5: stage_5,
                    stage_6: stage_6,
                    stage_7: stage_7,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }


    _getCounts = async () => {
        let query = `{
          
        
            OutboundDashboardFileCount {
                TotalEncounterSent
                Accepted999
                Rejected999
                Accepted277CA
                Rejected277CA
                
            }
          }
          `
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = ""
                let _data = ""
                let _new_data = res.data.OutboundDashboardFileCount
                let condition = data && data.length > 0 ? true : false
                let _condition = _data && _data.length > 0 ? true : false
                let _new_condition = _new_data && _new_data.length > 0 ? true : false

                let summary_1 = [
                    { name: 'Ready For Batch', value: condition ? data[0].ReadyForBatch : 0, onClick: this.onClick },
                    { name: 'Ready To Resubmit Queue', value: 0 },
                ]

                let summary_2 = [
                    { name: 'Batches', value: _condition ? _data[0].TotalBatch : 0 },
                    { name: 'Validated', value: _condition ? _data[0].ValidatedBatch : 0 },
                    { name: 'Validated with Errors', value: _condition ? _data[0].ValidatedWithErrorsBatch : 0 },
                ]

                let summary_3 = [
                    { name: 'Generated 837 Files', value: _new_condition ? _new_data[0].TotalEncounterSent : 0 },
                    { name: 'Sent To Payers', value: _new_condition ? _new_data[0].TotalEncounterSent : 0 },
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
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{OutboundFileRejectionPieChart {
            X_Axis
            Y_Axis
          }
          barchart : Claim837RTClaimBarchart (Sender:"",State:"",Provider:"", StartDt :"${startDate}", EndDt : "${endDate}", ChartType: "Monthwise", Type : "", RecType: "Kaiser") {
            From
            MonthNo
            Year
            To
            Amount
            TotalClaims
            X_axis
            Y_axis
        }
        piechart : Claim837RTClaimBarchart (Sender:"",State:"",Provider:"", StartDt :"${startDate}", EndDt : "${endDate}", ChartType: "Errorwise", Type : "", RecType: "Kaiser") {
            X_axis
            Y_axis
            
        }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
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
                let second_data = this.getPieChartData(res.data.OutboundFileRejectionPieChart)
                let pie_data = this.getPieChartPaymentData(res.data.piechart)

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

        if (header == 'Top 10 Claim Rejected Errors') {
            addon = '/accept'
            claimStatus = 'Rejected'
        } else if (header == 'Top 10 Claim Payment Errors') {

            addon = '/reject'
            claimStatus = 'Rejected'
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

    getPieChartPaymentData = (pieChart) => {
        let pieLabel = []
        let pieData = []

        pieChart.forEach((d) => {
            pieLabel.push(d.X_axis)
            pieData.push(d.Y_axis)
        })

        let pie_data = {
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

        return pie_data
    }

    renderCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    {/* <div className="col-6" style={{ paddingRight: '5px' }}>
                        {this.renderPieChart('Top 10 Claim Rejected Errors', this.state.second_data)}
                    </div> */}
                    <div className="col-6" style={{ paddingRight: '9px' }}>
                        {this.renderPieChart('Top 10 Claim Payment Errors', this.state.pie_data)}
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
          
        })
    }



    gotoClaimDetails = (data) => {
        console.log("data", data)
        let sendData = []
        if (data && data.length > 0) {
            sendData = data
        } else {
            let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
            let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
            let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
            let State = this.state.State ? this.state.State : 'n'
            let type = this.state.type ? this.state.type : ''


        }

        this.props.history.push('/' + Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser, {
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

  

    getBatchListData = async () => {
        let query = `{
            BatchDashboardDetails BatchDashboardDetails (BatchID:"",BatchStatus:"",BatchClaimStatus: ""){
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
        // this.getBatchListData()
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
            let data = []

            let FileID = ''
            let F99Status = ''
            let F277Status = ''
            let url = ''
            let noApiFlag = false

            if (item.name == '999 Accepted') {
                claimStatus = 'Accepted'
                url = Strings.Outbound_Claim_999_response_Kaiser
            } else if (item.name == '999 Rejected') {
                claimStatus = 'Rejected'
                noApiFlag = true
                url = Strings.Outbound_Claim_999_response_Kaiser
            } else if (item.name == '277CA Received') {
                // F99Status = 'Accepted'
                // url = Strings.Outbound_Claim_999_response_Kaiser
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

            let geturl = url ? url : Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser
            row.push(
                <Tiles
                    isClickable={
                        item.name != '277CA Received'
                    }
                    isenrollment={true}
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

            let FileID = ''
            let F99Status = ''
            let F277Status = ''

            if (item.name == 'X12 Claim Count') {
                color = "var(--green)"
            } else if (item.name == '999 Accepted') {
                claimStatus = 'Accepted'
                color = "var(--green)"
            } else if (item.name == '999 Rejected') {
                claimStatus = 'Rejected'
            } else if (item.name == '277CA Accepted') {
                color = "var(--green)"
            } else if (item.name == '277CA Rejected') {
            } else if (item.name == 'Resubmit') {
                color = "var(--green)"
            }
            // else if (item.name == 'X12 Claim Line Item Count') {
            //     color = "var(--blue)"
            // }
            // else if (item.name == 'WIP 30-60') {
            //     color = "var(--blue)"
            // }else if (item.name == 'WIP 0-30') {
            //     color = "var(--blue)"
            // }else if (item.name == 'WIP >60') {
            //     color = "var(--blue)"
            // }else if (item.name == 'Paid') {
            //     color = "var(--green)"
            // }else if (item.name == 'Payment Adjustment') {
            //     color = "var(--orange)"
            // }


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

                    FileID: FileID,
                    F99Status: F99Status,
                    F277Status: F277Status,
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser}
                    data={sendData}
                    color={color}
                    unclick={item.color ? item.color : ''}
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
            { headerName: "Total Claims", field: "Count", flex: 1 },
            { headerName: "Errored Claims", field: "Error", flex: 1 },
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
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'

        let columnDefs = [
            { headerName: "File Name", field: "FileName_Outbound", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            // {
            //     headerName: "State", field: "State", width: 100,
            //     cellRenderer: (data) => {
            //         return "FL"
            //     }
            // },
            { headerName: "Process ID", field: "FileID", flex: 1 },
            { headerName: "File Date", field: "FileDate_Outbound", width: 120 },
            { headerName: "File Status", field: "FileStatus_Outbound", width: 140 },
            // { headerName: "Payer", field: "", flex: 1, cellRenderer: (data) => { return 'Anthem Blue Cross' } },
            { headerName: "Total Claims", field: "TotalEncounterSent", width: 130 },
            { headerName: "Rejected Claims", field: "Rejected_277CA", flex: 1 },
        ]

        let query = `{            
            OutboundClaimsFileDetails(FileID :"", F99Status :"",F277Status:"",MolinaClaimID:""  ClaimID:"" ClaimStatus:""
            sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
            startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter}, 
            ){
                FileID
                FileName_Outbound
                FileDate_Outbound
                FileStatus_Outbound
                TotalEncounterSent
                Rejected_277CA
                RecCount
            }
        }`

        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                {/* <h6 className="font-size">Claims Information For <label style={{ color: 'var(--main-bg-color)' }}>(File Name:-{this.state.Ag_grid_FileName} , File Date:-{this.state.Ag_grid_fileDate})</label></h6> */}
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls._transaction837_kaiser}
                    paginationPageSize={5}
                    index={'OutboundClaimsFileDetails'}
                    State={this.state.State}
                    fieldType={'FileDate_Outbound'}
                    // postData={this.postData}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    type={this.state.type}
                    filterClaim={this.state.Filter_ClaimId}
                    incoming_837fileId={this.state.incoming_837fileId}
                    // selectedFileId={this.state.selectedFileId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                    
                />
            </div>
        )


        // return (
        //     <div>
        //         <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
        //             <AgGridReact
        //                 modules={this.state.modules}
        //                 columnDefs={columnDefs}
        //                 autoGroupColumnDef={this.state.autoGroupColumnDef}
        //                 defaultColDef={this.state.defaultColDef}
        //                 suppressRowClickSelection={true}
        //                 groupSelectsChildren={true}
        //                 debug={true}
        //                 rowSelection={this.state.rowSelection}
        //                 rowGroupPanelShow={this.state.rowGroupPanelShow}
        //                 pivotPanelShow={this.state.pivotPanelShow}
        //                 enableRangeSelection={true}
        //                 paginationAutoPageSize={false}
        //                 pagination={true}
        //                 domLayout={this.state.domLayout}
        //                 paginationPageSize={this.state.paginationPageSize}
        //                 onGridReady={this.onGridReady}
        //                 rowData={this.state.claimsList}
        //                 enableCellTextSelection={true}
        //                 onCellClicked={(event) => {
        //                     if (event.colDef.headerName == 'File Name') {
        //                         let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        //                         let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        //                         let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        //                         let State = this.state.State ? this.state.State : 'n'
        //                         let type = this.state.type ? this.state.type : ''

        //                         let sendData = [
        //                             {
        //                                 flag: '',
        //                                 State: State,
        //                                 selectedTradingPartner: selectedTradingPartner,
        //                                 startDate: startDate,
        //                                 endDate: endDate,
        //                                 status: "",
        //                                 type: type,
        //                                 FileID: event.data.FileID,
        //                                 F99Status: "",
        //                                 F277Status: ""
        //                             },
        //                         ]

        //                         this.props.history.push('/' + Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser, {
        //                             data: sendData
        //                         })
        //                     }
        //                 }}
        //             >
        //             </AgGridReact>
        //         </div>
        //     </div>
        // )
    }

    clickNavigation = (event) => {
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

            this.props.history.push('/' + Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser, {
                data: sendData
            })
        }
    }
    updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
        this.setState({
            fieldType: fieldType,
            sortType: sortType,
            startRow: startRow,
            endRow: endRow,
            filterArray: filterArray,
        })
    }

    renderBatchEncounterDetails = () => {
        return (
            <div className="row col-12 nopadding" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {/* {this._renderClaimTables(this.state.stage_1)}
                {this._renderClaimTables(this.state.stage_2)}
                {this._renderClaimTables(this.state.stage_3)} */}
            </div>
        )
    }

    renderEncounterDetails = () => {
        return (
            <div className="row col-12 nopadding" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(this.state.stage_4)}
                {this._renderClaimTables(this.state.stage_5)}
                {this._renderClaimTables(this.state.stage_6)}
                {this._renderClaimTables(this.state.stage_7)}
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
                // isPayer={true}
                removeSubmitter={true}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
                days90Filter={true}
                removeState={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Submission Dashboard (Outbound)</h5>
                {this._renderTopbar()}
                <h6 style={{ marginTop: '20px', color: "#424242", flex: 1 }}>File Status</h6>
                {this._renderSummary(this.state.summary_3)}
                <h6 style={{ marginTop: '20px', color: "#424242", flex: 1 }}>Claim Status</h6>
                {this.renderEncounterDetails()}
                {this.renderCharts()}
                <div>
                    {this._renderList()}
                </div>
            </div>
        );
    }
}