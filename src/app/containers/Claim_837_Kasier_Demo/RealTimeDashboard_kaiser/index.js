import React from 'react';
import './styles.css';
import '../../Files/files-styles.css';
import { Line } from 'react-chartjs-2';
import '../../color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { PieChart } from '../../../components/PieChart';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';
import { Common_837_Kasier } from '../../../components/Common_837_Kasier';

export class RealTimeDashboard_kaiser extends React.Component {

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
            FunctionalGroupDetails: false,
            selectedFileId: "",
            TransactionSet: false,

        }

        this.showFile = this.showFile.bind(this)

    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
    }

    componentDidMount() {
        this._refreshScreen()
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
            barchart : Claim837RTClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `", RecType: "Outbound") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
            }
            file_piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "FileErrorwise", Type : "` + this.state.type + `", RecType: "Outbound") {
                X_axis
                Y_axis
            }
            piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "Errorwise", Type : "` + this.state.type + `", RecType: "Outbound") {
                X_axis
                Y_axis
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837, {
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
        let subtitle = ''

        if (header == 'Top 10 File Level Errors') {
            addon = '/accept'
            claimStatus = 'Rejected'
            subtitle = 'Rejected Files'
        } else if (header == 'Top 10 Claim Level Errors') {
            addon = '/reject'
            generalStatus = 'Rejected'
            subtitle = 'Rejected Claims'
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
                subtitle: subtitle
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
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Total</a>
                        <a className="nav-item nav-link" id="nav-profile-tab" onClick={() => this.handleSort('I')} data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Institutional</a>
                        <a className="nav-item nav-link" id="nav-contact-tab" onClick={() => this.handleSort('P')} data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Professional</a>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"></div>
                    <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"></div>
                    <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"></div>
                </div>
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

        this.props.history.push('/' + Strings.Claim_Details_837, {
            data: sendData
        })
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
      let  columnDefs= [
            { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "State", field: "State", width: 70 },
            { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "File Status", field: "FileStatus", width: 80 },
            { headerName: "Load Status", field: "Status", width: 80 },
            { headerName: "MCG Status", field: "MCGStatus", width: 100 },
            { headerName: "Sender", field: "Sender", width: 80 },
            // { headerName: "Receiver", field: "Receiver", width: 80 },
            { headerName: "Total Claims", field: "Claimcount", width: 100 },                   
            { headerName: "Rejected Claims", field: "RejectedClaims", flex: 1 },
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            Claim837RTDashboardFileDetails(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},                    
                    Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
                    Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", 
                    FileID: "" ,Type:"${this.state.type}", RecType:"Outbound",
                    LoadStatus:"", MCGStatus:"", Status277CA:"",  Status: ""
            ) {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                FileStatus
                Claimcount
                Receiver
                RejectedClaims
                Status
                State
                MCGStatus
              }
            }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                 <h6 className="font-size">File Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls._transaction837}
                    fieldType={'FileDate'}
                    index={'Claim837RTDashboardFileDetails'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    paginationPageSize={5}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    _refreshScreen = () => {
        this.getData()
        // this._getVolumeAnalyasis()
    }
    _getVolumeAnalyasis = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
    
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            barchart : Claim837RTClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `", RecType: "Outbound") {
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
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837, {
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

             
               

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

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
                setData={this.setData}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
                SubmitterName={true}
            />
        )
    }

    renderCommonGroup = () => {
        return (
            <Common_837_Kasier
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                type={this.state.type}
                selectedTradingPartner={this.state.selectedTradingPartner}
                providerName={this.state.providerName}
                State={this.state.State}
                fileHeader={true}
                claimHeader={true}
            />
        )
    }
    _renderFunctionalGroupDetails() {

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "State", field: "State", width: 70 },
            { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "File Status", field: "FileStatus", width: 80 },
            { headerName: "Load Status", field: "LoadStatus", width: 80 },
            
            { headerName: "MCG Status", field: "MCGLoadStatus", width: 100 },
            { headerName: "Application Sender Code", field: "ApplicationSenderCode", width: 100 },
            { headerName: "Application Receiver Code", field: "ApplicationReceiverCode", width: 150 },
            { headerName: "Functional Identifier Code", field: "FunctionalIdentifierCode", width: 70 },
            { headerName: "Group Control Number", field: "GroupControlNumber", width: 70 },
            { headerName: "Total CLP Count", field: "total_claim", width: 100 },
            { headerName: "Rejected Claims", field: "RejectedClaims", flex:1 },

        ]

        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
    
        let query = `{
            Dashboard837FunctionalGroupDetails(sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
            startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},                    
            Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
            Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", 
            FileID: "${this.state.selectedFileId}" ,Type:"${this.state.type}", RecType:"Outbound",
            LoadStatus:"", MCGStatus:"", Status277CA:"",  Status: "") {
                    RecCount
                    FileID
                    FileName
                    GSID
                    ApplicationReceiverCode
                    ApplicationSenderCode
                    FunctionalIdentifierCode
                    GroupControlNumber
                    Type
                    total_claim
                    RejectedClaims
                    FileStatus
                    State
                   FileDate
                  LoadStatus
                  MCGLoadStatus    
                 }
               }
               `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Functional Group Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls._transaction837}
                    fieldType={'FileDate'}
                    index={'Dashboard837FunctionalGroupDetails'}
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
            { headerName: "State", field: "State", width: 70 },
             { headerName: "File Date", field: "FileDate", width: 100 },
             { headerName: "File Status", field: "FileStatus", width: 80 },
             { headerName: "Load Status", field: "LoadStatus", width: 80 },
             { headerName: "MCG Status", field: "MCGLoadStatus", width: 100 },
            { headerName: "Submitter", field: "Submitter_Name", width: 100 },
            { headerName: "Receiver", field: "Receiver_Name", width: 100 },
             { headerName: "Total Claim", field: "total_claim", width: 150 },
            { headerName: "Rejected Claims", field: "RejectedClaims" , flex:1 },
          

        ]

        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
       
        let query = `{
            Dashboard837TransactionSetHeaderDetails(sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},                    
                    Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
                    Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", 
                    FileID: "${this.state.selectedGSID}" ,Type:"${this.state.type}", RecType:"Outbound",
                    LoadStatus:"", MCGStatus:"", Status277CA:"",  Status: "") {
                        RecCount
                        FileID
                        FileName
                        GSID
                        STID
                        Submitter_Name
                        Receiver_Name
                        total_claim
                        RejectedClaims
                        Submitter_Identification_Code
                        Receiver_Identification_Code
                        FileStatus
                         State
                        FileDate
                       LoadStatus
                       MCGLoadStatus    
                       
                     }
                   }
                   `
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Transaction Set Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls._transaction837}
                    fieldType={'FileDate'}
                    index={'Dashboard837TransactionSetHeaderDetails'}
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

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Submission Dashboard</h5>
                {this._renderTopbar()}
                {this.tab()}
                {this.renderCommonGroup()}
                {this.renderCharts()}
                {this._renderList()}
                {this.state.FunctionalGroupDetails ? this._renderFunctionalGroupDetails() : null}
                 {this.state.TransactionSet ? this._renderTransactionSet() : null}
            </div>
        );
    }
}