import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';

var val = ''
export class ClaimDetails837 extends React.Component{
    
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
            claimDetails: [],
            claimLineDetails: [],
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

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    componentDidMount(){
        this.getTransactions()
    }

    getTransactions(providerName){
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        if(!providerName){
            providerName = ''
        }

        let query = `{            
            Claim837RTProcessingSummary (page:${this.state.page},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"") {
                RecCount
                ClaimID
                ClaimDate
                Subscriber_ID
                Claim_Amount
                ClaimStatus
                ProviderLastName
                ProviderFirstName
                SubscriberLastName
                SubscriberFirstName
                adjudication_status
                ClaimLevelErrors
            }
        }`
        console.log(query)
        fetch(Urls.claim_processing, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.Claim837RTProcessingSummary
                if(data && data.length > 0){
                let recCount = data[0].RecCount ? Number(data[0].RecCount) : 0
                let TotalClaims = data[0].RecCount
                let count = 0

                try {
                    count = recCount / 10
                    count = count.floor(count)
                    if (recCount % 10 > 0) {
                        count = count + 1
                    }
                } catch (error) {

                }
                console.log(count)

                this.setState({
                    Claim837RTProcessingSummary: data,
                    recCount: count,
                    TotalClaims: TotalClaims,
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

    getDetails(claimId){
        let url = Urls.real_time_claim_details
        let query = `{
            Claim837RTDetails(ClaimID:"`+claimId+`") {
              ClaimID
              ClaimDate
              ClaimTMTrackingID
              Subscriber_ID
              Claim_Amount
              ClaimStatus
              ProviderLastName
              ProviderFirstName
              SubscriberLastName
              SubscriberFirstName
              adjudication_status
              ClaimLevelErrors
              AdmissionDate
              BillingProviderAddress
              BillingProviderCity_State_Zip
              ICDCode
              AccidentDate
            }
            Claim837RTLineDetails(ClaimID:"`+claimId+`") {
              ClaimID
              ServiceLineCount
              ProviderPaidAmount
              ServiceDate
              ProcedureDate
              PaidServiceUnitCount
            }
          }
          `

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
            if(res.data.Claim837RTDetails && res.data.Claim837RTDetails.length > 0){
                let data = res.data.Claim837RTDetails[0]
                let claimDetails = 
                [
                    { key: 'Claim HiPaaS Id', value: data.ClaimTMTrackingID },
                    { key: 'Claim Date', value: data.ClaimDate },
                    { key: 'Subscriber first name', value: data.SubscriberFirstName },
                    { key: 'Subscriber last name', value: data.SubscriberLastName },
                    { key: 'Admission date', value: data.AdmissionDate },
                    { key: 'Claim amount', value: data.Claim_Amount },
                    { key: 'Provider address', value: data.BillingProviderAddress },
                    { key: 'Claim Status', value: data.ClaimStatus },
                    { key: 'ICD Code', value: data.ICDCode },
                    { key: 'Accident Date', value: data.AccidentDate }
                ]
                this.setState({
                    showDetails: true,
                    claimDetails : claimDetails,
                    claimLineDetails : res.data.Claim837RTLineDetails,
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    } 

    renderRows(dictionary) {
        let row = []
        let col = []
        let count = 0

        dictionary.forEach(item => {
            col.push(
                <div className="col">
                    <div className="header">{item.key}</div>
                    <div>{item.value}</div>
                </div>
            )

            if (col.length % 4 == 0) {
                row.push(<div className="row">{col}</div>)
                col = []
            }
            count++
            if (count == dictionary.length && col.length > 0) {
                row.push(<div className="row">{col}</div>)
            }
        });

        return (
            <div className="summary-style">
                {row}
            </div>
        )
    }

    renderTransactions(){
        let row = []
        const data = this.state.Claim837RTProcessingSummary ? this.state.Claim837RTProcessingSummary : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td><a href="#" onClick={() => {
                        this.setState({
                            claimId : d.ClaimID
                        }, () => {
                            this.getDetails(d.ClaimID)
                        })
                    }} style={{ color: "#6AA2B8" }}>{d.ClaimID}</a></td>
                    <td>{d.ClaimDate}</td>
                    <td>{d.Claim_Amount}</td>
                    <td>{d.ClaimStatus}</td>
                    <td>{d.adjudication_status}</td>
                    <td>{d.ClaimLevelErrors}</td>
                </tr>
            )
        })
        return(
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head" style={{fontSize:"9px"}}>
                            <td className="table-head-text">Claim Id</td>
                            <td className="table-head-text list-item-style">Claim Date</td>
                            <td className="table-head-text list-item-style">Claim Amount</td>
                            <td className="table-head-text list-item-style">Claim Status</td>
                            <td className="table-head-text list-item-style">Current State</td>
                            <td className="table-head-text list-item-style">Error Code</td>
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
                    pageCount={this.state.recCount}
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

    onHandleChange(e){
        let providerName = e.target.value
        clearTimeout(val)
        val = setTimeout(() => {
            this.getTransactions(providerName)
        }, 300);
    }

    renderFilters(){
        return(
            <div className="form-style" id='filters'>
            <div className="form-row">
                <div className="form-group col-2">
                    <div className="list-dashboard">State</div>
                    <select className="form-control list-dashboard" id="state"
                        onChange={(event) => {
                            this.setState({
                                State: event.target.options[event.target.selectedIndex].text
                            }, () => {
                                this.getTransactions()
                            })
                        }}>
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
                    <input
                        onChange={(e) => this.onHandleChange(e)}
                        className="form-control" type="text" />
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
                        }}>
                        <option value="select"></option>
                        {this.getoptions()}
                    </select>
                </div>
            </div>
        </div>
        )
    }

    renderClaimDetails(){
        let row = []
        const data = this.state.claimLineDetails ? this.state.claimLineDetails : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.ClaimID}</td>
                    <td>{d.ServiceLineCount}</td>
                    <td>{d.ProviderPaidAmount}</td>
                    <td>{d.ServiceDate}</td>
                    <td>{d.ProcedureDate}</td>
                    <td>{d.PaidServiceUnitCount}</td>
                </tr>
            )
        })
        return(
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event'} data-toggle="collapse">Claim line data</a></div>
                    <div id={'event'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{fontSize:"9px"}}>
                                    <td className="table-head-text list-item-style">Claim Id</td>
                                    <td className="table-head-text list-item-style">Service line count</td>
                                    <td className="table-head-text list-item-style">Provider paid amount</td>
                                    <td className="table-head-text list-item-style">Service date</td>
                                    <td className="table-head-text list-item-style">Procedure date</td>
                                    <td className="table-head-text list-item-style">Paid service unit count</td>
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

    renderHeader(header) {
        return (
            <tr className="table-head">
                <td className="table-head-text">{header}</td>
            </tr>
        )
    }

    render() {
        return (
            <div>
                <label style={{color:"#139DC9" , fontWeight:"500" , marginTop:"10px", fontSize: '24px'}}>Claim Details</label>
                {this.renderFilters()}
                <div className="row">
                    <div className="col-6">
                        {this.renderTransactions()}
                    </div>
                    
                    <div className="col-6">
                        {
                            this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ? 
                                <table className="table claim-Details">
                                    {this.renderHeader('Claim #'+ this.state.claimId)}
                                    {this.renderRows(this.state.claimDetails) }
                                </table>
                            : null
                            }
                        {this.state.showDetails && this.state.claimLineDetails && this.state.claimLineDetails.length > 0 ? this.renderClaimDetails() : null}
                    </div>
                </div>
            </div>
        );
    }
}