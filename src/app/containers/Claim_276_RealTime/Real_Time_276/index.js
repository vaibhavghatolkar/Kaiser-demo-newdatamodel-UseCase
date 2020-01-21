import React from 'react'
import '../../Claims/Dashboard/styles.css'
import './style.css'
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { EligibilityDetails } from '../../EligibilityDetails';
import Strings from '../../../../helpers/Strings';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Images from '../../../../theme/Images';

export class RealTime276 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            showDetails: false,
            files_list: [],
            tradingpartner: [],
            pieArray: [],
            pieLabels: [],
            tradingChartLabel: [],
            tradingChartData: [],
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
            startDate : moment().subtract(30,'d').format('YYYY-MM-DD'),
            endDate : moment().format('YYYY-MM-DD'),
            transactionId: '',
            selected_val: '',
            averageResponseTime: '',
            selectedTradingPartner: '',
            noResponsePercent: '',
            chartType: this.props.location.state.data[0].apiflag == 1 ? 'Eligibilityweekwise' : 'ClaimRequestweekwise',
            colorArray : [
                '#139DC9',
                '#83D2B4'
            ],
            errorColorArray: [
                '#139DC9',
                '#83D2B4',
                '#9DCA15',
                '#03d9c6',
            ],
            apiflag: Number(this.props.location.state.data[0].apiflag == 1 ? this.props.location.state.data[0].apiflag : 1)
        }

        this.getData = this.getData.bind(this)
        this.getCommonData = this.getCommonData.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentWillReceiveProps() {
        setTimeout(() => {
            this.getCommonData()
            this.getData()
        }, 50);
    }

    componentDidMount(){
        this.getCommonData()
        this.getData()
    }

    getCommonData(chartType){
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''  
        chartType = this.state.chartType
        if(!this.state.chartType && this.state.apiflag == 1){
            chartType = "Eligibilitymonthwise"
        } else if (!this.state.chartType && this.state.apiflag == 0){
            chartType = "ClaimRequestMonthwise"
        }
        console.log('I am here check me out ' +  this.state.chartType)
        
        let query = `{
            Trading_PartnerList(Transaction:"ClaimRequest") {
                Trading_Partner_Name 
            }
            tradingPartnerwise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "ClaimRequestTradingPartner") {
                X_axis
                Y_axis
            }
            datewise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "`+ chartType + `") {
                X_axis
                Y_axis
            }
        }`


        if(this.state.apiflag == 1){
            query = `{
                Trading_PartnerList(Transaction:"EligibilityStatus") {
                    Trading_Partner_Name 
                }
                tradingPartnerwise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "EligibilityTradingPartner") {
                    X_axis
                    Y_axis
                }
                datewise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "`+ chartType + `") {
                    X_axis
                    Y_axis
                }
            }`
        }

        console.log('query ', query)

        fetch(Urls.common_data, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(res => {
            if(res.data){
                this.performCommonOperations(res, chartType)
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    getData(chartType){
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let url = Urls.claimstatus
        // console.log(this.state.chartType)
        // if(!this.state.chartType && this.state.apiflag == 1){
        //     chartType = "Eligibilitymonthwise"
        // } else if (!this.state.chartType && this.state.apiflag == 0){
        //     chartType = "ClaimRequestMonthwise"
        // }
        
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
            }
            ClaimStatuswiseCount(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`") {
                ClaimStatus
                Total
            }
        }`


        if(this.state.apiflag == 1){
            url = Urls.eligibility_url
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
                }
                Eligibilty271ErrorwiseCount(State:"`+ this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"") {
                    ErrorType
                    RecCount
                    Percentage
                }
            }`
        }

        console.log('query ', query)

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
                    this.performOperations(res, chartType)
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    async performCommonOperations(res, flag){
        let tradingChartData = []
        let tradingChartLabel = []
        let dateChartData = []
        let dateChartLabel = []

        if(res.data.tradingPartnerwise && res.data.tradingPartnerwise.length > 0){
            res.data.tradingPartnerwise.forEach(item => {
                tradingChartLabel.push(item.X_axis)
                tradingChartData.push(item.Y_axis)
            })
        }

        if(res.data.datewise && res.data.datewise.length > 0){
            let count = 1
            res.data.datewise.forEach(item => {
                try {
                    if(flag == 'Eligibilityweekwise' || flag == 'ClaimRequestweekwise'){
                        dateChartLabel.push('week ' + count)
                    } else if(flag == 'EligibilityDatewise' || flag == 'ClaimRequestDatewise'){
                        dateChartLabel.push(item.X_axis)
                    } else {
                        dateChartLabel.push(item.X_axis)
                    }
                    dateChartData.push(item.Y_axis)
                } catch (error) {}
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

    async performOperations(res, flag){
        let data = []
        let errorPieArray = []
        let errorLabelArray = []

        if (this.state.apiflag == 1) {
            data = res.data.Eligibilty270[0]
        } else {
            data = res.data.ClaimRequest276[0]
        }

        let summary = [
            { name: 'OVERALL VOLUME (DAILY)', value: data.Daily_Volume },
            { name: 'TOTAL TRANSACTION VOLUME', value: data.TotalNumOfReq },
            { name: 'INVALID TRANSACTIONS', value: data.Invalid_Trans },
            { name: 'ERROR PERCENTAGE', value: data.Error_Per },
            { name: 'AVG RESPONSE TIME', value: data.AvgResTime + ' sec' },
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
            errorPieArray : errorPieArray,
            errorLabelArray : errorLabelArray,
            inComplaince : data.In_Compliance_Per,
            outComplaince : data.out_of_Compliance_per,
            thisMonth: data.ThisMonth_Volume,
            lastMonth : data.LastMonth_Volume,
            averageResponseTime : data.AvgResTime,
            noResponsePercent : data.NoResponse_Per,
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

    getPieData(array, labels, colorArray) {
        let data = {
            labels: labels,
            datasets: [{
                data: array,
                backgroundColor: colorArray,
                hoverBackgroundColor: colorArray
            }]
        }

        return data
    }

    renderCharts(){
       let minimumValue = Math.min(...this.state.dateChartData)
        minimumValue = (minimumValue==0 ? 0 : (minimumValue-(minimumValue*10/100)))
        minimumValue = Math.ceil(minimumValue)
        return(
            <div>
                <div className="row chart-div">
                {
                    this.state.tradingChartLabel && this.state.tradingChartLabel.length > 0
                    ?
                    <div className="chart-container chart">
                        <label className="chart-header">Submitter volume</label>
                        <Bar
                            data={this.getBarData(this.state.tradingChartLabel, this.state.tradingChartData, '#139DC9')}
                            width={100}
                            height={60}
                            options={{
                                legend: {
                                    display: false,
                                }
                            }}/>
                    </div> : null
                }
                {
                    this.state.dateChartLabel && this.state.dateChartLabel.length > 0
                    ?
                    <div className="chart-container chart">
                        <label className="chart-header">Real - Time Volume {this.state.selected_val ? '(' + this.state.selected_val + ')': '(Monthly)'}</label>
                        <Bar
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
                                        }
                                    }]
                                }
                            }}/>
                    </div> : null
                }
                </div>
                <div className="row chart-div">
                    {
                        this.state.errorArray && this.state.errorArray.length > 0 ?
                            this.renderSummary() : null
                    }
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

    renderTopbar() {
        return (
            <form className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
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
                                } else if(selected_val == 'Last 30 days'){
                                    day = 30
                                    chartType = this.state.apiflag == 1 ? 'Eligibilityweekwise' : 'ClaimRequestweekwise'
                                } else if(selected_val == 'Last 90 days'){
                                    day = 90
                                } else if(selected_val == 'Last 180 days'){
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
                            <option value=""></option>
                            <option value="1">Last week</option>
                            <option selected="selected" value="2">Last 30 days</option>
                            <option value="2">Last 90 days</option>
                            <option value="2">Last 180 days</option>
                            <option value="2">Last year</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                this.onSelect(event, 'State')
                            }}
                        >
                            <option selected="selected" value=""></option>
                            <option value="1">California</option>
                            <option value="2">Michigan</option>
                            <option value="3">Florida</option>
                            <option value="4">New York</option>
                            <option value="5">Idaho</option>
                            <option value="6">Ohio</option>
                            <option value="7">Illinois</option>
                            <option value="8">Texas</option>
                            <option value="9">Mississippi</option>
                            <option value="10">South Carolina</option>
                            <option value="11">New Mexico</option>
                            <option value="12">Puerto Rico</option>
                            <option value="13">Washington</option>
                            <option value="14">Utah</option>
                            <option value="15">Wisconsin</option>
                        </select>
                    </div>

                    <div className="form-group col-2">
                        <div className="list-dashboard">
                            Submitter
                        </div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                                // setTimeout(() => {
                                //     this.getCommonData()
                                //     this.getData()
                                // }, 50);
                            }}
                        >
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
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
       
        array.forEach(item => {
            data = [
                {apiflag:apiflag,State:this.state.State ? this.state.State : 'n' , selectedTradingPartner:this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n', startDate:startDate ,endDate:endDate ,transactionId:this.state.transactionId ? this.state.transactionId : 'n' , status:item.name == 'TOTAL TRANSACTION VOLUME' ? 'n' : item.name == 'Total Success Count' ? 'Pass' : 'Fail' , count:item.value},
               ]
            row.push(


                // <Link 
                //     to={
                //         '/' + url + 
                //         '/' + (this.state.State ? this.state.State : 'n') + 
                //         '/' + (this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n') + 
                //         '/' + startDate + 
                //         '/' + endDate + 
                //         '/' + (this.state.transactionId ? this.state.transactionId : 'n') + 
                //         '/' + (item.name == 'TOTAL TRANSACTION VOLUME' ? 'n' : item.name == 'Total Success Count' ? 'Pass' : 'Fail') + 
                //         '/' + item.value
                //     } className="col-2 summary-container">
                //     <div>
                //         <div className="summary-header">{item.name}</div>
                //         <div className="summary-title">{item.value}{item.name == 'ERROR PERCENTAGE' || item.name == 'NO RESPONSE' ? '%' : ''}</div>
                //     </div>
                // </Link>
                <Link to={{ pathname: '/'+ url , state: {data}}} className="col-2 summary-container"> 
                <div>
                        <div className="summary-header">{item.name}</div>
                        <div className="summary-title">{item.value}{item.name == 'ERROR PERCENTAGE' || item.name == 'NO RESPONSE' ? '%' : ''}</div>
                    </div>
                 </Link>     
                // <Link
                //     to={
                //         '/' + url, 
                       
                //     } className="col-2 summary-container">
                //     <div>
                //         <div className="summary-header">{item.name}</div>
                //         <div className="summary-title">{item.value}{item.name == 'ERROR PERCENTAGE' || item.name == 'NO RESPONSE' ? '%' : ''}</div>
                //     </div>
                // </Link>
            )
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

    renderAvgSummaryDetails(){
        return(
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
                    <td style={{ fontSize: "11px" }}><a style={{cursor:"pointer"}} >{this.state.apiflag == 1 ? d.ErrorType : d.ClaimStatus}</a></td>
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

    render() {
        return (
            <div>
                <label style={{ color: "#139DC9", fontWeight: "500", marginTop: "10px", fontSize: '24px' }}>{this.state.apiflag == 0 ? 'Real Time 276' : 'Eligibility Real Time'}</label>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                <div className="row">
                    <div className="col-9">
                        {this.renderCharts()}
                    </div>
                    <div className="col-3 nopadding">
                        {this.renderVolumeSummary('Real - Time Volume', 'Last Month', this.state.lastMonth, 'This Month', this.state.thisMonth, this.state.realTimePercent + ' %')}
                        {this.renderVolumeSummary('Compliance Ratio', 'In Compliance', this.state.inComplaince + ' %', 'Out of Compliance', this.state.outComplaince + ' %')}
                    </div>
                </div>
            </div>
        );
    }
}