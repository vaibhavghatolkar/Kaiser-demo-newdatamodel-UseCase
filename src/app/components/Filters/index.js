import React from 'react'
import '../../containers/Files/files-styles.css'
import "../../containers/color.css";
// import { Link } from 'react-router-dom'
import moment from 'moment';
import { StateDropdown } from '../StateDropdown';
import DatePicker from "react-datepicker";
import Strings from '../../../helpers/Strings';
import Urls from '../../../helpers/Urls';
import { getProviders } from '../../../helpers/getDetails';
// import { AutoComplete } from '../AutoComplete';

let val = ''
let val_in = ''
let val_trans = ''
let filterClaimId = ''
export class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            selectedTradingPartner: '',
            State: this.props.State ? this.props.State : '',
            tradingpartner: [],
            providers: [],
            Filter_ClaimId: this.props.Filter_ClaimId ? this.props.Filter_ClaimId : '',
            transactionId: this.props.transactionId ? this.props.transactionId : '',
            TransactionMasterList: [],
            transOptions: [],
        }
    }

    componentDidMount() {
        this.getCommonData()
        this.getTransactiondata()
        if (this.props.isTransType) {
            this.getTransOptions()
        }
    }

    getCommonData = async () => {
        let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
        let submitter_key = "Claim837RT"
        if (this.props.submitter_key) {
            submitter_key = this.props.submitter_key
        }
        let query = `{
            Trading_PartnerList(RecType :"${isOutbound ? "Outbound" : "Inbound"}", Transaction:"${submitter_key}") {
                Trading_Partner_Name 
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
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
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getTransactiondata() {
        let query = `{      
            TransactionMaster  {                  
                Trans_Code
                Transaction_Type
            }           
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
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

                this.setState({
                    TransactionMasterList: res.data.TransactionMaster

                })
            })

            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    getTransOptions = () => {
        let query = `{
            Transaction834_DropDown {
              transtype
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
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
                        transOptions: res.data.Transaction834_DropDown ? res.data.Transaction834_DropDown : [],
                    })

                    if (res.data.Transaction834_DropDown && res.data.Transaction834_DropDown.length > 0) {
                        this.props.update('transType', res.data.Transaction834_DropDown[0].transtype)
                    }
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }


    _handleStateChange = (event) => {
        this.props.update('State', event.target.options[event.target.selectedIndex].text)
    }

    handleStartChange = (date) => {
        this.setState({
            startDate: date
        }, () => {
            this.props.update('startDate', date)
        })
    };

    handleEndChange = (date) => {
        this.setState({
            endDate: date
        }, () => {
            this.props.update('endDate', date)
        })
    }

    onSelect = (event, name) => {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.props.update(name, '')
        } else {
            if (name == 'selectedTradingPartner') {
                this.props.update(name, event.target.options[event.target.selectedIndex].value)
            } else {
                this.props.update(name, event.target.options[event.target.selectedIndex].text)
            }
        }
    }


    onSelected = (value) => {
        this.props.update('providerName', value)
    }
    onChangeName = (value, name) => {
        this.props.update(name, value)
    }
    getoptions = () => {
        let row = []
        this.state.tradingpartner.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value={element.Trading_Partner_Name}>{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    getTransData = () => {
        let row = []
        this.state.TransactionMasterList.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value={element.Trans_Code}>{element.Trans_Code}</option>)
        })
        return row

    }

    renderTransOptions = () => {
        let row = []
        this.state.transOptions.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.transtype}</option>)
        })
        return row
    }

    onHandleChange = (event) => {
        clearTimeout(val)
        let providerName = event.target.value
        let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
        val = setTimeout(() => {
            getProviders(isOutbound ? 'Outbound' : 'Inbound', providerName)
                .then(list => {
                    this.setState({
                        providers: list
                    })
                }).catch(error => {
                    process.env.NODE_ENV == 'development' && console.log(error)
                })
        }, 300);
    }

    changeFilterInput = (event) => {
        let passing_val = event.target.value
        this.setState({
            Filter_ClaimId: passing_val
        }, () => {
            clearTimeout(val_in)
            val_in = setTimeout(() => {
                this.onChangeName(passing_val, 'Filter_ClaimId')
            }, 750);
        })
    }

    changeTransaction = (event) => {
        clearTimeout(val_trans)
        let passing_val = event.target.value
        val_trans = setTimeout(() => {
            this.onChangeName(passing_val, 'transactionId')
        }, 300);
    }

    renderFilters = () => {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    {
                        !this.props.removeState ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">State</div>
                                <StateDropdown
                                    selected_state={this.props.State}
                                    method={this._handleStateChange}
                                />
                            </div> : null
                    }
                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
                        />
                    </div> */}

                    {
                        this.props.isTransType ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">
                                    Transaction Type
                                </div>
                                <select className="form-control list-dashboard"
                                    onChange={(event) => {
                                        this.onSelect(event, 'transType')
                                    }}
                                >
                                    {this.renderTransOptions()}
                                    {/* <option selected={this.props.transactionType == "837 Encounter" ? "selected" : ""} value="837 Encounter">837 Encounter</option> */}
                                </select>
                            </div> : null
                    }

                    {
                        !this.props.removeSubmitter ?
                            (this.props.isDiffSubmitter ?
                                <div className="form-group col-2">
                                    <div className="list-dashboard">
                                        Transaction Type
                                </div>
                                    <select className="form-control list-dashboard"
                                        onChange={(event) => {
                                            this.onSelect(event, 'transactionType')
                                        }}
                                        defaultValue={this.props.transactionType}
                                    >
                                        <option value="1"></option>
                                        {!this.props.isEncounter ?
                                        this.props.is837 ? <option value="837Encounters">837</option> : 
                                            
                                        (this.props._is835 ?
                                                <option value="835">835</option> :
                                                <option value="837">837</option>) : null
                                        }
                                        {this.props.isEncounter ? <option value="837Encounters">837 Encounter</option> : null}
                                        

                                    </select>
                                </div>
                                :
                                <div className="form-group col-2">
                                    <div className="list-dashboard">Submitter</div>
                                    <select className="form-control list-dashboard" id="TradingPartner"
                                        value={this.props.selectedTradingPartner}
                                        onChange={(event) => {
                                            this.onSelect(event, 'selectedTradingPartner')
                                        }}>
                                        <option value=""></option>
                                        {this.getoptions()}
                                    </select>
                                </div>)
                            : null
                    }{
                        this.props.isPayer ? 
                        <div className="form-group col-2">
                                    <div className="list-dashboard">Payer</div>
                                    <select className="form-control list-dashboard" id="TradingPartner"
                                        value={this.props.payer}
                                        onChange={(event) => {
                                            this.onSelect(event, 'payer')
                                        }}>
                                        <option value=""></option>
                                        <option value="Anthem Blue Cross">Anthem Blue Cross</option>
                                        <option value="Molina Healthcare">Molina Healthcare</option>
                                        <option value="Blue Shield of California">Blue Shield of California</option>
                                        <option value="Sharp Health Plan">Sharp Health Plan</option>
                                        <option value="Health Net">Health Net</option>
                                    </select>
                                </div> : null
                    }
                    {
                        this.props.isTimeRange ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Time Range</div>
                                <select
                                    className="form-control list-dashboard" id="state"
                                    onChange={(event) => {
                                        let day = 0
                                        let chartType = ''
                                        let selected_val = event.target.options[event.target.selectedIndex].text

                                        if (selected_val == 'Last week') {
                                            day = 7
                                            chartType = 'Datewise'
                                        } else if (selected_val == 'Last 30 days') {
                                            day = 30
                                            chartType = 'Weekwise'
                                        } else if (selected_val == 'Last 90 days') {
                                            day = 90
                                        } else if (selected_val == 'Last 180 days') {
                                            day = 180
                                        } else if (selected_val == 'Last year') {
                                            day = 365
                                        }

                                        let startDate = moment().subtract(day, 'd').format('YYYY-MM-DD')
                                        let endDate = moment().format('YYYY-MM-DD')

                                        if (!selected_val) {
                                            startDate = ''
                                            endDate = ''
                                        }
                                        this.props.setData(startDate, endDate, selected_val, chartType)
                                    }}

                                    defaultValue={this.props.changeDefault ? 'halfYear' : 'year'}
                                >
                                    <option value="1">Last week</option>
                                    <option value="2">Last 30 days</option>
                                    <option value="2">Last 90 days</option>
                                    <option value="halfYear">Last 180 days</option>
                                    <option value="year">Last year</option>
                                </select>
                            </div> : null
                    }{
                        !this.props.removeStartDate ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Start Date</div>
                                <DatePicker className="form-control list-dashboard"
                                    selected={this.props.startDate ? new Date(moment(this.props.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                                    onChange={this.handleStartChange}
                                    maxDate={this.props.endDate ? new Date(moment(this.props.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                                />
                            </div>
                            : null
                    }
                    {
                        !this.props.removeEndDate ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">End Date</div>
                                <DatePicker className="form-control list-dashboard"
                                    selected={this.props.endDate ? new Date(moment(this.props.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                                    onChange={this.handleEndChange}
                                    minDate={this.props.startDate ? new Date(moment(this.props.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                                />
                            </div>

                            : null
                    }
                    {
                        // !this.props.removeGrid ?
                        //     <div className="form-group col-2">
                        //         <div className="list-dashboard">Grid Type</div>
                        //         <select className="form-control list-dashboard" id="Grid"
                        //             value={'classic'}
                        //             onChange={(event) => {
                        //                 this.props.onGridChange(event)
                        //             }}>
                        //             <option value="default">Default</option>
                        //             <option value="classic">Classic</option>
                        //         </select>
                        //     </div> : null
                    }
                    {
                        this.props.errorType ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Error Type</div>
                                <select className="form-control list-dashboard" id="TradingPartner"
                                    onChange={(event) => {
                                        this.onSelect(event, 'error_Type')
                                    }}>
                                    <option value=""></option>
                                    {/* {this.getErrorOptions()} */}
                                </select>
                            </div> : null
                    }
                    {
                        this.props.showclaimId ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">{this.props.isMolina ? 'Molina Claim Id' : 'Claim Id'}</div>
                                <input
                                    className="form-control list-dashboard"
                                    value={this.state.Filter_ClaimId}
                                    onChange={(event) => {
                                        this.changeFilterInput(event)
                                    }}></input>
                            </div> : null
                    }
                    {
                        this.props.TransactionId ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Transaction Id</div>
                                <input className="form-control list-dashboard"
                                    onChange={(event) => {
                                        this.changeTransaction(event)
                                    }}></input>
                            </div> : null
                    }
                    {
                        this.props.TransactionFlag ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Transaction</div>
                                <select className="form-control list-dashboard" id="TradingPartner"
                                    onChange={(event) => {
                                        this.onSelect(event, 'selectedTransaction')
                                    }}>
                                    <option value=""></option>
                                    {this.getTransData()}
                                </select>
                            </div>
                            : null
                    }
                    {
                        this.props.Transaction_278_Submitter ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Submitter</div>
                                <select className="form-control list-dashboard" id="ProviderName">
                                    <option value=""></option>
                                    <option value="1">TRIZETTO PROVIDER SOLUTIONS</option>
                                    <option value="2">WPS</option>
                                </select>
                            </div>
                            : null
                    }
                    {
                        this.props.Transaction_278_provider ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Provider Name</div>
                                <select className="form-control list-dashboard" id="ProviderName">
                                    <option value=""></option>
                                    <option value="1">Provider Name 1</option>
                                    <option value="2">Provider Name 2</option>
                                </select>
                            </div>
                            : null
                    }
                        {
                        this.props.Updatebutton ?
                            <div className="form-group col-2">
                                <div className="list-dashboard"></div>
                                <button type="submit" className="btn light_blue1 btn-xs" style={{ marginRight: "120px" ,marginTop:"16px" ,height:"32px" }}>Update</button>
                            </div>
                            : null
                    }






                </div>
            </div>
        )
    }

    render() {
        return (
            this.renderFilters()
        )
    }
}