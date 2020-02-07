import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
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
            TotalClaims: 0,
            Accepted: 0,
            Rejected: 0,
            TotalSentToQNXT: 0,
            Total999: 0,
            Total277CA: 0,
            orderby: ''
        }

        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
        this.getCommonData()
        this.getCountData()
        this.getData()
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`

        console.log('query ', query)
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
                        tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    getCountData() {
        let query = `{
            Claim837RTDashboardCount (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", Type : ""   ) {
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
                if (data && data.length > 0) {
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
            Claim837RTProcessingSummary (page:${this.state.pageCount},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", FileID: "" , OrderBy:"` + this.state.orderby + `",Type:"") {
                RecCount
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
                ClaimUniqueID
                FileID
                FileName
                FileCrDate
                FileStatus
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
                if (data && data.length > 0) {
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
                    <td className="list-item-style">{d.FileName}</td>
                    <td className="list-item-style">{moment(d.FileCrDate).format('MMM D YYYY hh:mm a')}</td>
                    <td className="list-item-style">{d.FileStatus}</td>
                    <td className="list-item-style">{d.ClaimID}</td>
                    <td className="list-item-style">{moment(d.ClaimDate).format('MMM D YYYY hh:mm a') != 'Invalid date' ? moment(d.ClaimDate).format('MMM D YYYY hh:mm a') : d.ClaimDate}</td>
                    <td className="list-item-style">{d.ClaimStatus}</td>
                    <td className="list-item-style">{d.Subscriber_ID}</td>
                    <td className="list-item-style">{d.SubscriberLastName}</td>
                    <td className="list-item-style">{d.SubscriberFirstName}</td>
                    <td className="list-item-style">{d.ProviderLastName}</td>
                    <td className="list-item-style">{d.ProviderFirstName}</td>
                    <td className="list-item-style">{d.Claim_Amount}</td>

                </tr>
            )
        })


        return (
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head">
                            <td className="table-head-text"><small>File Name

                                </small> 
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName asc" : "Order By Claim837RTProcessingSummary.FileName asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName desc" : "Order By Claim837RTProcessingSummary.FileName desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>File Date</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate asc" : "Order By Claim837RTProcessingSummary.FileCrDate asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate desc" : "Order By Claim837RTProcessingSummary.FileCrDate desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>File Status</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2 asc" : "Order By Claim837RTProcessingSummary.FileStatus asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2 desc" : "Order By Claim837RTProcessingSummary.FileStatus desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Claim Id</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID asc" : "Order By Claim837RTProcessingSummary.ClaimID asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID desc" : "Order By Claim837RTProcessingSummary.ClaimID desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Claim Date</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime asc" : "Order By Claim837RTProcessingSummary.ClaimDate asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime desc" : "Order By Claim837RTProcessingSummary.ClaimDate desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Claim Status</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus asc" : "Order By Claim837RTProcessingSummary.ClaimStatus asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus desc" : "Order By Claim837RTProcessingSummary.ClaimStatus desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Subscriber Id</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.Subscriber_ID asc" : "Order By Claim837RTProcessingSummary.Subscriber_ID asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.Subscriber_ID desc" : "Order By Claim837RTProcessingSummary.Subscriber_ID desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Subscriber Last Name</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberLastName asc" : "Order By Claim837RTProcessingSummary.SubscriberLastName asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberLastName desc" : "Order By Claim837RTProcessingSummary.SubscriberLastName desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Subscriber First Name</small>
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberFirstName asc" : "Order By Claim837RTProcessingSummary.SubscriberFirstName asc")} src={require('../../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '13px' }}></img> */}
                                {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberFirstName desc" : "Order By Claim837RTProcessingSummary.SubscriberFirstName desc")} src={require('../../../components/Images/icons8-down-arrow-24.png')} style={{ width: '15px' }}></img> */}
                            </td>
                            <td className="table-head-text"><small>Provider Last Name</small></td>
                            <td className="table-head-text"><small>Provider First Name</small></td>
                            <td className="table-head-text"><small>Claim Amount</small></td>

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
    handleSort(e) {
        this.setState({
            orderby: e

        })
        setTimeout(() => {
            this.getData()
        }, 50);
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

    onHandleChange(e) {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            }, () => {
                this.getCountData()
                this.getData()
            })
        }, 300);
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            if (!element) {
                return
            }
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
            showDetails: false
        });

        setTimeout(() => {
            this.getCountData()
            this.getData()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
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
                <h5 style={{ color: 'var(--main-bg-color)', fontsize: "20px" }}>Claim Processing Summary</h5> <br />
                {this.renderTopBar()}
                {this.renderStats()}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 ? this.renderTransactions() : null}
            </div>
        );
    }
}