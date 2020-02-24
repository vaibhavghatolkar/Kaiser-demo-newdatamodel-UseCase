import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';

var val = ''
export class EncounterDetails extends React.Component {

    constructor(props) {
        super(props);
 
        let flag =props.location.state.data[0].flag
        if(flag == 'accept'){
            flag = 'Accepted Claims'
        } else if (flag == 'reject') {
            flag = 'Rejected Claims'
        } else {
            flag = 'Other'
        }

        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineData: [],
            file: [],
            memberInfo: {},
            subscriberNo: '',
            type: props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            flag: flag,
            coverage_data: [],
            tradingpartner: [],
            claimsList: [],
            summaryList: [],
            showDetails: false,
            files_list: [],
            errorList: [],
            eventLog: [],
            claimDetails: [],
            claimLineDetails: [],
            Transaction_Compliance: '',
            providerName: '',

            State: props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status: props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            transactionId: props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus: props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            errorcode: '',

            page: 1,
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag: props.location.state.data[0].apiflag,

            pieArray: [],
            labelArray: [],
            orderby: '',
            Icdcode: [],
            fileid:'',
            selectedICdCode:'',
            claimid:'',
            Icdcodepresent:'',

            nameRotation : 180,
            dateRotation : 180,
            statusRotation : 180,
            submitterRotation : 180,
        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.Saved = this.Saved.bind(this)
    }

