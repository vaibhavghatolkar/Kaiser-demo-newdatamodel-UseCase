import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import { getDetails } from '../../../../helpers/getDetails';
import DatePicker from "react-datepicker";
export class AuditSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartne837: [],
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            selectedTradingPartner: '',
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0,
            TotalClaims:'', 
            Accepted:'',
            Rejected:'',
            InProgress:'',           
            Total999 :'',
            Total277CA:'',  
            TotalSentToQNXT:'',  
             Paid:'', 
            denied:'',  
             WIP:'',
            Pending:''
        }

        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
      
        this.getData()
        this.getCommonData()
    }

     //   FileID
            //   filename
            //   Submitted
            //   Rejected
            //   Pending
            //   Verified
            //   Error
            //   InBizstock

    getData() {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        
        let query = `{
            ClaimsDailyAudit(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound"){
          

              FileID
              filename
              Submitted
              Accepted
              Rejected
              SentToQNXT
              Paid
              denied
              WIP
              Pending
              F277
              F999
            }
            ClaimsDailyAuditCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:""){
                SubTotal
                VeriTotal
                InBizstockTotal
                PenTotal
                RejTotal
                errTotal
            }
            FileInCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:"",RecType:"Inbound"){
                totalFile
                TotalClaims 
                Accepted
                Rejected
                InProgress           
                Total999 
                Total277CA  
                TotalSentToQNXT  
                 Paid 
                denied   
                 WIP
                Pending
            }
        }`
 console.log("sa,f.hdsfkfdhg" , query)
        fetch(Urls.claims_837, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.data) {
                    let totalFile = 0
                    try {
                        totalFile = res.data.FileInCount[0].totalFile
                    } catch (error) {

                    }
                   console.log("sdghusighsjgn", res.data.FileInCount[0])
                    this.setState({
                        claimsAudit: res.data.ClaimsDailyAudit,
                        SubTotal: res.data.ClaimsDailyAuditCount[0].SubTotal,
                        VeriTotal: res.data.ClaimsDailyAuditCount[0].VeriTotal,
                        InBizstockTotal: res.data.ClaimsDailyAuditCount[0].InBizstockTotal,
                        PenTotal: res.data.ClaimsDailyAuditCount[0].PenTotal,
                        RejTotal: res.data.ClaimsDailyAuditCount[0].RejTotal,
                        errTotal: res.data.ClaimsDailyAuditCount[0].errTotal,                      
                        totalFile: totalFile,                  
                        TotalClaims: res.data.FileInCount[0].TotalClaims,
                        Accepted: res.data.FileInCount[0].Accepted,
                        Rejected: res.data.FileInCount[0].Rejected,
                        InProgress: res.data.FileInCount[0].InProgress,
                        Total999: res.data.FileInCount[0].Total999,
                        Total277CA: res.data.FileInCount[0].Total277CA,
                         TotalSentToQNXT: res.data.FileInCount[0].TotalSentToQNXT,
                        Paid: res.data.FileInCount[0].Paid,
                        denied: res.data.FileInCount[0].denied,
                        WIP: res.data.FileInCount[0].WIP,
                        Pending: res.data.FileInCount[0].Pending
                        
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTransactions() {
        let row = []
        const data = this.state.claimsAudit;
        console.log("sd,fmsdjkdsjh"  , data)

        data.forEach((d) => {
            row.push(
                <tr>
                    <td><a onClick={() => { this.props.history.push('/' + Strings.ClaimProcessingSummary)}} style={{ color: "#6AA2B8", cursor: "pointer" }}>{d.filename}</a></td>
                    <td className="list-item-style">{d.Submitted}</td>
                    <td className="list-item-style">{d.Submitted}</td>
                    <td colSpan={2} className="list-item-style">{d.Accepted}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                    <td className="list-item-style">0</td>
                    <td className="list-item-style">{d.SentToQNXT}</td>
                    <td colSpan={2} className="list-item-style">{d.F999}</td>
                    <td colSpan={2} className="list-item-style">{d.F277}</td>
                  
                </tr>
            )
        });
        return (
            <table className="table table-bordered claim-list">
                <tr className="table-head">
                    <td className="table-head-text list-item-style">File Name <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Submitted <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td colSpan={2} className="table-head-text list-item-style">In HiPaaS <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Accepted PreProcess <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Rejected PreProcess <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Error in PreProcess <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    {/* <td className="table-head-text list-item-style">Accepted in Preprocess</td> */}
                    <td colSpan={2} className="table-head-text list-item-style">In Qnxt <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td  className="table-head-text list-item-style">999<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td  className="table-head-text list-item-style">277 CA<img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                </tr>
                <tbody >
                    <tr>
                        {/* <td>Totals</td>
                        <td className="list-item-style">{this.state.SubTotal}</td>
                        <td colSpan={2} className="list-item-style">{this.state.InBizstockTotal}</td>
                        <td className="list-item-style">{this.state.RejTotal}</td>
                        <td className="list-item-style">0</td>
                        <td colSpan={2} className="list-item-style">{this.state.VeriTotal}</td>
                        <td></td>
                        <td></td> */}
                        {/* <td className="list-item-style">{this.state.PenTotal}</td>
                        <td className="list-item-style">{this.state.errTotal}</td> */}
                    </tr>
                    {row}
                </tbody>
            </table>
        )
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.setState({
                [key]: ''
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`


        fetch(Urls.common_data, {
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
                  
                    this.setState({
                        tradingpartne837: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }
    renderStats() {
        return (
            <div className="row padding-left" >
              
                        <div className="col summary-container">
                            <div className="summary-header">Total Files</div>
                            <div className="green summary-title">{this.state.totalFile}</div>
                        </div> 
                        <div className="col summary-container">
                            <div className="summary-header">In HiPaaS</div>
        <div className="blue summary-title">{this.state.TotalClaims}</div>
                        </div> 
                        <div className="col summary-container">
                            <div className="summary-header">Accepted</div>
                            <div className="green summary-title">{this.state.Accepted}</div>
                        </div> 
                        <div className="col summary-container">
                            <div className="summary-header">Rejected</div>
                            <div className="orange summary-title">{this.state.Rejected}</div>
                        </div> 
                        <div className="col summary-container">
                            <div className="summary-header">999</div>
                            <div className="green summary-title">{this.state.Total999}</div>
                            </div> 
                                                               
                        <div className="col summary-container">
                            <div className="summary-header">Send To Qnxt</div>
                            <div className="green summary-title">{this.state.TotalSentToQNXT}</div>
                            </div>
                  
                         
                        
              
                        <div className="col summary-container">
                            <div className="summary-header">277 CA</div>
                            <div className="orange summary-title">{this.state.Total277CA}</div>
                        </div>
              
                       
                        </div>   
            
        )
    }
    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            // this.getCountData()
            this.getData()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            // this.getCountData()
            this.getData()
        }, 50);
    }

    renderTopBar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-dashboard" id="state"                      
                        >
                            <option value=""></option>
                            <option selected value="1">California</option>
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
                        <input className="form-control" type="text"
                            
                        />

                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                            onChange={this.handleEndChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                         onChange={(event) => {
                            this.onSelect(event, 'selectedTradingPartner')
                        }}
                        >
                          
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                </div>
            </div>
        )
    }
    getoptions() {
        console.log("sfsdsds" , this.state.tradingpartne837)
        let row = []
        this.state.tradingpartne837.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }
    render() {
        return (
            <div>
                <h5 className="headerText">Claims Audit Summary</h5>
                {this.renderTopBar()}
                {this.renderStats()}
                <div className="col-12" style={{padding:"0px"}}>
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 ? this.renderTransactions() : null}
                </div>
            </div>
        );
    }
}