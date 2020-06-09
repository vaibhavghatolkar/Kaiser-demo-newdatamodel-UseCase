import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../color.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import '../Files/files-styles.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Strings from '../../../helpers/Strings';
import { Filters } from '../../components/Filters';
import { ServersideGrid } from '../../components/ServersideGrid';

var val = ''
export class Outbound_277CAReponse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            showDetails: false,
            transactionRotation: 180,
            submitterRotation: 180,
            errorRotation: 180,
            rotation: 180,
            fileNameRotation: 180,
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
            gridType: 1,
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "Response File Name", field: "ResponseFileName", width: 220, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Date", field: "ResponseFileDateTime", width: 100, },
                { headerName: "837 File Name", field: "FileName", width: 220, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "Status", field: "status", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
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
                    <div style={{ height: "200px", overflow: "auto" }} className="border-view breakword" id={'hello' + flag}>{this.state.Response}</div>
                </div>
            </div>
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

    clickNavigation = (event) => {
        if (event.colDef.headerName == 'Response File Name') {
            this.render277CADetails(event.data.id)
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

    _renderTransactions() {
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let fileId = this.props.location.state ? (this.props.location.state.fileId ? this.props.location.state.fileId : '') : ""

        let query = `{
            Data277CANew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                    
                    RecType: "Inbound", TrasactionType: "${this.state.transactionType}", 
                    FileId: "${fileId}", FileName: "", StartDt: "${startDate}", EndDt: "${endDate}", 
                    State: "${this.state.State}", page: ${this.state.page}, OrderBy: "${this.state.orderby}", GridType:${this.state.gridType}
            ) {
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
                    ResponseFileDateTime            
                }
            }`
        return (
            <div style={{ padding: '0', marginTop: '17px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls.common_data}
                    index={'Data277CANew'}
                    fieldType={'ResponseFileDateTime'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    _refreshScreen = () => {
        
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            showDetails: false,
            files_list: [],
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            // this.getTransactions()
        })
    }

    update = (key, value) => {
        this.setState({
            [key]: value,
            showDetails: false,
            initialPage: 0,
            page: 1
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                removeGrid={true}
                endDate={this.state.endDate}
                isDiffSubmitter={true}
                transactionType={this.state.transactionType}
            />
        )
    }


    render() {
        return (
            <div>
                <h5 className="headerText">277 CA Claims Acknowledgement (Outbound)</h5>
                {this._renderTopbar()}
                <div className="row">
                    <div className="col-7 margin-top">
                        {/* {this.renderTransactionsNew()} */}

                        {this._renderTransactions()}
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