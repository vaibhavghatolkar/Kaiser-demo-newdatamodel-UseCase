import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';
import { Common_837 } from '../../../components/Common_837';

let val = ''
export class AuditSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartne837: [],
            providers: [],
            summaryList: [],
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            acceptedFiles: 0,
            HiPaaSCount: 0,
            loaded: 0,
            gridType: 1,
            selectedTradingPartner: '',
            type: '',
            providerName: '',
            orderby: "",
            State: "",
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0,
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            TotalClaims: '',
            Accepted: '',
            Rejected: '',
            InProgress: '',
            Total999: '',
            Total277CA: '',
            TotalSentToQNXT: '',
            Paid: '',
            denied: '',
            WIP: '',
            Pending: '',
            page: 1,
            count: 1,
            total_999: 0,
            nameRotation: 180,
            statusRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,
            totalCount: '',
            accepted_Files: '',
            acceptedwithErrors: '',
            rejected_Files: '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            NotSent999: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].notSent ? props.location.state.data[0].notSent : '',
            columnDefs: [
                { headerName: "File Name", field: "filename", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State", width: 80 },
                { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "File Status", field: "FileStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "Load Status", field: "LoadStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                // { headerName: "MCG Load Status	", field: "MCGStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
                { headerName: "X12 Count", field: "Submitted", width: 90 },
                { headerName: "HiPaaS Count", field: "InHiPaaS", width: 90 },
                { headerName: "Accepted PreProcess", field: "Accepted", width: 90 },
                { headerName: "Rejected PreProcess", field: "Rejected", width: 90 },
                // { headerName: "Load in MCG", field: "LoadMCG", width: 90 },
                { headerName: "Load Error", field: "LoadError", width: 90 },

                { headerName: "277CA Accepted", field: "Accepted_277CA", width: 90 },
                { headerName: "277CA Rejected", field: "Rejected_277CA", width: 90 },
                // { headerName: "Error in PreProcess", field: "Error", width: 90 },
                // { headerName: "In MCG	", field: "SentToQNXT", width: 80 },
                { headerName: "999", field: "F999", width: 240, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "277CA", field: "F277", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
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

    goto277 = (fileId) => {
        this.props.history.push('/' + Strings.Outbound_277CAResponse, {
            fileId: fileId,
            data: [{
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                selectedTradingPartner: this.state.selectedTradingPartner,
                State: this.state.State,
            }]
        })
    }

    goto999 = (fileId) => {
        this.props.history.push('/' + Strings.Outbound_response_999, {
            fileId: fileId,
            data: [
                {
                    flag999: '1',
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    selectedTradingPartner: this.state.selectedTradingPartner,
                    State: this.state.State,
                },
            ]
        })
    }

    clickNavigation = (event) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, file_id: event.data.FileID },
        ]
        if (event.colDef.headerName == '999' && event.data.F999) {
            this.goto999(event.data.FileID)
        }
        if (event.colDef.headerName == '277CA' && event.data.F277) {
            this.goto277(event.data.FileID)
        }
        if (event.colDef.headerName == 'File Name') {
            this.props.history.push('/' + Strings.ClaimProcessingSummary, {
                data: sendData
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

    _renderTransactions() {
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            ClaimsDailyAuditNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                    
                    submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  
                    RecType:"Inbound", page: ${this.state.page}, Provider:"${this.state.providerName}", 
                    OrderBy:"${this.state.orderby}", State:"${this.state.State}", GridType:${this.state.gridType}, NotSent999:"${this.state.NotSent999}"
            ) {
                  FileID
                  filename
                  Submitted
                  Accepted
                  Rejected
                  SentToQNXT
                  Paid
                  denied
                  WIP
                  Pending
                  F277
                  F999
                  FileStatus
                  RecCount
                  Error
                  InHiPaaS
                  State
                  ProcessID
                  LoadStatus
                  MCGStatus
                  Accepted_277CA
                  Rejected_277CA
                  LoadMCG
                  LoadError
                }
              }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls.base_url}
                    fieldType={'FileDate'}
                    index={'ClaimsDailyAuditNew'}
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

    update = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                setData={this.setData}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeGrid={true}
            />
        )
    }

    renderCommonGroup = () => {
        return (
            <Common_837
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                type={this.state.type}
                selectedTradingPartner={this.state.selectedTradingPartner}
                providerName={this.state.providerName}
                State={this.state.State}
                removeClaims={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Audit Summary</h5>
                {this._renderTopbar()}
                {this.renderCommonGroup()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this._renderTransactions()}
                </div>
            </div>
        );
    }
}