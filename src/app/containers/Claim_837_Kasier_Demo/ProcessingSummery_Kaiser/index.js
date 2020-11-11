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
import { Common_837_Kasier } from '../../../components/Common_837_Kasier';

export class ClaimProcessingSummary_Kaiser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            providers: [],
            incoming_fileId: '',
            status277CA: '',
            gridType: 1,
            recCount: 0,
            HiPaaSCount: 0,
            pageCount: 1,
            Months: 0,
            loaded: 0,
            Accepted_277CA: 0,
            Rejected_277CA: 0,
            selectedTradingPartner: props.location.state && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            State: props.location.state && props.location.state.data[0] && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            file_id: props.location.state && props.location.state.data[0] && props.location.state.data[0].file_id != 'n' ? props.location.state.data[0].file_id : '',
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
            Filter_ClaimId: "",
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
            rowSelection: 'never',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
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
                    State: this.state.State
                },
            ]
        })
    }

    gotoDetails = (fileId) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type, incoming_fileId: fileId ? fileId : this.state.incoming_fileId, Filter_ClaimId: this.state.Filter_ClaimId, },
        ]

        this.props.history.push('/' + Strings.Claim_Details_837_Grid, {
            data: sendData
        })
    }

    handleSort = (e, rotation, key) => {
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
            this.getClaimCounts()
        }, 50);
    }

    _renderStats() {
        let _summary = [
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            // { header: '999', value: this.state.Total999, style: "red summary-title" },
            // { header: 'Load in MCG', value: this.state.loaded, style: "green summary-title" },
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

    clickNavigation = (event) => {
        if (event.colDef.headerName == '999' && event.data.F999) {
            this.goto999(event.data.FileID)
        }
        if (event.colDef.headerName == '277CA' && event.data.F277) {
            this.goto277(event.data.FileID)
        }
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                incoming_fileId: event.data.FileID
            }, () => {
                this.gotoDetails()
            })
        } 
        if (event.colDef.headerName == "835 Process Id" && event.data.ProcessID835) {
            sessionStorage.setItem('isOutbound', true)
            let data = [
                {
                    apiflag: '0',
                    State: 'n',
                    selectedTradingPartner: 'n',
                    startDate: 'n',
                    endDate: 'n',
                    transactionId: 'n',
                    status: 'n',
                    count: 'n',
                    incoming_fileId: event.data.ProcessID835
                }
            ]
            this.props.history.push('/' + Strings.claimPayment_835_details, {
                data: data
            })

            window.location.reload()

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

    _renderTransactions = () => {
        let columnDefs= [
            { headerName: "File Name", field: "FileName", cellStyle: {  color: '#139DC9', cursor: 'pointer' } },
            { headerName: "ClaimID", field: "ClaimID", width: 100 },
            { headerName: "Subscriber Name", field: "SubscriberName", width: 100 },
            { headerName: "Provider Name", field: "ProviderName", width: 100 },
            { headerName: "Provider Address", field: "ProviderAddress", width: 100 },
            { headerName: "Claim Charge Amount", field: "ClaimChargeAmt", width: 100 },
            { headerName: "DRG Code", field: "DRGCode", width: 100 },
           
        ]


        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{
            Claim837RTProcessingSummaryNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                    
                    Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
                    Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", 
                    FileID: "${this.state.file_id}" , Type:"", RecType:"Inbound",
                    FileStatus : "", LoadStatus:"", MCGStatus:"", Status277CA:"", ClaimID:"${this.state.Filter_ClaimId}"
            ) {
                RecCount
                FileID
                FileName
                GSID
                STID
                ProviderName
                ProviderAddress
                SubscriberName
                ClaimID
                ClaimChargeAmt
                DRGCode
            }
          }`
        return (
            <ServersideGrid
                columnDefs={columnDefs}
                query={query}
                url={Urls._transaction837}
                fieldType={'FileID'}
                index={'Claim837RTProcessingSummaryNew'}
                State={this.state.State}
                selectedTradingPartner={this.state.selectedTradingPartner}
                startDate={startDate}
                endDate={endDate}
                filterClaim={this.state.Filter_ClaimId}
                updateFields={this.updateFields}
                onClick={this.clickNavigation}
            />
        )
    }

    update = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }
    _refreshScreen = () => {

    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                setData={this.setData}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                showclaimId={false}
                isMolina={true}
                removeGrid={true}
                State={this.state.State}
                selectedTradingPartner={this.state.selectedTradingPartner}
                SubmitterName={true}
            />
        )
    }

    renderCommonGroup = () => {
        return (
            <Common_837_Kasier
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                type={this.state.type}
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
                <h5 className="headerText">Claim Processing Summary</h5>
                {this._renderTopbar()}
                {this.renderCommonGroup()}
                {this._renderTransactions()}
            </div>
        );
    }
}