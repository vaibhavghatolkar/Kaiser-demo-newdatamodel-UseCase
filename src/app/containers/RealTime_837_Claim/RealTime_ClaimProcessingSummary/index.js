import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";

export class ClaimProcessingSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            recCount: 0,
            pageCount: 0,
            Months: 0,
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
        this.getData()
    }

    getData() {
        // let query = `{
        //     ClaimsDailyAudit(submitter:"`+this.state.selectedTradingPartner+`",fromDt:"",ToDt:""){
        //       FileID
        //       filename
        //       Submitted
        //       Rejected
        //       Pending
        //       Verified
        //       Error
        //       InBizstock
        //     }
        //     ClaimsDailyAuditCount(submitter:"`+this.state.selectedTradingPartner+`",fromDt:"",ToDt:""){
        //         SubTotal
        //         VeriTotal
        //         InBizstockTotal
        //         PenTotal
        //         RejTotal
        //         errTotal
        //     }
        //     FileInCount(submitter:"`+this.state.selectedTradingPartner+`",fromDt:"",ToDt:""){
        //         totalFile
        //     }
        //     Trading_PartnerList(Transaction:"Claim837") { 

        //         Trading_Partner_Name 

        //     }
        // }`
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
      
        let query = `{

            
                Claim837RTProcessingSummary (page:${this.state.pageCount},Sender:"",State:"",Provider:"",StartDt:"${startDate}",EndDt:"${endDate}") {
                  RecCount
                  Accepted
                  Rejected
                  Total999
                  Total277CA
                  TotalSentToQNXT
                  ClaimID
                  ClaimDate
                  ClaimTMTrackingID
                  Subscriber_ID
                  Claim_Amount
                  ClaimStatus
                  ProviderLastName
                  ProviderFirstName
                } 
                  
             
        }`
        console.log(query)
        fetch(Urls.base_url, {
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
                let recCount = data[0].RecCount
                let TotalClaims = data[0].RecCount
                let Accepted = data[0].Accepted
                let Rejected = data[0].Rejected
                let TotalSentToQNXT = data[0].TotalSentToQNXT
                let Total999 = data[0].Total999
                let Total277CA = data[0].Total277CA
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
                    Accepted: Accepted,
                    Rejected: Rejected,
                    TotalSentToQNXT: TotalSentToQNXT,
                    Total999: Total999,
                    Total277CA: Total277CA,
                })
                // if(res.data){
                //     let totalFile = 0
                //     try {
                //         totalFile = res.data.FileInCount[0].totalFile
                //     } catch (error) {

                //     }

                //     this.setState({
                //         claimsAudit: res.data.ClaimsDailyAudit,
                //         SubTotal : res.data.ClaimsDailyAuditCount[0].SubTotal,
                //         VeriTotal : res.data.ClaimsDailyAuditCount[0].VeriTotal,
                //         InBizstockTotal : res.data.ClaimsDailyAuditCount[0].InBizstockTotal,
                //         PenTotal : res.data.ClaimsDailyAuditCount[0].PenTotal,
                //         RejTotal : res.data.ClaimsDailyAuditCount[0].RejTotal,
                //         errTotal : res.data.ClaimsDailyAuditCount[0].errTotal,
                //         tradingpartner: res.data.Trading_PartnerList,
                //         totalFile : totalFile
                //     })
                // }
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
                    <td>{d.ClaimID}</td>
                    <td>{d.ClaimDate}</td>
                    <td>{d.Claim_Amount}</td>
                    <td>{d.ClaimStatus}</td>
                    <td>{d.Subscriber_ID}</td>
                    <td>{providerName ? providerName : ''}</td>

                </tr>
            )
        });
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr className="table-head">
                            <td className="table-head-text"><small>Claim Id</small></td>
                            <td className="table-head-text"><small>Claim Date</small></td>
                            <td className="table-head-text"><small>Claim Amount</small></td>
                            <td className="table-head-text"><small>Claim Status</small></td>
                            <td className="table-head-text"><small>Subscriber Id</small></td>
                            <td className="table-head-text"><small>Provider Name</small></td>
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
        if (event.target.options[event.target.selectedIndex].text == 'Select Provider Name' || event.target.options[event.target.selectedIndex].text == 'Select Trading Partner') {
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

    renderTopBar() {
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
                        {/* {this.getoptions()} */}
                    </select>
                </div>
                <div className="form-group col-2">
                    <div className="list-header-dashboard">Provider</div>
                    <input className="form-control" type="text" />

                </div>
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
        )
    }

    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails : false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails : false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderStats() {
        return (
            <div className="row">
                {/* <div className="col-2">
                    <div className="center-align">Total Files</div>
                    <div className="center-align"><a href="#" className="blue bold-text summary-values" 
                    ><Link to={'/' + Strings.claimDetails + '/n/n/n/n'}>{this.state.totalFile}</Link></a></div>
                </div> */}
                <div className="col-2">
                    <div className="center-align">Total Claims</div>
            <div className="blue bold-text summary-values center-align">{this.state.TotalClaims}</div>
                </div>
                <div className="col-2">
                    <div className="center-align">Accepted</div>
            <div className="blue bold-text summary-values center-align">{this.state.Accepted}</div>
                </div>
                <div className="col-2">
                    <div className="center-align">Rejected</div>
            <div className="blue bold-text summary-values center-align">{this.state.Rejected}</div>
                </div>
                <div className="col-2">
                    <div className="center-align">Sent to QNXT</div>
            <div className="blue bold-text summary-values center-align">{this.state.TotalSentToQNXT}</div>
                </div>
                <div className="col-2">
                    <div className="center-align">999</div>
                    <div className="green bold-text summary-values center-align">{this.state.Total999}</div>
                </div>
                <div className="col-2">
                    <div className="center-align">277 CA</div>
            <div className="red bold-text summary-values center-align">{this.state.Total277CA}</div>
                </div>
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