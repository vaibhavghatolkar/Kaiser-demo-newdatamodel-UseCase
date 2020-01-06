import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';

var val = ''
export class EligibilityDetails extends React.Component{
    
    constructor(props){
        super(props);

        this.state={
            claimsList : [],
            summaryList : [],
            showDetails: false,
            files_list : [],
            tradingpartner: [],
            errorList: [],
            eventLog: [],
            Transaction_Compliance: '',

            State: props.match.params.State != 'n' ? props.match.params.State : '',
            status: props.match.params.status != 'n' ? props.match.params.status : '',
            startDate: props.match.params.startDate != 'n' ? props.match.params.startDate : '',
            endDate: props.match.params.endDate != 'n' ? props.match.params.endDate : '',
            transactionId: props.match.params.transactionId != 'n' ? props.match.params.transactionId : '',
            errorcode: '',
            
            selectedTradingPartner: props.match.params.selectedTradingPartner != 'n' ? props.match.params.selectedTradingPartner : '',
            page: 1,
            count : 0,
            apiflag: props.match.params.apiflag,

            pieArray : [],
            labelArray : [],
        }

        this.getData = this.getData.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            this.getData()
            this.getTransactions()
        }, 50);
    }

    componentDidMount(){
        this.getData()
        this.getTransactions()
    }

    getData(uuid){
        let query = ''
        if(uuid){
            query = `{
                EventLogData(HiPaaS_UUID:"`+uuid+`") {
                    HiPaaS_UUID
                    EventName
                    EventCreationDateTime
                    Exception
                    ErrorMessage
                    Transaction_Compliance
                }
            }`
        } else {
            query = `{
                Trading_PartnerList(Transaction:"EligibilityStatus")  {
                    Trading_Partner_Name 
                }
                ErrorType_List(Transaction: "Eligibility") {
                    ErrorType
                }
            }`
    
            if(this.state.apiflag == 1){
                query = `{
                    Trading_PartnerList(Transaction:"EligibilityStatus")  {
                        Trading_Partner_Name 
                    }
                    ErrorType_List(Transaction: "Eligibility") {
                        ErrorType
                    }
                }`
            }   
        }

        console.log(query)

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
                if(uuid){
                    this.setState({
                        eventLog: res.data.EventLogData,
                        Transaction_Compliance : res.data.EventLogData && res.data.EventLogData.length > 0 ? res.data.EventLogData[0].Transaction_Compliance : ''
                    })
                } else {
                    this.setState({
                        tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                        errorList: res.data.ErrorType_List ? res.data.ErrorType_List : [],
                    })
                }
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    getTransactions(){
        let query = ''
        let typeId = this.state.status
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let chartQuery = ''
        let url = Urls.claimstatus

        if(this.state.apiflag == 1 && this.state.status != 'Pass'){
            chartQuery = `Eligibilty271ErrorwiseCount(State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorType:"`+this.state.errorcode+`") {
                                ErrorType
                                RecCount
                            }`
        }

        query = `{
            ClaimRequest_Datewise(TypeID:"`+typeId+`" page:`+this.state.page+` State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorType:"`+this.state.errorcode+`") {
                RecCount
                HiPaaSUniqueID
                Date
                Trans_type
                Submiter
                Trans_ID
                Error_Type
                Error_Code
                ErrorDescription
            }`+chartQuery+`
        }`
        
        if(this.state.apiflag == 1){
            url = Urls.eligibility_url
            query = `{
                EligibilityAllDtlTypewise(TypeID:"`+typeId+`" page:`+this.state.page+` State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorType:"`+this.state.errorcode+`") {
                    RecCount
                    HiPaaSUniqueID
                    Date
                    Trans_type
                    Submiter
                    Trans_ID
                    Error_Type
                    Error_Code
                    ErrorDescription
                }`+chartQuery+`
            }`
        }

        console.log('query ', query)

        fetch(url, {
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
                let count = 1
                let data = []
                let pieArray = []
                let labelArray = []
                
                if(this.state.apiflag == 1){
                    data = res.data.EligibilityAllDtlTypewise
                } else {
                    data = res.data.ClaimRequest_Datewise
                }

                if(this.state.status != "Pass" && res.data.Eligibilty271ErrorwiseCount){
                    res.data.Eligibilty271ErrorwiseCount.forEach(item => {
                        pieArray.push(item.RecCount)
                        labelArray.push(item.ErrorType)
                    })
                }
                
                if(data && data.length > 0){
                    count = Math.floor(data[0].RecCount / 10)
                    if(data[0].RecCount % 10 > 0){
                        count = count + 1
                    }
                }

                this.setState({
                    files_list : data,
                    count: count,
                    pieArray: pieArray,
                    labelArray: labelArray,
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

    showDetails(){
        this.setState({
            showDetails: true
        })
    }

    handlePageClick(data){
        let page = data.selected + 1
        this.setState({
            page : page
        })

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    getDetails(uuid){
        let url = Urls.claimstatus

        let query = `{
            ClaimRequest(HiPaaSUniqueID:"`+uuid+`") {
              Message
            }
            ClaimStatus277(HiPaaSUniqueID:"`+uuid+`") {
                Message
            }
        }`

        if(this.state.apiflag == 1){
            url = Urls.eligibility_url
            query = `{
                Eligibilty270Request(HiPaaSUniqueID:"`+uuid+`") {
                  Message
                }
                Eligibilty271Response(HiPaaSUniqueID:"`+uuid+`") {
                    Message
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
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(res => {
            if(res.data){
                this.setState({
                    showDetails: true,
                    message_270 : this.state.apiflag == 1 ? res.data.Eligibilty270Request[0].Message : res.data.ClaimRequest[0].Message,
                    message_271 : this.state.apiflag == 1 ? res.data.Eligibilty271Response[0].Message : res.data.ClaimStatus277[0].Message,
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    } 

    renderTransactions(){
        let row = []
        const data = this.state.files_list ? this.state.files_list : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td><a href="#" onClick={() => {
                        this.getData(d.HiPaaSUniqueID)
                        this.getDetails(d.HiPaaSUniqueID)
                    }} style={{ color: "#6AA2B8" }}>{d.Trans_ID}</a></td>
                    <td>{d.Date}</td>
                    <td>{d.Trans_type}</td>
                    <td>{d.Submiter}</td>
                    {this.state.status != 'Pass' ? <td>{d.Error_Type}</td> : null}
                    {this.state.status != 'Pass' ? <td>{d.Error_Code}</td> : null}
                    {this.state.status != 'Pass' ? <td>{d.ErrorDescription}</td> : null}
                </tr>
            )
        })
        return(
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head" style={{fontSize:"9px"}}>
                            <td className="table-head-text">Transaction Id</td>
                            <td className="table-head-text list-item-style">Transaction Date</td>
                            <td className="table-head-text list-item-style">Status</td>
                            <td className="table-head-text list-item-style">Submitter</td>
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Type</td> : null}
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Code</td> : null}
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Description</td> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
                    pageCount={this.state.count}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(page) => {this.handlePageClick(page)}}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    previousClassName={'page-link'}
                    nextClassName={'page-link'}
                    pageLinkClassName={'page-link'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    />
            </div>
        )
    }

    renderDetails(flag){
        return(
            <div className="row">
                {this.state.status != 'n' ? <div className="col-1"></div> : null}
                <div className={this.state.status == 'n' ? "col-12" : "col-11"}>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{flag ? 'Transaction Response' : 'Transaction Request'}</a></div>
                    <div className="border-view collapse" id={'hello' + flag}>{flag ? this.state.message_271 : this.state.message_270}</div>
                </div>
            </div>
        )
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="" selected={this.state.selectedTradingPartner == element.Trading_Partner_Name ? "selected" : ""}>{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    getErrorOptions(){
        let row = []
        this.state.errorList.forEach(element => {
            row.push(<option value="" selected={this.state.errorcode == element.ErrorType ? "selected" : ""}>{element.ErrorType}</option>)
        })
        return row
    }
    
    onSelect(event, key){
        if(event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Submitter'){
            this.setState({
                [key] : '',
                showDetails : false
            })
        } else {
            this.setState({
                [key] : event.target.options[event.target.selectedIndex].text,
                showDetails : false
            })
        }

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails : false
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails : false
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    renderPieChart(){
        const data = {
            labels: this.state.labelArray,
            datasets: [{
                data: this.state.pieArray,
                backgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DCA15',
                    '#03d9c6',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DCA15',
                    '#03d9c6',
                ]
            }],
            flag: ''
        };
        return(
            <div>
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
                    width={80}
                    height={40} />
            </div>
        )
    }

    renderFilters(){
        return(
                <form className="form-style" id='filters'>
                    <div className="form-row">
                        <div className="form-group col-md-2">
                            <div className="list-dashboard">Transaction Id</div>
                            <input className="form-control list-dashboard"
                                id="state"
                                onChange={(e) => {
                                    clearTimeout(val)
                                    let value = e.target.value
                                    val = setTimeout(() => {
                                        this.setState({transactionId : value, showDetails : false})
                                        setTimeout(() => {
                                            this.getTransactions()
                                        }, 50);
                                    }, 300);
                                }}
                            />
                        </div>
                        <div className="form-group col-md-2">
                            <div className="list-dashboard">State</div>
                            <select className="form-control list-dashboard" id="state"
                                onChange={(event) => {
                                    this.onSelect(event, 'State')
                                }}
                            >
                                <option selected={this.state.State == "" ? "selected" : ""} value=""></option>
                                <option selected={this.state.State == "California" ? "selected" : ''} value="1">California</option>
                                <option selected={this.state.State == "Michigan" ? "selected" : ''} value="2">Michigan</option>
                                <option selected={this.state.State == "Florida" ? "selected" : ''} value="3">Florida</option>
                                <option selected={this.state.State == "New York" ? "selected" : ''} value="4">New York</option>
                                <option selected={this.state.State == "Idaho" ? "selected" : ''} value="5">Idaho</option>
                                <option selected={this.state.State == "Ohio" ? "selected" : ''} value="6">Ohio</option>
                                <option selected={this.state.State == "Illinois" ? "selected" : ''} value="7">Illinois</option>
                                <option selected={this.state.State == "Texas" ? "selected" : ''} value="8">Texas</option>
                                <option selected={this.state.State == "Mississippi" ? "selected" : ''} value="9">Mississippi</option>
                                <option selected={this.state.State == "South Carolina" ? "selected" : ''} value="10">South Carolina</option>
                                <option selected={this.state.State == "New Mexico" ? "selected" : ''} value="11">New Mexico</option>
                                <option selected={this.state.State == "Puerto Rico" ? "selected" : ''} value="12">Puerto Rico</option>
                                <option selected={this.state.State == "Washington" ? "selected" : ''} value="13">Washington</option>
                                <option selected={this.state.State == "Utah" ? "selected" : ''} value="14">Utah</option>
                                <option selected={this.state.State == "Wisconsin" ? "selected" : ''} value="15">Wisconsin</option>
                            </select>
                        </div>
                        
                        <div className="form-group col-md-2">
                            <div className="list-dashboard">Submitter </div>
                            <select className="form-control list-dashboard" id="TradingPartner"
                                onChange={(event) => {
                                    this.onSelect(event, 'selectedTradingPartner')
                                    setTimeout(() => {
                                        this.getTransactions()
                                    }, 50);
                                }}
                            >
                                <option value="select"></option>
                                {this.getoptions()}
                            </select>
                        </div>

                        {
                            this.state.status != 'Pass'
                            ?
                            <div className="form-group col-md-2">
                                <div className="list-dashboard">Error Type</div>
                                <select className="form-control list-dashboard" id="TradingPartner"
                                    onChange={(event) => {
                                        this.onSelect(event, 'errorcode')
                                        setTimeout(() => {
                                            this.getTransactions()
                                        }, 50);
                                    }}
                                >
                                    <option value="select"></option>
                                    {this.getErrorOptions()}
                                </select>
                            </div>
                            : null
                        }
                        <div className="form-group col-md-2">
                            <div className="list-dashboard">Start Date</div>
                            <DatePicker 
                                className="datepicker"
                                selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                                onChange={this.handleStartChange}
                            />
                        </div>
                        <div className="form-group col-md-2">
                            <div className="list-dashboard">End Date</div>
                            <DatePicker 
                                className="datepicker"
                                selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                                onChange={this.handleEndChange}
                            />
                        </div>
                    </div>
                </form>
        )
    }

    renderEventLog(){
        let row = []
        const data = this.state.eventLog ? this.state.eventLog : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.EventName}</td>
                    <td>{moment.unix(d.EventCreationDateTime/1000).format('DD MMM YYYY hh:mm:ss')}</td>
                    <td>{d.Exception}</td>
                </tr>
            )
        })
        return(
            <div className="row">
                {this.state.status != 'n' ? <div className="col-1"></div> : null}
                <div className={this.state.status == 'n' ? "col-12" : "col-11"}>
                    <div className="top-padding"><a href={'#' + 'event'} data-toggle="collapse">Stage Details ({this.state.Transaction_Compliance})</a></div>
                    <div id={'event'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{fontSize:"9px"}}>
                                    <td className="table-head-text list-item-style">Stage</td>
                                    <td className="table-head-text list-item-style">Execution Time</td>
                                    <td className="table-head-text list-item-style">Exception</td>
                                </tr>
                            </thead>
                            <tbody>
                                {row}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <label style={{color:"#139DC9" , fontWeight:"500" , marginTop:"10px", fontSize: '24px'}}>{this.state.apiflag == 0 ? (this.state.status == 'Fail' ? 'Claim Errors' : 'Claim Details') : (this.state.status == 'Fail' ? 'Eligibility Errors' : 'Eligibility Details')}</label>
                {this.renderFilters()}
                <div className="row">
                    <div className="col-6">
                        {this.renderTransactions()}
                    </div>
                    
                    <div className="col-6">
                        {/* {this.state.status != 'Pass' && this.state.pieArray.length > 0 ? this.renderPieChart() : null} */}
                        {this.state.showDetails && this.state.eventLog && this.state.eventLog.length > 0 ? this.renderEventLog(1) : null}
                        {this.state.showDetails ? this.renderDetails() : null}
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div>
            </div>
        );
    }
}