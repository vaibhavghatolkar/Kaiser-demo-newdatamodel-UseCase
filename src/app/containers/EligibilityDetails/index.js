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
import { Filters } from '../../components/Filters';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

var val = ''
let controller = new AbortController()
export class EligibilityDetails extends React.Component {

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
             State: props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status: props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            startDate: props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            transactionId: props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            errorcode: props.location.state && props.location.state.data && props.location.state.data[0].errorcode ? props.location.state.data[0].errorcode : '',

            selectedTradingPartner: props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            page: 1,
            count: 0,
            apiflag: props.location.state.data[0].apiflag,
            transactionStatus:props.location.state.data[0] && props.location.state.data[0].transactionStatus ? props.location.state.data[0].transactionStatus : "",
            HiPaaSID:props.location.state.data[0] && props.location.state.data[0].HiPaaSID ? props.location.state.data[0].HiPaaSID : "",
            subtitle: props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            pieArray: [],
            labelArray: [],
            orderby: '',
            paginationPageSize: 5,
            domLayout: 'autoHeight',

            autoGroupColumnDef: {
                headerName: 'Group',
                minWidth: 170,
                field: 'athlete',
                valueGetter: function (params) {
                    if (params.node.group) {
                        return params.node.key;
                    } else {
                        return params.data[params.colDef.field];
                    }
                },
                headerCheckboxSelection: true,
                cellRenderer: 'agGroupCellRenderer',
                cellRendererParams: { checkbox: true },
            },
            defaultColDef: {
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
        }

