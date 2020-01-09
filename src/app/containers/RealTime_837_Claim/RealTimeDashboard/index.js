import React from 'react';
import './styles.css';
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import { Files } from '../../Files';
import { Topbar } from '../../../components/Topbar';
import { Files_837 } from '../../Files_837';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import Strings from '../../../../helpers/Strings';


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
            apiflag: this.props.apiflag,
            tradingpartner: [],
            startDate: '',
            endDate: '',
            selectedTradingPartner: '',
            Months: 0,
            Accepted_per: 0,
            rejected_per: 0,
            ClaimBarChart: [],
            claimLabels: [],
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
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    componentDidMount() {
        this.getData()
    }

    getData(chartType) {
        if(!chartType){
            chartType = "Monthwise"
        }
        
        let query = `{
            Claim837RTDashboardCount (Sender:"",State:"",Provider:"", StartDt :"`+this.state.startDate+`", EndDt : "`+this.state.endDate+`") {
                TotalClaims
                Accepted
                Rejected
                Accepted_Per
                Rejected_Per
                Total999
                Total277CA
                TotalSentToQNXT
            }
            Claim837RTClaimBarchart (Sender:"",State:"",Provider:"", StartDt :"`+this.state.startDate+`", EndDt : "`+this.state.endDate+`", ChartType: "`+chartType+`") {
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
        console.log(query)
        fetch(Urls.real_time_claim , {
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
                let ClaimBarChart = res.data.Claim837RTClaimBarchart
                let claimLabels = []
                
                if(data.Claim837RTDashboardCount && data.Claim837RTDashboardCount.length > 0){
                    summary = [
                        { name: 'Total Claims', value: data.Claim837RTDashboardCount[0].TotalClaims ? data.Claim837RTDashboardCount[0].TotalClaims : '' },
                        { name: 'Accepted Claims', value: data.Claim837RTDashboardCount[0].Accepted ? data.Claim837RTDashboardCount[0].Accepted : ''   },
                        { name: 'Rejected Claims', value: data.Claim837RTDashboardCount[0].Rejected ? data.Claim837RTDashboardCount[0].Rejected : ''},
                        { name: 'Accepted Percentage', value: data.Claim837RTDashboardCount[0].Accepted_Per  ? data.Claim837RTDashboardCount[0].Accepted_Per : ''},
                        { name: 'Rejected Percentage', value: data.Claim837RTDashboardCount[0].Rejected_Per  ? data.Claim837RTDashboardCount[0].Rejected_Per : ''},
                    ]
                    Accepted_per1 = data.Claim837RTDashboardCount[0].Accepted_Per
                    rejected_per1 = data.Claim837RTDashboardCount[0].Rejected_Per
                }
                
                let count = 0
                ClaimBarChart.forEach((d)=> {
                    count++;
                    array.push(
                        d.Y_axis ? parseFloat(d.Y_axis) : 0
                    )
                    if(chartType == 'Weekwise'){
                        claimLabels.push('week' + count)
                    } else {
                        claimLabels.push(
                            d.X_axis
                        )
                    }
                })
        
                this.setState({
                    summaryList: summary,
                    Accepted_per: Accepted_per1,
                    rejected_per: rejected_per1,
                    ClaimBarChart:array,
                    claimLabels : claimLabels
                })
            })
            .catch(err => {
                console.log(err)
            })
    }


    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text">File Name</td>
                <td className="table-head-text list-item-style">File Date</td>
                <td className="table-head-text list-item-style">File Status</td>
                <td className="table-head-text list-item-style">Submitter</td>
                <td className="table-head-text list-item-style">Claim Count</td>
            </tr>
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

    renderCharts() {
        const data = {
            labels: [
                'Accepted',
                'Rejected'
            ],
            datasets: [{
                data: [this.state.Accepted_per, this.state.rejected_per],
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

        console.log(this.state.ClaimBarChart)
        
        return (
            <div className="row chart-div">
                <div className="chart-container chart">
                    <Pie data={data}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0
                                }
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }}
                        width={100}
                        height={60} />
                </div>
                <div className="chart-container chart">
                    <Bar
                        data={this.getBarData(this.state.claimLabels,this.state.ClaimBarChart, "#139DC9")}
                        width={100}
                        height={60}
                        options={{
                            legend: {
                                position: 'bottom'
                            }
                        }} />
                </div>
            </div>
        )
    }

    renderList() {
        let row = []
        const data = this.state.claimsList;
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.name}</td>
                    <td className="list-item-style">{moment(d.date).format('DD/MM/YYYY')}<br />{moment(d.date).format('h:m a')}</td>
                    <td className={"list-item-style " + (d.status == 'SentToQnxt' || d.status == 'Accepted' ? 'green ' : (d.status == 'Rejected' ? 'red ' : ''))}>{d.status}</td>
                    <td className="list-item-style">{d.submitter}</td>
                    <td className="list-item-style">{d.dCount}</td>
                </tr>
            )
        });

        return (
            <table className="table table-bordered claim-list">
                {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderTableHeader() : null}
                <tbody>
                    {row}
                </tbody>
            </table>
        );
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
        if(event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner'){
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

    MonthsEvent(event, key){
        this.setState({
            [key] : event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderSummaryDetails(){
        let row = []
        let array = this.state.summaryList
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270 + '/' + apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        
        array.forEach(item => {
            let addon = ''
            if(item.name == 'Accepted Claims'){
                addon = '/accept'
            } else if(item.name == 'Rejected Claims'){
                addon = '/reject'
            } else {
                addon = '/other'
            }
            row.push(
                <Link 
                    to={'/ClaimDetails837' + addon + '/' + selectedTradingPartner + '/' + startDate + '/' + endDate} className="col-2 summary-container">
                    <div>
                        <div className="summary-header">{item.name}</div>
                        <div className="summary-title">{item.value}{item.name == 'ERROR PERCENTAGE' || item.name == 'NO RESPONSE' ? '%' : ''}</div>
                    </div>
                </Link>
            )
        });

        return(
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    renderTopbar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">Time Range</div>
                        <select 
                            className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                let day = 0
                                let chartType = ''
                                let selected_val = event.target.options[event.target.selectedIndex].text

                                if(selected_val == 'Last week'){
                                    day = 7
                                    chartType = 'Datewise'
                                } else if(selected_val == 'Last 30 days'){
                                    day = 30
                                    chartType = 'Weekwise'
                                } else if(selected_val == 'Last 90 days'){
                                    day = 90
                                } else if(selected_val == 'Last 180 days'){
                                    day = 180
                                } else if(selected_val == 'Last year'){
                                    day = 365
                                }

                                let startDate = moment().subtract(day,'d').format('YYYY-MM-DD')
                                let endDate = moment().format('YYYY-MM-DD')

                                if(!selected_val){
                                    startDate = ''
                                    endDate = ''
                                }

                                this.setState({
                                    startDate : startDate,
                                    endDate: endDate,
                                    selected_val: selected_val
                                })

                                setTimeout(() => {
                                    this.getData(chartType)
                                }, 50);
                            }}
                            >
                            <option  selected="selected" value=""></option>
                            <option value="1">Last week</option>
                            <option value="2">Last 30 days</option>
                            <option value="2">Last 60 days</option>
                            <option value="2">Last 180 days</option>
                            <option value="2">Last year</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-dashboard" id="state">
                            <option value=""></option>
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
                        <div className="list-dashboard">Provider</div>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner" 
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
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

    render() {
        return (
            <div>
                <br></br>
                <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Claims Dashboard</h5><br></br>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                {this.renderCharts()}
            </div>
        );
    }
}