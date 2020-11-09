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
import { Common_Split_835 } from '../../../components/Common_Split_835';
import { Line } from 'react-chartjs-2';
let isOutbound;
export class Payment_Split_Dashboard extends React.Component {

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
            FunctionalGroupDetails: false,
            selectedFileId: "",
            TransactionSet: false,
            selectedGSID: "",
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
            Payee: props.location.state && props.location.state.data[0] && props.location.state.data[0].Payee != 'n' ? props.location.state.data[0].Payee : '',
            Payer: props.location.state && props.location.state.data[0] && props.location.state.data[0].Payer != 'n' ? props.location.state.data[0].Payer : '',
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
        isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
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
        let recType = isOutbound ? 'Outbound' : 'Inbound'

        let query = `{ ERA835DashboardCountNew(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
                TotalCount
                Rejected
                Accepted
                AvailitySent
                Exception
                EFT
                CHK
              }
            }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(isOutbound ? Urls.transaction835 : Urls._transaction835, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let progress_data = res.data.ERA835DashboardCountNew
                let progress_condition = progress_data && progress_data.length > 0
                let Validated = progress_condition ? Number((progress_data[0].Accepted / progress_data[0].TotalCount) * 100).toFixed(2) : 0
                let Error = progress_condition ? Number((progress_data[0].Rejected / progress_data[0].TotalCount) * 100).toFixed(2) : 0
                let exception = progress_condition ? Number((progress_data[0].Exception / progress_data[0].TotalCount) * 100).toFixed(2) : 0

                this.setState({
                    progress_Validated:Validated>=0 ? Validated:0,
                    progress_Error: Error>=0 ? Error:0 ,
                    progress_exception:exception>=0 ? exception :0
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
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            barchart : Payment835RTClaimBarchart (State:"${this.state.State}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "` + chartType + `", RecType: "Split") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
            }
            file_piechart:Dashboard835PieChart(State:"${this.state.State}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "FileErrorwise", RecType: "Split") {
                X_axis
                Y_axis
            }
            CompliancePieChart835(State:"${this.state.State}",StartDt:"${startDate}",EndDt:"${endDate}",RecType:"Split") {
                Type
                TotalCount
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(isOutbound ? Urls.transaction835 : Urls._transaction835, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
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
                let ClaimBarChart = res.data.barchart
                let count = 0
                let claimLabels = []
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
                    Payee: "",
                    Payer: "",
                    clp06List: "",
                    claimIdData: "",
                    CLP01List: "",
                    PatientSubscriberIDList: "",
                    CheckEFTNo: "",
                    checkDate: "",
        
                },
            ]
        }

        this.props.history.push('/' + Strings.InboundPaymentDetails, {
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
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                selectedFileId: event.data.FileID,
                FunctionalGroupDetails: true,
                TransactionSet: false,

            })
        }
    }
    clickNavigation1 = (event) => {
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                selectedGSID: event.data.GSID,
                TransactionSet: true
            })
        }
    }
    clickNavigation2 = (event) => {
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                incoming_fileId: event.data.GSID
            }, () => {
                this.gotoClaimDetails()
            })
        }
    }


    _renderList() {

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "Status", field: "Status", width: 100 },
            { headerName: "Submitter", field: "Sender", width: 150 },
            { headerName: "Receiver", field: "Receiver", width: 70 },
            { headerName: "Total CLP Count", field: "TotalClaim", width: 100 },

        ]



        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
            Dashboard835FileDetailsNew(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",EndDt: "${endDate}",
          Status:"" , FileID:"" ,RecType:"Split",  EFTCHK:"",ClaimID:"",
            sorting:[{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
            startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter:${filter}) {
                RecCount
                Sender
                FileID
                FileName
                FileDate
                Receiver
                State
                RemittanceFileName
                RemittanceSentDate
                TotalClaim
                Status
            }
          }
          `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">File Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    fieldType={'FileDate'}
                    index={'Dashboard835FileDetailsNew'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                    paginationPageSize={5}
                />
            </div>
        )
    }

    _renderFunctionalGroupDetails() {

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Application Sender Code", field: "ApplicationSenderCode", width: 100 },
            { headerName: "Application Receiver Code", field: "ApplicationReceiverCode", width: 150 },
            { headerName: "Functional Identifier Code", field: "FunctionalIdentifierCode", width: 70 },
            { headerName: "Group Control Number", field: "GroupControlNumber", width: 70 },
            { headerName: "Total CLP Count", field: "TotalClaim", width: 100 },

        ]

        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
                Dashboard835FunctionalGroupDetails(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",EndDt: "${endDate}",
                 Status:"" , FileID:"${this.state.selectedFileId}" ,RecType:"Split", 
                 EFTCHK:"",ClaimID:"",
                 sorting:[{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                 startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter:${filter}) {
                    RecCount
                    FileID
                    FileName
                    GSID
                    ApplicationReceiverCode
                    ApplicationSenderCode
                    FunctionalIdentifierCode
                    GroupControlNumber
                    TotalClaim
                 }
               }
               `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Functional Group Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    fieldType={'GSID'}
                    index={'Dashboard835FunctionalGroupDetails'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation1}
                    paginationPageSize={5}
                    selectedFileId={this.state.selectedFileId}
                />
            </div>
        )
    }

    _renderTransactionSet() {

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer'  } },
            { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "Status", field: "Status", width: 100 },
            { headerName: "NPI", field: "PayeeNPI", width: 100 },
            { headerName: "Payee", field: "Organization", width: 150 },
            { headerName: "PayerName", field: "PayerName", width: 150 },
            { headerName: "Payment Method", field: "CHECKEFTFlag", width: 70 },
            { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 100 },
            { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 100 },
            { headerName: "Total Bill Amount", field: "TotalBillAmount", width: 100 },
            { headerName: "Total CLP Count", field: "TotalClaim", width: 100 },

        ]

        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
                    Dashboard835TransactionSetHeaderDetails(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",EndDt: "${endDate}",
                    Status:"" , FileID:"${this.state.selectedGSID}" ,RecType:"Split", EFTCHK:"",ClaimID:"",
                     sorting:[{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                     startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter:${filter} Payer:"",Payee:"",CLP01:"",
                     CLP06:""
                     ,PatientSubscriberID:"",CheckNo:"",CheckDate:"") {
                        RecCount
                        FileId
                        GSID
                        STID
                        PayerName
                        PayerID
                        PayerN1
                        PayeeN1
                        Organization
                        FileName
                        Status
                        FileDate
                        TRN01
                        TRN03
                        CheckEFTNo
                        CheckEFTDt
                        AccountNo
                        CHECKEFTFlag
                        TotalBillAmount
                        TotalClaim
                        PayeeNPI
                     }
                   }
                   `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Transaction Set Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    fieldType={'FileDate'}
                    index={'Dashboard835TransactionSetHeaderDetails'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation2}
                    paginationPageSize={5}
                    selectedFileId={this.state.selectedGSID}
                    handleColWidth={120}
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
            chartType,
            FunctionalGroupDetails: false,
            TransactionSet: false
        }, () => {
            this._refreshScreen()
        })
    }

    update = (key, value) => {
        this.setState({
            [key]: value,
            FunctionalGroupDetails: false,
            TransactionSet: false
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
                removeState={true}

            />
        )
    }
    renderMethod = () => {
        this.setState({
            // PayerNameList:
        }, () => {
            // this.TileShowsApi()
        })


    }

    renderCommonGroup = () => {
        return (
            <Common_Split_835
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
                <h5 className="headerText"> Payment Split Dashboard </h5>
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
                        {this.state.FunctionalGroupDetails ? this._renderFunctionalGroupDetails() : null}
                        {this.state.TransactionSet ? this._renderTransactionSet() : null}
                    </div>
                </div>
            </div>
        );
    }
}
