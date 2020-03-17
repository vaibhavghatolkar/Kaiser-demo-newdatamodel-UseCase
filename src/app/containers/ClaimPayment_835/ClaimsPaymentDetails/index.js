import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';
import { CommonNestedTable } from '../../../components/CommonNestedTable';

var val = ''
export class ClaimPaymentDetails extends React.Component {

    constructor(props) {
        super(props);

        console.log('hello these are the props', props)
        let flag = props.location.state.data[0].flag
        if (flag == 'accept') {
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
            fileDetails: [],
            memberInfo: {},
            subscriberNo: '',
            type: props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            Service_startDate: '',
            Service_endDate: '',
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
            Organization: '',

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
            fileid: '',
            selectedICdCode: '',
            claimid: '',
            Icdcodepresent: '',
            nameRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            StateList: [],
            Statecode:'',
            Sender:''
        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.Service_StartChange = this.Service_StartChange.bind(this)
        this.Service_EndChange = this.Service_EndChange.bind(this)

    }

    componentDidMount() {
        this.getCommonData()
        this.getData()
        this.getState()

    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(RecType :"Outbound", Transaction:"Claim837RT") {
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

    getData = () => {
      
        let count = 1
        let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.Service_endDate ? moment(this.state.Service_endDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.Organization
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            RemittanceViewerFileDetails(Sender:"${this.state.Sender}",State:"${this.state.State ? this.state.State : ''}",Organization:"${this.state.Organization}",EFTStartDt:"${Service_startDate}",EFTEndDt:"${ServiceEndDate}",ClaimReceivedStartDt:"${startDate}",ClaimReceivedEndDt:"${endDate}", page: ` + this.state.Firstgridpage + ` , OrderBy:"` + this.state.orderby + `") {
                RecCount
  Sender
  Organization
  FileID
  FileName
  CheckEFTNo
  FileDate
  PayerName
  PayerID
  AccountNo
  CHECKEFTFlag
  CheckEFTDt
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
                if (res && res.data && res.data.RemittanceViewerFileDetails) {

                    if (res.data.RemittanceViewerFileDetails.length > 0) {

                        count = Math.floor(res.data.RemittanceViewerFileDetails[0].RecCount / 10)
                        if (res.data.RemittanceViewerFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;

                    }

                    this.setState({
                        intakeClaims: res.data.RemittanceViewerFileDetails,
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
            if ('sort_' + fileId in files) {
                files['sort_' + fileId].array = []
                data.forEach(item => {
                    files['sort_' + fileId].array.push(item)
                });
            }
        } else {
            intakeClaims.forEach(item => {
                files['sort_' + item.FileID] = {
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
   

         let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.ServiceEndDate ? moment(this.state.ServiceEndDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            RemittanceViewerPatientDetails  (page:${this.state.page},Sender:"${this.state.Sender}",State:"${this.state.State ? this.state.State : ''}",Organization:"${this.state.Organization}",EFTStartDt:"${Service_startDate}",EFTEndDt:"${ServiceEndDate}",  ClaimReceivedStartDt:"${startDate}" ,ClaimReceivedEndDt:"${endDate}" , FileID : "` + fileId + `", OrderBy:"") {
                RecCount
                RefId
                FileID
                FileName
                ClaimID
                FileDate
                ClaimReceivedDate
                PatientName
                PatientControlNo
                PayerName
                TotalChargeAmt
                TotalClaimPaymentAmt
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
                 
                var data = res.data.RemittanceViewerPatientDetails
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

    getDetails(claimId, fileId, fileData) {
        let Claim_Icdcode = ""
        let url = Urls.real_time_claim_details
        let query = `{
            RemittanceViewerClaimDetails (ClaimID:"`+ claimId + `", FileID: "` + fileId + `") {
                FileID
                FileName
                FileDate
                Organization
                Payee_IdentificationQL
                Payee_IdentificationCode
                CheckEFTNo
                PayerIdentifier
                PayerName
                PayerID
                CheckEFTDt
                AccountNo
                CHECKEFTFlag
                ClaimID
                PayerClaimControl
                ClaimReceivedDate
                PatientName
                PatientControlNo
                TotalChargeAmt
                TotalClaimPaymentAmt
                PatietResAMT
                DigonisCode
                DGNQty
                ClaimStatusCode
                FacilityCode
                AdjustmentAmt
            }
            RemittanceViewerClaimServiceDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `") {
                FileID
                ClaimID
                ServiceEndDate
                ServiceStartDate
                AdjudicatedCPT
                ChargeAmount
                PaidAmt
                AdjAmt
                SubmittedCPT
                LineControlNo
                ServiceSupplementalAmount
                OriginalUnitsofServiceCount
                UnitsofServicePaidCount
            }
          }
          `

        console.log('query ', query)

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
            
                let fileDetails=[]
                if (res.data.RemittanceViewerClaimDetails && res.data.RemittanceViewerClaimDetails.length > 0) {

                    let data = res.data.RemittanceViewerClaimDetails[0]

                    let fileDetails = [
                        { key: 'File Name', value: fileData.FileName },
                        { key: 'File Date', value: moment(fileData.FileDate).format('MM/DD/YYYY') + moment(fileData.FileDate).format(' h:m A') },
                        { key: 'Receiver', value: fileData.Receiver }
                    ]

                    let claimDetails =
                        [
                            { key: 'Claim Number' ,value: data.ClaimID },
                            { key: 'Payer Name',value: data.PayerName },
                            { key: 'Payer claim control No.', value: data.PayerClaimControl},
                            { key: 'Claim Status Code',value: data.ClaimStatusCode },
                            { key: 'Claim Filling Indicator',},
                            { key: 'Claim Received Date', value: data.ClaimReceivedDate},
                            { key: 'Patient ID', },
                            { key: 'Patient Name',value: data.PatientName },
                            { key: 'Provider ID', },
                            { key: 'Provider Name', },
                            { key: 'Rendering Provider ID',},
                            { key: 'Facility Code Value',value: data.FacilityCode },
                            { key: 'Patient Control Number',value: data.PatientControlNo },
                            { key: 'Payment Method Code',value: data.CHECKEFTFlag },
                            { key: 'DRG Code',value: data.DigonisCode },                            
                            { key: 'Total Patient Resp',value: data.PatietResAMT },
                        ]
                    this.setState({
                        showDetails: true,
                        claimDetails: claimDetails,
                         claimLineDetails: res.data.RemittanceViewerClaimServiceDetails,
                        fileDetails: fileDetails,
                        fileid: data.FileID,
                        claimid: data.ClaimID,
                        Icdcodepresent: data.FieldToUpdate
                    })
                 }
                 console.log("sdnsajhsfjf" , this.state. claimLineDetails)
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
                    <div>{(moment(item.value).format('MM/DD/YYYY, hh:mm a') != "Invalid date" && item.key == 'Claim Date') ? moment(item.value).format('MM/DD/YYYY, hh:mm a') : item.value}</div>
                </div>
            )

            if (col.length % 3 == 0) {
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




    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Organization' || event.target.options[event.target.selectedIndex].text == 'Submitter') {
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

    Service_StartChange(date) {
        this.setState({
            Service_startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }
    Service_EndChange(date) {
        this.setState({
            Service_endDate: date,
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
                    'var(--main-bg-color)',
                    'var(--cyan-color)',
                    'var(--hex-color)',
                    'var(--pacific-blue-color)',
                ],
                hoverBackgroundColor: [
                    'var(--main-bg-color)',
                    'var(--cyan-color)',
                    'var(--hex-color)',
                    'var(--pacific-blue-color)',
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
    getoptions() {

        let row = []
        this.state.StateList.forEach(element => {
            row.push(<option selected={this.state.Statecode == element.StateCode ? element.StateCode : ''} value={element.StateCode}>{element.State}</option>)
        })
        return row

    }
    getState() {
        let query = `{
                  StateList  (UserId:0 Flag:0) {
                  State
                StateCode
            }
       }`
        console.log(query)
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
                    StateList: res.data.StateList

                })
            })

            .catch(err => {
                console.log(err)
            })
    }

    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderFilters() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-sm-2">
                        <div className="list-dashboard">State</div>
                        <select className="form-control list-header-dashboard" va id="fao1"
                                                onChange={(event) => {
                                                    this.ChangeVal(event, 'State')
                                                    setTimeout(() => {
                                                        this.getData()
                                                    }, 50);
                                                }} >>
                                            <option value="" ></option>
                                                {this.getoptions()}

                                            </select>
                      
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Sender</div>
                               <input className="form-control" 
                                                onChange={(e) => {
                                                    clearTimeout(val)
                                                    let value = e.target.value
                                                    val = setTimeout(() => {
                                                        this.setState({ Sender: value, showDetails: false })
                                                        setTimeout(() => {
                                                            this.getData()
                                                        }, 50);
                                                    }, 300);
                                                }}
                                            />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Organization</div>
                      <input className="form-control" 
                                                onChange={(e) => {
                                                    clearTimeout(val)
                                                    let value = e.target.value
                                                    val = setTimeout(() => {
                                                        this.setState({ Organization: value, showDetails: false })
                                                        setTimeout(() => {
                                                            this.getData()
                                                        }, 50);
                                                    }, 300);
                                                }}
                                            />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Check/eft Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.Service_startDate ? new Date(this.state.Service_startDate) : ''}
                            onChange={this.Service_StartChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Check/eft End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.Service_endDate ? new Date(this.state.Service_endDate) : ''}
                            onChange={this.Service_EndChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Claim Received - Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Claim Received - End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                            onChange={this.handleEndChange}
                        />
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
                    <td>{d.ServiceStartDate}</td>
                    <td>{d.ServiceEndDate}</td>
                    <td>{d.LineControlNo}</td>
                    <td>{d.AdjudicatedCPT}</td>
                    <td>{d.SubmittedCPT}</td>
            <td></td><td></td><td></td>
                 <td>${d.ChargeAmount}</td>
                 <td>${d.AdjAmt}</td><td>${d.PaidAmt}</td>
                                   
                                
                    {/* <td>{d.ServiceSupplementalAmount}</td>
                    <td>{d.OriginalUnitsofServiceCount}</td>
                    <td>{d.UnitsofServicePaidCount}</td> */}
                    {/* To be filled with approproate data */}
                 
                </tr>
            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <div className="top-padding"><a href={'#' + 'event'} data-toggle="collapse">Service Line Information</a></div>
                    <div id={'event'} style={{ overflow: "auto" }} >
                        <table className="table table-bordered background-color" style={{ marginBottom: "0px" }}>
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style">Service start Dates</td>
                                    <td className="table-head-text list-item-style">Service End Dates</td>
                                    <td className="table-head-text list-item-style">Line Item Control #</td>
                                    <td className="table-head-text list-item-style">Adjudicated CPT</td>
                                    <td className="table-head-text list-item-style">Submitted CPT</td>
                                    <td className="table-head-text list-item-style">Submitted Units</td>
                                    <td className="table-head-text list-item-style">Paid Units</td>
                                    <td className="table-head-text list-item-style">Allowed Actual</td>
                                    <td className="table-head-text list-item-style">Charge Amount</td>
                                    <td className="table-head-text list-item-style">Adj Amount</td>
                                    <td className="table-head-text list-item-style">Paid Amount</td>



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
            <tr className="table-head">
                   <td className="table-head-text list-item-style">Claim No.</td>
                <td className="table-head-text list-item-style">Patient Name</td>
                <td className="table-head-text">Patient Control</td>
             
                {/* <td className="table-head-text list-item-style">Check/EFT Date</td>
                <td className="table-head-text list-item-style">Check/EFT Number</td> */}
                <td className="table-head-text list-item-style">Total Charged Amount</td>

                <td className="table-head-text list-item-style">Total Paid Amount</td>
                {/* <td className="table-head-text list-item-style">Action</td> */}
                {/* <td className="table-head-text list-item-style">Error</td> */}
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
                <div className="col-3 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By Claim837RTFileDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img> */}
                    File Name
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By Claim837RTFileDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.nameRotation}deg)`, marginRight: '4px' }}></img> */}
                    File Date
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by Claim837RTFileDetails.FileDate", this.state.dateRotation, 'dateRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.dateRotation}deg)`, marginRight: '4px' }}></img> */}
                    Check/EFT No.
                </div>
                <div className="col-3 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By Claim837RTFileDetails.FileStatus", this.state.statusRotation, 'statusRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.statusRotation}deg)`, marginRight: '4px' }}></img> */}
                    Check/EFT Date
                </div>
                <div className="col-2 col-header justify-align">
                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By Claim837RTFileDetails.Sender", this.state.submitterRotation, 'submitterRotation')} src={require('../../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.submitterRotation}deg)`, marginRight: '4px' }}></ */}
                    Organization
                </div>
            </div>
        )
    }

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        let count = 0

        console.log("dfbbgnbg" ,data)
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
                    <div className="col-3 col-small-style border-left small-font left-align"><a href={'#' + keys}
                        onClick={() => {
                            this.getTransactions(data[keys].value.FileID)
                        }} style={{ color: "var(--light-blue)" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileDate}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.CheckEFTNo}</div>
                    <div className="col-3 col-small-style small-font"> {data[keys].value.CheckEFTDt}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.Organization}</div>
                </div>
            )

            {
                col = []
                data[keys].array.forEach((d) => {
                    console.log(d)
                    col.push(
                        <tr>
                            <td className="list-item-style"><a className="clickable" onClick={() => {
                                this.setState({
                                    claimId: d.ClaimID
                                }, () => {
                                    this.getDetails(d.ClaimID, d.FileID, data[keys].value)
                                })
                            }} style={{ color: "var(--light-blue)" }}>{d.ClaimID}</a></td>
                            {/* <td className="list-item-style">{moment(d.ClaimDate).format('MM/DD/YYYY') != "Invalid date" ? moment(d.ClaimDate).format('MM/DD/YYYY') : d.ClaimDate}</td> */}
                            <td className="list-item-style">{d.PatientName}</td>
                            <td className="list-item-style">{d.PatientControlNo}</td>
                        
                            <td className="style-left">${d.TotalChargeAmt} </td>
                        <td className="list-item-style">${d.TotalClaimPaymentAmt}</td>


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
                        onPageChange={(page) => { this.handlePageClick(page, data[keys].value.FileID) }}
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
                <div style={{ marginLeft: '-14px' }}>  <br></br>
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

    renderTable() {
        const data = this.state.claimsObj
        let headerArray = []
        let rowArray = []
        headerArray.push(
            { value: 'File Name', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation'), key: this.state.transactionRotation, upScale: 1 },
            { value: 'File Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation'), key: this.state.dateRotation },
            { value: 'File Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation'), key: this.state.statusRotation },
            { value: 'Submitter', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation'), key: this.state.submitterRotation },
        )

        rowArray.push(
            { value: 'FileName' },
            { value: 'FileDate' },
            { value: 'FileStatus' },
            { value: 'Sender' }
        )

        return (
            <CommonNestedTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
            />
        )
    }
    

    render() {

        return (
            <div>
                <h5 className="headerText">Remittance Viewer</h5>
                {this.renderFilters()}
                <div className="row padding-left">
                    <div className="col-6 claim-list file-table">
                        {this.state.claimsObj ? this.renderList() : null}
                        {/* {this.state.claimsObj ? this.renderTable() : null} */}
                    </div>

                    <div className="col-6">
                        {
                            this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                            <div>
                            <h6 style={{ marginTop: '20px', color: "#424242" }}>Claim Information</h6>
                            <hr />
                        </div> : null
                        }
                        {
                            
                            this.state.showDetails && this.state.claimDetails && this.state.claimDetails.length > 0 ?
                            <table className="table claim-Details border">
                            {this.renderHeader('Claim #' + this.state.claimId)}
                            {/* {this.renderHeader('Claim Information ')} */}
                            {this.renderRows(this.state.claimDetails)}
                           
                         
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