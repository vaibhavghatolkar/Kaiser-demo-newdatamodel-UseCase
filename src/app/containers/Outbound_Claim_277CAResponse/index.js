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
export class Outbound_Claim_277CAResponse extends React.Component {

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
            transactionType: '837 Encounter',

            page: 1,
            count: 0,
            apiflag: 0,
            Response: 'ISA*00* *00* *01*MHFL261055137 *ZZ*AVAILITY *200406*1810*:*00501*191124599*0*T*:~GS*HN*AVAILITY*MHFL261055137*20200406*1810*147970544*X*005010X214~ST*277*237873476*005010X214~BHT*0085*08*2378734761318146481*20200406*0434*TH~HL*1**20*1~NM1*PR*2*MHFL261055137*****46*51062~TRN*1*147970544~DTP*050*D8*20200405~DTP*009*D8*20200405~HL*2*1*21*1~NM1*41*2*AVAILITY LLC*****46*030240928~TRN*2*13142518~STC*A1:19:40*20200405*WQ*5.98~HL*3*2*19*1~NM1*85*2*JOE SMITH MD*****XX*1234567893~TRN*1*4090906527190080065~REF*G2*987654321~HL*4*3*PT~NM1*QC*1*LASTNAME*FIRSTNAME****MI*S123456789~TRN*2*HIPPAP0006-5~STC*A1:19:PR*20200406*WQ*5.98~REF*1K*20096115959~REF*D9*13142518~DTP*472*D8*20200301~SE*23*237873476~GE*1*147970544~IEA*1*191124599~',
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

    componentDidMount() {
        let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
        if (isOutbound) {
            let rowData = [
                {
                    "FileId": "3713480403950954881",
                    "FileName": "8377497113293649972076",
                    "Date": "2020-04-07T04:21:56.992Z",
                    "Submitter": "AVAILITY",
                    "id": "3934192",
                    "status": null,
                    "Response": "",
                    "TrasactionType": null,
                    "RecCount": "1",
                    "ResponseFileName": "277CA7497113293649972076",
                    "ResponseFileDate": "2020-04-06T18:57:34.485Z",
                    "ResponseFileDateTime": moment().format('YYYY-MM-DD')
                },
                {
                    "FileId": "3713480403950954881",
                    "FileName": "8371964250429698373886",
                    "Date": "2020-04-07T04:21:56.992Z",
                    "Submitter": "AVAILITY",
                    "id": "3934192",
                    "status": null,
                    "Response": "",
                    "TrasactionType": null,
                    "RecCount": "1",
                    "ResponseFileName": "277CA1964250429698373886",
                    "ResponseFileDate": "2020-04-06T18:57:34.485Z",
                    "ResponseFileDateTime": moment().format('YYYY-MM-DD')
                },
                {
                    "FileId": "3713480403950954881",
                    "FileName": "8377878216941641853647",
                    "Date": "2020-04-07T04:21:56.992Z",
                    "Submitter": "AVAILITY",
                    "id": "3934192",
                    "status": null,
                    "Response": "",
                    "TrasactionType": null,
                    "RecCount": "1",
                    "ResponseFileName": "277CA7878216941641853647",
                    "ResponseFileDate": "2020-04-06T18:57:34.485Z",
                    "ResponseFileDateTime": moment().format('YYYY-MM-DD')
                },
                {
                    "FileId": "3713480403950954881",
                    "FileName": "8378113234872195945628",
                    "Date": "2020-04-07T04:21:56.992Z",
                    "Submitter": "AVAILITY",
                    "id": "3934192",
                    "status": null,
                    "Response": "",
                    "TrasactionType": null,
                    "RecCount": "1",
                    "ResponseFileName": "277CA8113234872195945628",
                    "ResponseFileDate": "2020-04-06T18:57:34.485Z",
                    "ResponseFileDateTime": moment().format('YYYY-MM-DD')
                },
            ]

            this.setState({
                files_list: rowData,
                rowData: rowData
            })
        } else {
            this.getTransactions()
        }
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
              ResponseFileDateTime
            }
          }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._inbound_common_data, {
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
        fetch(Urls._inbound_common_data, {
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
                            if (event.colDef.headerName == 'Response File Name') {
                                this.setState({
                                    showDetails: true
                                })
                                // this.render277CADetails(event.data.id)
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
                removeSubmitter={true}
                transactionType={this.state.transactionType}
                removeGrid={true}
            />
        )
    }


    render() {
        let header = ''
        try {
            let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
            if (isOutbound) {
                header = '277 CA Claims Acknowledgement'
            } else {
                header = '277 CA Claims Acknowledgement (Outbound)'
            }
        } catch (error) {

        }
        return (
            <div>
                <h5 className="headerText">{header}</h5>
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