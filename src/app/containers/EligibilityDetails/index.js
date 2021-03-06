import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../color.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import '../Files/files-styles.css';
import { Filters } from '../../components/Filters';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { ServersideGrid } from '../../components/ServersideGrid';
var val = ''
const $ = window.$;
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
            State: props.location.state && props.location.state.data && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status: props.location.state && props.location.state.data && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            startDate: props.location.state && props.location.state.data && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            transactionId: props.location.state && props.location.state.data && props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            errorcode: props.location.state && props.location.state.data && props.location.state.data[0].errorcode ? props.location.state.data[0].errorcode : '',

            selectedTradingPartner: props.location.state && props.location.state.data && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            page: 1,
            count: 0,
            apiflag: props.location.state && props.location.state.data && props.location.state.data[0].apiflag,
            transactionStatus: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].transactionStatus ? props.location.state.data[0].transactionStatus : "",
            HiPaaSID: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].HiPaaSID ? props.location.state.data[0].HiPaaSID : "",
            subtitle: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            complianceStatus: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].complianceStatus ? props.location.state.data[0].complianceStatus : '',
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
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
        }

        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()

    }

    _refreshScreen = () => {
        this.getData()

    }

    getData(uuid) {
        let query = ''
            if (this.state.apiflag == 1) {
                query = `{
                    EventLogData270( HiPaaS_UUID: "${uuid}") {
                        HiPaaS_UUID
                        EventName
                        EventCreationDateTime
                        Exception
                        ErrorMessage
                        Transaction_Compliance
                        Response_Time
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
                        Response_Time
                      }
            }`
        }
        

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.transaction270, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    'user-id' : sessionStorage.getItem('user-id'),
'Cache-Control': 'no-cache, no-store',
'Expires': 0,
'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    if (uuid) {
                        let eventLog = ""
                        if (this.state.apiflag == 1) {
                            eventLog = res.data.EventLogData270
                        } else {
                            eventLog = res.data.EventLogData276
                        }

                        this.setState({
                            eventLog: eventLog,
                            Transaction_Compliance: eventLog && eventLog.length > 0 ? eventLog[0].Transaction_Compliance : ''
                        })
                    } else {
                        this.setState({
                            tradingpartner: [],
                            errorList: [],
                        })
                    }
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
                    'user-id' : sessionStorage.getItem('user-id'),
