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
import { getProviders } from '../../../../helpers/getDetails';
import { AutoComplete } from '../../../components/AutoComplete';
import { StateDropdown } from '../../../components/StateDropdown';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';


var val = ''
const $ = window.$;
export class Load_Exception extends React.Component {

    constructor(props) {
        super(props);
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
            lineCount: 0,
            showClaims: false,
            clickedError: '',
            lineData: [],
            file: [],
            fileDetails: [],
            claimStageDetails: [],
            memberInfo: {},
            subscriberNo: '',
            molina_claimId: '',
            type: props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            gridflag: props.location.state.data[0] && props.location.state.data[0].gridflag ? props.location.state.data[0].gridflag : '',
            fileStatus: props.location.state.data[0] && props.location.state.data[0].fileStatus != '' && props.location.state.data[0].fileStatus != undefined ? props.location.state.data[0].fileStatus : '',
            generalStatus: props.location.state.data[0] && props.location.state.data[0].generalStatus ? props.location.state.data[0].generalStatus : '',
            mcgStatus: props.location.state.data[0] && props.location.state.data[0].mcgStatus ? props.location.state.data[0].mcgStatus : '',
            incoming_fileId: props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
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
            page: 1,
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag: props.location.state.data[0].apiflag,

            pieArray: [],
            labelArray: [],
            orderby: '',
            inner_orderby: '',
            fileid: '',
            claimid: '',
            nameRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            claimIdRotation: 180,
            claimStatusRotation: 180,
            subsciberRotation: 180,
            claimAmountRotation: 180,
            errorRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,

            seqID: '',
            fileDataDetails: '',
            page1: 1,

            gridType: 1,
            paginationPageSize: 5,
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "File Name", field: "FileName", width: 300, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State", width: 70 },
                { headerName: "Process Id", field: "ProcessID", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Type", field: "Type", width: 50 },
                { headerName: "File Date", field: "FileDateTime", width: 130 },
                { headerName: "File Status", field: "FileStatus", width: 80 },
                { headerName: "Submitter", field: "Sender", width: 80 },

                { headerName: "Load Status", field: "Status", width: 80 },
                { headerName: "MCG Status", field: "MCGStatus", width: 80 },
                { headerName: "Total Claims", field: "Claimcount", width: 80 },
                // { headerName: "Rejected Claims", field: "Rejected", flex: 1 },
                // { headerName: "Error Description", field: "FileLevelError",width:700 ,cellStyle: { wordBreak: 'break-all',   'white-space': 'normal'}  },
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


            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            showerror: '',
            rowData: [],
            Aggrid_ClaimLineData: ''

        }
    }

