import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import '../../Files/files-styles.css';
import { StateDropdown } from '../../../components/StateDropdown';
import Strings from '../../../../helpers/Strings';

var val = ''
export class Payment_details  extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            showDetails: false,
            nameRotation: 180,
            transactionRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            errorRotation: 180,
            rotation: 180,
            fileNameRotation : 180,
            dateRotation : 180,
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

            page: 1,
            count: 0,
            apiflag: 0,
            Response: '',
            initialPage: null,

            pieArray: [],
            labelArray: [],
            orderby: '',
            fileRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            Sender:'',
            Organization:'',
            Service_startDate: '',
            Service_endDate:'',
            startDate:'',
            endDate:'',
            Firstgridpage:1,
            orderby:'', 
            intakeClaims:[],
            StateList:[]
        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.Service_StartChange = this.Service_StartChange.bind(this)
        this.Service_EndChange = this.Service_EndChange.bind(this)
    }

    componentDidMount() {
        this.getTransactions()
        this.getState()
    }

    getTransactions() {

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
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
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

                let count = 1
                if (res && res.data && res.data.RemittanceViewerFileDetails) {

                    if (res.data.RemittanceViewerFileDetails.length > 0) {

                        count = Math.floor(res.data.RemittanceViewerFileDetails[0].RecCount / 10)
                        if (res.data.RemittanceViewerFileDetails[0].RecCount % 10 > 0) {
                            
                            count = count + 1
                        }
                    }

                    this.setState({
                        intakeClaims: res.data.RemittanceViewerFileDetails,
                        count : count
                    })


                }


            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    showDetails() {
        this.setState({
            showDetails: true
        })
    }

    onClick = (value) => {
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
            this.getTransactions()
        }, 50);
    }


    renderDetails(flag) {
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding"><a>{flag ? '835 Response' : 'Transaction Request'}</a></div>
                    <div className="border-view breakword" style={{height: '300px', overflow:'auto'}} id={'hello' + flag}>ISA*01*0000000000*01*0000000000*ZZ*ABCDEFGHIJKLMNO*ZZ*123456789012345*101127*1719*U*00400*000003438*0*P*>~GS*HP*ABCCOM*01017*20110315*1005*1*X*004010X091A1~ST*835*07504123~BPR*H*5.75*C*NON************20110315~TRN*1*A04B001017.07504*1346000128~DTM*405*20110308~N1*PR*ASHTABULA COUNTY ADAMH BD*XX*6457839886~N3*4817 STATE ROAD SUITE 203~N4*ASHTABULA*OH*44004~N1*PE*LAKE AREA RECOVERY CENTER *FI*346608640~N3*2801 C. COURT~N4*ASHTABULA*OH*44004~REF*PQ*1017~LX*1~CLP*444444*1*56.70*56.52*0*MC*0000000655555555*53~NM1*QC*1*FUDD*ELMER*S***MI*1333333~NM1*82*2*WECOVERWY SVCS*****FI*346608640~REF*F8*A76B04054~SVC*HC:H0005:HF:H9*56.70*56.52**6~DTM*472*20110205~CAS*CO*42*0.18*0~REF*6R*444444~CLP*999999*4*25.95*0*25.95*13*0000000555555555*11~NM1*QC*1*SAM*YOSEMITE*A***MI*3333333~NM1*82*2*ACME AGENCY*****FI*310626223~REF*F8*H57B10401~SVC*ZZ:M2200:HE*25.95*0**1~DTM*472*20021224~CAS*CR*18*25.95*0~CAS*CO*42*0*0~REF*6R*999999~CLP*888888*4*162.13*0*162.13*MC*0000000456789123*11~NM1*QC*1*SQUAREPANTS*BOB* ***MI*2222222~NM1*82*2*BIKINI AGENCY*****FI*310626223~REF*F8*H57B10401~SVC*ZZ:M151000:F0*162.13*0**1.9~DTM*472*20020920~CAS*CO*29*162.13*0*42*0*0~REF*6R*888888~CLP*111111*2*56.52*18.88*0*13*0000000644444444*53~NM1*QC*1*LEGHORN*FOGHORN*P***MI*7777777~NM1*82*2*CHICKENHAWK SVCS*****FI*346608640~REF*F8*A76B04054~SVC*HC:H0005:HF:H9*56.52*18.88**6~DTM*472*20031209~CAS*CO*42*0*0~CAS*OA*23*37.64*0~REF*6R*111111~CLP*121212*4*56.52*0*0*13*0000000646464640*53~NM1*QC*1*EXPLORER*DORA****MI*1717171~NM1*82*2*SWIPER AGENCY*****FI*346608640~REF*F8*A76B04054~SVC*HC:H0005:HF:H9*56.52*0**6~DTM*472*20031202~CAS*CO*42*0*0~CAS*OA*23*57.6*0*23*-1.08*0~REF*6R*121212~CLP*333333*1*74.61*59.69*14.92*13*0000000688888888*55~NM1*QC*1*BEAR*YOGI* ***MI*2222222~NM1*82*2*JELLYSTONE SVCS*****FI*346608640~REF*F8*A76B04054~SVC*ZZ:A0230:HF*74.61*59.69**1~DTM*472*20110203~CAS*PR*2*14.92*0~CAS*CO*42*0*0~REF*6R*333333~CLP*777777*25*136.9*0*0*13*0000000622222222*53~NM1*QC*1*BIRD*TWEETY*M***MI*4444444~NM1*82*2*GRANNY AGENCY*****FI*340716747~REF*F8*A76B03293~SVC*HC:H0015:HF:99:H9*136.9*0**1~DTM*472*20030911~CAS*PI*104*136.72*0~CAS*CO*42*0.18*0~REF*6R*777777~CLP*123456*22*-42.58*-42.58*0*13*0000000657575757*11~NM1*QC*1*SIMPSON*HOMER* ***MI*8787888~NM1*82*2*DOH GROUP*****FI*310626223~REF*F8*A57B04033~SVC*HC:H0036:GT:UK*-42.58*-42.58**-2DTM*472*20110102~CAS*CR*141*0*0*42*0*0*22*0*0~CAS*OA*141*0*0~REF*6R*123456~CLP*090909*22*-86.76*-86.76*0*MC*0000000648484848*53~NM1*QC*1*DUCK*DAFFY*W***MI*1245849~NM1*82*2*ABTHSOLUTE HELP*****FI*346608640REF*F8*A76B04054~SVC*HC:H0004:HF:H9*-86.76*-86.76**-4~DTM*472*20110210~CAS*CR*22*0*0*42*0*0~CAS*OA*22*0*0~REF*6R*090909~LQ*HE*MA92~SE*93*07504123GE*1*1~IEA*1*004075123</div>
                </div>
            </div>
        )
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
                    StateList: res.data.StateList

                })
            })

            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
        setTimeout(() => {
            this.getTransactions()
        }, 50);
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
            showDetails: false,
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false,
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text,
            showDetails: false,
            initialPage: 0,
            page: 1
        }, () => {
            this.getTransactions()
        })
    }


    Service_StartChange(date) {
        this.setState({
            Service_startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }
    Service_EndChange(date) {
        this.setState({
            Service_endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getTransactions()
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
                                                        this.getTransactions()
                                                    }, 50);
                                                }} >>
                                            <option value="" ></option>
                                                {this.getoptions()}

                                            </select>
                      
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Organization</div>
                      <input className="form-control" 
                                                onChange={(event) => {
                                                    clearTimeout(val)
                                                    let value = event.target.value
                                                    val = setTimeout(() => {
                                                        this.setState({ Organization: value, showDetails: false })
                                                        setTimeout(() => {
                                                            this.getTransactions()
                                                        }, 50);
                                                    }, 300);
                                                }}
                                            />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Check/EFT Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.Service_startDate ? new Date(this.state.Service_startDate) : ''}
                            onChange={this.Service_StartChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Check/EFT End Date</div>
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

    renderTableHeader() {
        return (
            <tr className="table-head">
                
                <td className="table-head-text list-item-style">
                <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerFileDetails.FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>File Name</a>
                </td>
                <td className="table-head-text list-item-style">
                <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerFileDetails.FileDate", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>File Date</a>
                </td>
                <td className="table-head-text list-item-style">
                <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerFileDetails.Organization", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>Organization</a>
                </td>
                <td className="table-head-text list-item-style">
                <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerFileDetails.CheckEFTNo", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>Check/EFT No.</a>
                </td>
                <td className="table-head-text list-item-style">
                <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By RemittanceViewerFileDetails.CheckEFTDt", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>Check/EFT Date</a>
                </td>
            </tr>
        )
    }

    renderTransactionsNew() {
        const data = this.state.intakeClaims ? this.state.intakeClaims : [];
        let row = []

        data.forEach(item => {
            let date = item.FileDate ? moment((item.FileDate)).format("MM/DD/YYYY hh:mm a") : ''
            let CheckEFTDt = item.CheckEFTDt ? moment((item.CheckEFTDt)).format("MM/DD/YYYY hh:mm a") : ''
            // let date = item.FileDate ? moment((item.FileDate)).format("MM/DD/YYYY hh:mm a") : ''

            row.push(
                <tr>
                    <td className="list-item-style">
                        <a className="clickable"
                            onClick={() => {
                                this.onClick()
                            }} style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>{item.FileName}</a></td>
                    <td className="list-item-style">{date}</td>
                    <td className="list-item-style" style={{wordBreak: 'break-all'}}>{item.Organization}</td>
                    <td className="list-item-style" style={{wordBreak: 'break-all'}}>{item.CheckEFTNo}</td>
                    <td className="list-item-style">{CheckEFTDt}</td>
                </tr>
            )

        });

        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    { this.renderTableHeader()}
                    <tbody>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={this.state.initialPage}
                    forcePage={this.state.initialPage}
                    pageCount={this.state.count}
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


    render() {
        return (
            <div>
                <h5 className="headerText">835 Details</h5>
                {this.renderFilters()}
                <div className="row">
                    <div className="col-7 margin-top">
                        {this.renderTransactionsNew()}
                    </div>
                    <div className="col-5 margin-top">
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div>
            </div>
        );
    }
}