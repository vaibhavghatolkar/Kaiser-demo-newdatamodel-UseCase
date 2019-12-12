import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";

export class EligibilityDetails extends React.Component{
    
    constructor(props){
        super(props);

        this.state={
            claimsList : [],
            summaryList : [],
            showDetails: false,
            files_list : [],
            tradingpartner: [],

            State: props.match.params.State != 'n' ? props.match.params.State : '',
            status: props.match.params.status != 'n' ? props.match.params.status : '',
            startDate: props.match.params.startDate != 'n' ? props.match.params.startDate : '',
            endDate: props.match.params.endDate != 'n' ? props.match.params.endDate : '',
            transactionId: props.match.params.transactionId != 'n' ? props.match.params.transactionId : '',
            errorcode: '',
            
            selectedTradingPartner: '',
            page: 1,
            count : 0,
            apiflag: props.match.params.apiflag
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

    getData(){
        let query = `{
            Trading_PartnerList(Transaction:"EligibilityStatus")  {
                Trading_Partner_Name 
            }
        }`

        if(this.state.apiflag == 1){
            query = `{
                Trading_PartnerList(Transaction:"EligibilityStatus")  {
                    Trading_Partner_Name 
                }
            }`
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
                    tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : []
                })
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
        
        query = `{
            ClaimRequest_Datewise(TypeID:"`+typeId+`" page:`+this.state.page+` State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorCode:"`+this.state.errorcode+`") {
                RecCount
                HiPaaSUniqueID
                Date
                Trans_type
                Submiter
                Trans_ID
                Error_Code
                ErrorDescription
            }
        }`
        
        if(this.state.apiflag == 1){
            query = `{
                EligibilityAllDtlTypewise(TypeID:"`+typeId+`" page:`+this.state.page+` State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+startDate+`" EndDt:"`+endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorCode:"`+this.state.errorcode+`") {
                    RecCount
                    HiPaaSUniqueID
                    Date
                    Trans_type
                    Submiter
                    Trans_ID
                    Error_Code
                    ErrorDescription
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
                let count = 1
                let data = []
                if(this.state.apiflag == 1){
                    data = res.data.EligibilityAllDtlTypewise
                } else {
                    data = res.data.ClaimRequest_Datewise
                }
                
                if(data && data.length > 0){
                    count = Math.floor(data[0].RecCount / 10)
                    if(data[0].RecCount % 10 > 0){
                        count = count + 1
                    }
                }

                this.setState({
                    files_list : data,
                    count: count
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
        let query = `{
            ClaimRequest(HiPaaSUniqueID:"`+uuid+`") {
              Message
            }
            ClaimStatus277(HiPaaSUniqueID:"`+uuid+`") {
                Message
            }
        }`

        if(this.state.apiflag == 1){
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
                    <td><a href="#" onClick={() => {this.getDetails(d.HiPaaSUniqueID)}} style={{ color: "#6AA2B8" }}>{d.Trans_ID}</a></td>
                    <td>{moment.unix(d.Date/1000).format("DD MMM YYYY hh:mm:ss")}</td>
                    <td>{d.Trans_type}</td>
                    <td>{d.Submiter}</td>
                    <td>{d.Error_Code}</td>
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
                            <td className="table-head-text list-item-style">Trans Type</td>
                            <td className="table-head-text list-item-style">Submitter</td>
                            <td className="table-head-text list-item-style">Error Type</td>
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
            <div>
                <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">Transaction Request</a></div>
                <div className="border-view collapse" id={'hello' + flag}>{flag ? this.state.message_271 : this.state.message_270}</div>
            </div>
        )
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
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
    }

    renderTopbar() {
        return (
            <div className="row header">
                <div className="form-group col-3">
                    <div className="list-dashboard">Select State</div>
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

                <div className="form-group col-3">
                    <div className="list-dashboard">Select Trading Partner </div>
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
                    <div className="list-dashboard">Start Date</div>
                    <DatePicker 
                        className="datepicker"
                        selected={this.state.startDate}
                        onChange={this.handleStartChange}
                    />
                </div>
                <div className="form-group col-3">
                    <div className="list-dashboard">End Date</div>
                    <DatePicker 
                        className="datepicker"
                        selected={this.state.endDate}
                        onChange={this.handleEndChange}
                    />
                </div>
            </div>
        )
    }

    handleStartChange(date) {
        this.setState({
            startDate: date
        });
    }

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
    }

    renderDetailsheader(){
        return(
            <div className="row header">
                <div className="form-group col-sm-3">
                    <div className="list-dashboard">Transaction Id</div>
                    <input className="form-control list-dashboard" id="state"
                        onChange={(e) => {
                            this.setState({transactionId : e.target.value})
                        }}
                    />
                </div>
                {
                    this.state.status != 'Pass'
                    ?
                    <div className="form-group col-sm-3">
                        <div className="list-dashboard">Error Code</div>
                        <input className="form-control list-dashboard" id="state"
                            onChange={(e) => {
                                this.setState({errorcode : e.target.value})
                            }}
                        />
                    </div>
                    : null
                }
                <div className="form-group">
                    <div class="button"><a href='#' onClick={() => {this.getTransactions()}}>Search</a></div>
                </div>
            </div>
            
        )
    }

    render() {
        return (
            <div>
                {/* {this.renderSearchBar()} */}
                <div>
                    <label style={{color:"#139DC9" , fontWeight:"bold" , marginTop:"10px"}}>Transaction Details</label>
                    {this.renderTopbar()}
                    {this.renderDetailsheader()}
                    <div className="col-6" style={{float:"left"}}>
                        {this.renderTransactions()}
                    </div>
                    <div className="col-6" style={{float:"right"}}>
                        {this.state.showDetails ? this.renderDetails() : null}
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div>
            </div>
        );
    }
}