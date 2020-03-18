import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import Strings from '../../../../helpers/Strings'
import { CommonTable } from '../../../components/CommonTable';
import { AutoComplete } from '../../../components/AutoComplete';
import { getProviders } from '../../../../helpers/getDetails';
import { StateDropdown } from '../../../components/StateDropdown';
import { Tiles } from '../../../components/Tiles';

let val = ''
export class ClaimProcessingSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            providers: [],
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
            Paid: 0,
            Pending: 0,
            Denide: 0,
            wip90: 0,
            orderby: '',

            fileNameFlag: 180,
            fileDateFlag: 180,
            extraField2Flag: 180,
            claimIDFlag: 180,
            createDateTimeFlag: 180,
            claimStatusFlag: 180,
            subscriber_IDFlag: 180,
            subscriberLastNameFlag: 180,
            subscriberFirstNameFlag: 180,
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
            Trading_PartnerList(RecType :"Inbound", Transaction:"Claim837RT") {
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

        let query = `{FileInCount(submitter:"${this.state.selectedTradingPartner}"  fromDt:"${this.state.startDate}" ToDt:"${this.state.endDate}" RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}") {
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
          } }`

        console.log(query)

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
                var data = res.data.FileInCount
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
                        Paid: data[0].Paid,
                        Pending: data[0].Pending,
                        Denide: data[0].denied,
                        wip90: data[0].WIP,
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
            Claim837RTProcessingSummary (page:${this.state.pageCount},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", FileID: "" , OrderBy:"` + this.state.orderby + `",Type:"", RecType:"Inbound") {
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
                F999
				F277
                TotalLinewise835
                TotalLine
                Transaction_Status
                ClaimRefId
                MolinaClaimID
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

    goto277 = () => {
        sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_277CAResponse)
        setTimeout(() => {
            window.location.reload()
        }, 50);
    }

    goto999 = (fileId) => {
        sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_response_999, {
            fileId: fileId
        })
        setTimeout(() => {
            window.location.reload()
        }, 50);
    }

    gotoDetails = () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type },
        ]

        this.props.history.push('/' + Strings.ClaimDetails837, {
            data : sendData
        })
    }

    renderTransactionsNew() {
        const data = this.state.Claim837RTProcessingSummary ? this.state.Claim837RTProcessingSummary : []
        let headerArray = []
        let rowArray = []

        headerArray.push(
            { value: 'File Name', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By Claim837RTProcessingSummary.FileName", this.state.fileNameFlag, 'fileNameFlag'), key: this.state.fileNameFlag },
            { value: 'File Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate" : "Order By Claim837RTProcessingSummary.FileCrDate", this.state.fileDateFlag, 'fileDateFlag'), key: this.state.fileDateFlag },
            { value: 'File Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2" : "Order By Claim837RTProcessingSummary.FileStatus", this.state.extraField2Flag, 'extraField2Flag'), key: this.state.extraField2Flag },
            { value: '999' },
            { value: 'Claim Id', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID" : "Order By Claim837RTProcessingSummary.MolinaClaimID", this.state.claimIDFlag, 'claimIDFlag'), key: this.state.claimIDFlag },
            { value: 'Claim Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime" : "Order By Claim837RTProcessingSummary.ClaimDate", this.state.createDateTimeFlag, 'createDateTimeFlag'), key: this.state.createDateTimeFlag },
            { value: 'Claim Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus" : "Order By Claim837RTProcessingSummary.ClaimStatus", this.state.claimStatusFlag, 'claimStatusFlag'), key: this.state.claimStatusFlag },
            // {value : 'Subscriber Last Name', method : () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberLastName" : "Order By Claim837RTProcessingSummary.SubscriberLastName", this.state.subscriberLastNameFlag, 'subscriberLastNameFlag') , key : this.state.subscriberLastNameFlag},
            // {value : 'Subscriber First Name', method : () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.SubscriberFirstName" : "Order By Claim837RTProcessingSummary.SubscriberFirstName", this.state.subscriberFirstNameFlag, 'subscriberFirstNameFlag') , key : this.state.subscriberFirstNameFlag},
            // {value : 'Provider Last Name'},
            // {value : 'Provider First Name'},
            // {value : 'Claim Amount'},
            { value: 'Subscriber Id', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.Subscriber_ID" : "Order By Claim837RTProcessingSummary.Subscriber_ID", this.state.subscriber_IDFlag, 'subscriber_IDFlag'), key: this.state.subscriber_IDFlag },
            { value: 'HiPaaS Status' },
            { value: 'Adjudication Status' },
            { value: '277CA' },
            { value: '835' },
        )

        rowArray.push(
            { value: 'FileName', method: this.gotoDetails, isClick: 1 },
            { value: 'FileCrDate', isDate: 1 },
            { value: 'FileStatus' },
            { value: 'F999', isClick: 1, method: this.goto999, key_argument : 'FileID' },
            { value: 'MolinaClaimID' },
            { value: 'ClaimDate', isDate: 1 },
            { value: 'ClaimStatus' },
            // { value : 'SubscriberLastName'},
            // { value : 'SubscriberFirstName'},
            // { value : 'ProviderLastName'},
            // { value : 'ProviderFirstName'},
            // { value: 'Claim_Amount', isAmount: 1 },
            { value: 'Subscriber_ID' },
            { value: 'Transaction_Status' },
            { value: 'adjudication_status' },
            { value: 'F277', isClick: 1, method: this.goto277 },
            // { value: 'TotalLine', secondVal: 'TotalLinewise835', isBar: 1 },
            { value: ''},
        )

        return (
            <CommonTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
                count={this.state.recCount}
                handlePageClick={this.handlePageClick}
            />
        )
    }

    handleSort = (e, rotation, key) => {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            orderby: e,
            [key]: rotation == 0 ? 180 : 0
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

    onHandleChange = (e) => {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            getProviders("Inbound", providerName)
                .then(list => {
                    this.setState({
                        providers: list
                    })
                }).catch(error => {
                    console.log(error)
                })
        }, 300);
    }

    onSelected = (value) => {
        this.setState({
            providerName: value
        }, () => {
            this.getCountData()
            this.getData()
        })
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

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this.getCountData()
            this.getData()
        })
    }

    renderTopBar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
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
                    <div className="col summary-container" style={{ marginTop: '-10px', paddingLeft: '16px' }}>
                        <div className="summary-header">WIP > 90 Days</div>
                        <div className="blue summary-title">{this.state.wip90}</div>
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

    _renderStats() {
        let _summary = [
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            { header: '999', value: this.state.Total999, style: "red summary-title" },
            { header: 'Sent To MCG', value: this.state.TotalSentToQNXT, style: "green summary-title" },
            { header: '277 CA', value: this.state.Total277CA, style: "red summary-title" },
            { header: 'Pending', value: this.state.Pending, style: "orange summary-title" },
            { header: 'Paid', value: this.state.Paid },
            { header: 'Denied', value: this.state.Denide }
        ]

        let row = []

        _summary.forEach(item => {
            row.push(
                <Tiles
                    header_text={item.header}
                    value={item.value}
                    isClickable={false}
                    _style={item.style}
                />
            )
        })
        return (

            <div className="row padding-left" style={{ marginBottom: '10px' }}>
                {row}
            </div>

        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claim Processing Summary</h5>
                {this.renderTopBar()}
                {this._renderStats()}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 ? this.renderTransactionsNew() : null}
            </div>
        );
    }
}