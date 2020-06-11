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
import { Filters } from '../../components/Filters';

var val = ''
export class Outbound_Encounter_response_999 extends React.Component {

    constructor(props) {
        super(props);
        console.log('here are the props', props)
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
            fileNameRotation: 180,
            dateRotation: 180,
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
            transactionType: '837Encounters',

            page: 1,
            count: 0,
            apiflag: 0,
            Response: '',
            initialPage: null,
            flag999: this.props.location.state ? this.props.location.state.data[0].flag999 : '0',
            noApiFlag: this.props.location.state ? this.props.location.state.data[0].noApiFlag : false,

            pieArray: [],
            labelArray: [],
            orderby: '',
            fileRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            gridType: 1,
            paginationPageSize: 10,
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
          
            rowData: [],
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',

        }

    }

    componentDidMount() {
        if(!this.state.noApiFlag){
            this.getTransactions()
        }
    }

    getTransactions() {

        let query = ''
        let typeId = this.state.status
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let fileId = this.props.location.state ? (this.props.location.state.fileId ? this.props.location.state.fileId : '') : ""
        let recType = 'Inbound'
        let transactionType = this.state.transactionType
        if(this.state.flag999 == 0){
            recType = 'Inbound'
        }

        query = `{
            Data999(RecType: "${recType}", TrasactionType: "${transactionType}", FileId: "${fileId}", FileName: "", StartDt: "${startDate}", EndDt: "${endDate}", State: "${this.state.State}", page: ${this.state.page}, OrderBy: "${this.state.orderby}", GridType:${this.state.gridType}) {
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
              FileDateTime
            }
          }`
          if(this.state.flag999 == 1){
            query = `{
                Data999(RecType: "${recType}", TrasactionType: "${transactionType}", FileId: "${fileId}", FileName: "", StartDt: "${startDate}", EndDt: "${endDate}", State: "${this.state.State}", page: ${this.state.page}, OrderBy: "${this.state.orderby}", GridType:${this.state.gridType}, Type:"") {
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
                  FileDateTime
                }
              }`
          }
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(this.state.flag999 == 1 ? Urls._inbound_common_data : Urls._common_data, {
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
                if (data && data.Data999.length > 0) {

                    count = Math.floor(data.Data999[0].RecCount / 10)
                    if (data.Data999[0].RecCount % 10 > 0) {
                        count = count + 1
                    }
                }

                if (res.data) {
                    this.setState({
                        files_list: res.data.Data999,
                        rowData: this.state.gridType == 1 ? res.data.Data999 : [],
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

    render999Details(refId) {
        let transactionType = this.state.flag999 == 1 ? '837' : '837Encounters'
        let query = `{
            Data999_Response (RefId:${refId}, Transaction: "${transactionType}") {
                FileId
                RefId
                Response
            }
          }`

          if(this.state.flag999 == 0){
            query = `{
                Data999_Response (RefId:${refId}) {
                    FileId
                    RefId
                    Response
                }
              }`
          }
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(this.state.flag999 == 1 ? Urls._inbound_common_data : Urls._common_data, {
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
                        Response: res.data.Data999_Response[0].Response,
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
                    <div className="top-padding"><a  >{flag ? '999 Acknowledgement' : 'Transaction Request'}</a></div>
                    <div style={{ height: "200px", overflow: "auto" }} className="border-view breakword" id={'hello' + flag}>{this.state.Response}</div>
                </div>
            </div>
        )
    }

    getErrorOptions() {
        let row = []
        this.state.errorList.forEach(element => {
            row.push(<option value="" selected={this.state.errorcode == element.ErrorType ? "selected" : ""}>{element.ErrorType}</option>)
        })
        return row
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data999.ResponseFileName", this.state.fileNameRotation, 'fileNameRotation')}>Response File Name</a></td>
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data999.ResponseFileDate", this.state.dateRotation, 'dateRotation')}>Date</a></td>
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data999.FileName", this.state.fileRotation, 'fileRotation')}>837 File Name</a>
                </td>
                <td className="table-head-text list-item-style">
                    <a className="clickable" onClick={() => this.handleToggle((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Data999.status", this.state.statusRotation, 'statusRotation')}>Status</a>
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
                                this.render999Details(item.id)
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
        let columnDefs = []
        this.state.flag999 == 1 ?
            columnDefs = [
                { headerName: "Response File Name", field: "ResponseFileName", width: 220, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Date", field: "ResponseFileDateTime", width: 100, },
                { headerName: "X12 File Name", field: "FileName", width: 220, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "X12 File Date", field: "FileDateTime", flex: 1, },
            ] :
            columnDefs = [
                { headerName: "Response File Name", field: "ResponseFileName", width: 220, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Date", field: "ResponseFileDate", width: 100, },
                { headerName: "File Name Sent To State", field: "FileName", width: 220, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "File Date Sent To State", field: "Date", flex: 1, },
            ]


        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '17px' }}>
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
                        rowData={this.state.rowData}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'Response File Name') {
                                this.render999Details(event.data.id)
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    _refreshScreen = () => {
        this.getTransactions()
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            showDetails: false,
            files_list: [],
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            this.getTransactions()
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
                endDate={this.state.endDate}
                isDiffSubmitter={true}
                transactionType={this.state.transactionType}
                removeGrid={true}
            />
        )
    }

    render() {
        // alert(isclick)
        return (
            <div>
                <h5 className="headerText">{this.state.flag999 == 1 ? '999 Acknowledgement (Outbound)' : '999 Acknowledgement (Inbound)'}</h5>
                {this._renderTopbar()}
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