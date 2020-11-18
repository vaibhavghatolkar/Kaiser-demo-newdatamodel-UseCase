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
import { ServersideGrid } from '../../../components/ServersideGrid';

let val = ''
export class Outbound_Claim_updated_ProcessingSummary_Kaiser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradingpartner: [],
            Claim837RTProcessingSummary: [],
            stage_4: [],
            stage_5: [],
            stage_6: [],
            stage_7: [],
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
                { headerName: "File Name", field: "FileName_Outbound", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
                { headerName: "State", field: "State",  width: 100,
                cellRenderer: (data) => {
                    return   "FL"                
                }
            },
                { headerName: "File Date", field: "FileDate_Outbound", width: 100 },
                { headerName: "File Status", field: "FileStatus_Outbound", width: 105 },
                { headerName: "Claims ID", field: "ClaimID", width: 100, },
                { headerName: "Molina Claims ID", field: "MolinaClaimID", width: 130, },
                { headerName: "Claims Date", field: "EncounterDate", width: 130, },
                { headerName: "Claims 999 Status", field: "Encounter99_Status", width: 140, },
                { headerName: "Claims 277CA Status", field: "Encounter277CA_Status", width: 140 },
                // { headerName: "999", field: "F999", width: 170, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "277CA", field: "F277CA", width: 170, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "835 Process Id", field: "label", width: 170, cellStyle: { color: '#139DC9', cursor: 'pointer' } , },
                { headerName: "835", field: "PaymentDetails", width: 110, 
                cellStyle: { color: '#139DC9', cursor: 'pointer' } 
                // cellRenderer: (data) => {    
                //     if(data.data.MolinaClaimID == "000000000074457A"){ return  "10 | 2"}
                //     if(data.data.MolinaClaimID == "000000000059435"){ return  "2 | 1"}
                //     if(data.data.MolinaClaimID == "000000000059440"){ return '4 | 1'}
                //     if(data.data.MolinaClaimID == "000000000059446"){ return '4 | 1'}
                //     if(data.data.MolinaClaimID == "000000000059450"){ return '2 | 1'}
                //     if(data.data.MolinaClaimID == "000000000059460"){ return '1 | 1'}
                //     if(data.data.MolinaClaimID == "000000000059462"){ return '2 | 0'}
                //     if(data.data.MolinaClaimID == "000000000059465"){ return '2 | 0'}
                //     if(data.data.MolinaClaimID == "000000000059473"){ return '1 | 0'}
                //     if(data.data.MolinaClaimID == "000000000059478"){ return '3 | 0'}
                //   }, 
                
                },
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
            rowData: [],
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
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
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Kaiser", Provider:"${this.state.providerName}", State:"${this.state.State}", Type:"") {
              Total999
            }
            Total277CAResponse(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Kaiser", Provider:"${this.state.providerName}", State:"${this.state.State}", Type:"") {
                Total277CA
            }
            
         }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
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
            OutboundDashboardFileTable {
                TotalEncounterSent
                Accepted999
                Rejected999
                Accepted277CA
                Rejected277CA
                Resubmit277CA
                Line_Item_Count
            }
            OutboundPaymentDashboard {
                Paid
                Payment_Adjustment
                Payment_Never_Submitted
                Denied
              }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
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
                    let _data = res.data.OutboundDashboardFileTable
                    let _data1 = res.data.OutboundPaymentDashboard
                    let _condition = _data && _data.length > 0 ? true : false
                    let _condition1 = _data1 && _data1.length > 0 ? true : false

                    let stage_4 = [
                        { 'header': '' },
                        { 'name': 'X12 Claim Count', 'value': _condition ? _data[0].TotalEncounterSent : 0, isClick: true },
                        { 'name': 'X12 Claim Line Item Count', 'value': _condition ? _data[0].Line_Item_Count : 0, color : '#139DC9' },
                    ]
                    let stage_5 = [
                        { 'header': '' },
                        { 'name': '999 Accepted', 'value': _condition ? _data[0].Accepted999 : 0, isClick: true },
                        { 'name': '999 Rejected', 'value': _condition ? _data[0].Rejected999 : 0, isClick: true },
                        // { 'name': '277CA Accepted', 'value': _condition ? _data[0].Accepted277CA : 0 , isClick: true },
                        // { 'name': '277CA Rejected', 'value': _condition ? _data[0].Rejected277CA : 0, isClick: true  },
                    ]

                    let stage_6 = [
                        { 'name': '277CA Accepted', 'value': _condition ? _data[0].Accepted277CA : 0, color : '#2AC327'  },
                    { 'name': '277CA Rejected', 'value': _condition ? _data[0].Rejected277CA : 0, color : '#FF3B41' },
                    { 'name': 'Resubmit', 'value': _condition ? _data[0].Resubmit277CA : 0, color : '#139DC9' },
                    ]
                    let stage_7 = [
                        { 'name': 'Paid', 'value': _condition1 ? _data1[0].Paid : 0, color : '#2AC327'  },
                        { 'name': 'Denied', 'value': _condition1 ? _data1[0].Denied : 0, color : '#FF3B41' },
                        { 'name': 'Payment Adjustment', 'value': _condition1 ? _data1[0].Payment_Adjustment : 0, color : '#FA731A'  },
                        { 'name': 'WIP 0-30', 'value': 500, color : '#139DC9' },
                        { 'name': 'WIP 30-60', 'value': 350, color : '#139DC9' },
                        { 'name': 'WIP >60', 'value': 430, color : '#139DC9' },
                    ]

                    this.setState({
                        stage_4: stage_4,
                        stage_5: stage_5,
                        stage_6: stage_6,
                        stage_7: stage_7,
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

        let query = `{FileInCount(submitter:"${this.state.selectedTradingPartner}"  fromDt:"${this.state.startDate}" ToDt:"${this.state.endDate}" RecType:"Kaiser", Provider:"${this.state.providerName}", State:"${this.state.State}") {
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

        fetch(Urls._transaction837_kaiser, {
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
            OutboundEncounterProcessingSummary(FileID:"${this.state.file_id}", F99Status: "", F277Status: "", PaymentStatus:"", MolinaClaimID:"") {
                RefID
                FileID
                FileName_Outbound
                FileDate_Outbound
                FileStatus_Outbound
                ClaimID
                MolinaClaimID
                EncounterDate
                Encounter99_Status
                Encounter277CA_Status
                F999
                F277CA
                ProcessID835
              }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837_kaiser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.OutboundEncounterProcessingSummary
                if(data[0].MolinaClaimID == "000000000074457A"){data[0].label =  '7655566443354321'}
                if(data[1].MolinaClaimID == "000000000059435"){ data[1].label = '22333114433555443322'}
                if(data[2].MolinaClaimID == "000000000059440"){ data[2].label = '45333221144455566688'}
                if(data[3].MolinaClaimID == "000000000059446"){ data[3].label = '56625423228889991112225555'}
                if(data[4].MolinaClaimID == "000000000059450"){ data[4].label = '7665554434221211111'}
                if(data[5].MolinaClaimID == "000000000059460"){ data[5].label = '1237634252525555'}
                if(data[6].MolinaClaimID == "000000000059462"){ data[6].label = ''}
                if(data[7].MolinaClaimID == "000000000059465"){ data[7].label = ''}

                if (data && data.length > 0) {

                    this.setState({
                        rowData: this.state.gridType == 1 ? data : [],
                    })
                }


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
        this.props.history.push('/' + Strings.Outbound_Claim_277CAResponse, {
            fileId: fileId
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
    }

    goto999 = (fileId) => {
        // sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_Claim_999_response_Kaiser, {
            fileId: fileId,
            data: [
                { flag999: '0' },
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

        this.props.history.push('/' + Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser, {
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
            let notSent = ''
            let subtitle = ''
            let status277CA = ''
            let color = "var(--red)"

            let FileID = ''
            let F99Status = ''
            let F277Status = ''

            if (item.name == 'X12 Claim Count') {
                color = "var(--green)"
            } else if (item.name == '999 Accepted') {
                claimStatus = 'Accepted'
                color = "var(--green)"
            } else if (item.name == '999 Rejected') {
                claimStatus = 'Rejected'
            } else if (item.name == '277CA Accepted') {
                color = "var(--green)"
            } else if (item.name == '277CA Rejected') {
            } else if (item.name == 'Resubmit') {
                color = "var(--green)"
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
                    notSent: notSent,
                    subtitle: subtitle,
                    status277CA: status277CA,

                    FileID: FileID,
                    F99Status: F99Status,
                    F277Status: F277Status,
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Outbound_Claim_updated_Details_837_Grid_Kaiser}
                    data={sendData}
                    color={color}
                    unclick={item.color ? item.color : ''}
                />
            )
        })

        return (
            <div className="col chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }


    renderEncounterDetails = () => {
        return (
            <div className="row col-12 nopadding" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(this.state.stage_4)}
                {this._renderClaimTables(this.state.stage_5)}
                {this._renderClaimTables(this.state.stage_6)}
                {this._renderClaimTables(this.state.stage_7)}
            </div>
        )
    }

    // _renderTransactions() {
    //     return (
    //         <div className="ag-theme-balham" style={{ height: '400px', padding: '0px', marginLeft: '1px' }}>
    //             <AgGridReact
    //                 modules={this.state.modules}
    //                 columnDefs={this.state.columnDefs}
    //                 autoGroupColumnDef={this.state.autoGroupColumnDef}
    //                 defaultColDef={this.state.defaultColDef}
    //                 suppressRowClickSelection={true}
    //                 groupSelectsChildren={true}
    //                 debug={true}
    //                 rowSelection={this.state.rowSelection}
    //                 rowGroupPanelShow={this.state.rowGroupPanelShow}
    //                 pivotPanelShow={this.state.pivotPanelShow}
    //                 enableRangeSelection={true}
    //                 paginationAutoPageSize={false}
    //                 pagination={true}
    //                 domLayout={this.state.domLayout}
    //                 paginationPageSize={this.state.paginationPageSize}
    //                 onGridReady={this.onGridReady}
    //                 rowData={this.state.rowData}
    //                 enableCellTextSelection={true}
    //                 onCellClicked={(event) => {
    //                     if (event.colDef.headerName == '999') {
    //                         this.goto999(event.data.FileID)
    //                     }
    //                     if (event.colDef.headerName == '277CA') {
    //                         this.goto277(event.data.FileID)
    //                     }
    //                     if (event.colDef.headerName == 'File Name') {
    //                         this.setState({
    //                             incoming_fileId: event.data.FileID
    //                         }, () => {
    //                             this.gotoDetails()
    //                         })
    //                     }
    //                     if (event.colDef.headerName == "835 Process Id" && event.value) {
    //                         sessionStorage.setItem('isOutbound', false)
    //                         let data = [
    //                             {
    //                                 apiflag: '0',
    //                                 State: 'n',
    //                                 selectedTradingPartner: 'n',
    //                                 startDate: 'n',
    //                                 endDate: 'n',
    //                                 transactionId: 'n',
    //                                 status: 'n',
    //                                 count: 'n',
    //                                 incoming_fileId: event.value
    //                             }
    //                         ]
    //                         this.props.history.push('/' + Strings.claimPayment_835_details, {
    //                             data: data
    //                         })
                
    //                         window.location.reload()
                
    //                     }
    //                 }}
    //             >
    //             </AgGridReact>
    //         </div>
    //     )
    // }

    clickNavigation = (event) => {
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
        else if (event.colDef.headerName == "835" && event.value) {
            sessionStorage.setItem('isOutbound', false)
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
                    incoming_835fileId: event.data.MolinaClaimID
                }
            ]
            this.props.history.push('/' + Strings.InboundPaymentDetails, {
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
            filterArray: filterArray,
        })
    }

    _renderTransactions() {
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'

        let query = `{            
            OutboundEncounterProcessingSummary(FileID:"${this.state.file_id}", F99Status: "", F277Status: "", PaymentStatus:"", MolinaClaimID:"", ClaimID:""
            sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
            startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},ClaimStatus:""

            ){
                RecCount
                FileID
                FileName_Outbound
                FileDate_Outbound
                FileStatus_Outbound
                ClaimID
                MolinaClaimID
                EncounterDate
                Encounter99_Status
                Encounter277CA_Status
                F999
                F277CA
                RefID
                PaymentStatus
                Error_Field
                Error_Description
                PaymentDetails
            }
        }`

        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls._transaction837_kaiser}
                    paginationPageSize={10}
                    index={'OutboundEncounterProcessingSummary'}
                    State={this.state.State}
                    fieldType={'PaymentDetails'}
                    // postData={this.postData}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    type={this.state.type}
                    filterClaim={this.state.Filter_ClaimId}
                    selectedFileId={this.state.selectedFileId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                    sorting={true}
                />
            </div>
        )

        
    }

    _refreshScreen = () => {
        // this.getCountData()
        this.getClaimCounts()
        // this.getData()
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
                isPayer={true}
                removeSubmitter={true}
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
                <h5 className="headerText">Claims Processing Summary (Outbound)</h5>
                {this._renderTopbar()}
                {/* {this._renderStats()} */}
                {this.renderEncounterDetails()}
                {this._renderTransactions() }
            </div>
        );
    }
}