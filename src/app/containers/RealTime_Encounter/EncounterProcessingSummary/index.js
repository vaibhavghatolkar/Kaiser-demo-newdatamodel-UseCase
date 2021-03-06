import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import Strings from '../../../../helpers/Strings'
import { CommonTable } from '../../../components/CommonTable';
import { AutoComplete } from '../../../components/AutoComplete';
import { getProviders } from '../../../../helpers/getDetails';
import { StateDropdown } from '../../../components/StateDropdown';
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Link } from 'react-router-dom'
import { TableTiles } from '../../../components/TableTiles';
import { Filters } from '../../../components/Filters';

let val = ''
export class EncounterProcessingSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            providers: [],
            incoming_fileId: '',
            resubmitEncounters: 0,
            status277CA: '',
            gridType: 1,
            recCount: 0,
            HiPaaSCount: 0,
            pageCount: 1,
            Months: 0,
            loaded: 0,
            Accepted_277CA: 0,
            Rejected_277CA: 0,
            selectedTradingPartner: "",
            State: "",
            type: "",
            providerName: "",
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
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
            file_id: props && props.location.state && props.location.state.file_id ? props.location.state.file_id : '',
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Process Id", field: "ProcessID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "State", field: "State", width: 80 },
                { headerName: "File Date", field: "FileDateTime", width: 100 },
                { headerName: "File Status", field: "FileStatus", width: 100 },
                { headerName: "Molina Encounter Id", field: "MolinaClaimID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Encounter Date", field: "ClaimDateTime", width: 100, },
                { headerName: "Encounter Status", field: "ClaimStatus", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "Subscriber Id", field: "Subscriber_ID", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
                { headerName: "277CA Status", field: "Status277CA", width: 100 },
                { headerName: "999", field: "F999", width: 240, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "277CA", field: "F277", width: 100, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "HiPaaS Status", field: "Transaction_Status", width:100, cellStyle: {wordBreak: 'break-all',   'white-space': 'normal' } },

                { headerName: "Adjudication Status", field: "adjudication_status", width: 100 },
                // { headerName: "835", field: "F277" },
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

        this.getData = this.getData.bind(this)
        this.handlePageClick = this.handlePageClick.bind(this)
    }

    componentDidMount() {
        this._refreshScreen()
    }

    _get999Count = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type:"") {
              Total999
            }
            Total277CAResponse(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type:"") {
                Total277CA
            }
            
         }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._inbound_Encounter, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    Total999: res.data.Total999Response && res.data.Total999Response.length > 0 ? res.data.Total999Response[0].Total999 : '',
                    Total277CA: res.data.Total277CAResponse && res.data.Total277CAResponse.length > 0 ? res.data.Total277CAResponse[0].Total277CA : '',
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{
            Claim837RTDashboardCountClaimStatus(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Inbound") {
                X12Count
                HiPaaSCount
                MCGLoadCount
            }
            Claim837RTDashboardTable(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Inbound") {
                Accepted_Claims
                Rejected_Claims
                FileReject_Claims
                Processing_Claims
                ReconciledError_Claims
                LoadingClaims
                LoadedErrorClaims
                Accepted_277CA
                Rejected_277CA
                Resubmit
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._inbound_Encounter, {
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
                    let data = res.data.Claim837RTDashboardCountClaimStatus[0]
                    let _data = res.data.Claim837RTDashboardTable[0]

                    this.setState({
                        Accepted: _data ? _data.Accepted_Claims : 0,
                        Rejected: _data ? _data.Rejected_Claims : 0,
                        loaded: _data ? _data.LoadingClaims : 0,


                        X12Count: data ? data.X12Count : 0,
                        HiPaaSCount: data ? data.HiPaaSCount : 0,
                        Accepted_Claims: _data ? _data.Accepted_Claims : 0,
                        Rejected_Claims: _data ? _data.Rejected_Claims : 0,
                        FileReject_Claims: _data ? _data.FileReject_Claims : 0,
                        Processing_Claims: _data ? _data.Processing_Claims : 0,
                        ReconciledError_Claims: _data ? _data.ReconciledError_Claims : 0,
                        LoadingClaims: _data ? _data.LoadingClaims : 0,
                        LoadedErrorClaims: _data ? _data.LoadedErrorClaims : 0,
                        Accepted_277CA: _data ? _data.Accepted_277CA : 0,
                        Rejected_277CA: _data ? _data.Rejected_277CA : 0,
                        resubmitEncounters: _data ? _data.Resubmit : 0,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getCountData = async () => {
        setTimeout(() => {
            this._get999Count()
        }, 1000);

        let query = `{FileInCount(submitter:"${this.state.selectedTradingPartner}"  fromDt:"${this.state.startDate}" ToDt:"${this.state.endDate}" RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}") {
            totalFile
            TotalClaims
            Accepted
            Rejected
            InProgress
            Total999
            Total277CA
            TotalSentToQNXT
            Paid
            denied
            WIP
            Pending
          } }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(Urls._inbound_claims_837, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.FileInCount
                if (data && data.length > 0) {

                    this.setState({
                        Paid: data[0].Paid,
                        Pending: data[0].Pending,
                        Denide: data[0].denied,
                        wip90: data[0].WIP,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{            
            Claim837RTProcessingSummary (page:${this.state.pageCount},Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"", FileID: "${this.state.file_id}" , OrderBy:"` + this.state.orderby + `",Type:"", RecType:"Inbound", GridType:${this.state.gridType}, FileStatus : "", LoadStatus:"", MCGStatus:"", Status277CA:"") {
                RecCount
                ClaimID
                ClaimDate
                ClaimTMTrackingID
                Subscriber_ID
                Claim_Amount
                ClaimStatus
                ProviderLastName
                ProviderFirstName
                SubscriberLastName
                SubscriberFirstName
                adjudication_status
                ClaimLevelErrors
                ClaimUniqueID
                FileID
                FileName
                FileCrDate
                FileStatus
                F999
				F277
                TotalLinewise835
                TotalLine
                Transaction_Status
                ClaimRefId
                MolinaClaimID
                ProcessID
                State
                FileDateTime
                ClaimDateTime
                Status277CA
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._inbound_Encounter, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.Claim837RTProcessingSummary
                let count = 0
                if (data && data.length > 0) {
                    let recCount = data[0].RecCount
                    try {
                        count = recCount / 10
                        count = count.floor(count)
                        if (recCount % 10 > 0) {
                            count = count + 1
                        }
                    } catch (error) {

                    }

                }

                this.setState({
                    Claim837RTProcessingSummary: data,
                    rowData: this.state.gridType == 1 ? data : [],
                    recCount: count,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    handlePageClick(data, fileId) {
        let page = data.selected + 1
        this.setState({
            pageCount: page
        })

        setTimeout(() => {
            this.getCountData()
            this.getClaimCounts()
            this.getData()
        }, 50);
    }

    goto277 = (fileId) => {
        // sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_277CAResponse, {
            fileId: fileId
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
    }

    goto999 = (fileId) => {
        // sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_response_999, {
            fileId: fileId,
            data: [
                { flag999: '1' },
            ]
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
    }

    gotoDetails = (fileId) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type, incoming_fileId: fileId ? fileId : this.state.incoming_fileId },
        ]

        this.props.history.push('/' + Strings.Inbound_EncounterDetails, {
            data: sendData
        })
    }

    renderTransactionsNew() {
        const data = this.state.Claim837RTProcessingSummary ? this.state.Claim837RTProcessingSummary : []
        let headerArray = []
        let rowArray = []

        headerArray.push(
            { value: 'File Name', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileName" : "Order By n.FileName", this.state.fileNameFlag, 'fileNameFlag'), key: this.state.fileNameFlag },
            { value: 'File Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.FileDate" : "Order By n.FileCrDate", this.state.fileDateFlag, 'fileDateFlag'), key: this.state.fileDateFlag },
            { value: 'File Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By fileintake.ExtraField2" : "Order By n.FileStatus", this.state.extraField2Flag, 'extraField2Flag'), key: this.state.extraField2Flag },
            { value: 'Molina Claim Id', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.ClaimID" : "Order By n.MolinaClaimID", this.state.claimIDFlag, 'claimIDFlag'), key: this.state.claimIDFlag },
            { value: 'Claim Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.CreateDateTime" : "Order By n.ClaimDate", this.state.createDateTimeFlag, 'createDateTimeFlag'), key: this.state.createDateTimeFlag },
            { value: 'Claim Status', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? " Order By IntakeClaimData.ClaimStatus" : "Order By n.ClaimStatus", this.state.claimStatusFlag, 'claimStatusFlag'), key: this.state.claimStatusFlag },
            { value: 'Subscriber Id', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "Order By IntakeClaimData.Subscriber_ID" : "Order By n.Subscriber_ID", this.state.subscriber_IDFlag, 'subscriber_IDFlag'), key: this.state.subscriber_IDFlag },
            { value: '277CA Status' },
            { value: '999' },
            // { value: 'HiPaaS Status' },           
            { value: '277CA' },
            { value: 'Adjudication Status' },
            // { value: '835' },
        )

        rowArray.push(
            { value: 'FileName', method: this.gotoDetails, isClick: 1, key_argument: 'FileID' },
            { value: 'FileCrDate', isDate: 1 },
            { value: 'FileStatus' },
            { value: 'MolinaClaimID' },
            { value: 'ClaimDate', isDate: 1 },
            { value: 'ClaimStatus' },
            { value: 'Subscriber_ID' },
            { value: 'Status277CA' },
            { value: 'F999', isClick: 1, method: this.goto999, key_argument: 'FileID' },
            // { value: 'Transaction_Status' },           
            { value: 'F277', isClick: 1, method: this.goto277, key_argument: 'FileID' },
            { value: 'adjudication_status' },
            // { value: 'TotalLine', secondVal: 'TotalLinewise835', isBar: 1 },
            // { value: '' },
        )

        return (
            <CommonTable
                overflow={true}
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
                count={this.state.recCount}
                handlePageClick={this.handlePageClick}
            />
        )
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
            this.getCountData()
            this.getClaimCounts()
            this.getData()
        }, 50);
    }

    _renderStats() {
        let _summary = [
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            // { header: '999', value: this.state.Total999, style: "red summary-title" },
            { header: 'Load in ODS', value: this.state.loaded, style: "green summary-title" },
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

    _renderClaimTables = (array) => {
        let row = []
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''
        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let loadStatus = ''
            let generalStatus = ''
            let mcgStatus = ''
            let status277CA = ''
            let subtitle = ''
            let color = "var(--red)"
            let url = ''
            
            if (item.name == 'Accepted') {
                generalStatus = 'Accepted'
                subtitle = 'Accepted Claims'
                color = "var(--green)"
            } else if (item.name == 'Rejected') {
                generalStatus = 'Rejected'
                subtitle = "Rejected Claims"
            }  else if (item.name == 'File Rejected') {
                generalStatus = 'File Rejected'
                subtitle = item.name
            } else if (item.name == 'Reconciled Error') {
                loadStatus = 'Reconcile Exception'
                subtitle = item.name
            } else if (item.name == 'Load in ODS') {
                mcgStatus = 'Loaded'
                subtitle = item.name
                color = "var(--main-bg-color)"
            } else if (item.name == 'Resubmit') {
                generalStatus = 'Resubmit'
                subtitle = 'Ready to Resubmit Encounters'
                color = "var(--green)"
            }  else if(item.name == 'Load Error'){
                subtitle = item.name
                mcgStatus = 'Exception'
                url = Strings.encounterLoadException
            }

            if (item.name == 'Accepted' && item.is277CA) {
                subtitle = '277CA Accepted Claims'
                generalStatus = ''
                status277CA = 'Accepted'
            }

            if (item.name == 'Rejected' && item.is277CA) {
                subtitle = '277CA Rejected Claims'
                generalStatus = ''
                status277CA = 'Rejected'
            }

            let sendData = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: claimStatus,
                    type: type,
                    gridflag: loadStatus,
                    generalStatus: generalStatus,
                    mcgStatus: mcgStatus,
                    subtitle: subtitle,
                    status277CA: status277CA
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={url ? url : Strings.Inbound_EncounterDetails}
                    data={sendData}
                    color={color}
                />
            )
        })

        return (
            <div className="col chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }


    renderClaimDetails = () => {
        let stage_1 = [
            { 'header': 'HiPaaS Load Status' },
            // { 'name': 'X12 Count', 'value': this.state.X12Count },
            // { 'name': 'HiPaaS Count', 'value': this.state.HiPaaSCount },
            { 'name': 'X12 Count', 'value': 15339 },
            { 'name': 'HiPaaS Count', 'value': 15338 },
            { 'name': 'Reconciled Error', 'value': this.state.ReconciledError_Claims, 'isClick': 1 },
        ]
        let stage_2 = [
            { 'header': 'L1 - L7 Status' },
            // { 'name': 'Accepted', 'value': this.state.Accepted_Claims, 'isClick': 1 },
            // { 'name': 'Rejected', 'value': this.state.Rejected_Claims, 'isClick': 1 },
            { 'name': 'Accepted', 'value': 15300, 'isClick': 1 },
            { 'name': 'Rejected', 'value': this.state.Rejected_Claims, 'isClick': 1 },
            { 'name': 'File Rejected', 'value': this.state.FileReject_Claims, 'isClick': 1 },
            { 'name': 'Resubmit', 'value': this.state.resubmitEncounters, 'isClick': 1 },
        ]
        let stage_3 = [
            { 'header': 'ODS Load Status' },
            // { 'name': 'Load in ODS', 'value': this.state.LoadingClaims, 'isClick': 1 },
            // { 'name': 'Load Error', 'value': this.state.LoadedErrorClaims, 'isClick': 1 },
            { 'name': 'Load in ODS', 'value': 15000, 'isClick': 1 },
            { 'name': 'Load Error', 'value': 300, 'isClick': 1 },
        ]

        let stage_4 = [
            { 'header': 'L3 - L7 Status' },
            { 'name': 'Accepted', 'value': this.state.Accepted_277CA, 'isClick': 1, 'is277CA': 1 },
            { 'name': 'Rejected', 'value': this.state.Rejected_277CA, 'isClick': 1, 'is277CA': 1 },
        ]

        return (
            <div className="row" style={{ marginBottom: '12px', marginLeft: '-10px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {/* {this._renderClaimTables(stage_4)} */}
                {this._renderClaimTables(stage_3)}
            </div>
        )
    }

    _renderTransactions() {
        return (
            <div className="ag-theme-balham" style={{ height: '400px', padding: '0px', marginLeft: '1px' }}>
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
                    onCellClicked={(event) => {
                        if (event.colDef.headerName == '999') {
                            this.goto999(event.data.FileID)
                        }
                        if (event.colDef.headerName == '277CA') {
                            this.goto277(event.data.FileID)
                        }
                        if (event.colDef.headerName == 'File Name') {
                            this.setState({
                                incoming_fileId: event.data.FileID
                            }, () => {
                                this.gotoDetails()
                            })
                        }
                    }}
                >
                </AgGridReact>
            </div>
        )
    }

    _refreshScreen = () => {
        // this.getCountData()
        this.getClaimCounts()
        this.getData()
    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            Claim837RTProcessingSummary: [],
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            this.getData()
        })
    }

    update = (key, value) => {
        this.setState({
            [key]: value
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
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Encounter Processing Summary</h5>
                {this._renderTopbar()}
                {/* {this._renderStats()} */}
                {this.renderClaimDetails()}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 && !this.state.gridType ? this.renderTransactionsNew() : null}
            </div>
        );
    }
}