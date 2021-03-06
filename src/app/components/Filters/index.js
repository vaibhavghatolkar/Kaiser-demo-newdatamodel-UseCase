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
import { AutoComplete } from '../AutoComplete';

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
            checkDate: this.props.checkDate,
            selectedTradingPartner: '',
            State: this.props.State ? this.props.State : '',
            tradingpartner: [],
            PayerNameList: [],
            InvoicePattern: [],
            LOB: [],
            PayeeNameList: [],
            clp06List: [],
            claimIdData: [],
            CLP01List: [],
            TreasuryCompanyDescriptionList: [],
            TreasuryFileNameList: [],
            PatientSubscriberIDList: [],
            Filter_ClaimId: this.props.Filter_ClaimId ? this.props.Filter_ClaimId : '',
            transactionId: this.props.transactionId ? this.props.transactionId : '',
            TransactionMasterList: [],
            transOptions: [],
            LockBoxFileNameList: [],
            SelectedLOB: this.props.LOB ? this.props.LOB : "",
            selectedService: this.props.selectedService ? this.props.selectedService : ""
        }
    }

    componentDidMount() {
        this.getCommonData()
        this.getFileNameData()
        this.getCompanyDescList()
        this.getTransactiondata()
        this.getInvoicePatternApi()
        this.getLOBListApi()
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
    getInvoicePatternApi = async () => {

        let query = `{
            InvoicePatternList(LOB:"${this.state.SelectedLOB}") {
                Invoice_Pattern
                Invoice_Pattern_Value
              }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction835, {
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
                        InvoicePattern: res.data.InvoicePatternList ? res.data.InvoicePatternList : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getLOBListApi = async () => {

        let query = `{
            LOBList {
                LOB
              }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction835, {
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
                        LOB: res.data.LOBList ? res.data.LOBList : [],
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

    getFileNameData() {
        let query = ""
        if (this.props.FileNameLockBox) {
            query = `{      
                LockBoxFileNameList {
                    File_Name
                  }       
            }`
        } else {
            query = `{      
                TreasuryFileNameList {
                    File_Name
                  }         
            }`
        }


        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction835Kaiser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (this.props.FileNameLockBox) {
                    this.setState({
                        LockBoxFileNameList: res.data.LockBoxFileNameList

                    })
                } else {
                    this.setState({
                        TreasuryFileNameList: res.data.TreasuryFileNameList

                    })
                }

            })

            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    getCompanyDescList() {
        let query = `{      
            TreasuryCompanyDescriptionList {
                Company_Description
              }        
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction835Kaiser, {
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
                    TreasuryCompanyDescriptionList: res.data.TreasuryCompanyDescriptionList

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

    handleCheckChange = (date) => {
        this.setState({
            checkDate: date
        }, () => {
            this.props.update('checkDate', date)
        })
    }




    onSelect = (event, name) => {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.props.update(name, '')
        } else {
            if (name == 'selectedTradingPartner' || name == 'Split') {
                this.props.update(name, event.target.options[event.target.selectedIndex].value)
            } else {
                if (name == 'LOB') {
                    this.setState({
                        SelectedLOB: event.target.options[event.target.selectedIndex].text
                    }, () => {
                        this.getInvoicePatternApi()
                    })
                }
                if (name == 'Service') {
                    this.setState({
                        selectedService: event.target.options[event.target.selectedIndex].text
                    }, () => {
                        //  this.getReferenceIDListApi()
                    })
                }
                this.props.update(name, event.target.options[event.target.selectedIndex].text)
            }
        }
    }


    onSelected = (value) => {
        this.props.update('Payer', value)
    }
    onSelected1 = (value) => {
        this.props.update('Payee', value)
    }
    onSelected2 = (value) => {
        this.props.update('clp06List', value)
    }
    onSelected3 = (value) => {
        this.props.update('claimIdData', value)
    }
    onSelected4 = (value) => {
        this.props.update('CLP01List', value)
    }
    onSelected5 = (value) => {
        this.props.update('PatientSubscriberIDList', value)
    }
    onSelected6 = (value) => {
        this.props.update('CheckEFTNo', value)
    }
    onSelected7 = (value) => {
        this.props.update('ReferenceID', value)
    }
    Clear = (value) => {

        this.props.renderMethod("Clear")
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
    getInvoicePattern = () => {
        let row = []
        this.state.InvoicePattern.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value={element.Invoice_Pattern_Value}>{element.Invoice_Pattern}</option>)
        })
        return row
    }
    getLOBData = () => {
        let row = []
        this.state.LOB.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value={element.LOB}>{element.LOB}</option>)
        })
        return row
    }

    getFileNameDataKaiser = () => {
        let row = []
        this.state.TreasuryFileNameList.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option selected={this.props.FileNameData == element.File_Name ? "selected" : ""} value={element.File_Name}>{element.File_Name}</option>)
        })
        return row
    }
    getCompanyDescKaiser = () => {
        let row = []
        this.state.TreasuryCompanyDescriptionList.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option selected={this.props.CompanyDesc == element.Company_Description ? "selected" : ""} value={element.Company_Description}>{element.Company_Description}</option>)
        })
        return row
    }

    getLockboxFileName = () => {
        let row = []
        this.state.LockBoxFileNameList.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option selected={this.props.FileNameData == element.File_Name ? "selected" : ""} value={element.File_Name}>{element.File_Name}</option>)
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

    onHandleChange = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                PayerList (RecType:"835Link",Payer:"${providerName}" Service:"${this.state.selectedService}") {
                  PayerName
                }
              }`
              if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.PayerList.forEach(item => {
                            data.push(item.PayerName)
                        })
                        this.setState({
                            PayerNameList: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }
    onHandleChange1 = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                PayeeList (RecType:"835Link",Payee:"${providerName}" Service:"${this.state.selectedService}") {
                  PayeeName
                  NPI
                }
              }`
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.PayeeList.forEach(item => {
                            data.push(item.NPI)
                        })
                        this.setState({
                            PayeeNameList: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }
    onHandleChange2 = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                CLP06List (RecType:"835Link",CLP06:"${providerName}" Service:"${this.state.selectedService}") {
                    CLP06
                    Desc
                }
              }`
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.CLP06List.forEach(item => {
                            data.push({
                                'CLP06Code': item.CLP06,
                                'desc': item.Desc
                            })
                        })
                        this.setState({
                            clp06List: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }
    onHandleChange3 = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                ClaimIDList(RecType:"835Link",ClaimID:"${providerName}" Service:"${this.state.selectedService}") {
                    ClaimID
                  }
              }`
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.ClaimIDList.forEach(item => {
                            data.push(item.ClaimID)
                        })
                        this.setState({
                            claimIdData: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }
    onHandleChange4 = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                CLP01List(RecType:"835Link",CLP01:"${providerName}" Service:"${this.state.selectedService}") {
                    CLP01
                  }
              }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.CLP01List.forEach(item => {
                            data.push(item.CLP01)
                        })
                        this.setState({
                            CLP01List: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }
    onHandleChange5 = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                PatientSubscriberIDList(RecType:"835Link",PatientSubscriberID:"${providerName}" Service:"${this.state.selectedService}") {
                    PatientSubscriberID
                  }
              }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.PatientSubscriberIDList.forEach(item => {
                            data.push(item.PatientSubscriberID)
                        })
                        this.setState({
                            PatientSubscriberIDList: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }
    onHandleChange6 = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                CheckEFTNoList(RecType:"835Link",CheckEFTNo:"${providerName}" Service:"${this.state.selectedService}") {
                    CheckEFTNo
                  }
              }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.CheckEFTNoList.forEach(item => {
                            data.push(item.CheckEFTNo)
                        })
                        this.setState({
                            CheckEFTNo: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
        }, 300);
    }

    getReferenceIDListApi = (e) => {
        clearTimeout(val)
        let providerName = e.target.value

        val = setTimeout(() => {
            let query = `{
                ReferenceIDList(RecType:"835Link" ReferenceID:"${providerName}" Service:"${this.state.selectedService}") {
                    ReferenceID
                  }
              }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            return fetch(Urls._transaction835, {
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
                        let data = []
                        res.data.ReferenceIDList.forEach(item => {
                            data.push(item.ReferenceID)
                        })
                        this.setState({
                            ReferenceIDData: data
                        })
                    }
                })
                .catch(err => {
                    process.env.NODE_ENV == 'development' && console.log(err)
                });
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

    changeFilterInput1 = (event) => {
        let passing_val = event.target.value
        this.setState({
            incoming_837fileId: passing_val
        }, () => {
            clearTimeout(val_in)
            val_in = setTimeout(() => {
                this.onChangeName(passing_val, 'incoming_837fileId')
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
                                    <div className="list-dashboard">{this.props.SubmitterName ? 'Sender' : 'Submitter'}</div>
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
                        this.props.FileNameKaiser ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">File Name</div>
                                <select className="form-control list-dashboard" id="TradingPartner"
                                    value={this.props.FileNameData}
                                    onChange={(event) => {
                                        this.onSelect(event, 'FileNameData')
                                    }}>
                                    <option value=""></option>
                                    {this.props.FileNameLockBox ? this.getLockboxFileName() : this.getFileNameDataKaiser()}
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

                                    defaultValue={this.props.changeDefault ? 'halfYear' : this.props.days90Filter ? '2' : 'year'}
                                >
                                    <option value="1">Last week</option>
                                    <option value="2">Last 30 days</option>
                                    <option value="3">Last 90 days</option>
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
                                <div className="list-dashboard">{this.props.isMolina ? 'HiPaaS Claim Id' : 'Claim Id'}</div>
                                <input
                                    className="form-control list-dashboard"
                                    value={this.state.Filter_ClaimId}
                                    onChange={(event) => {
                                        this.changeFilterInput(event)
                                    }}></input>
                            </div> : null
                    }
                    {
                        this.props.CLM01 ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">CLM01</div>
                                <input
                                    className="form-control list-dashboard"
                                    value={this.state.incoming_837fileId}
                                    onChange={(event) => {
                                        this.changeFilterInput1(event)
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
                        this.props.PBHBShow ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">By Service</div>
                                <select className="form-control list-dashboard" id="ProviderName"
                                    value={this.props.payer}
                                    onChange={(event) => {
                                        this.onSelect(event, 'Service')
                                    }}>
                                    <option value=""></option>
                                    <option value="PB">PB</option>
                                    <option value="HB">HB</option>
                                    <option value="PB & HB">PB & HB</option>
                                </select>
                            </div>
                            : null
                    }

                    {this.props.payerShow ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">Payer</div>
                            <AutoComplete
                                list={this.state.PayerNameList}
                                onHandleChange={this.onHandleChange}
                                onSelected={this.onSelected}
                                renderMethod={this.props.renderMethod}
                                flag={"Payer"}

                            />
                        </div> : null}
                    {this.props.payeeShow ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">NPI</div>
                            <AutoComplete
                                list={this.state.PayeeNameList}
                                onHandleChange={this.onHandleChange1}
                                onSelected={this.onSelected1}
                                renderMethod={this.props.renderMethod}
                                flag={"Payee"}
                            />
                        </div> : null}
                    {this.props.CheckEFTNo ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">Check/EFT Number (TRN02)</div>
                            <AutoComplete
                                list={this.state.CheckEFTNo}
                                onHandleChange={this.onHandleChange6}
                                onSelected={this.onSelected6}
                                renderMethod={this.props.renderMethod}
                                flag={"CheckEFTNo"}
                            />
                        </div> : null
                    }
                    {
                        this.props.checkDateShow ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Check Date (BPR16)</div>
                                <DatePicker className="form-control list-dashboard"
                                    selected={this.props.checkDate ? new Date(moment(this.props.checkDate).format('YYYY-MM-DD hh:mm')) : ''}
                                    onChange={this.handleCheckChange}
                                />
                            </div>

                            : null
                    }

                    {this.props.ReferenceIDList ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">Receiver Identification Number</div>
                            <AutoComplete
                                list={this.state.ReferenceIDData}
                                onHandleChange={this.getReferenceIDListApi}
                                onSelected={this.onSelected7}
                                renderMethod={this.props.renderMethod}
                                flag={"ReferenceID"}
                            />
                        </div> : null
                    }

                    {
                        this.props.LOBShow ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">LOB</div>
                                <select className="form-control list-dashboard" id="LOB"
                                    value={this.props.LOB}
                                    onChange={(event) => {
                                        this.onSelect(event, 'LOB')
                                    }}>
                                    <option value=""></option>
                                    {this.getLOBData()}
                                </select>
                            </div>

                            : null
                    }

                    {
                        this.props.InvoicePatternList ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Invoice Pattern</div>
                                <select className="form-control list-dashboard" id="InvoicePattern"
                                    value={this.props.InvoicePattern}
                                    onChange={(event) => {
                                        this.onSelect(event, 'InvoicePattern')
                                    }}>
                                    <option value=""></option>
                                    {this.getInvoicePattern()}
                                </select>
                            </div>

                            : null
                    }


                    {this.props.CLP01Show ?
                        <div className="form-group col-2">
                        <div className="list-dashboard">CLP01</div>
                        <AutoComplete 
                            list={this.state.CLP01List}
                            onHandleChange={this.onHandleChange4}
                            onSelected={this.onSelected4}
                            renderMethod={this.props.renderMethod}
                            flag={"CLP01List"}
                        />
                    </div>: null 
                    }
                    {this.props.clp06Show ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">Financial Class (CLP06)</div>
                            <AutoComplete
                                list={this.state.clp06List}
                                extraParams={true}
                                onHandleChange={this.onHandleChange2}
                                onSelected={this.onSelected2}
                                renderMethod={this.props.renderMethod}
                                flag={"clp06List"}
                            />
                        </div> : null
                    }

                    {this.props.claimIdData ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">Payer Claim Control No(CLP07)</div>
                            <AutoComplete
                                list={this.state.claimIdData}
                                onHandleChange={this.onHandleChange3}
                                onSelected={this.onSelected3}
                                renderMethod={this.props.renderMethod}
                                flag={"claimIdData"}
                            />
                        </div> : null
                    }


                    {this.props.PatientSubscriberIDList ?
                        <div className="form-group col-2">
                            <div className="list-dashboard">Guarantor</div>
                            <AutoComplete
                                list={this.state.PatientSubscriberIDList}
                                onHandleChange={this.onHandleChange5}
                                onSelected={this.onSelected5}
                                renderMethod={this.props.renderMethod}
                                flag={"PatientSubscriberIDList"}
                            />
                        </div> : null
                    }
                    {
                        this.props.CompanyDescKaiser ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Company Description</div>
                                <select className="form-control list-dashboard" id="TradingPartner"
                                    value={this.props.CompanyDesc}
                                    onChange={(event) => {
                                        this.onSelect(event, 'CompanyDesc')
                                    }}>
                                    <option value=""></option>
                                    {this.getCompanyDescKaiser()}
                                </select>
                            </div> : null
                    }





                    {
                        this.props.Split ?
                            <div className="form-group col-2">
                                <div className="list-dashboard">Split File(Y/N)</div>
                                <select className="form-control list-dashboard"
                                    onChange={(event) => {
                                        this.onSelect(event, 'Split')
                                    }}>
                                    <option value=""></option>
                                    <option selected={this.props.Split == "SPLIT" ? true : false} value="SPLIT">Yes</option>
                                    <option selected={this.props.Split == "Inbound" ? true : false} value="Inbound">No</option>
                                </select>
                            </div>
                            : null
                    }

                    {
                        this.props.Clear ?
                            <div className="form-group col-1">
                                <div className="list-dashboard"></div>
                                <button type="submit" onClick={this.Clear} className="btn light_blue1 btn-xs" style={{ marginRight: "120px", marginTop: "16px", height: "32px" }}>Clear</button>
                            </div>
                            : null
                    }



                    {
                        this.props.Updatebutton ?
                            <div className="form-group col-2">
                                <div className="list-dashboard"></div>
                                <button type="submit" className="btn light_blue1 btn-xs" style={{ marginRight: "120px", marginTop: "16px", height: "32px" }}>Update</button>
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