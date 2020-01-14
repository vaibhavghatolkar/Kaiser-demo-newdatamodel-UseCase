import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";

let val = ''
export class ClaimProcessingSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            recCount: 0,
            pageCount: 1,
            Months: 0,
            selectedTradingPartner: "",
            State: "",
            providerName: "",
            startDate: "",
            endDate: "",
            TotalClaims : 0,
            Accepted : 0,
            Rejected : 0,
            TotalSentToQNXT : 0,
            Total999 : 0,
            Total277CA : 0
        }

        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
        this.getCountData()
        this.getData()
    }

    getCountData(){
        let query = `{
            Claim837RTDashboardCount (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"`+this.state.startDate+`", EndDt : "`+this.state.endDate+`") {
                TotalClaims
                Accepted
                Rejected
                Accepted_Per
                Rejected_Per
                Total999
                Total277CA
                TotalSentToQNXT
            }
        }`
        
        console.log(query)

        fetch(Urls.real_time_claim, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.Claim837RTDashboardCount
                if(data && data.length > 0){
                    let Accepted = data[0].Accepted
                    let Rejected = data[0].Rejected
                    let TotalSentToQNXT = data[0].TotalSentToQNXT
                    let Total999 = data[0].Total999
                    let Total277CA = data[0].Total277CA

                    this.setState({
                        Accepted: Accepted,
                        Rejected: Rejected,
                        TotalSentToQNXT: TotalSentToQNXT,
                        Total999: Total999,
                        Total277CA: Total277CA,
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    getData() {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
      
        let query = `{            
            Claim837RTProcessingSummary (page:${this.state.pageCount},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"") {
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
                let count = 0
                if(data && data.length > 0){
                    let recCount = data[0].RecCount
                    try {
                        count = recCount / 10
                        count = count.floor(count)
                        if (recCount % 10 > 0) {
                            count = count + 1
                        }
                    } catch (error) {

                    }
                    console.log(count)
                }

                this.setState({
                    Claim837RTProcessingSummary: data,
                    recCount: count,
                })
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

    handlePageClick(data, fileId) {
        let page = data.selected + 1
        this.setState({
            pageCount: page
        })

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderTransactions() {
        let row = []
        const data = this.state.Claim837RTProcessingSummary;

        data.forEach((d) => {
            var providerName = d.ProviderFirstName ? d.ProviderFirstName : '' + " " + d.ProviderLastName ? d.ProviderLastName : ''
            row.push(
                <tr>
                    <td className="list-item-style">{d.ClaimID}</td>
                    <td className="list-item-style">{d.ClaimDate}</td>
                    <td className="list-item-style">{d.Subscriber_ID}</td>
                    <td className="list-item-style">{d.SubscriberLastName}</td>
                    <td className="list-item-style">{d.SubscriberFirstName}</td>
                    <td className="list-item-style">{d.ProviderLastName}</td>
                    <td className="list-item-style">{d.ProviderFirstName}</td>
                    <td className="list-item-style">{d.Claim_Amount}</td>
                    <td className="list-item-style">{d.ClaimStatus}</td>
                </tr>
            )
        })
        return (
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head">
                            <td className="table-head-text"><small>Claim Id</small></td>
                            <td className="table-head-text"><small>Claim Date</small></td>
                            <td className="table-head-text"><small>Subscriber Id</small></td>
                            <td className="table-head-text"><small>Subscriber Last Name</small></td>
                            <td className="table-head-text"><small>Subscriber First Name</small></td>
                            <td className="table-head-text"><small>Provider Last Name</small></td>
                            <td className="table-head-text"><small>Provider First Name</small></td>
                            <td className="table-head-text"><small>Claim Amount</small></td>
                            <td className="table-head-text"><small>Claim Status</small></td>
                        </tr>
                    </thead>

                    {row}

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
                    onPageChange={(page) => { this.handlePageClick(page) }}
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

    onHandleChange(e){
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            this.setState({
                providerName : providerName
            }, () => {
                this.getCountData()
                this.getData()
            })
        }, 300);
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    renderTopBar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                this.setState({
                                    State: event.target.options[event.target.selectedIndex].text
                                }, () => {
                                    this.getCountData()
                                    this.getData()
                                })
                            }}
                        >
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
                        <input className="form-control" type="text" 
                            onChange={(e) => this.onHandleChange(e)}
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
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails : false
        });

        setTimeout(() => {
            this.getCountData()
            this.getData()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails : false
        });

        setTimeout(() => {
            this.getCountData()
            this.getData()
        }, 50);
    }

    renderStats() {
        return (
            <div className="row padding-left">
                { 
                    this.state.Accepted ? 
                    <div className="col-2 summary-container">
                        <div className="summary-header">Accepted</div>
                        <div className="summary-title">{this.state.Accepted}</div>
                    </div> : null 
                }
                { 
                    this.state.Rejected ? 
                    <div className="col-2 summary-container">
                        <div className="summary-header">Rejected</div>
                        <div className="summary-title">{this.state.Rejected}</div>
                    </div> : null 
                }
                { 
                    this.state.TotalSentToQNXT ? 
                    <div className="col-2 summary-container">
                        <div className="summary-header">Sent to QNXT</div>
                        <div className="summary-title">{this.state.TotalSentToQNXT}</div>
                    </div> : null 
                }

                { 
                    this.state.Total999 ? 
                    <div className="col-2 summary-container">
                        <div className="summary-header">999</div>
                        <div className="summary-title">{this.state.Total999}</div>
                    </div> : null 
                }
                { 
                    this.state.Total277CA ? 
                    <div className="col-2 summary-container">
                        <div className="summary-header">277 CA</div>
                        <div className="summary-title">{this.state.Total277CA}</div>
                    </div> : null 
                }
            </div>
        )
    }

    render() {
        return (
            <div>
                <br />
                <h5 style={{ color: '#139DC9', fontsize: "20px" }}>Claim Processing Summary</h5> <br />
                {this.renderTopBar()}
                {this.renderStats()}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 ? this.renderTransactions() : null}
            </div>
        );
    }
}