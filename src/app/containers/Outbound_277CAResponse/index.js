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
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Strings from '../../../helpers/Strings';

var val = ''
export class Outbound_277CAReponse extends React.Component {

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
            gridType:1,
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "Response File Name", field: "ResponseFileName" , cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Date", field: "ResponseFileDate" },
                { headerName: "837 File Name", field: "FileName" },
                { headerName: "Status", field: "status" },
            ],
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
                editable: false,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100,
            },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',

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
            Data277CA(RecType: "Inbound", TrasactionType: "${this.state.transactionType}", FileId: "${fileId}", FileName: "", StartDt: "${startDate}", EndDt: "${endDate}", State: "${this.state.State}", page: ${this.state.page}, OrderBy: "${this.state.orderby}", GridType:${this.state.gridType}) {
              FileId
              FileName
              Date
              Submitter
              id
              status
              Response
              TrasactionType
              RecCount
              ResponseFileName
              ResponseFileDate
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
                let data = res.data
                let count = 1
                if (data && data.Data277CA.length > 0) {

                    count = Math.floor(data.Data277CA[0].RecCount / 10)
                    if (data.Data277CA[0].RecCount % 10 > 0) {
                        count = count + 1
                    }
                }
                
                if (res.data) {
                    this.setState({
                        files_list: res.data.Data277CA,
                        rowData: this.state.gridType == 1 ? res.data.Data277CA : [],
                        count: count
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

    handleToggle = (e, rotation, key) => {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            showDetails: false,
            orderby: e,
            [key]: rotation == 0 ? 180 : 0
        })
        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    render277CADetails(refId) {
        let query = `{
            Data277CA_Response (RefId:${refId}) {
              FileId
              RefId
              Response
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
                        Response: res.data.Data277CA_Response[0].Response,
                        showDetails: true
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });

    }

    renderDetails(flag) {
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding"><a  >{flag ? '277CA Acknowledgement' : 'Transaction Request'}</a></div>
                    <div style={{height:"200px" ,overflow: "auto"}} className="border-view breakword" id={'hello' + flag}>{this.state.Response}</div>
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
            showDetails: false,
            initialPage: 0,
            page: 1
        });

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false,
            initialPage: 0,
            page: 1
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

    renderFilters() {
        return (
            <form className="form-style" id='filters'>
                <div className="form-row">

                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>

                    <div className="form-group col-2">
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

                    <div className="form-group col-2">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker
                            className="form-control list-dashboard"
                            selected={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-dashboard"
                            selected={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleEndChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Grid Type</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.setState({
                                    page: 1,
                                    rowData : [],
                                    showDetails: false,
                                    files_list: [],
                                    gridType : event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
                                }, () => {
                                    this.getTransactions()
                                })
                            }}
                        >
                            <option value="select">Default</option>
                            <option selected value="select">Classic</option>
                        </select>
                    </div>
                </div>
            </form>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data277CA.ResponseFileName", this.state.fileNameRotation, 'fileNameRotation')}>Response File Name</a></td>
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data277CA.ResponseFileDate", this.state.dateRotation, 'dateRotation')}>Date</a></td>
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data277CA.FileName", this.state.fileRotation, 'fileRotation')}>837 File Name</a>
                </td>
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data277CA.status", this.state.statusRotation, 'statusRotation')}>Status</a>
                </td>
            </tr>
        )
    }

    renderTransactionsNew() {
        const data = this.state.files_list ? this.state.files_list : [];
        let row = []

        data.forEach(item => {
            let date = item.ResponseFileDate ? moment.utc((item.ResponseFileDate)).format("MM/DD/YYYY hh:mm a") : ''

            row.push(
                <tr>
                    <td className="list-item-style">
                        <a className="clickable"
                            onClick={() => {
                                this.render277CADetails(item.id)
                            }} style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>{item.ResponseFileName}</a></td>
                    <td className="list-item-style">{date}</td>
                    <td className="list-item-style" style={{ wordBreak: 'break-all' }}>{item.FileName}</td>
                    <td className="list-item-style">{item.status}</td>
                </tr>
            )

        });

        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    {this.state.files_list && this.state.files_list.length > 0 ? this.renderTableHeader() : null}
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

    _renderTransactions() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '17px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={this.state.columnDefs}
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
                        rowData={this.state.rowData}
                        enableCellTextSelection={true}    
                        enableCellTextSelection={true}    
                        onCellClicked={(event) => {
                            if(event.colDef.headerName == 'Response File Name'){
                            this.render277CADetails(event.data.id)
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }


    render() {
        return (
            <div>
                <h5 className="headerText">277 CA Claims Acknowledgement (Outbound)</h5>
                {this.renderFilters()}
                <div className="row">
                    <div className="col-7 margin-top">
                        {/* {this.renderTransactionsNew()} */}

                    {this.state.files_list && this.state.files_list.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                    {this.state.files_list && this.state.files_list.length > 0 && !this.state.gridType ? this.renderTransactionsNew() : null}
                    </div>
                    <div className="col-5 margin-top">
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div>
            </div>
        );
    }
}