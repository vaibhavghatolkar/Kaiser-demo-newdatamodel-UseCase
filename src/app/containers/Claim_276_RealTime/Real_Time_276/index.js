import React from 'react'
import '../../Claims/Dashboard/styles.css'
import './style.css'
import {Pie, Bar} from 'react-chartjs-2';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { EligibilityDetails } from '../../EligibilityDetails';
import Strings from '../../../../helpers/Strings';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";

export class RealTime276 extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            claimsList : [],
            summaryList : [],
            showDetails: false,
            files_list : [],
            tradingpartner: [],
            pieArray: [],
            pieLabels: [],
            tradingChartLabel : [],
            tradingChartData : [],
            dateChartLabel : [],
            dateChartData : [],
            errorPieArray : [],
            errorLabelArray : [],
            State: '',
            startDate: '',
            endDate: '',
            transactionId: '',
            selectedTradingPartner: '',
            colorArray : [
                '#139DC9',
                '#83D2B4'
            ],
            errorColorArray : [
                '#139DC9',
                '#83D2B4',
                '#9DCA15',
            ],
            apiflag : Number(this.props.match.params.apiflag ? this.props.match.params.apiflag : 1)
        }

        this.getData = this.getData.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        
        let query = `{
            ClaimRequest276(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`") {
                AvgResTime
                TotalNumOfReq
                Success
                Error
            }
            Trading_PartnerList(Transaction:"ClaimRequest") {
                Trading_Partner_Name 
            }
            tradingPartnerwise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "ClaimRequestTradingPartner") {
                X_axis
                Y_axis
            }
            datewise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "ClaimRequestDatewise") {
                X_axis
                Y_axis
            }
            ClaimStatuswiseCount(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`") {
                ClaimStatus
                Total
            }
        }`


        if(this.state.apiflag == 1){
            query = `{
                Eligibilty270(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`") {
                    AvgResTime
                    TotalNumOfReq
                    Success
                    Error
                }
                Trading_PartnerList(Transaction:"EligibilityStatus") {
                    Trading_Partner_Name 
                }
                tradingPartnerwise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "EligibilityTradingPartner") {
                    X_axis
                    Y_axis
                }
                datewise : DashboardBarChartData(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`", ChartType: "EligibilityDatewise") {
                    X_axis
                    Y_axis
                }
                Eligibilty271ErrorwiseCount(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorType:"") {
                    ErrorType
                    RecCount
                }
            }`
        }

        console.log('query ', query)

        fetch(Urls.base_url, {
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
                let data = []
                let tradingChartData = []
                let tradingChartLabel = []
                let dateChartData = []
                let dateChartLabel = []
                let errorPieArray = []
                let errorLabelArray = []

                if(this.state.apiflag){
                    data = res.data.Eligibilty270[0]
                } else {
                    data = res.data.ClaimRequest276[0]
                }

                let summary = [
                    {name:'Avg Response Time (sec)', value : data.AvgResTime},
                    {name:'Total Number Of Requests', value : data.TotalNumOfReq},
                    {name:'Total Success Count', value : data.Success},
                    {name:'Total Error Count', value : data.Error},
                ]

                let pieArray = []
                pieArray.push(data.Success)
                pieArray.push(data.Error)

                let pieLabels = []
                pieLabels.push("Success")
                pieLabels.push("Error")

                if(res.data.tradingPartnerwise && res.data.tradingPartnerwise.length > 0){
                    res.data.tradingPartnerwise.forEach(item => {
                        tradingChartLabel.push(item.X_axis)
                        tradingChartData.push(item.Y_axis)
                    })
                }

                if(res.data.datewise && res.data.datewise.length > 0){
                    res.data.datewise.forEach(item => {
                        try {
                            dateChartLabel.push(moment(Number(item.X_axis)).format('DD MMM'))
                            dateChartData.push(item.Y_axis)
                        } catch (error) {}
                    })
                }

                if(res.data.Eligibilty271ErrorwiseCount && res.data.Eligibilty271ErrorwiseCount.length > 0 && this.state.apiflag == 1){
                    res.data.Eligibilty271ErrorwiseCount.forEach(item => {
                        errorPieArray.push(item.RecCount)
                        errorLabelArray.push(item.ErrorType)
                    })
                } else if(res.data.ClaimStatuswiseCount && res.data.ClaimStatuswiseCount.length > 0){
                    res.data.ClaimStatuswiseCount.forEach(item => {
                        errorPieArray.push(item.Total)
                        errorLabelArray.push(item.ClaimStatus)
                    })
                }
                
                this.setState({
                    summaryList: summary,
                    pieArray: pieArray,
                    pieLabels: pieLabels,
                    tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    tradingChartLabel: tradingChartLabel,
                    tradingChartData: tradingChartData,
                    dateChartLabel: dateChartLabel,
                    dateChartData: dateChartData,
                    errorPieArray : errorPieArray,
                    errorLabelArray : errorLabelArray,
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    getTransactions(key){
        let query = ''
        let typeId = "276"
        if(this.state.apiflag == 1){
            typeId = "270"
        }
        if(key == 'Total Number Of Requests'){
            query = "{ EligibilityAllDtlTypewise (TypeID:\""+typeId+"\"){ Trans_CountID TypeOfTransaction AvgResTime TotalNumOfReq Success Error Date Trans_type Submiter Trans_ID Error_Code } }"
        } else {
            query = "{ EligibilityErrorDtlTypewise (TypeID:\""+typeId+"\"){ Trans_CountID TypeOfTransaction AvgResTime TotalNumOfReq Success Error Date Trans_type Submiter Trans_ID Error_Code } }"
        }

        fetch(Urls.base_url, {
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
                this.setState({
                    files_list : key == 'Total Number Of Requests' ? res.data.EligibilityAllDtlTypewise : res.data.EligibilityErrorDtlTypewise,
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    renderSearchBar(){
        return(
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search Claim"/>
            </div>
        )
    }

    getBarData(labelArray, dataArray, color){
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

    getPieData(array, labels, colorArray){
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
        return(
            <div>
                <div className="row chart-div">
                    {
                        this.state.pieArray && this.state.pieArray.length > 0
                        ?
                        <div className="chart-container chart">
                            <Pie data={this.getPieData(this.state.pieArray, this.state.pieLabels, this.state.colorArray)}
                                options={{
                                    elements: {
                                        arc: {
                                            borderWidth: 0
                                        }
                                    },
                                    legend: {position: 'bottom'}
                                }}
                                width={100}
                                height={64}/>
                        </div> : null
                    }

                    {
                        this.state.tradingChartLabel && this.state.tradingChartLabel.length > 0
                        ?
                        <div className="chart-container chart">
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
                </div>

                <div className="row chart-div">
                    {
                        this.state.dateChartLabel && this.state.dateChartLabel.length > 0
                        ?
                        <div className="chart-container chart">
                            <Bar
                                data={this.getBarData(this.state.dateChartLabel, this.state.dateChartData, '#83D3B4')}
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
                        this.state.errorPieArray && this.state.errorPieArray.length > 0
                        ?
                        <div className="chart-container chart">
                            <Pie data={this.getPieData(this.state.errorPieArray, this.state.errorLabelArray, this.state.errorColorArray)}
                                options={{
                                    elements: {
                                        arc: {
                                            borderWidth: 0
                                        }
                                    },
                                    legend: {position: 'bottom'}
                                }}
                                width={100}
                                height={64}/>
                        </div> : null
                    }
                </div>
            </div>
        )
    }

    gotoRealTimeTransactions(key){
        this.setState({
            key : key
        })
    }

    renderSummary(){
        let row = []
        const data = this.state.summaryList;
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'

        data.forEach((d) => {
            let apiflag = this.state.apiflag
            let url = Strings.ElilgibilityDetails270 + '/' + apiflag

            row.push(
                <tr>
                    <td className="bold-text">{d.name}</td>
                    <td className={
                        (d.name == 'Avg Response Time (sec)') ? 'blue bold-text summary-values' :
                        (d.name == 'Total Success Count') ? 'green bold-text summary-values' :
                        (d.name == 'Total Number Of Requests' || d.name == 'Total Error Count') ? 'red bold-text summary-values' : ''
                    }>
                        <Link 
                            to={
                                '/' + url + 
                                '/' + (this.state.State ? this.state.State : 'n') + 
                                '/' + (this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n') + 
                                '/' + startDate + 
                                '/' + endDate + 
                                '/' + (this.state.transactionId ? this.state.transactionId : 'n') + 
                                '/' + (d.name == 'Total Number Of Requests' ? 'n' : d.name == 'Total Success Count' ? 'Pass' : 'Fail') + 
                                '/' + d.value
                            }>{d.value}</Link>
                    </td>
                </tr>
            )
        });
    
        return (
            <table className="table table-bordered claim-list summary-list">
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }

    showDetails(){
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
            this.getData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    onSelect(event, key){
        if(event.target.options[event.target.selectedIndex].text == 'Select Provider Name' || event.target.options[event.target.selectedIndex].text == 'Select Trading Partner'){
            this.setState({
                [key] : ''
            })
        } else {
            this.setState({
                [key] : event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderTopbar() {
        return (
            <form className="form-style" id='filters'>
                    <div className="form-row">
                <div className="form-group col-2">
                    <div className="list-dashboard">State</div>
                    <select className="form-control list-dashboard" id="state"
                        onChange={(event) => {
                            this.onSelect(event, 'State')
                        }}
                    >
                        <option  selected="selected" value=""></option>
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
                        Trading Partner 
                    </div>
                    <select className="form-control list-dashboard" id="TradingPartner"
                        onChange={(event) => {
                            this.onSelect(event, 'selectedTradingPartner')
                            setTimeout(() => {
                                this.getData()
                            }, 50);
                        }}
                    >
                        <option value="select"></option>
                        {this.getoptions()}
                    </select>
                </div>
               <div className="form-group col-2">
                    <div className="list-dashboard">Start Date</div>
                    <DatePicker 
                        className="datepicker"
                        selected={this.state.startDate}
                        onChange={this.handleStartChange}
                    />
                </div>
                <div className="form-group col-2">
                    <div className="list-dashboard">End Date</div>
                    <DatePicker className="datepicker"
                        selected={this.state.endDate}
                        onChange={this.handleEndChange}
                    />  
                </div>
            </div>
        </form>
        )
    }

    render() {
        return (
            <div>
                {
                    <div>
                        <label style={{color:"#139DC9" , fontWeight:"500" , marginTop:"10px", fontSize: '24px'}}>{this.state.apiflag == 0 ? 'Real Time 276' : 'Real Time 270'}</label>
                        {this.renderTopbar()}
                        <div className="row">
                            <div className="col-9">
                                {this.renderCharts()}
                            </div>
                            <div className="col-3">
                                {this.renderSummary()}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}