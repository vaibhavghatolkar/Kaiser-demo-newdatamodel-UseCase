import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../color.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';
import '../Files/files-styles.css';
import { CommonTable } from '../../components/CommonTable';
import { StateDropdown } from '../../components/StateDropdown';

var val = ''
export class Outbound_response_999 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            showDetails: false,
            transactionRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            errorRotation: 180,
            rotation: 180,
            files_list: [],
            tradingpartner: [],
            errorList: [],
            eventLog: [],
            Transaction_Compliance: '',
            State: "",
            status: "",
            startDate: "",
            endDate: "",
            transactionId: "",
            errorcode: "",
            transactionType: this.props.location.state ? (this.props.location.state.flag ? '837 Encounter' : '837') : "837",

            // selectedTradingPartner: props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            page: 1,
            count: 0,
            apiflag: 0,
            Response: '',

            pieArray: [],
            labelArray: [],
            orderby: '',
        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
        this.getTransactions()
    }

    getTransactions() {

        let query = ''
        let typeId = this.state.status
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let fileId = this.props.location.state ? (this.props.location.state.fileId ? this.props.location.state.fileId : '') : ""

        query = `{
                Data999(RecType: "Inbound", TrasactionType: "${this.state.transactionType}", FileId: "${fileId}", FileName: "", StartDt: "${startDate}", EndDt: "${endDate}") {
                  FileId
                  FileName
                  Date
                  Submitter
                  id
                  status
                  Response
                  TrasactionType
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

                    console.log(".fsdjhjsdgh", res.data.Data999)
                    this.setState({
                        files_list: res.data.Data999,

                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    showDetails() {
        this.setState({
            showDetails: true
        })
    }

    handlePageClick = (data) => {
        let page = data.selected + 1
        let flag = false
        if (page != this.state.page) {
            flag = true
        }

        this.setState({
            page: page
        })

        if (flag) {
            setTimeout(() => {
                this.getTransactions()
            }, 50)
        }
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
            this.getTransactions()
        }, 50);
    }

    render999Details(fileId) {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            Data999(RecType: "Inbound", TrasactionType: "${this.state.transactionType}", FileId: "${fileId}", FileName: "", StartDt: "${startDate}", EndDt: "${endDate}") {
              FileId
              FileName
              Date
              Submitter
              id
              status
              Response
              TrasactionType
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
                // alert(res.data.Data999[0].Response)
                if (res.data) {
                    this.setState({
                        Response: res.data.Data999[0].Response,
                        showDetails: true
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });

    }

    renderDetails(flag) {
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{flag ? '999 Acknowledgement' : 'Transaction Request'}</a></div>
                    <div className="border-view breakword" id={'hello' + flag}>{this.state.Response}</div>
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

    getErrorOptions() {
        let row = []
        this.state.errorList.forEach(element => {
            row.push(<option value="" selected={this.state.errorcode == element.ErrorType ? "selected" : ""}>{element.ErrorType}</option>)
        })
        return row
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Submitter') {
            this.setState({
                [key]: '',
                showDetails: false
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text,
                showDetails: false
            })
        }

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this.getTransactions()
        })
    }

    renderFilters() {
        return (
            <form className="form-style" id='filters'>
                <div className="form-row">

                    <div className="form-group col">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>

                    <div className="form-group col">
                        <div className="list-dashboard">Sender </div>
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

                    <div className="form-group col">
                        <div className="list-dashboard">
                            Transaction Type
                        </div>
                        <select className="form-control list-dashboard"
                            onChange={(event) => {
                                this.onSelect(event, 'transactionType')
                            }}
                        >
                            <option value="1"></option>
                            <option selected={this.state.transactionType == "837" ? "selected" : ""} value="837">837</option>
                            <option selected={this.state.transactionType == "837 Encounter" ? "selected" : ""} value="837 Encounter">837 Encounter</option>
                        </select>
                    </div>

                    {/* <div className="form-group col">
                        <div className="list-dashboard">
                            Provider Name

                        </div>
                        <select className="form-control list-dashboard"><option value=""></option>
                            <option selected="selected" value="1">Provider Name 1</option>
                            <option value="2">Provider Name 2</option>
                        </select>
                    </div> */}

                    <div className="form-group col">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker
                            className="form-control list-dashboard"
                            selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-dashboard"
                            selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                            onChange={this.handleEndChange}
                        />
                    </div>
                </div>
            </form>
        )
    }

    onClick = (value) => {
        this.render999Details(value)
    }

    renderTransactionsNew() {
        const data = this.state.files_list ? this.state.files_list : []
        let headerArray = []
        let rowArray = []
        headerArray.push(
            { value: 'FileName', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation'), key: this.state.transactionRotation, upScale: 1 },
            { value: 'Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation'), key: this.state.dateRotation },
            { value: 'Sender', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation'), key: this.state.submitterRotation },
            { value: 'Status' },
            { value: 'Trasaction Type' },

        )

        rowArray.push(
            { value: 'FileName', upScale: 1 },
            { value: 'Date', isDate: 1, isNottime: 1 },
            { value: 'Submitter' },
            { value: 'status' },
            { value: 'TrasactionType' }
        )

        return (
            <CommonTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
                count={this.state.count}
                handlePageClick={this.handlePageClick}
                onClickKey={'FileId'}
                onClick={this.onClick}
            />
        )
    }


    // renderMaterialTable(){
    //     return(
    //         <EnhancedTable/>
    //     )
    // }

    render() {
        return (
            <div>
                <h5 className="headerText">999 Acknowledgement (Outbound)</h5>
                {this.renderFilters()}
                <div className="row">
                    <div className="col-7 margin-top">
                        {/* {this.renderMaterialTable()} */}
                        {/* {this.renderEnhancedTable()} */}
                        {this.renderTransactionsNew()}
                    </div>
                    <div className="col-5">
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div>
            </div>
        );
    }
}