    componentDidMount() {
        this.getData()
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
            Claim837RTLoadExceptionFileDetails(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.Firstgridpage + ` , OrderBy:"${this.state.orderby}", RecType: "Inbound", GridType:${this.state.gridType} ,LoadStatus:"", Status:"", MCGStatus:"${this.state.mcgStatus}", FileID: "") {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                Claimcount
                FileStatus
                Rejected
                Type
                Status
                State
                ProcessID
                FileLevelError
                MCGStatus
                FileDateTime 
            }
        }`
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
                if (res && res.data && res.data.Claim837RTLoadExceptionFileDetails) {

                    if (res.data.Claim837RTLoadExceptionFileDetails.length > 0) {

                        count = Math.floor(res.data.Claim837RTLoadExceptionFileDetails[0].RecCount / 10)
                        if (res.data.Claim837RTLoadExceptionFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;
                    }

                    this.setState({
                        rowData: this.state.gridType == 1 ? res.data.Claim837RTLoadExceptionFileDetails : [],
                        intakeClaims: res.data.Claim837RTLoadExceptionFileDetails,
                        recount: count,


                    }, () => {
                        this.sortData()
                    })
                }
            })
            .catch(err => {

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
            claimsObj: files,
            page: 1
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
            LoadException (FileID : "` + fileId + `") {
                FileID
                FileName
                FileDate
                State
                ProcessID
                Exception
                ClaimID
                ProcessName
            }
        }`

        // console.log(query)

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
                var data = res.data.LoadException


                this.setState({
                    claims_rowData: data,
                    Ag_grid_FileName: res.data.LoadException[0].FileName,
                    Ag_grid_fileDate: res.data.LoadException[0].FileDate,
                    showDetails: true
                })


            })
            .catch(err => {

            });
    }


    handlePageClick = (data, fileId) => {

        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getTransactions(fileId)
        })
    }

    handlePageClickLine = (data) => {
        let page = data.selected + 1
        this._getHLDetails(this.state.fileid)
        this.getDetails(this.state.claimid, this.state.fileid, this.state.seqID, this.state.fileDataDetails, page)

    }

    renderRows(dictionary) {
        let row = []
        let col = []
        let count = 0

        dictionary.forEach(item => {
            col.push(
                <div className="col">
                    <div className="header">{item.key}</div>
                    {item.isDate ? this.getDatePicker() : <div>{(moment(item.value).format('MM/DD/YYYY, hh:mm a') != "Invalid date" && item.key == 'Claim Date') ? moment(item.value).format('MM/DD/YYYY, hh:mm a') : item.value}</div>}
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

    getErrorOptions() {
        let row = []
        this.state.errorList.forEach(element => {
            row.push(<option value="" selected={this.state.errorcode == element.ErrorType ? "selected" : ""}>{element.ErrorType}</option>)
        })
        return row
    }

    renderHeader(header) {
        return (
            <tr className="table-head">
                <td className="table-head-text">{header}</td>
            </tr>
        )
    }

    renderClaimsHeader(fileId) {
        return (
            <tr className="table-head">
                {/* <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.MolinaClaimID", this.state.claimIdRotation, 'claimIdRotation', fileId) }}>Process ID</a></td>
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.ClaimStatus", this.state.claimStatusRotation, 'claimStatusRotation', fileId) }}>State</a></td> */}
                <td className="table-head-text list-item-style"><a className="clickable" onClick={() => { this.handleInnerSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By n.Subscriber_ID", this.state.subsciberRotation, 'subsciberRotation', fileId) }}>Exception</a></td>

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

    handleInnerSort = (e, rotation, key, fileId) => {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            inner_orderby: e,
            [key]: rotation == 0 ? 180 : 0
        })
        setTimeout(() => {
            this.getTransactions(fileId)
        }, 50);
    }

    renderTableHeader() {
        return (
            <div className="row">
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By FileName", this.state.nameRotation, 'nameRotation')} src={require('../../../components/Images/up_arrow.png')}>File Name</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By State", this.state.stateRotation, 'stateRotation')}>State</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By ProcessID", this.state.processIdRotation, 'processIdRotation')}>Process Id</a>
                </div>
                {/* <div className="col-1 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "Order By Type", this.state.typeRotation, 'typeRotation')} src={require('../../../components/Images/up_arrow.png')}>Type</a>
                </div> */}
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order by fileintake.FileDate" : "Order by FileDate", this.state.dateRotation, 'dateRotation')} src={require('../../../components/Images/up_arrow.png')}>File Date</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.Extrafield2" : "Order By FileStatus", this.state.statusRotation, 'statusRotation')} src={require('../../../components/Images/up_arrow.png')}>File Status</a>
                </div>
                <div className="col-2 col-header justify-align">
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ISA06" : "Order By FileLevelError", this.state.submitterRotation, 'submitterRotation')} src={require('../../../components/Images/up_arrow.png')}>Error Description</a>
                </div>
            </div>
        )
    }

    render_load_excaption() {
        let row = []
        const data = this.state.claims_rowData ? this.state.claims_rowData : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.ClaimID}</td>
                    <td style={{ wordBreak: 'break-all' }}>{d.ProcessName}</td>
                    <td style={{ wordBreak: 'break-all' }}>{d.Exception}</td>
                </tr>
            )
        })
        return (
            <div className="row">
                <div className="col-12">
                    <br></br>
                    <div >
                        <table className="table table-bordered background-color">
                            <thead>
                                <tr className="table-head">

                                    <td className="table-head-text list-item-style">Claim Id</td>
                                    <td className="table-head-text list-item-style">Process Name</td>
                                    <td className="table-head-text list-item-style">Exception</td>
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


    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        let count = 0

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
                    <div className="col-2 col-small-style border-left small-font left-align"><a href={'#' + keys}
                        onClick={() => {
                            this.setState({
                                showDetails: false
                            })
                            this.getTransactions(data[keys].value.FileID)
                        }} style={{ color: "var(--light-blue)" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.State}</div>
                    <div className="col-2 col-small-style small-font" style={{ wordBreak: 'break-all' }}>{data[keys].value.ProcessID}</div>
                    {/* <div className="col-1 col-small-style small-font">{data[keys].value.Type}</div> */}
                    <div className="col-2 col-small-style small-font">{moment(data[keys].value.FileDateTime).format('MM/DD/YYYY')}<br />{moment(data[keys].value.FileDate).format('hh:mm a')}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileStatus}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileLevelError}</div>
                </div>
            )


        });

        return (
            <div>
                {this.renderTableHeader()}
                <table className="table claim-details">
                    {row}
                </table>
                <div style={{ marginLeft: '-14px' }}>
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={0}
                        pageCount={this.state.recount}
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

    _renderList() {
        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
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
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'File Name') {
                                this.setState({
                                    showClaims: true,
                                    showerror: false,
                                    claims_rowData: [],
                                    Ag_grid_FileName: '',
                                    Ag_grid_fileDate: '',
                                })
                                this.getTransactions(event.data.FileID)
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _renderClaims() {

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Id", field: "ClaimID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Process Name", field: "ProcessName", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "State", field: "State", width: 60 },
            { headerName: "Exception", field: "Exception", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } }
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
                        rowData={this.state.claims_rowData}

                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == "Exception" && event.data.Exception) {
                                this.setState({
                                    clickedError: event.data.Exception
                                }, () => {
                                    $('#error_modal_load').modal('show')
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    errorDialog = () => {
        return (
            <div class="modal" id="error_modal_load" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Exception</div>
                        <div className="scroll-div">
                            {this.state.clickedError}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#error_modal_load').modal('hide')
                            }}>
                            Close
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        )
    }

    _refreshScreen = () => {
        this.getData()
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            claimsAudit: [],
            showerror: false,
            showClaims: false,
            showDetails: false,
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            if (this.state.gridType == 1) {
                this.getData()
            } else {
                this.getData()
            }
        })
    }

    update = (key, value) => {
        this.setState({
            [key]: value,
            showDetails: false,
            showerror: false,
            showClaims: false
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
            />
        )
    }

    render() {

        return (
            <div>
                <h5 className="headerText">Load Exception</h5>
                {this._renderTopbar()}
                {
                    this.state.gridType
                        ?
                        <div>
                            {this._renderList()}
                            {this.state.showClaims ? this._renderClaims() : null}

                            {/* {this.state.showerror ? this._ClaimStage() : null} */}

                        </div>
                        :
                        <div className="row padding-left">
                            <div className="col-6 claim-list file-table">
                                {this.state.claimsObj ? this.renderList() : null}
                            </div>
                            <div className="col-6">

                                {this.state.showDetails ? this.render_load_excaption() : null}
                            </div>


                        </div>

                }
                {this.errorDialog()}
            </div>
        );
    }
}