import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { getProviders } from '../../../../helpers/getDetails';
import { AutoComplete } from '../../../components/AutoComplete';
import { StateDropdown } from '../../../components/StateDropdown';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


var val = ''
export class ClaimPayment_835_Exception extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            file: [],
            fileDetails: [],
            type: props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            startDate: props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            gridflag: props.location.state.data[0] && props.location.state.data[0].gridflag ? props.location.state.data[0].gridflag : '',
            fileStatus: props.location.state.data[0] && props.location.state.data[0].fileStatus != '' && props.location.state.data[0].fileStatus != undefined ? props.location.state.data[0].fileStatus : '',
            generalStatus: props.location.state.data[0] && props.location.state.data[0].generalStatus ? props.location.state.data[0].generalStatus : '',
            mcgStatus: props.location.state.data[0] && props.location.state.data[0].mcgStatus ? props.location.state.data[0].mcgStatus : '',
            incoming_fileId: props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            tradingpartner: [],
            showDetails: false,
            errorList: [],
            providerName: '',
            State: props.location.state.data[0] && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status: props.location.state.data[0] && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            transactionId: props.location.state.data[0] && props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus: props.location.state.data[0] && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            orderby: '',
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
            page1: 1,
            gridType: 1,
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "File Name", field: "FileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State" },
                { headerName: "ProcessID", field: "ProcessID" },
                { headerName: "Type", field: "Type" },
                { headerName: "File Date", field: "FileDate" },
                { headerName: "File Status", field: "FileStatus" },
                { headerName: "Submitter", field: "Sender" },

                { headerName: "Load Status", field: "Status" },
                { headerName: "MCG Status", field: "MCGStatus" },
                { headerName: "Total Claims", field: "Claimcount" },
                { headerName: "Rejected Claims", field: "Rejected" },
                { headerName: "Error Description", field: "FileLevelError" },
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


            rowSelection: 'never',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            showerror: '',
            Aggrid_ClaimLineData: ''

        }

        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)

    }

    componentDidMount() {
        this.getCommonData()
        this.getData()
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(RecType :"Inbound", Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`


        fetch(Urls.common_data, {
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
                        tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {

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
            Claim837RTDashboardFileDetails(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.Firstgridpage + ` , OrderBy:"${this.state.orderby}", RecType: "Inbound", GridType:${this.state.gridType} ,LoadStatus:"${this.state.gridflag}", Status:"${this.state.generalStatus}", MCGStatus:"${this.state.mcgStatus}", FileID: "${this.state.incoming_fileId}", Status277CA:"") {
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
            }
        }`


        fetch(Urls.base_url, {
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
                if (res && res.data && res.data.Claim837RTDashboardFileDetails) {

                    if (res.data.Claim837RTDashboardFileDetails.length > 0) {

                        count = Math.floor(res.data.Claim837RTDashboardFileDetails[0].RecCount / 10)
                        if (res.data.Claim837RTDashboardFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;
                    }

                    this.setState({
                        rowData: this.state.gridType == 1 ? res.data.Claim837RTDashboardFileDetails : [],
                        intakeClaims: res.data.Claim837RTDashboardFileDetails,
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
        let query = `{            
            LoadException (FileID : "` + fileId + `") {
                FileID
                FileName
                FileDate
                State
                ProcessID
                Exception
            }
        }`

        fetch(Urls.base_url, {
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
        });

        setTimeout(() => {
            this.getData()
        }, 50);
    }



    onHandleChange = (event) => {
        clearTimeout(val)
        let providerName = event.target.value
        val = setTimeout(() => {
            getProviders("Inbound", providerName)
                .then(list => {
                    this.setState({
                        providers: list
                    })
                }).catch(error => {

                })
        }, 300);
    }

    onSelected = (value) => {
        this.setState({
            providerName: value
        }, () => {
            this.getData()
        })
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text,
            showDetails: false,
            showerror: false,
            showClaims: false
        }, () => {
            this.getData()
        })
    }

    renderFilters() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
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
                        <div className="list-dashboard">Grid Type</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.setState({
                                    page: 1,
                                    rowData: [],
                                    claimsAudit: [],
                                    showerror: false,
                                    showClaims: false,
                                    showDetails: false,
                                    gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
                                }, () => {
                                    this.getData()
                                })
                            }}
                        >
                            <option value="select">Default</option>
                            <option selected value="select">Classic</option>
                        </select>
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
                    <a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By ProcessID", this.state.processIdRotation, 'processIdRotation')}>ProcessID</a>
                </div>
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
                    <td>{d.Exception}</td>

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
        let data = this.state.claimsObj;

        Object.keys(data).forEach((keys) => {
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
                    <div className="col-2 col-small-style small-font">{moment(data[keys].value.FileDate).format('MM/DD/YYYY')}<br />{moment(data[keys].value.FileDate).format('hh:mm a')}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileStatus}</div>
                    <div className="col-2 col-small-style small-font">{data[keys].value.FileLevelError}</div>
                </div>
            )

            // {
            //     col = []
            //     data[keys].array.forEach((d) => {

            //         col.push(
            //             <tr>
            //                 {/* <td className="list-item-style"><a  style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>{d.FileName}</a></td>
            //                 <td className="list-item-style">{d.FileDate}</td> */}
            //                 <td className="list-item-style">{d.ProcessID}</td>
            //                 <td className="style-left"> {d.State}</td>
            //                 <td className="list-item-style" style={{ wordBreak: 'break-all' }}>{d.Exception}</td>
            //             </tr>
            //         )
            //     })
            // }

            // row.push(
            //     <div id={keys} className="collapse">
            //         <table id="" className="table table-bordered claim-details" style={{ tableLayout: 'fixed' }}>
            //             {this.renderClaimsHeader(data[keys].value.FileID)}
            //             {col}
            //         </table>

            //         <ReactPaginate
            //             previousLabel={'previous'}
            //             nextLabel={'next'}
            //             breakLabel={'...'}
            //             breakClassName={'page-link'}
            //             initialPage={this.state.initialPage}
            //             pageCount={Math.floor((data[keys].value.Claimcount / 10) + (data[keys].value.Claimcount % 10 > 0 ? 1 : 0))}
            //             marginPagesDisplayed={2}
            //             pageRangeDisplayed={5}
            //             onPageChange={(page) => { this.handlePageClick(page, data[keys].value.FileID) }}
            //             containerClassName={'pagination'}
            //             pageClassName={'page-item'}
            //             previousClassName={'page-link'}
            //             nextClassName={'page-link'}
            //             pageLinkClassName={'page-link'}
            //             subContainerClassName={'pages pagination'}
            //             activeClassName={'active'}
            //         />

            //     </div>
            // )
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

        let defaultColDef = {
            editable: false,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            sortable: true,
            resizable: true,
            filter: true,
        }

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 200 },
            { headerName: "File Date", field: "FileDate", width: 150 },
            { headerName: "Process ID", field: "ProcessID", width: 120 },

            { headerName: "State", field: "State", width: 100 },
            { headerName: "Exception", field: "Exception", flex: 1 }
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={defaultColDef}
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


                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }



    render() {

        return (
            <div>
                <h5 className="headerText">Load Exception</h5>
                {this.renderFilters()}
                {
                    this.state.gridType
                        ?
                        <div>
                            {this._renderList()}
                            {this.state.showClaims ? this._renderClaims() : null}


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
            </div>
        );
    }
}