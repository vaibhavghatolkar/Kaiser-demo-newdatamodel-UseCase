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

const bardata = {
    labels: ['20:22', '20:23', '20:24', '20:25', '20:26', '20:27', '20:28'],
    showFile: false,
    datasets: [
        {
            label: 'Total Claims',
            backgroundColor: '#139DC9',
            borderColor: '#139DC9',
            borderWidth: 1,
            hoverBackgroundColor: '#139DC9',
            hoverBorderColor: '#139DC9',
            data: [100, 79, 85, 85, 89, 95, 83]
        }
    ],
    legend: {
        display: false
    }
};

var val = ''

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
            State: '',
            startDate: '',
            endDate: '',
            transactionId: '',
            selectedTradingPartner: '',
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
                console.log(this.state.apiflag)
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
                
                this.setState({
                    summaryList: summary,
                    pieArray: pieArray,
                    tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : []
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

    renderCharts(){
        const data = {
            labels: [
                'Success',
                'Errors'
            ],
            datasets: [{
                data: this.state.pieArray,
                backgroundColor: [
                '#139DC9',
                '#83D2B4'
                ],
                hoverBackgroundColor: [
                '#139DC9',
                '#83D2B4'
                ]
            }]
        };
        return(
            <div className="row chart">
                <div className="col-6">
                    <span className="title_graph">Execution Status Time</span>
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
                        height={60}/>
                </div>
                <div className="col-6">
                    <span className="title_graph">Execution Status</span>
                    <Bar
                        data={bardata}
                        width={100}
                        height={60}
                        options={{
                            legend: {
                                display: false,
                            }
                        }}/>
                </div>
            </div>
        )
    }

    gotoRealTimeTransactions(key){
        this.setState({
            key : key
        })

        // setTimeout(() => {
        //     this.getTransactions(key)
        // }, 50);
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

                <div className="form-group col-2">
                    <div className="list-dashboard">Transaction Id</div>
                    <input className="datepicker" onChange={(e) => {
                        clearTimeout(val)
                        let value = e.target.value
                        val = setTimeout(() => {
                            this.setState({transactionId : value, showDetails : false})
                            setTimeout(() => {
                                this.getData()
                            }, 50);
                        }, 300);
                    }}/>  
                </div>
            </div>
        </form>
        )
    }

    RealTime276MonthWiseData(){
        var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
 coll[i].addEventListener("click", function() {
   this.classList.toggle("active");
   var content = this.nextElementSibling;
  
   if (content.style.display === "block") {
     content.style.display = "none";
   } else {
     content.style.display = "block";
   }
 });
}
        return (
            <div className="container">
            <div className="panel-group">
                <div className="panel panel-default"  >
                    <div className="panel-heading collapsible" data-toggle="collapse" href="#BasicX12Options">
                        <span className="panel-title">2019</span>
                    </div>
                   
                    <div id="BasicX12Options"  className="panel-collapse content collapse">
                        <div style={{display:'block'}} className="panel-body">
                        <div className="col-12">
                        <button type="button" class="collapsible">November</button>
                        <div class="content" style={{display:'none'}}>
                        <table className="table">
                        <tr>
                        <td>1 Fri 2019</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td>
                        </tr>
                        <tr>
                        <td>2 Sat 2019</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td>
                        </tr>
                        <tr>
                        <td>3 Sun 2019</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td>
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
    

    render() {
        return (
            <div>
                {
                    <div>
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