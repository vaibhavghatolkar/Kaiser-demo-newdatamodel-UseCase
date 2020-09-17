import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings'
import { Tiles } from '../../../components/Tiles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';
import { Common_835 } from '../../../components/Common_835';

let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
export class ClaimPayment_835_ProcessingSummary extends React.Component {

    constructor(props) {
        super(props);
          this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            providers: [],
            incoming_fileId: '',
            gridType: 1,
            recCount: 0,
            pageCount: 1,
            Months: 0,
            loaded: 0,
            TotalException: 0,
            selectedTradingPartner: props.location.state && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            State:props.location.state && props.location.state.data[0] && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            file_id: props.location.state && props.location.state.data[0] && props.location.state.data[0].file_id != 'n' ? props.location.state.data[0].file_id : '',
            Filter_ClaimId: '',
            type: "",
            providerName: "",
            TotalClaims: 0,
            Accepted: 0,
            Rejected: 0,
            TotalSentToQNXT: 0,
            Total999: 0,
            Total277CA: 0,
            Paid: 0,
            Pending: 0,
            Denide: 0,
            wip90: 0,
            orderby: '',
            availitySent: '',

            X12Count: 0,
            Accepted_Claims: 0,
            Rejected_Claims: 0,
            FileReject_Claims: 0,
            Processing_Claims: 0,
            ReconciledError_Claims: 0,
            LoadingClaims: 0,
            LoadedErrorClaims: 0,

            fileNameFlag: 180,
            fileDateFlag: 180,
            extraField2Flag: 180,
            claimIDFlag: 180,
            createDateTimeFlag: 180,
            claimStatusFlag: 180,
            subscriber_IDFlag: 180,
            subscriberLastNameFlag: 180,
            subscriberFirstNameFlag: 180,
            paginationPageSize: 10,
            EFTData: 0,
            CheckData: 0,
            QNXT_Generated: 0,
            Hipaas_Received: 0,
            AvailitySent: 0,
            TotalError: 0,
            domLayout: 'autoHeight',

            columnDefs: [

                { headerName: "Remittance File Name", suppressMovable: true, field: "FileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Process Id", field: "", suppressMovable: true, },
                { headerName: "State", field: "", suppressMovable: true, },
                { headerName: "Remittance File Date", field: "FileDate", suppressMovable: true, },
                { headerName: " Remittance File Status", field: "", suppressMovable: true, },
                { headerName: "999", field: "", suppressMovable: true, },
                { headerName: "In HiPaaS", field: "", suppressMovable: true, },
            

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
                lockPosition: true,

                minWidth: 100,
            },
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
        }

    }

    _renderStats() {
        let _summary = [
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            // { header: '999', value: this.state.Total999, style: "red summary-title" },
            { header: 'Load in MCG', value: this.state.loaded, style: "green summary-title" },
            // { header: '277 CA', value: this.state.Total277CA, style: "red summary-title" },
            { header: 'Pending', value: this.state.Pending, style: "orange summary-title" },
            { header: 'Paid', value: this.state.Paid },
            { header: 'Denied', value: this.state.Denide }
        ]

        let row = []

        _summary.forEach(item => {
            row.push(
                <Tiles
                    header_text={item.header}
                    value={item.value}
                    isClickable={false}
                    _style={item.style}
                />
            )
        })
        return (

            <div className="row padding-left" style={{ marginBottom: '10px' }}>
                {row}
            </div>

        )
    }

    gotoDetails = (fileId) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            {
                flag: '',
                State: State,
                selectedTradingPartner: selectedTradingPartner,
                startDate: startDate,
                endDate: endDate,
                status: "",
                type: type,
                Filter_ClaimId: this.state.Filter_ClaimId,
                incoming_fileId: fileId ? fileId : this.state.incoming_fileId
            },
        ]

        this.props.history.push('/' + Strings.claimPayment_835_details, {
            data: sendData
        })
    }
   
    clickNavigation = (event) => {
     
        if (event.colDef.headerName == 'Process Id') {
            this.setState({
                incoming_fileId: event.data.FileID
            }, () => {
                this.gotoDetails()
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
        let columnDefs = [
            { headerName: "Process Id", field: "ProcessID", width: 300, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Received Date", field: "FileDate", width: 150 },
            { headerName: "State", field: "State", width: 150 },
            { headerName: "File Status", field: "Status", width: 150 },
            { headerName: "Remittance File Name", field: "RemittanceFileName", width: 150 },
            { headerName: "Remittance Sent Date", field: "RemittanceSentDate", width: 150 },
            { headerName: "Payment Method", field: "CHECKEFTFlag", width: 70 },
            { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 150 },
            { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 180 },
            { headerName: "Total Billed Amount", field: "TotalBillAmount", width: 130 },
            { headerName: "Claim Id", field: "ClaimID", width: 150 },
            { headerName: "Claim Received Date", field: "ClaimReceivedDate", width: 180 },
            { headerName: "Days Aged", field: "Days", width: 70 },
            { headerName: "Patient Name", field: "PatientName", width: 200 },
            { headerName: "Total Charge Amount", field: "TotalChargeAmt", width: 120 },
            { headerName: "Total Paid Amount", field: "TotalClaimPaymentAmt", width: 120 },
            { headerName: "Total Adjusted Amount", field: "TotalAdjustmentAmount", width: 130 },
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
            PaymentProcessingSummaryNew(
                StartDt:"` + startDate + `",EndDt:"` + endDate + `" , State:"${this.state.State}",FileID:"${this.state.file_id}",Status:"",
                RecType:"${recType}", AvailitySent:"${this.state.availitySent}", EFTCHK:"",ClaimID:"${this.state.Filter_ClaimId}",
                sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                   startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter}
                                
            ) {
                RefID
                RecCount
                FileID
                FileName
                FileDate
                ClaimID
                ClaimReceivedDate
                PatientName
                PatientControlNo
                PayerName
                TotalChargeAmt
                TotalClaimPaymentAmt
                Sender
                Organization
                TransactionType
                CheckEFTNo
                TRN03
                PayerID
                CheckEFTDt
                AccountNo
                CHECKEFTFlag
                Receiver
                TotalAdjustmentAmount
                TotalBillAmount
                Days
                RemittanceFileName
                RemittanceSentDate
                State
                Status
                ProcessID
                }
              }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={isOutbound ? Urls.transaction835 : Urls._transaction835}
                    fieldType={'FileDate'}
                    index={'PaymentProcessingSummaryNew'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                    filterClaim={this.state.Filter_ClaimId}
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
                showclaimId={true}
                State={this.state.State}
               
                
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
                removeFiles={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Payment Processing Summary</h5>
                {this._renderTopbar()}
                {this.renderCommonGroup()}
                {this._renderTransactions()}
            </div>
        );
    }
}