        this.getData = this.getData.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.getTransactions()
    }

    _refreshScreen = () => {
        this.getData()
        this.getTransactions()
    }

    getData(uuid) {
        let query = ''
        if (uuid) {
            if (this.state.apiflag == 1) {
                query = `{
                    EventLogData270( HiPaaS_UUID: "${uuid}") {
                        HiPaaS_UUID
                        EventName
                        EventCreationDateTime
                        Exception
                        ErrorMessage
                        Transaction_Compliance
                      }
            }`
            } else {
                query = `{
                    EventLogData276( HiPaaS_UUID: "${uuid}") {
                        HiPaaS_UUID
                        EventName
                        EventCreationDateTime
                        Exception
                        ErrorMessage
                        Transaction_Compliance
                      }
            }`
            }
        } else {
            query = `{
                Trading_PartnerList(RecType :"Inbound", Transaction:"ClaimRequest")  {
                    Trading_Partner_Name 
                }
                ErrorType_List(Transaction: "ClaimRequest") {
                    ErrorType
                }
            }`

            if (this.state.apiflag == 1) {
                query = `{
                    Trading_PartnerList(RecType :"Inbound", Transaction:"EligibilityStatus")  {
                        Trading_Partner_Name 
                    }
                    ErrorType_List(Transaction: "Eligibility") {
                        ErrorType
                    }
                }`
            }
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.transaction270, {
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
                    if (uuid) {
                        let eventLog = ""
                        if(this.state.apiflag == 1){
                            eventLog = res.data.EventLogData270
                        }else{
                            eventLog = res.data.EventLogData276
                        }

                        this.setState({
                            eventLog: eventLog,
                            Transaction_Compliance: eventLog && eventLog.length > 0 ? eventLog[0].Transaction_Compliance : ''
                        })
                    } else {
                        this.setState({
                            tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                            errorList: res.data.ErrorType_List ? res.data.ErrorType_List : [],
                        })
                    }
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getTransactions() {
        controller.abort()
        controller = new AbortController()
        let query = ''
        let typeId = this.state.transactionStatus
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let chartQuery = ''
        let url = Urls.transaction270
        let loginflag = localStorage.getItem("DbTech");

        query = `{
            ClaimRequest_Datewise(TypeID:"`+ typeId + `" page:` + this.state.page + ` State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"` + this.state.errorcode + `" OrderBy:"` + this.state.orderby + `", HiPaaSUniqueID: "${this.state.HiPaaSID}" ) {
                HiPaaSUniqueID
                Date
                Trans_type
                Submiter
                Trans_ID
                Error_Type
                Error_Code
                ErrorDescription
            }`+ chartQuery + `
        }`

        if (this.state.apiflag == 1) {
            url = Urls.transaction270
            query = `{
                EligibilityAllDtlTypewise(TypeID:"`+ typeId + `" page:` + this.state.page + ` State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `" ErrorType:"` + this.state.errorcode + `" OrderBy:"` + this.state.orderby + `", HiPaaSUniqueID:"${this.state.HiPaaSID}" ) {
                    HiPaaSUniqueID
                    Date
                    Trans_type
                    Submiter
                    Trans_ID
                    Error_Type
                    Error_Code
                    ErrorDescription
                }`+ chartQuery + `
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    let count = 1
                    let data = []
                    let pieArray = []
                    let labelArray = []

                    if (this.state.apiflag == 1) {
                        data = res.data.EligibilityAllDtlTypewise
                    } else {
                        data = res.data.ClaimRequest_Datewise
                    }

                    if (this.state.status != "Pass" && res.data.Eligibilty271ErrorwiseCount) {
                        res.data.Eligibilty271ErrorwiseCount.forEach(item => {
                            pieArray.push(item.RecCount)
                            labelArray.push(item.ErrorType)
                        })
                    }


                    this.setState({
                        files_list: data,
                        count: count,
                        pieArray: pieArray,
                        labelArray: labelArray,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
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

    handlePageClick = (data) => {
        let page = data.selected + 1
        let flag = false
        if(page != this.state.page){
            flag = true
        }

        this.setState({
            page: page
        })

        if(flag){
            setTimeout(() => {
                this.getTransactions()
            }, 50)
        }
    }

    getDetails(uuid) {
        let url = Urls.transaction270

        let query = `{
            ClaimRequest(HiPaaSUniqueID:"`+ uuid + `") {
              Message
            }
            ClaimStatus277(HiPaaSUniqueID:"`+ uuid + `") {
                Message
            }
        }`

        if (this.state.apiflag == 1) {
            url = Urls.transaction270
            query = `{
                Eligibilty270Request(HiPaaSUniqueID:"`+ uuid + `") {
                  Message
                }
                Eligibilty271Response(HiPaaSUniqueID:"`+ uuid + `") {
                    Message
                }
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
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
                        showDetails: true,
                        message_270: this.state.apiflag == 1 ? res.data.Eligibilty270Request && res.data.Eligibilty270Request.length > 0 && res.data.Eligibilty270Request[0].Message : res.data.ClaimRequest[0].Message,
                        message_271: this.state.apiflag == 1 ? res.data.Eligibilty271Response && res.data.Eligibilty271Response.length > 0 && res.data.Eligibilty271Response[0].Message : res.data.ClaimStatus277[0].Message,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderTransactions() {
        let row = []
        const data = this.state.files_list ? this.state.files_list : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td className="border-left"><a onClick={() => {
                        this.getData(d.HiPaaSUniqueID)
                        this.getDetails(d.HiPaaSUniqueID)
                    }} style={{ color: "var(--light-blue)", cursor: "pointer" }}>{d.Trans_ID}</a></td>
                    <td>{moment(d.Date).format("MMM DD YYYY hh:mm a")}</td>
                    <td>{d.Trans_type}</td>
                    <td>{d.Submiter}</td>
                    {this.state.status != 'Pass' ? <td>{d.Error_Type}</td> : null}
                    {this.state.status != 'Pass' ? <td>{d.Error_Code}</td> : null}
                    {this.state.status != 'Pass' ? <td>{d.ErrorDescription}</td> : null}
                </tr>
            )
        })
        return (
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head" style={{ fontSize: "9px" }}>
                            <td className="table-head-text">Transaction Id
                                <div>
                                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation')} src={require('../../components/Images/icons8-down-arrow-241.png')} style={{ width: '13px', transform: `rotate(${this.state.transactionRotation}deg)` }}></img>
                                </div>
                            </td>
                            <td className="table-head-text list-item-style" >Transaction Date
                            <div>
                                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation')} src={require('../../components/Images/icons8-down-arrow-241.png')} style={{ width: '13px', transform: `rotate(${this.state.dateRotation}deg)` }}></img>
                                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime desc" : "order by Date desc")} src={require('../../components/Images/icons8-down-arrow-24.png')} style={{ width: '13px' }}></img> */}
                                </div>
                            </td>
                            <td className="table-head-text list-item-style">Status
                            <div>
                                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation')} src={require('../../components/Images/icons8-down-arrow-241.png')} style={{ width: '13px', transform: `rotate(${this.state.statusRotation}deg)` }}></img>
                                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus desc" : "order by Trans_type desc")} src={require('../../components/Images/icons8-down-arrow-24.png')} style={{ width: '13px' }}></img> */}
                                </div>
                            </td>
                            <td className="table-head-text list-item-style">Submitter
                            <div>
                                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation')} src={require('../../components/Images/icons8-down-arrow-241.png')} style={{ width: '13px', transform: `rotate(${this.state.submitterRotation}deg)` }}></img>
                                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender desc" : "order by Submiter desc")} src={require('../../components/Images/icons8-down-arrow-24.png')} style={{ width: '13px' }}></img> */}
                                </div>
                            </td>
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Type
                            <div>
                                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.ErrorMessage" : "order by Error_Type", this.state.errorRotation, 'errorRotation')} src={require('../../components/Images/icons8-down-arrow-241.png')} style={{ width: '13px', transform: `rotate(${this.state.errorRotation}deg)` }}></img>
                                    {/* <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.ErrorMessage desc" : "order by Error_Type desc")} src={require('../../components/Images/icons8-down-arrow-24.png')} style={{ width: '13px' }}></img> */}
                                </div>
                            </td> : null}
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Code
                            {/* <img src={require('../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '8px' }}></img>
                                <img src={require('../../components/Images/icons8-down-arrow-24.png')} style={{ width: '8px' }}></img> */}
                            </td> : null}
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Description
                            {/* <img src={require('../../components/Images/icons8-long-arrow-up-32.png')} style={{ width: '8px' }}></img>
                                <img src={require('../../components/Images/icons8-down-arrow-24.png')} style={{ width: '8px' }}></img> */}
                            </td> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
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

    _renderList = () => {
        let columnDefs = [
            { headerName: "Transaction Id", field: "Trans_ID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Transaction Date", field: "Date", width: 150 },
            { headerName: "Status", field: "Trans_type", width: 150 },
            { headerName: "Submitter", field: "Submiter", width: 150 },
            { headerName: "Error Type", field: "Error_Type", width: 150 },
            { headerName: "Error Code", field: "Error_Code", width: 150 },
            { headerName: "Error Description", field: "ErrorDescription", flex: 1 },
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={this.state.files_list}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'Transaction Id') {
                                this.setState({
                                    showDetails: true
                                },() =>{
                                    this.getData(event.data.HiPaaSUniqueID)
                                    this.getDetails(event.data.HiPaaSUniqueID)   
                                })
                                  
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
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
            this.getTransactions()
        }, 50);
    }
    renderDetails(flag) {
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'hello' + flag} data-toggle="collapse">{flag ? 'Transaction Response' : 'Transaction Request'}</div>
                    <div className="border-view collapse breakword" id={'hello' + flag}>{flag ? this.state.message_271 : this.state.message_270}</div>
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

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text,
            showDetails: false
        }, () => {
            this.getTransactions()
        })
    }

    renderFilters() {
        return (
            <form className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col">
                        <div className="list-dashboard">Transaction Id</div>
                        <input className="form-control list-dashboard"
                            id="state"
                            onChange={(e) => {
                                clearTimeout(val)
                                let value = e.target.value
                                val = setTimeout(() => {
                                    this.setState({ transactionId: value, showDetails: false })
                                    setTimeout(() => {
                                        this.getTransactions()
                                    }, 50);
                                }, 300);
                            }}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>

                    <div className="form-group col">
                        <div className="list-dashboard">Submitte </div>
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

                    {
                        this.state.status != 'Pass'
                            ?
                            <div className="form-group col">
                                <div className="list-dashboard">Error Type</div>
                                <select className="form-control list-dashboard" id="TradingPartner"
                                    onChange={(event) => {
                                        this.onSelect(event, 'errorcode')
                                        setTimeout(() => {
                                            this.getTransactions()
                                        }, 50);
                                    }}
                                >
                                    <option value="select"></option>
                                    {this.getErrorOptions()}
                                </select>
                            </div>
                            : null
                    }
                    <div className="form-group col">
                        <div className="list-dashboard">
                            Provider Name
   
                        </div>
                        <select className="form-control list-dashboard"><option value=""></option>
                            <option selected="selected" value="1">Provider Name 1</option>
                            <option value="2">Provider Name 2</option>
                        </select>
                    </div>

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

    renderEventLog() {
        let row = []
        const data = this.state.eventLog ? this.state.eventLog : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.EventName}</td>
                    <td>{moment(Number(d.EventCreationDateTime) ? Number(d.EventCreationDateTime) : d.EventCreationDateTime).format('MM/DD/YYYY, hh:mm:ss:SSS')}</td>
                    <td>{d.Exception}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'event'} data-toggle="collapse">Stage Details ({this.state.Transaction_Compliance})</div>
                    <div id={'event'}>
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head" style={{ fontSize: "9px" }}>
                                    <td className="table-head-text list-item-style" width='33.33%'>Stage</td>
                                    <td className="table-head-text list-item-style" width='33.33%'>Execution Time</td>
                                    <td className="table-head-text list-item-style" width='33.33%'>Exception</td>
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

    createData(Trans_ID, Date, Trans_type, Submiter) {
        return { Trans_ID, Date, Trans_type, Submiter };
    }

    renderHeader() {
        return (
            <div className="row">
                <div className="col-header justify-align col">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.transactionRotation}deg)`, marginRight: '2px' }}></img> Transaction
                </div>
                <div className="col-header justify-align col" >
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.dateRotation}deg)`, marginRight: '2px' }}></img>Date
                </div>
                <div className="col-header justify-align col">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.statusRotation}deg)`, marginRight: '2px' }}></img> Status
                </div>
                <div className="col-header justify-align col">
                    <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.submitterRotation}deg)`, marginRight: '2px' }}></img> Submitter
                </div>
                {this.state.status != 'Pass' ? <div className="col-header justify-align col"><img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.ErrorMessage" : "order by Error_Type", this.state.errorRotation, 'errorRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '13px', transform: `rotate(${this.state.errorRotation}deg)` }}></img> Error Type</div> : null}
                {this.state.status != 'Pass' ? <div className="col-header justify-align col">Error Code</div> : null}
                {this.state.status != 'Pass' ? <div className="col-header justify-align col">Error Description</div> : null}
            </div>
        )
    }

    onClick = (value) => {
        this.getData(value)
        this.getDetails(value)
    }

    renderTransactionsNew() {
        const data = this.state.files_list ? this.state.files_list : []
        let headerArray = []
        let rowArray = []
        headerArray.push(
            { value: 'Transaction', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation'), key: this.state.transactionRotation, upScale: 1 },
            { value: 'Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation'), key: this.state.dateRotation },
            { value: 'Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation'), key: this.state.statusRotation },
            { value: 'Submitter', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation'), key: this.state.submitterRotation },
            { value: 'Error Type' },
            { value: 'Error Code' },
            { value: 'Description' }
        )

        rowArray.push(
            { value: 'Trans_ID', upScale: 1 },
            { value: 'Date', isDate: 1, isNottime: 1 },
            { value: 'Trans_type' },
            { value: 'Submiter' },
            { value: 'Error_Type' },
            { value: 'Error_Code' },
            { value: 'ErrorDescription' }
        )

        return (
            <CommonTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
                count={this.state.count}
                handlePageClick={this.handlePageClick}
                onClickKey={'HiPaaSUniqueID'}
                onClick={this.onClick}
            />
        )
    }

    renderEnhancedTable() {
        let row = []
        const data = this.state.files_list ? this.state.files_list : []

        data.forEach((d) => {
            row.push(
                <div className="row">
                    <div className="col col-small-style">
                        <a className="cursor-value small-font"
                            onClick={() => {
                                this.getData(d.HiPaaSUniqueID)
                                this.getDetails(d.HiPaaSUniqueID)
                            }} style={{ color: "#6AA2B8" }}>{d["Trans_ID"]}</a></div>
                    <div className="col col-small-style small-font">{moment(d.Date).format("MMM DD YYYY hh:mm a")}</div>
                    <div className="col col-small-style small-font">{d["Trans_type"]}</div>
                    <div className="col col-small-style small-font">{d["Submiter"]}</div>
                    {this.state.status != 'Pass' ? <div className="col col-style small-font">{d["Error_Type"]}</div> : null}
                    {this.state.status != 'Pass' ? <div className="col col-style small-font">{d["Error_Code"]}</div> : null}
                    {this.state.status != 'Pass' ? <div className="col col-style small-font">{d["ErrorDescription"]}</div> : null}
                </div>
            )
        })
        return (
            <div className="margin">
                <div className="row">
                    <div className="col-header justify-align col">
                        <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.transactionRotation}deg)`, marginRight: '2px' }}></img> Transaction
                    </div>
                    <div className="col-header justify-align col" >
                        <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.dateRotation}deg)`, marginRight: '2px' }}></img>Date
                    </div>
                    <div className="col-header justify-align col">
                        <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.statusRotation}deg)`, marginRight: '2px' }}></img> Status
                    </div>
                    <div className="col-header justify-align col">
                        <img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${this.state.submitterRotation}deg)`, marginRight: '2px' }}></img> Submitter
                    </div>
                    {this.state.status != 'Pass' ? <div className="col-header justify-align col"><img onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.ErrorMessage" : "order by Error_Type", this.state.errorRotation, 'errorRotation')} src={require('../../components/Images/up_arrow.png')} style={{ width: '13px', transform: `rotate(${this.state.errorRotation}deg)` }}></img> Error Type</div> : null}
                    {this.state.status != 'Pass' ? <div className="col-header justify-align col">Error Code</div> : null}
                    {this.state.status != 'Pass' ? <div className="col-header justify-align col">Error Description</div> : null}
                </div>
                {row}
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
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

    setData = (startDate, endDate, selected_val, chartType) => {
        this.setState({
            startDate,
            endDate,
            selected_val,
            chartType
        }, () => {
            this._refreshScreen()
        })
    }
    update = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                isSubmitter={true}
                removeGrid={true}
<<<<<<< HEAD
                errorType = {false}
=======
>>>>>>> f10f04c2f1307c55137848338767375e4b3f5f19
                setData={this.setData}
                // onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                TransactionId={true}
<<<<<<< HEAD
               
=======
                submitter_key={this.state.apiflag == 1 ? "EligibilityStatus" : "ClaimRequest"}
>>>>>>> f10f04c2f1307c55137848338767375e4b3f5f19
            />
        )
    }
    
    render() {
        return (
            <div>
                <h5 className="headerText">{(this.state.apiflag == 0 ?  'Claim Status Details ' : 'Eligibility Details ')}{this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {/* {this.renderFilters()} */}
                {this._renderTopbar()}
                {this._renderList()}
                {this.state.showDetails && this.state.eventLog && this.state.eventLog.length > 0 ? this.renderEventLog(1) : null}
                {this.state.showDetails ? this.renderDetails() : null}
                {this.state.showDetails ? this.renderDetails(1) : null}
                {/* <div className="row">
                    <div className="col-7 margin-top">
                        {this.renderTransactionsNew()}
                    </div>
                    <div className="col-5">
                        {this.state.showDetails && this.state.eventLog && this.state.eventLog.length > 0 ? this.renderEventLog(1) : null}
                        {this.state.showDetails ? this.renderDetails() : null}
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div> */}
            </div>
        );
    }
}