import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';


var val = ''
const $ = window.$;
export class Load_Exception extends React.Component {

    constructor(props) {
        super(props);
            this.state = {
            intakeClaims: [],
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
            type: props.location.state && props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            gridflag: props.location.state && props.location.state.data[0] && props.location.state.data[0].gridflag ? props.location.state.data[0].gridflag : '',
            fileStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].fileStatus != '' && props.location.state.data[0].fileStatus != undefined ? props.location.state.data[0].fileStatus : '',
            generalStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].generalStatus ? props.location.state.data[0].generalStatus : '',
            mcgStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].mcgStatus ? props.location.state.data[0].mcgStatus : '',
            incoming_fileId: props.location.state && props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
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
            State:props.location.state && props.location.state.data[0] && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status:props.location.state && props.location.state.data[0] && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            transactionId:props.location.state && props.location.state.data[0] && props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus:props.location.state && props.location.state.data[0] && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            page: 1,
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag:props.location.state && props.location.state.data[0] ? props.location.state.data[0].apiflag:'',

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


            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
            showerror: '',
            Aggrid_ClaimLineData: ''

        }
    }
    
  
    getTransactions = (fileId) => {
        // let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        // let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
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
     clickNavigation = (event) => {
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
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            Claim837RTLoadExceptionFileDetailsNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                    
                    Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",
                    Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",
                    Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , 
                    page: ` + this.state.Firstgridpage + ` , OrderBy:"${this.state.orderby}", 
                    RecType: "Inbound", GridType:${this.state.gridType} ,
                    LoadStatus:"", Status:"", MCGStatus:"${this.state.mcgStatus}", FileID: ""
            ) {
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
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls.base_url}
                    index={'Claim837RTLoadExceptionFileDetailsNew'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    fieldType={'FileDateTime'}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
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
            <div className="modal" id="error_modal_load" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog-error">
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
                removeGrid={true}
                State={this.state.State}
                selectedTradingPartner={this.state.selectedTradingPartner}
            />
        )
    }

    render() {

        return (
            <div>
                <h5 className="headerText">Load Exception</h5>
                {this._renderTopbar()}
                    <div>
                            {this._renderList()}
                            {this.state.showClaims ? this._renderClaims() : null}
                        </div>
                   {this.errorDialog()}
            </div>
        );
    }
}