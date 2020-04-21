import React from 'react'
import '../../Claims/Dashboard/styles.css'
import './style.css'
import '../../color.css'
import { Pie, Bar, Line } from 'react-chartjs-2';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { EligibilityDetails } from '../../EligibilityDetails';
import Strings from '../../../../helpers/Strings';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Images from '../../../../theme/Images';
import { StateDropdown } from '../../../components/StateDropdown';
import { Filters } from '../../../components/Filters';
import { TableTiles } from '../../../components/TableTiles';
import { PieChart } from '../../../components/PieChart';
import { AgGridReact } from 'ag-grid-react';
import { Tiles } from '../../../components/Tiles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

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
            progress_valid : 0,
            progress_invalid : 0,
            progress_noResponse : 0,
            incoming_fileId:'',
            noResponsePercent: '',
            second_data: [],
            chartType: this.props.location.state.data[0].apiflag == 1 ? 'Eligibilitymonthwise' : 'ClaimRequestMonthwise',
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
                editable: false,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
             
        }

        this.getData = this.getData.bind(this)
        this.getCommonData = this.getCommonData.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }



    componentDidMount() {
        this.getData()
        this.getCommonData()
        this.getTransactions()
    }


    _refreshScreen = () => {
        this.getData()
        this.getCommonData()
        this.getTransactions()
    }

    getCommonData(chartType) {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        chartType = this.state.chartType
        if (!this.state.chartType && this.state.apiflag == 1) {
            chartType = "Eligibilitymonthwise"
        } else if (!this.state.chartType && this.state.apiflag == 0) {
            chartType = "ClaimRequestMonthwise"
        }
        process.env.NODE_ENV == 'development' && console.log('I am here check me out ' + this.state.chartType)

        let query = `{
            Trading_PartnerList(RecType :"Inbound", Transaction:"ClaimRequest") {
                Trading_Partner_Name 
            }
            tradingPartnerwise : DashboardBarChartData276(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `", ChartType: "ClaimRequestTradingPartner") {
                X_axis
                Y_axis
            }
            datewise : DashboardBarChartData276(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `", ChartType: "` + chartType + `") {
                X_axis
                Y_axis
            }
        }`


        if (this.state.apiflag == 1) {
            query = `{
                Trading_PartnerList(RecType :"Inbound", Transaction:"EligibilityStatus") {
                    Trading_Partner_Name 
                }
                tradingPartnerwise : DashboardBarChartData(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `", ChartType: "EligibilityTradingPartner") {
                    X_axis
                    Y_axis
                }
                datewise : DashboardBarChartData(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `", ChartType: "` + chartType + `") {
                    X_axis
                    Y_axis
                }
                ErrorDescriptionPieChart(State: "", Sender: "", StartDt: "", EndDt: "") {
                    ErrorDescription
                    Transactions
                }
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.transaction270, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => { 
                    if(this.state.apiflag == 1){
                    let pieData = res.data.ErrorDescriptionPieChart
                    let second_data = res.data.ErrorDescriptionPieChart && res.data.ErrorDescriptionPieChart.length > 0 ? this.getPieChartData(pieData): ''
                    this.setState({
                        second_data: second_data
                    })
                    }
                
                if (res.data) {
                    this.performCommonOperations(res, chartType)
                    
                }
               
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getData(chartType) {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let url = Urls.transaction270
        let query = `{
            ClaimRequest276(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `") {
                AvgResTime
                TotalNumOfReq
                Success
                Error
                Daily_Volume
                LastMonth_Volume
                ThisMonth_Volume
                In_Compliance
                out_of_Compliance
                Error_Per
                In_Compliance_Per
                out_of_Compliance_per
                NoResponse_Per
                RealTime_Per
                Invalid_Trans
                Total_Paid
                Total_NoResponse
            }
            ClaimStatuswiseCount(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `") {
                ClaimStatus
                Total
            }
            ProgressBar276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                Valid_Per
                InValid_Per
                NoResponse_Per
              }
        }`


        if (this.state.apiflag == 1) {
            url = Urls.transaction270
            query = `{
                Eligibilty270(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `") {
                    AvgResTime
                    TotalNumOfReq
                    Success
                    Error
                    Daily_Volume
                    LastMonth_Volume
                    ThisMonth_Volume
                    In_Compliance
                    out_of_Compliance
                    Error_Per
                    In_Compliance_Per
                    out_of_Compliance_per
                    NoResponse_Per
                    RealTime_Per
                    Invalid_Trans
                    Total_NoResponse
                }
                Eligibilty271ErrorwiseCount(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"") {
                    ErrorType
                    RecCount
                    Percentage
                }
                ProgressBar270(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                    Valid_Per
                    InValid_Per
                    NoResponse_Per
                  }
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
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
                let progress_data=""
                if (this.state.apiflag == 1) {
                    data = res.data.Eligibilty270[0]
                    progress_data= res.data.ProgressBar270
                }else{
                    data = res.data.ClaimRequest276[0]
                    progress_data= res.data.ProgressBar276
                }
                if (res.data) {
                    this.performOperations(res, chartType)
                }
                
                let progress_condition= progress_data && progress_data.length > 0
                let Valid_Per = progress_condition ? Number(progress_data[0].Valid_Per).toFixed(2) : 0
                let InValid_Per = progress_condition ? Number(progress_data[0].InValid_Per).toFixed(2) : 0
                let NoResponse_Per =progress_condition ? Number(progress_data[0].NoResponse_Per).toFixed(2) : 0

               let summary = [
                    { name: 'Total Transaction', value: data.TotalNumOfReq },
                    { name: 'Valid Transaction', value: data.Success },
                    { name: 'Invalid Transaction', value: data.Error },
                    { name: 'No Response', value: data.Total_NoResponse },
                    { name: 'Avg Response Time (sec)', value: data.AvgResTime },
                    // { name: 'Error Percentage', value: data.EFT },
                ]

                this.setState({
                    summaryCount: summary,
                    progress_valid : Valid_Per,
                    progress_invalid : InValid_Per,
                    progress_noResponse : NoResponse_Per,
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
                    if (flag == 'Eligibilityweekwise' || flag == 'ClaimRequestweekwise') {
                        dateChartLabel.push('week ' + count)
                    } else if (flag == 'EligibilityDatewise' || flag == 'ClaimRequestDatewise') {
                        dateChartLabel.push(item.X_axis)
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

    async performOperations(res, flag) {
        let data = []
        let errorPieArray = []
        let errorLabelArray = []

        if (this.state.apiflag == 1) {
            data = res.data.Eligibilty270[0]
        } else {
            data = res.data.ClaimRequest276[0]
        }
        process.env.NODE_ENV == 'development' && console.log("asdad", data)
        let summary = [
            { name: 'TOTAL TRANSACTION', value: data.TotalNumOfReq },
            { name: 'INVALID TRANSACTIONS', value: data.Invalid_Trans },
            { name: 'ERROR PERCENTAGE', value: data.Error_Per },
            { name: 'AVG RESPONSE TIME (sec)', value: data.AvgResTime },
        ]

        if (this.state.apiflag == 0) {
            summary.push({ name: 'TOTAL PAID', value: data.Total_Paid })
        }

        let pieArray = []
        pieArray.push(data.Success)
        pieArray.push(data.Error)

        let pieLabels = []
        pieLabels.push("Success")
        pieLabels.push("Error")

        let errorArray = []
        if (res.data.Eligibilty271ErrorwiseCount && res.data.Eligibilty271ErrorwiseCount.length > 0 && this.state.apiflag == 1) {
            errorArray = res.data.Eligibilty271ErrorwiseCount
            res.data.Eligibilty271ErrorwiseCount.forEach(item => {
                errorPieArray.push(item.RecCount)
                errorLabelArray.push(item.ErrorType)
                errorLabelArray.push(item.Percentage)
            })
        } else if (res.data.ClaimStatuswiseCount && res.data.ClaimStatuswiseCount.length > 0) {
            errorArray = res.data.ClaimStatuswiseCount
            res.data.ClaimStatuswiseCount.forEach(item => {
                errorPieArray.push(item.Total)
                errorLabelArray.push(item.ClaimStatus)
            })
        }

        this.setState({
            summaryList: summary,
            pieArray: pieArray,
            pieLabels: pieLabels,
            errorPieArray: errorPieArray,
            errorLabelArray: errorLabelArray,
            inComplaince: data.In_Compliance_Per,
            outComplaince: data.out_of_Compliance_per,
            thisMonth: data.ThisMonth_Volume,
            lastMonth: data.LastMonth_Volume,
            averageResponseTime: data.AvgResTime,
            noResponsePercent: data.NoResponse_Per,
            errorCount: data.Error,
            errorArray: errorArray,
            realTimePercent: data.RealTime_Per
        })
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search Claim" />
            </div>
        )
    }

    getBarData(labelArray, dataArray, color) {
        let bardata = {
            labels: labelArray,
            showFile: false,
            datasets: [
                {
                    label: 'Total Transactions',
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

    getPieData(array, labels, colorArray) {
        const data = {
            labels: [
                'Completed',
                'Errored'
            ],
            datasets: [{
                data: [95, 5],
                backgroundColor: [
                    '#139DC9',
                    '#83D2B4'
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#83D2B4'
                ]
            }],
            flag: ''
        };

        return data
    }

    handleSort(e) {
        this.setState({
            type: e
        })
    }

    renderTabs(flag) {
        return (
            <nav>
                {
                    flag ?
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">

                        </div>
                        :
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('Submitter')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Submitter (top 5)</a>
                            <a class="nav-item nav-link" id="nav-profile-tab" onClick={() => this.handleSort('Provider')} data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Provider (top 5)</a>
                        </div>
                }
            </nav>
        )
    }

    renderPieChart() {
        return (
            <div className="row chart">
                <div className="col-6" style={{ paddingTop: "0px" }}>
                    <Pie data={this.getPieData}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0
                                }
                            },
                            legend: {
                                position: 'bottom'
                            },
                            tooltips: {
                                enabled: false
                            },
                            pieceLabel: {
                                render: 'label',
                                position: 'outside'
                            },
                            responsive: true,
                            legend: {
                                position: 'bottom',
                                display: 'false'
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            }
                        }}
                        width={200}
                        height={200} />
                </div>
            </div>
        );
    }

    dateviewtabledata() {
        return (
            <div className="container">
                <div className="panel-group">
                    <div className="panel panel-default">
                        <div className="panel-heading collapsible small-padding" style={{ background: "#139DC9", }} href="#BasicX12Options">
                            <span className="panel-title" style={{ color: "white", fontSize: "14px" }}>
                                2020
       </span>
                        </div>
                        <div id="BasicX12Options small-padding"   > <div className=" content">
                            <div className="panel-heading collapsible small-padding" data-toggle="collapse" href="#ISAIdentificationOptions1">
                                <span className="panel-title" style={{ fontSize: "14px" }}>
                                    February
                       </span>
                            </div>
                            <div id="ISAIdentificationOptions1" className="panel-collapse content collapse">
                                <div className="panel-body">
                                    <br />
                                    <table id="datewise_data">
                                        <thead class="thead-dark" style={{ color: "black" }}>
                                            <tr>
                                                <th scope="col">Date</th>
                                                <th scope="col">AVG RESPONSE TIME (sec)</th>
                                                <th scope="col">Total request count</th>
                                                <th scope="col">Total success rate</th>
                                                <th scope="col">Total error rate</th>
                                            </tr>
                                        </thead>
                                        <tr>
                                            <td >1 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >2 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >3 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >4 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >5 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >6 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >7 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >8 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >9 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >10 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >11 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >12 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >13 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >14 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >15 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >16 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >17 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >18 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >19 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >20 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >21 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >22 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >23 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >24 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >25 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >26 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >27 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >28 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >29 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div className="panel-heading collapsible" data-toggle="collapse" href="#ISAIdentificationOptions">
                                <span className="panel-title" style={{ fontSize: "14px" }}>
                                    January
                       </span>
                            </div>
                            <div id="ISAIdentificationOptions" className="panel-collapse content collapse">
                                <div className="panel-body">
                                    <br />
                                    <table id="datewise_data" >

                                        <thead class="thead-dark" style={{ color: "black" }}>
                                            <tr>
                                                <th scope="col">Date</th>
                                                <th scope="col">AVG RESPONSE TIME (sec)</th>
                                                <th scope="col">Total request count</th>
                                                <th scope="col">Total success rate</th>
                                                <th scope="col">Total error rate</th>
                                            </tr>
                                        </thead>
                                        <tr>
                                            <td >1 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >2 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >3 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >4 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >5 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >6 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >7 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >8 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >9 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >10 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>

                                        <tr>
                                            <td >11 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >12 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >13 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >14 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >15 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >16 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >17 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >18 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >19 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >20 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >21 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >22 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >23 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >24 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >25 Sat 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >26 Sun 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >27 Mon 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >28 Tue 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >29 Wed 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >30 Thu 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <td >31 Fri 2020</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>

                                    </table>
                                </div>
                            </div>

                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    renderCharts() {
        let minimumValue = Math.min(...this.state.dateChartData)
        minimumValue = (minimumValue == 0 ? 0 : (minimumValue - (minimumValue * 10 / 100)))
        minimumValue = Math.ceil(minimumValue)
        return (
            <div>
                <div className="row chart-div">
                   
                    {
                        this.state.dateChartLabel && this.state.dateChartLabel.length > 0
                            ?
                            <div className="chart-container chart col-11">
                                {/* {this.renderTabs(1)} */}
                                {/* <label className="chart-header">Real - Time Volume {this.state.selected_val ? '(' + this.state.selected_val + ')': '(Monthly)'}</label> */}
                                {/* <Bar
                                    data={this.getBarData(this.state.dateChartLabel, this.state.dateChartData, '#83D3B4')}
                                    width={100}
                                    height={60}
                                    options={{
                                        legend: {
                                            display: false,
                                        },
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    min: minimumValue,
                                                    userCallback: function (label, index, labels) {
                                                        // when the floored value is the same as the value we have a whole number
                                                        if (Math.floor(label) === label) {
                                                            return label;
                                                        }

                                                    }
                                                }
                                            }]
                                        }
                                    }} /> */}
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
                                {/* <img src={require('../../../components/Images/chart.png')} style={{ width: '100%', marginLeft: '-2px' }}></img> */}
                            </div> : null
                    }
                    
                </div>
                    
            </div>
        )
    }
    getPieChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.ErrorDescription)
            pieData.push(d.Transactions)
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
        let loadStatus = ''
        let generalStatus = ''
        let subtitle = ''
        if (header == 'Top 10 File Level Errors') {
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
                apiflag : apiflag
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






    gotoRealTimeTransactions(key) {
        this.setState({
            key: key
        })
    }

    showDetails() {
        this.setState({
            showDetails: true
        })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    handleStartChange(date) {
        this.setState({
            startDate: date
        });
        setTimeout(() => {
            this.getCommonData()
            this.getData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {
            this.getCommonData()
            this.getData()
        }, 50);
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Submitter') {
            this.setState({
                [key]: ''
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getCommonData()
            this.getData()
        }, 50);
    }

    onHandleChange(e, flag) {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            if (flag) {
                this.setState({
                    selectedTradingPartner: providerName
                }, () => {
                    this.getCommonData()
                    this.getData()
                })
            } else {
                this.setState({
                    providerName: providerName
                }, () => {
                    this.getCommonData()
                    this.getData()
                })
            }
        }, 300);
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this.getCommonData()
            this.getData()
        })
    }

    renderTopbar() {
        return (
            <form className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-3">
                        <div className="list-dashboard">Time Range</div>
                        <select
                            className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                let day = 0
                                let chartType = ''
                                let selected_val = event.target.options[event.target.selectedIndex].text

                                if (selected_val == 'Last week') {
                                    day = 7
                                    chartType = this.state.apiflag == 1 ? 'EligibilityDatewise' : 'ClaimRequestDatewise'
                                } else if (selected_val == 'Last 30 days') {
                                    day = 30
                                    chartType = this.state.apiflag == 1 ? 'Eligibilityweekwise' : 'ClaimRequestweekwise'
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
                                    this.getCommonData(chartType)
                                    this.getData(chartType)
                                }, 50);
                            }}
                        >
                            <option value="2">Last week</option>
                            <option value="2">Last 30 days</option>
                            <option value="2">Last 90 days</option>
                            <option value="2">Last 180 days</option>
                            <option value="1">Last year</option>
                            <option value="2">Last 2 years</option>
                            <option value="2">Last 3 years</option>
                            <option selected="selected" value="2">All</option>
                        </select>
                    </div>
                    <div className="form-group col-3">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>

                    <div className="form-group col-3">
                        <div className="list-dashboard">
                            Submitter
                        </div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}
                        >
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                    <div className="form-group col-3">
                        <div className="list-dashboard">
                            Provider Name

                        </div>
                        <select className="form-control list-dashboard">
                            <option value=""></option>
                            <option selected="selected" value="1">Provider Name 1</option>
                            <option value="2">Provider Name 2</option>
                            <option value="2">Provider Name 3</option>
                            <option value="2">Provider Name 4</option>
                            <option value="2">Provider Name 5</option>
                        </select>
                    </div>

                    {/*  <div className="form-group col-2">
                
                 <div className="list-dashboard">
                      {this.renderPieChart()}
                     </div>

                 

                   
                        </div> */}


                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Submitter</div>
                        <input className="form-control" type="text" 
                            onChange={(e) => this.onHandleChange(e, 1)}
                        />
                    </div>

                    <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <input className="form-control" type="text" 
                            onChange={(e) => this.onHandleChange(e)}
                        />
                    </div> */}
                </div>
            </form>
        )
    }

    renderSummaryDetails() {
        let row = []
        let data = []
        let array = this.state.summaryList
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let errorcode = ""

        array.forEach(item => {
            if (item.name == 'INVALID TRANSACTIONS') {
                errorcode = '999'
            } else {
                errorcode = ""
            }

            data = [
                { apiflag: apiflag, State: this.state.State ? this.state.State : 'n', selectedTradingPartner: this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n', startDate: startDate, endDate: endDate, transactionId: this.state.transactionId ? this.state.transactionId : 'n', status: item.name == 'TOTAL TRANSACTION' ? 'n' : item.name == 'Total Success Count' ? 'Pass' : 'Fail', count: item.value, errorcode: errorcode },
            ]

            if (item.name !== 'TOTAL PAID' && item.name !== 'OVERALL VOLUME') {
                row.push(
                    item.name == 'TOTAL TRANSACTION' || item.name == 'ERROR PERCENTAGE' || item.name == 'INVALID TRANSACTIONS'
                        ?
                        <Link to={{ pathname: '/' + url, state: { data } }} className="col summary-container">
                            <div>
                                <div className="summary-header">
                                    {item.name}
                                </div>



                                <div className={(item.name == 'ERROR PERCENTAGE') ? 'orange summary-title' : (item.name == 'OVERALL VOLUME(DAILY)') ? 'blue summary-title' : (item.name == 'INVALID TRANSACTIONS') ? 'orange summary-title' : (item.name == 'AVG RESPONSE TIME (sec)') ? 'dark_red summary-title' : (item.name == 'TOTAL PAID') ? 'dark_red summary-title' : (item.name == 'TOTAL TRANSACTION' ? 'green summary-title' : '')}  >
                                    {Number(item.value) ? item.value : 0}{item.name == 'ERROR PERCENTAGE' || item.name == 'NO RESPONSE' ? '%' : ''}

                                </div>
                            </div>
                        </Link>
                        :
                        <div className="col summary-container">
                            <div className="summary-header">{item.name}</div>
                            <div className={(item.name == 'ERROR PERCENTAGE') ? 'orange summary-title' : (item.name == 'TOTAL TRANSACTION' || item.name == 'OVERALL VOLUME(DAILY)') ? 'blue summary-title' : (item.name == 'INVALID TRANSACTIONS') ? 'orange summary-title' : (item.name == 'AVG RESPONSE TIME (sec)') ? 'dark_red summary-title' : (item.name == 'TOTAL PAID') ? 'dark_red summary-title' : (item.name == 'TOTAL TRANSACTION' ? 'green summary-title' : '')}  >

                                {Number(item.value) ? item.value : 0}{item.name == 'ERROR PERCENTAGE' || item.name == 'NO RESPONSE' ? '%' : ''}
                            </div>
                        </div>
                )
            }
        });

        return (
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    renderVolumeSummary(header, initialHeader, initialValue, laterHeader, laterValue, rise) {
        return (
            <div className="volume-summary chart">
                <div className="volume-summary-header">{header}</div>
                <div className="row">
                    <div className="col nopadding">
                        <div className="volume-header center-align-vol">{initialHeader}</div>
                        <div className="volume-title center-align-vol">{initialValue}</div>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="col nopadding">
                        <div className="volume-header center-align-vol">{laterHeader}</div>
                        <div className="volume-title center-align-vol">{laterValue}</div>
                    </div>
                </div>
                {
                    rise ?
                        <div className="increase-percent">{rise}</div>
                        :
                        <div className="col padding-top">
                            <div className="volume-header center-align-vol">No Response</div>
                            <div className="no-response-title center-align-vol">{this.state.noResponsePercent} %</div>
                        </div>
                }
            </div>
        )
    }

    renderAvgSummaryDetails() {
        return (
            <div className="col-5 summary-container">
                <div className="summary-header">Average Response Times</div>
                <div className="row">
                    <div className="col-6">
                        <div className="response-summary-title">Response Time : {this.state.averageResponseTime}sec</div>
                        <div className="response-summary-title">No Response : {this.state.noResponsePercent}</div>
                    </div>
                    <div>
                        <div className="response-summary-title">In Compliance {this.state.inComplaince} %</div>
                        <div className="response-summary-title">Out of Compliance {this.state.outComplaince} %</div>
                    </div>
                </div>
            </div>
        )
    }

    renderSummary() {
        let row = []
        const data = this.state.errorArray
        var check = this.state.apiflag;
        data.forEach((d) => {

            row.push(

                <tr>
                    <td style={{ fontSize: "11px" }}><a style={{ cursor: "pointer" }} >{this.state.apiflag == 1 ? d.ErrorType : d.ClaimStatus}</a></td>
                    <td >{this.state.apiflag == 1 ? d.RecCount : d.Total}</td>
                    {this.state.apiflag == 1 ? <td >{this.state.apiflag == 1 ? d.Percentage : ''}</td> : ""}


                </tr>
            )
        });

        return (
            <table className="table table-bordered claim-list summary-list chart-container chart">
                <thead>
                    <th style={{ fontSize: "11px" }}>{this.state.apiflag == 1 ? "Error Description" : "Claim Status"}</th>     <th style={{ fontSize: "11px" }}>{this.state.apiflag == 1 ? "Total Errors" : "Total Claims"}</th>
                    {this.state.apiflag == 1 ? <th style={{ fontSize: "11px" }}>Error %</th> : ""}

                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }



    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryCount
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
            let subtitle = ''
            let availitySent = ''
            let EFTCHK = ''
            let apiflag = ''
            let loadStatus = ''
            let url = ''
            let data = []
            if (item.name == 'Total Transaction') {
                claimStatus = ''
                subtitle = ""
                apiflag = this.state.apiflag
            } else if (item.name == 'Valid Transaction') {
                claimStatus = 'Pass'
                subtitle = "Valid Transaction"
                apiflag = this.state.apiflag
            } else if (item.name == 'Invalid Transaction') {
                claimStatus = 'Fail'
                subtitle = "Invalid Transaction"
                apiflag = this.state.apiflag
            } else if (item.name == 'No Response') {
                claimStatus = 'No'
                subtitle = "No Response"
                apiflag = this.state.apiflag
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
                    transactionId: 'n',
                    transactionStatus: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                    EFTCHK: EFTCHK,
                    apiflag : apiflag
                },
            ]

            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Avg Response Time (sec)'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    url={url ? url : Strings.ElilgibilityDetails270}
                />

            )
        });

        return (
            <div className="row padding-left">
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
            let subtitle = ''
            let availitySent = ''
            let color = "var(--red)"
            let Status=''
            if (item.name == 'In Compliance') {
                // claimStatus = 'Error'
                // subtitle = "Files in Error"
                color = "var(--main-bg-color)"
            } else if (item.name == 'Out of Compliance') {
                // availitySent = 'Y'
                // subtitle = "Sent to Availity"
                color = "var(--orange)"
            }else if (item.name == 'No Response') {
                // availitySent = 'Y'
                // subtitle = "Sent to Availity"
                color = "var(--red)"
            }else if (item.name == 'This Month') {
                // availitySent = 'Y'
                // subtitle = "Sent to Availity"
                color = "var(--main-bg-color)"
            }
            
            let sendData = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    transactionId: 'n',
                    status: Status,
                    MaintenanceCode:claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                },
            ]

            row.push(
                <TableTiles
                    item={item}
                    // url={Strings.claimsDashboard_834_details}
                    data={sendData}
                    color={color}
                />
            )
        })
        return (
            <div className="col-3 chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }


    _renderTableTiles = () => {

        let stage_1 = [
            { 'header': 'Real - Time Volume' },
            { 'name': 'Last Month', 'value': this.state.lastMonth },
            { 'name': 'This Month', 'value': this.state.thisMonth, 'isClick': true },
           ]
           let stage_2= [
            { 'header': 'Compliance Ratio' },
            { 'name': 'In Compliance', 'value': this.state.inComplaince + ' %', 'isClick': true },
            { 'name': 'Out of Compliance', 'value': this.state.outComplaince + ' %', 'isClick': true },
            { 'name': 'No Response', 'value': this.state.noResponsePercent + ' %', 'isClick': true },
  
        ]
       

        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}                
                {this._renderClaimTables(stage_2)}
             </div>
        )
    }


    getTransactions() {

        let query = ''
        let typeId = this.state.status
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let chartQuery = ''
        let url = Urls.transaction270
        let loginflag = localStorage.getItem("DbTech");

        if (this.state.apiflag == 1 && this.state.status != 'Pass') {
            chartQuery = `Eligibilty271ErrorwiseCount(State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"") {
                                ErrorType
                                RecCount
                            }`
        }

        query = `{
            ClaimRequest_Datewise(TypeID:"" page: 1 State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"" OrderBy:"" ) {
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
            url = Urls.transaction270
            query = `{
                EligibilityAllDtlTypewise(TypeID:"" page: 1  State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"" OrderBy:"", HiPaaSUniqueID:"" ) {
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

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
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
                    let count = 1
                    let data = []
                    let pieArray = []
                    let labelArray = []

                    if (this.state.apiflag == 1) {
                        data = res.data.EligibilityAllDtlTypewise
                    } else {
                        data = res.data.ClaimRequest_Datewise
                    }

                    if (this.state.status != "Pass" && res.data.Eligibilty271ErrorwiseCount) {
                        res.data.Eligibilty271ErrorwiseCount.forEach(item => {
                            pieArray.push(item.RecCount)
                            labelArray.push(item.ErrorType)
                        })
                    }

                    // if (data && data.length > 0) {
                    //     count = Math.floor(data[0].RecCount / 10)
                    //     if (data[0].RecCount % 10 > 0) {
                    //         count = count + 1
                    //     }
                    // }

                    this.setState({
                        files_list: data,
                        count: count,
                        pieArray: pieArray,
                        labelArray: labelArray,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _renderList = () => {
        let columnDefs = [
            { headerName: "Transaction Id", field: "Trans_ID",  cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Transaction Date", field: "Date" },
            { headerName: "Status", field: "Trans_type" },
            { headerName: "Submitter", field: "Submiter", flex:1 },
            // { headerName: "Error Type", field: "Error_Type", width: 150 },
            // { headerName: "Error Code", field: "Error_Code", width: 150 },
            // { headerName: "Error Description", field: "ErrorDescription", flex: 1 },
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
                        rowData={this.state.files_list}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'Transaction Id') {
                                this.setState({
                                    incoming_fileId: event.data.HiPaaSUniqueID
                                }, () => {
                                    this.gotoTransactionDetails()
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
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
                    transactionId:''
                },
            ]
        }

        this.props.history.push('/' + Strings.ElilgibilityDetails270, {
            data: sendData
        })
    }


    progressBar() {

        let valid = this.state.progress_valid + "%"
        let invalid = this.state.progress_invalid + "%"
        let noResponse = this.state.progress_noResponse + "%"
        return (
            <div class="progress">
                {/* <div class="progress-bar" role="progressbar" style={{ width: k }}>Total Sent To Availity ({k})</div> */}
                <div class="progress-bar bg-success" role="progressbar" style={{ width: valid }}>Vaild Transaction ({valid})</div>
                <div class="progress-bar bg-danger" role="progressbar" style={{ width: invalid }}>Invalid Transaction ({invalid})</div>
                <div class="progress-bar bg-info" role="progressbar" style={{ width: noResponse }}>No Response ({noResponse})</div>
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
                // onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }

   


    render() {
        return (
            <div>
                <h5 className="headerText">{this.state.apiflag == 0 ? '276 Real Time' : 'Eligibility Real Time'}</h5>
                   
                        
                        {this._renderTopbar()}
                        {this.progressBar()}
                        {this._renderSummaryDetails()}
                 
                    {/* <div className="col-3 nopadding">
                        {this.renderVolumeSummary('Real - Time Volume', 'Last Month', this.state.lastMonth, 'This Month', this.state.thisMonth, this.state.realTimePercent + ' %')}
                    </div> */}
                {this._renderTableTiles()}
                {this._renderAllPieCharts()}
                {this._renderList()}
                {/* <div className="row">
                    <div className="col-9">
                        {this.renderCharts()}
                    </div>
                    <div className="col-3 nopadding">

                        {this.renderVolumeSummary('Compliance Ratio', 'In Compliance', this.state.inComplaince + ' %', 'Out of Compliance', this.state.outComplaince + ' %')}
                        {this.renderPieChart()}
                    </div>
                </div> */}
            </div>
        );
    }
}