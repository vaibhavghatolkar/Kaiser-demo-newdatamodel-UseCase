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
            ClaimBarChart: []
        }
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.showFile = this.showFile.bind(this)
        this.renderSummary = this.renderSummary.bind(this)
        // this.getData = this.getData.bind(this)
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

    getData() {
        
        let query = `{
            Claim837RTDashboardCount (Sender:"",State:"",Provider:"",Month:${this.state.Months},Year:2020) {
                TotalClaims
                Accepted
                Rejected
                Accepted_Per
                Rejected_Per
              
              }
              Claim837RTClaimBarchart (Sender:"",State:"",Provider:"", Year: 2020 , Month :12, Flag: "${this.state.Months}") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
              }
        }`
        console.log(query)
        fetch(Urls.base_url , {
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
                let totalData = data.Claim837RTDashboardCount
                let Accepted_per1;
                let rejected_per1;
                let ClaimBarChart = res.data.Claim837RTClaimBarchart
                
                if(totalData == ""){
                    summary = [
                        { name: 'Total Claims', value: 0 },
                        { name: 'Accepted Claims', value: 0 },
                        { name: 'Rejected Claims', value: 0 },
                        { name: 'Accepted Percentage', value: 0 },
                        { name: 'Rejected Percentage', value: 0 },
                    ]
                    Accepted_per1 = 0
                    rejected_per1 = 0
                }else{
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
                
                ClaimBarChart.forEach((d)=> {
                    array.push(
                        d.TotalClaims ? parseFloat(d.TotalClaims) : 0
                    )
                })
        
                this.setState({
                    summaryList: summary,
                    Accepted_per: Accepted_per1,
                    rejected_per: rejected_per1,
                    ClaimBarChart:array
                    // tradingpartner: res.data.Trading_PartnerList
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
        let labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        
        return (
            <div className="row chart">
                <div className="col-6">
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
                <div className="col-6">
                    
                    <Bar
                        data={this.getBarData(labels,this.state.ClaimBarChart, "#139DC9")}
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

    renderSummary() {
        let row = []
        const data = this.state.summaryList;
        // this.state.flag
        // this.state.selectedTradingPartner
        // this.state.startDate
        // this.state.endDate
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'

        data.forEach((d) => {
            let addon = ''
            if(d.name == 'Accepted Claims'){
                addon = '/accept'
            } else if(d.name == 'Rejected Claims'){
                addon = '/reject'
            } else {
                addon = '/other'
            }
            row.push(
                <tr>
                    <td className="bold-text">{d.name}</td>
                    <td><a href="#" onClick={() => { 
                        // this.showFile(d.name) 
                    }} className={
                        (d.name == 'Accepted Percentage' || d.name == 'Total Claims') ? 'blue bold-text summary-values' :
                            (d.name == 'Paid Claims' || d.name == 'Accepted Claims') ? 'green bold-text summary-values' :
                                (d.name == 'Claims Queue' || d.name == 'Work in Progress') ? 'dark_red bold-text summary-values' :
                                    (d.name == 'Rejected Percentage' || d.name == 'Rejected Claims') ? 'red bold-text summary-values' :
                                        (d.name == 'Partial Paid Claims') ? 'orange bold-text summary-values' : ''
                    }>
                        <Link to={'/ClaimDetails837' + addon + '/' + selectedTradingPartner + '/' + startDate + '/' + endDate}>{d.value}</Link>
                    </a></td>
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

    renderErrors() {
        let row = []
        const data = this.state.summaryList;
        // this.state.flag
        // this.state.selectedTradingPartner
        // this.state.startDate
        // this.state.endDate
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'

        data.forEach((d) => {
            let addon = ''
            if(d.name == 'Accepted Claims'){
                addon = '/accept'
            } else if(d.name == 'Rejected Claims'){
                addon = '/reject'
            } else {
                addon = '/other'
            }
            row.push(
                <tr>
                    <td className="bold-text">{d.name}</td>
                    <td><a href="#" onClick={() => { 
                        // this.showFile(d.name) 
                    }} className={
                        (d.name == 'Accepted %' || d.name == 'Total Claims') ? 'blue bold-text summary-values' :
                            (d.name == 'Paid Claims' || d.name == 'Accepted Claims') ? 'green bold-text summary-values' :
                                (d.name == 'Claims Queue' || d.name == 'Work in Progress') ? 'dark_red bold-text summary-values' :
                                    (d.name == 'Rejected %' || d.name == 'Rejected Claims') ? 'red bold-text summary-values' :
                                        (d.name == 'Partial Paid Claims') ? 'orange bold-text summary-values' : ''
                    }>
                        <Link to={'/ClaimDetails837' + addon + '/' + selectedTradingPartner + '/' + startDate + '/' + endDate}>{d.value}</Link>
                    </a></td>
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

    MonthsEvent(event, key){
        this.setState({
            [key] : event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderTopbar() {
        return (
            <div className="row">
                <div className="form-group col-2">
                    <div className="list-header-dashboard">State</div>
                    <select className="form-control list-header-dashboard" id="state">
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
                    <div className="list-header-dashboard">Trading Partner </div>
                    <select className="form-control list-header-dashboard" id="TradingPartner" 
                        onChange={(event) => {
                            this.onSelect(event, 'selectedTradingPartner')
                        }}>
                        <option value="select"></option>
                        {this.getoptions()}
                    </select>
                </div>
                <div className="form-group col-2">
                    <div className="list-header-dashboard">Provider</div>
                    <input className="form-control" type="text" />
                    {/* <select className="form-control list-header-dashboard" id="option" 
                        onChange={(event) => {
                            this.onSelect(event, 'providerName')
                        }}
                    >
                        <option value="0">Select Provider Name</option>
                        <option value="1">Provider Name 1</option>
                        <option value="2">Provider Name 2</option>
                    </select> */}
                </div>
                {/* <div className="form-group col-2">
                    <div className="list-header-dashboard">Start Date</div>
                    <DatePicker className="datepicker form-control list-header-dashboard"
                        selected={this.state.startDate}
                        onChange={this.handleStartChange}
                    />
                </div>
                <div className="form-group col-2">
                    <div className="list-header-dashboard">End Date</div>
                    <DatePicker className="datepicker form-control list-header-dashboard"
                        selected={this.state.endDate}
                        onChange={this.handleEndChange}
                    />
                </div> */}
                <div className="form-group col-2">
                    <div className="list-header-dashboard">Month</div>
                    <select className="form-control list-header-dashboard" id="state"
                     onChange={(event) => {
                        this.MonthsEvent(event, 'Months')
                    }}>>
                        <option value="0">All</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                        </select>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                
                {
                    this.state.showFile
                        ?
                        <Files_837
                            flag={this.state.flag}
                            selectedTradingPartner = {this.state.selectedTradingPartner}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                        />
                        :
                        <div>
                        {/* {this.renderSearchBar()} */}
                        <br></br>
                        <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Claims Dashboard</h5><br></br>
                        {/* <p style={{ color: '#139DC9', fontWeight: 'bold' }}>Claims Dashboard</p>  */}
                            {this.renderTopbar()}
                            <div className="row">
                                <div className="col-9">
                                    {this.renderCharts()}
                                    {/* {this.renderList()} */}
                                </div>
                                <div className="col-3">
                                    {this.renderSummary()}<br />
                                    {/* {this.renderErrors()} */}
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}