'Cache-Control': 'no-cache, no-store',
'Expires': 0,
'Pragma': 'no-cache',
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

    clickNavigation = (event) => {
        if (event.colDef.headerName == 'Transaction Id') {
            this.setState({
                showDetails: true
            }, () => {
                this.getData(event.data.HiPaaSUniqueID)
                this.getDetails(event.data.HiPaaSUniqueID)
            })

        } else if (event.colDef.headerName == "Error Description" && event.data.ErrorDescription) {
            this.setState({
                clickedError: event.data.ErrorDescription
            }, () => {
                $('#error_modal').modal('show')
            })

        }
    }
    updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
        this.setState({
            fieldType: fieldType,
            sortType: sortType,
            startRow: startRow,
            endRow: endRow,
            filterArray: filterArray
        })
    }
    _renderList() {
        let columnDefs;
        if (this.state.transactionStatus == 'Pass' || this.state.transactionStatus == 'No') {
            columnDefs = [
                { headerName: "Transaction Id", field: "Trans_ID", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Transaction Date", field: "Date", flex: 1 },
                { headerName: "Status", field: "Trans_type", flex: 1 },
                { headerName: "Submitter", field: "Submiter", flex: 1 },
                { headerName: "Response Time (sec)", field: "Response_Time", flex: 1 },
            ]
        } else {
            if (this.state.apiflag == 1) {
                columnDefs = [
                    { headerName: "Transaction Id", field: "Trans_ID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                    { headerName: "Transaction Date", field: "Date", width: 150 },
                    { headerName: "Status", field: "Trans_type", width: 150 },
                    { headerName: "Submitter", field: "Submiter", width: 150 },
                    { headerName: "Response Time (sec)", field: "Response_Time", width: 70 },
                    { headerName: "Error Type", field: "Error_Type", width: 150 },
                    { headerName: "Error Code", field: "Error_Code", width: 150 },
                    { headerName: "Error Description", field: "ErrorDescription", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                ]
            } else {
                columnDefs = [
                    { headerName: "Transaction Id", field: "Trans_ID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                    { headerName: "Transaction Date", field: "Date", width: 150 },
                    { headerName: "Status", field: "Trans_type", width: 150 },
                    { headerName: "Submitter", field: "Submiter", width: 150 },
                    { headerName: "Response Time (sec)", field: "Response_Time", width: 70 },
                    { headerName: "Error Code", field: "Error_Code", width: 150 },
                    { headerName: "Error Description", field: "ErrorDescription", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                ]
            }
        }

        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = ''
        let chartQuery = ''
        let passquery = ''
        query = `{
            ClaimRequest_DatewiseNew(TypeID:"${this.state.transactionStatus}" page: 1 State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" StartDt:"` + startDate + `" EndDt:"` + endDate + `" TransactionID:"` + this.state.transactionId + `"  ErrorType:"` + this.state.errorcode + `" OrderBy:"` + this.state.orderby + `", HiPaaSUniqueID: "${this.state.HiPaaSID}"
            ,sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
            startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter},
            TransactionStatus: "${this.state.complianceStatus}"
            ) {
                RecCount
                HiPaaSUniqueID
                Date
                Trans_type
                Submiter
                Trans_ID
                Error_Type
                Error_Code
                ErrorDescription
                Response_Time
            }`+ chartQuery + `
        }`

        if (this.state.apiflag == 1) {
            query = `{
                EligibilityAllDtlTypewiseNew(TypeID:"${this.state.transactionStatus}" page: 1  
                State:"` + this.state.State + `" Sender:"` + this.state.selectedTradingPartner + `" 
                StartDt:"` + startDate + `" EndDt:"` + endDate + `" 
                TransactionID:"` + this.state.transactionId + `"  
                ErrorType:"` + this.state.errorcode + `" OrderBy:"` + this.state.orderby + `",
                HiPaaSUniqueID: "${this.state.HiPaaSID}"
                ,sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter},
                TransactionStatus: "${this.state.complianceStatus}"
                ) {
                    RecCount
                    HiPaaSUniqueID
                    Date
                    Trans_type
                    Submiter
                    Trans_ID
                    Error_Type
                    Error_Code
                    ErrorDescription
                    Response_Time
                }`+ chartQuery + `
            }`
        }
        if (this.state.apiflag == 1) {
            passquery = 'EligibilityAllDtlTypewiseNew'
        } else {
            passquery = 'ClaimRequest_DatewiseNew'
        }

        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls.transaction270}
                    fieldType={'Date'}
                    index={passquery}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    filterClaim={this.state.transactionId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    errorDialog = () => {
        return (
            <div className="modal" id="error_modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Error Description</div>
                        <div className="scroll-div">
                            {this.state.clickedError}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#error_modal').modal('hide')
                            }}>
                            Close
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        )
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

    renderEventLog() {
        let row = []
        const data = this.state.eventLog ? this.state.eventLog : []
        let responseTime = 0
        data.forEach((d) => {
            try {
                responseTime = (Math.round(d.Response_Time * 100) / 100).toFixed(2);
            } catch (error) {}
            row.push(
                <tr>
                    <td>{d.EventName}</td>
                    {/* <td>{moment(d.EventCreationDateTime ? Number(d.EventCreationDateTime) : d.EventCreationDateTime).format('MM/DD/YYYY, hh:mm:ss:SSS')}</td> */}
                    <td>{d.EventCreationDateTime}</td>
                    <td>{d.Exception}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'event'} data-toggle="collapse">Stage Details ({this.state.Transaction_Compliance}), {responseTime && responseTime != 0 ? ('Response Time (sec) : ' + responseTime) : ''}</div>
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

    onClick = (value) => {
        this.getData(value)
        this.getDetails(value)
    }

    setData = (startDate, endDate, selected_val, chartType) => {
        this.setState({
            startDate,
            endDate,
            selected_val,
            chartType,
        }, () => {
            this._refreshScreen()
        })
    }
    update = (key, value) => {
        this.setState({
            [key]: value,
            showDetails: false
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
                setData={this.setData}
                // onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                TransactionId={true}
                submitter_key={this.state.apiflag == 1 ? "EligibilityStatus" : "ClaimRequest"}
                State={this.state.State}
                selectedTradingPartner={this.state.selectedTradingPartner}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">{(this.state.apiflag == 0 ? 'Claim Status Details ' : 'Eligibility Details ')}{this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {this._renderTopbar()}
                {this._renderList()}
                {this.state.showDetails && this.state.eventLog && this.state.eventLog.length > 0 ? this.renderEventLog(1) : null}
                {this.state.showDetails ? this.renderDetails() : null}
                {this.state.showDetails ? this.renderDetails(1) : null}
                {this.errorDialog()}
               
            </div>
        );
    }
}