    componentDidMount() {
        this.getCommonData()
        this.getData()
        this.getIcdCode()
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(Transaction:"Encounter") {
                Trading_Partner_Name 
            }
        }`

      
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
    getIcdCode(){
        let query = `{
            ClaimsICDCODE  {
                SeqId
                ICD_CODE
                Year
                ExtraField1
            }
        }`

     
        fetch(Urls.real_time_claim_details, {
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
                    Icdcode: res.data.ClaimsICDCODE ? res.data.ClaimsICDCODE : [],
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    getData = () => {
        let count = 1
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            EncounterFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.Firstgridpage + ` , OrderBy:"` + this.state.orderby + `"  ) {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                Claimcount
                FileStatus
            }
        }`
        console.log(query)
        fetch(Urls.real_time_claim_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.EncounterFileDetails) {

                    if (res.data.EncounterFileDetails.length > 0) {

                        count = Math.floor(res.data.EncounterFileDetails[0].RecCount / 10)
                        if (res.data.EncounterFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;

                    }

                    this.setState({
                        intakeClaims: res.data.EncounterFileDetails,



                    }, () => {
                        this.sortData()
                    })


                }


            })
            .catch(err => {
                console.log(err)
            });
    }

    sortData(fileId, data) {
        let files = {}
        let intakeClaims = this.state.intakeClaims

        if (fileId && data) {
            files = this.state.claimsObj
            if (fileId in files) {
                files[fileId].array = []
                data.forEach(item => {
                    files[fileId].array.push(item)
                });
            }
        } else {
            intakeClaims.forEach(item => {
                files[item.FileID] = {
                    value: item,
                    array: []
                }
            })
        }

        this.setState({
            claimsObj: files
        })
    }

    getTransactions = (fileId) => {

        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            EncounterProcessingSummary (page:${this.state.page},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", FileID : "` + fileId + `", Type : "` + this.state.type + `" , OrderBy:"` + this.state.orderby + `") {
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
                ClaimUniqueID
                FileID
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
                var data = res.data.EncounterProcessingSummary
                if (data && data.length > 0) {
                    this.sortData(fileId, data)
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search Claim" />
            </div>
        )
    }

    showDetails() {
        this.setState({
            showDetails: true
        })
    }

    handlePageClick = (data, fileId) => {

        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getTransactions(fileId)
        })
    }

    getIcdcodeoptions() {
        let row = []
        this.state.Icdcode.forEach(element => {
             
            row.push(<option value="">{element.ICD_CODE}</option>)
        })
        return row
    }

    getDetails(claimId, fileId){
        var Claim_Icdcode = '';
        let url = Urls.real_time_claim_details
        let query = `{
            EncounterDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `") {
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
              FileID 
              FieldToUpdate
            }
            EncounterLineDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `") {
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
            if(res.data.EncounterDetails && res.data.EncounterDetails.length > 0){
                if (res.data.EncounterDetails[0].FieldToUpdate == "ICDCode") {                    
                    Claim_Icdcode = <select id="fao1" className="form-control" style={{width:"100px"}}  onChange={(e) => this.ChangeVal(e)}>
                        <option value="0" ></option>
                        {this.getIcdcodeoptions()}
                    </select>
                }
                else {
                    Claim_Icdcode =res.data.EncounterDetails[0].ICDCode;
                }
                let data = res.data.EncounterDetails[0]
                
                let claimDetails = 
                [
                    { key: 'Encounter HiPaaS Id', value: data.ClaimTMTrackingID },
                    { key: 'Encounter Date', value: data.ClaimDate },
                    { key: 'Subscriber first name', value: data.SubscriberFirstName },
                    { key: 'Subscriber last name', value: data.SubscriberLastName },
                    { key: 'Admission date', value: data.AdmissionDate },
                    // { key: 'Claim amount', value: data.Claim_Amount },
                    { key: 'Provider address', value: data.BillingProviderAddress },
                    { key: 'Encounter Status', value: data.ClaimStatus },
                    { key: 'ICD Code', value: Claim_Icdcode },
                    { key: 'Accident Date', value: data.AccidentDate },
                    { key: '',  },
                    { key: '',  },
                ]
                this.setState({
                    showDetails: true,
                    claimDetails : claimDetails,
                    claimLineDetails : res.data.EncounterLineDetails,
                    fileid:data.FileID,
                    claimid:data.ClaimID,
                    Icdcodepresent:data.FieldToUpdate
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    } 
    ChangeVal(event, key){
        this.state.selectedICdCode=  event.target.options[event.target.selectedIndex].text;
   
     }
    renderRows(dictionary) {
        let row = []
        let col = []
        let count = 0

        dictionary.forEach(item => {
            col.push(
                <div className="col">
                    <div className="header">{item.key} : </div>
                    <div>{(moment(item.value).format('MMM D YYYY hh:mm a') != "Invalid date" && item.key == 'Claim Date') ? moment(item.value).format('MMM D YYYY hh:mm a') : item.value}</div>
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

    // renderTransactions(){
    //     let row = []
    //     const data = this.state.EncounterProcessingSummary ? this.state.EncounterProcessingSummary : []

    //     data.forEach((d) => {
    //         row.push(
    //             <tr>
    //                 <td><a href="#" onClick={() => {
    //                     this.setState({
    //                         claimId : d.ClaimID
    //                     }, () => {
    //                         this.getDetails(d.ClaimID)
    //                     })
    //                 }} style={{ color: "#6AA2B8" }}>{d.ClaimID}</a></td>
    //                 <td>{d.ClaimDate}</td>
    //                 <td>{d.Claim_Amount}</td>
    //                 <td>{d.ClaimStatus}</td>
    //                 <td>{d.adjudication_status}</td>
    //                 <td>{d.ClaimLevelErrors}</td>
    //             </tr>
    //         )
    //     })
    //     return(
    //         <div>
    //             <table className="table table-bordered claim-list">
    //                 <thead>
    //                     <tr className="table-head" style={{fontSize:"9px"}}>
    //                         <td className="table-head-text">Claim Id</td>
    //                         <td className="table-head-text list-item-style">Claim Date</td>
    //                         <td className="table-head-text list-item-style">Claim Amount</td>
    //                         <td className="table-head-text list-item-style">Claim Status</td>
    //                         <td className="table-head-text list-item-style">Current State</td>
    //                         <td className="table-head-text list-item-style">Error Code</td>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {row}
    //                 </tbody>
    //             </table>
    //         </div>
    //     )
    // }

    renderDetails(flag) {
        return (
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
            if (!element) {
                return
            }
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
            this.getData()
        }, 50);
    }

    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderPieChart() {
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
        return (
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

    onHandleChange(e) {
        let providerName = e.target.value
        clearTimeout(val)
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            })
            this.getData()
        }, 300);
    }

    renderFilters() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                this.setState({
                                    State: event.target.options[event.target.selectedIndex].text,
                                    showDetails: false
                                }, () => {
                                    this.getData()
                                })
                            }}>
                            <option selected={this.state.State == '' ? "selected" : ""} value=""></option>
                            <option selected={this.state.State == 'California' ? "selected" : ""} value="1">California</option>
                            <option selected={this.state.State == 'Michigan' ? "selected" : ""} value="2">Michigan</option>
                            <option selected={this.state.State == 'Florida' ? "selected" : ""} value="3">Florida</option>
                            <option selected={this.state.State == 'New York' ? "selected" : ""} value="4">New York</option>
                            <option selected={this.state.State == 'Idaho' ? "selected" : ""} value="5">Idaho</option>
                            <option selected={this.state.State == 'Ohio' ? "selected" : ""} value="6">Ohio</option>
                            <option selected={this.state.State == 'Illinois' ? "selected" : ""} value="7">Illinois</option>
                            <option selected={this.state.State == 'Texas' ? "selected" : ""} value="8">Texas</option>
                            <option selected={this.state.State == 'Mississippi' ? "selected" : ""} value="9">Mississippi</option>
                            <option selected={this.state.State == 'South Carolina' ? "selected" : ""} value="10">South Carolina</option>
                            <option selected={this.state.State == 'New Mexico' ? "selected" : ""} value="11">New Mexico</option>
                            <option selected={this.state.State == 'Puerto Rico' ? "selected" : ""} value="12">Puerto Rico</option>
                            <option selected={this.state.State == 'Washington' ? "selected" : ""} value="13">Washington</option>
                            <option selected={this.state.State == 'Utah' ? "selected" : ""} value="14">Utah</option>
                            <option selected={this.state.State == 'Wisconsin' ? "selected" : ""} value="15">Wisconsin</option>
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

    renderClaimDetails() {
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
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event'} data-toggle="collapse">Encounter line data</a></div>
                    <div id={'event'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style">Encounter Id</td>
                                    <td className="table-head-text list-item-style">Service line count</td>
                                    <td className="table-head-text list-item-style">Provider paid amount</td>
                                    <td className="table-head-text list-item-style">Service date</td>
                                    <td className="table-head-text list-item-style">Procedure code</td>
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

    renderClaimsHeader() {
        return (
            <tr className="table-head" style={{ fontSize: "9px" }}>
                <td className="table-head-text">Encounter Id</td>
                <td className="table-head-text list-item-style">Encounter Date</td>
                {/* <td className="table-head-text list-item-style">Encounter Amount</td> */}
                <td className="table-head-text list-item-style">Encounter Status</td>
                <td className="table-head-text list-item-style">Adjudication Status</td>
                <td className="table-head-text list-item-style">Error Code</td>
            </tr>
        )
    }
    handleSort(e, rotation, key) {
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
    renderTableHeader() {
        return (
            <div className="row">
                <div className="col-4 col-header justify-align">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By EncounterFileDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img>File Name
                </div>
                <div className="col-2 col-header justify-align">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by EncounterFileDetails.FileDate", this.state.dateRotation, 'dateRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.dateRotation}deg)`, marginRight: '4px' }}></img>File Date
                </div>
                <div className="col-3 col-header justify-align">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By EncounterFileDetails.FileStatus", this.state.statusRotation, 'statusRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.statusRotation}deg)`, marginRight: '4px' }}></img>File Status
                </div>
                <div className="col-3 col-header justify-align">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By EncounterFileDetails.Sender", this.state.submitterRotation, 'submitterRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.submitterRotation}deg)`, marginRight: '4px' }}></img>Submitter
                </div>
                {/* <div className="col-2 col-header">Status</div> */}
            </div>
        )
    }

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        let count = 0

        console.log(data)
        try {
            count = data[Object.keys(data)[0]].value.Claimcount / 10
            if (data[Object.keys(data)[0]].value.Claimcount % 10 > 0) {
                count = count + 1
            }
        } catch (error) {

        }


        Object.keys(data).map((keys) => {
            row.push(
                <div className="row">
                    <div className="col-4 left-align col-small-style"><a href={"#" + data[keys].value.FileID}
                        onClick={() => {
                            this.getTransactions(data[keys].value.FileID)
                        }} style={{ color: "#6AA2B8" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-2 col-small-style">{moment(data[keys].value.FileDate).format('MM/DD/YYYY')}<br />{moment(data[keys].value.FileDate).format('hh:mm a')}</div>
                    <div className="col-3 col-small-style">{data[keys].value.FileStatus}</div>
                    <div className="col-3 col-small-style">{data[keys].value.Sender}</div>
                </div>
            )

            {
                col = []
                data[keys].array.forEach((d) => {
                    col.push(
                        <tr>
                            <td className="list-item-style"><a  className="clickable" onClick={() => {
                                this.setState({
                                    claimId: d.ClaimID
                                }, () => {
                                    this.getDetails(d.ClaimID, d.FileID)
                                })
                            }} style={{ color: "#6AA2B8" }}>{d.ClaimID}</a></td>
                            <td className="list-item-style">{moment(d.ClaimDate).format('MM/DD/YYYY') != "Invalid date" ? moment(d.ClaimDate).format('MM/DD/YYYY') : d.ClaimDate}</td>
                            {/* <td className="list-item-style">{d.Claim_Amount}</td> */}
                            <td className="list-item-style">{d.ClaimStatus}</td>
                            <td className="list-item-style">{d.adjudication_status}</td>
                            <td className="list-item-style">{d.ClaimLevelErrors}</td>
                        </tr>
                    )
                })
            }

            row.push(
                <div id={keys} className="collapse">
                    <table id="" className="table table-bordered claim-details">
                        {this.renderClaimsHeader()}
                        {col}
                    </table>

                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={this.state.initialPage}
                        pageCount={Math.floor((data[keys].value.Claimcount / 10) + (data[keys].value.Claimcount % 10 > 0 ? 1 : 0))}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(page) => { this.handlePageClick(page, keys) }}
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
        });

        return (
            <div>

                {this.renderTableHeader()}
                {row}
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
                    pageCount={this.setState.recount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(page) => { this.handlePageClick1(page) }}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    previousClassName={'page-link'}
                    nextClassName={'page-link'}
                    pageLinkClassName={'page-link'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        );
    }
    handlePageClick1(data) {

        let page = data.selected + 1
        this.setState({
            Firstgridpage: page
        })

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderButton() {
            return (

                <div>

                    <button onClick={this.Saved} className="btn light_blue1 btn-xs" style={{ marginLeft: "20px" }}>Save</button>

                </div>
            )
        }

        Saved() {                 
          
              if(this.state.selectedICdCode!="")
              {
                       let query = `mutation{updateEncounterICDCode(
                        ClaimID:"`+ this.state.claimid + `" 
                        FileID:"`+ this.state.fileid + `"  
                        ICDCode:"`+ this.state.selectedICdCode + `" 
                       
                        )
                      }`
                console.log(" gsdg"  ,query);
                fetch(Urls.base_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query
    
                    })
                })
                    .then(r => r.json())
                    .then(data =>
                        alert(data.data.updateEncounterICDCode),
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)
    
                    );
    
            }
        
    
        }
    render() {
      
        return (
            <div>
                <label style={{ color: "#139DC9", fontWeight: "500", marginTop: "10px", fontSize: '24px' }}>Encounter Details</label>
                {this.renderFilters()}
                <div className="row padding-left">
                    <div className="col-6 claim-list file-table">
                        {this.state.claimsObj ? this.renderList() : null}
                    </div>

                    <div className="col-6">
                        {
                            this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                                <table className="table claim-Details">
                                    {this.renderHeader('Encounter #'+ this.state.claimId)}
                                    {this.renderRows(this.state.claimDetails) }
                                    <br></br>                                    
                                    {this.state.Icdcodepresent=="ICDCode" ? this.renderButton() : "" }                                     
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