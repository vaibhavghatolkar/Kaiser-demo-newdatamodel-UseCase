import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';
import { Common_835 } from '../../../components/Common_835';

let val = ''
let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
export class AuditSummary835 extends React.Component {

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
            columnDefs: [
                { headerName: "Process Id", field: "ProcessID", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "QNXT File Name", field: "QNXTFileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Received Date", field: "Date" },
                { headerName: "State", field: "State" },
                { headerName: "File Status", field: "Status" },
                { headerName: "Remittance File Name", field: "RemittanceFileName" },
                { headerName: "Remittance File Date	", field: "RemittanceSentDate" },
                { headerName: "QNXT Generated", field: "Received" },
                { headerName: "HiPaaS Received", field: "InHipaas" },
                // { headerName: "Error in PreProcess", field: "" },
                { headerName: "Accepted", field: "Accepted" },
                { headerName: "Rejected", field: "Rejected" },
                { headerName: "999", field: "F999", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "In MCG	", field: "SentToQNXT" },
                // { headerName: "277CA", field: "F277", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
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
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
        }
    }

    goto277 = (fileId) => {
        this.props.history.push('/' + Strings.Outbound_277CAResponse, {
            fileId: fileId
        })
    }

    goto999 = (fileId) => {
        this.props.history.push('/' + Strings.Inbound_response_999, {
            fileId: fileId,
            data: [{
                flag999: '0',
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                selectedTradingPartner: this.state.selectedTradingPartner,
                State: this.state.State,
            }]
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
        if (event.colDef.headerName == 'Process Id') {
            this.props.history.push('/' + Strings.ClaimPayment_835_ProcessingSummary, {
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
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
            AuditSummary835New(
                StartDt:"` + startDate + `",EndDt:"` + endDate + `" , State:"${this.state.State}",FileID:"",Status:"",RecType:"${recType}",
                sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                   startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter}                
            ) {
                FileID
                RecCount
                QNXTFileName
                Date
                State
                ProcessID
                F999
                RemittanceFileName
                RemittanceSentDate
                Status
                Received
                InHipaas
                Accepted
                Rejected
                }
              }`

          
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    fieldType={'FileDate'}
                    index={'AuditSummary835New'}
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
                removeSubmitter={true}
                removeGrid={true}
                changeDefault={true}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }

    renderCommonGroup = () => {
        return (
            <Common_835
                startDate={this.state.startDate}
                endDate={this.state.endDate}
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
                <h5 className="headerText">Payment Audit Summary</h5>
                {this._renderTopbar()}
                {this.renderCommonGroup()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this._renderTransactions()}
                </div>
            </div>
        );
    }
}