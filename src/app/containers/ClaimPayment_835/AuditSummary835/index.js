import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import { getDetails, getProviders } from '../../../../helpers/getDetails';
import DatePicker from "react-datepicker";
import ReactPaginate from 'react-paginate';
import { AutoComplete } from '../../../components/AutoComplete';
import { StateDropdown } from '../../../components/StateDropdown';
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

let val = ''
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
            startDate: moment().subtract(180, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
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
                { headerName: "QNXT File Name", field: "QNXTFileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "File Date", field: "Date" },
                { headerName: "State", field: "State" },
                { headerName: "Process Id", field: "ProcessID" },
                { headerName: "File Status", field: "Status" },
                { headerName: "Remittance File Name", field: "RemittanceFileName" },
                { headerName: "Remittance File Date	", field: "RemittanceSentDate" },
                { headerName: "Received", field: "Received" },
                { headerName: "In HiPaaS", field: "InHipaas" },
                { headerName: "Error in PreProcess", field: "" },
                { headerName: "999", field: "F999", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                // { headerName: "Accepted PreProcess", field: "Accepted" },
                // { headerName: "Rejected PreProcess", field: "Rejected" },
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
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
        }

        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.getClaimCounts()
        this._getCounts()
        this._getCountsNew()
        this.getCommonData()
    }

    _get999Count = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{

            Claim837RTRejectedFile (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Inbound") {
                TotalAcceptedFiles
            }
         }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.claims_837, {
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
                    acceptedFiles: res.data.Claim837RTRejectedFile[0].TotalAcceptedFiles,
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
                HiPaaSCount
            }
            Claim837RTDashboardTable(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Inbound") {
                Accepted_Claims
                Rejected_Claims
                LoadingClaims
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.common_data, {
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
                        HiPaaSCount: data ? data.HiPaaSCount : 0,
                        Accepted: _data ? _data.Accepted_Claims : 0,
                        Rejected: _data ? _data.Rejected_Claims : 0,
                        loaded: _data ? _data.LoadingClaims : 0,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            
                AuditSummary835(StartDt: "${startDate}", EndDt: "${endDate}", State: "${this.state.State}", FileID:"",Status:"",RecType:"Outbound") {
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
                }
              
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.base_url, {
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
                if (res.data) {

                    let count = 1
                    if (data && data.AuditSummary835.length > 0) {

                        count = Math.floor(data.AuditSummary835[0].RecCount / 10)
                        if (data.AuditSummary835[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                    }

                    this.setState({
                        claimsAudit: res.data.AuditSummary835,
                        rowData: this.state.gridType == 1 ? res.data.AuditSummary835 : [],
                        count: count
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });

        setTimeout(() => {
            this._get999Count()
        }, 1000);
    }

    getData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            FileInCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `",RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}"){
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
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.claims_837, {
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
                if (res.data) {
                    let totalFile = 0
                    try {
                        totalFile = res.data.FileInCount[0].totalFile
                    } catch (error) {

                    }

                    this.setState({
                        totalFile: totalFile,
                        TotalClaims: res.data.FileInCount[0].TotalClaims,
                        InProgress: res.data.FileInCount[0].InProgress,
                        Total277CA: res.data.FileInCount[0].Total277CA,
                        Paid: res.data.FileInCount[0].Paid,
                        denied: res.data.FileInCount[0].denied,
                        WIP: res.data.FileInCount[0].WIP,
                        Pending: res.data.FileInCount[0].Pending,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _getCountsNew = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            ERA835DashboardCountNew(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                TotalCount
                Rejected
                Accepted
              }
              Total999Response835(State: "${this.state.State}") {
                Total999
              }
              
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.real_time_claim, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                 let data = res.data.ERA835DashboardCountNew[0]
                // this.setState({
                //     totalCount: data[0].TotalCount,
                //     accepted_Files: data[0].Accepted,
                //     acceptedwithErrors: data[0].AcceptedwithErrors,
                //     rejected_Files: data[0].Rejected
                // })
                let summary= []
              
                summary = [
                    { name: 'Received From QNXT', value: data.TotalCount },
                    { name: 'Vaildated', value: data.Accepted },
                    { name: 'Files in Error', value: data.Rejected },
                    { name: 'Error Resolved', value: 0 },
                    { name: 'Total Sent To Availity', value: 6 },
                    { name: '999 Received', value: res.data.Total999Response835[0].Total999 },
                ]

                this.setState({
                    summaryList: summary,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }


    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryList
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270 + '/' + apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let loadStatus = ''
            let mcgStatus = ''
            let data = []
            if (item.name == 'Accepted') {
                addon = '/accept'
                claimStatus = 'Accepted'
            } else if (item.name == 'Accepted with Errors') {
                addon = '/reject'
                claimStatus = 'Accepted with Errors'
            } else if (item.name == 'Processing') {
                addon = '/reject'
                claimStatus = 'Received'
            } else if (item.name == 'Rejected') {
                claimStatus = 'Rejected'
            } else if (item.name == 'Reconciled') {
                loadStatus = 'Reconciled'
            } else if (item.name == 'Reconciled Error') {
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load Error') {
                mcgStatus = 'Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
            } else {
                addon = '/other'
            }
            data = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: claimStatus,
                    type: type,
                    gridflag: loadStatus,
                    mcgStatus: mcgStatus
                },
            ]
            row.push(
                <Tiles
                    isClickable={
                        item.name != 'HiPaaS | MCG' &&
                        item.name != '999' &&
                        item.name != '277 CA'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    // url={Strings.Claim_Details_837_Grid}
                />

            )
        });

        return (
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
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
            fileId: fileId
        })
        // setTimeout(() => {
        //     window.location.reload()
        // }, 50);
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
            this.getClaimCounts()
            this._getCounts()

        }, 50);
    }

    renderTransactions() {
        let row = []
        const data = this.state.claimsAudit;
        data.forEach((d) => {
            let count = 0
            try {
                count = (Number(d.Submitted) ? Number(d.Submitted) : 0) - (Number(d.InHiPaaS) ? Number(d.InHiPaaS) : 0)
            } catch (error) { }

            row.push(
                <tr>
                    <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.QNXTFileName}</td>
                    <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.Date}</td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style">{d.ProcessID}</td>
                    <td className="list-item-style">{d.Status}</td>
                    <td className="list-item-style">{d.RemittanceFileName}</td>
                    <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.RemittanceSentDate}</td>
                    <td className="list-item-style">{d.Received}</td>
                    <td className="list-item-style">{d.InHipaas}</td>
                    <td className="list-item-style"></td>
                    <td className="list-item-style">{d.F999}</td>
                </tr>
            )
        });
        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    <tr className="table-head">
                        <td className="table-head-text list-item-style">QNXT File Name</td>
                        <td className="table-head-text list-item-style">File Date</td>
                        <td className="table-head-text list-item-style">State</td>
                        <td className="table-head-text list-item-style">Process Id</td>
                        <td className="table-head-text list-item-style">File Status</td>
                        <td className="table-head-text list-item-style">Remittance File Name</td>
                        <td className="table-head-text list-item-style">Remittance File Date	</td>
                        <td className="table-head-text list-item-style">Received</td>
                        <td className="table-head-text list-item-style">In HiPaaS</td>
                        <td className="table-head-text list-item-style">Error in PreProcess</td>
                        <td className="table-head-text list-item-style">999</td>
                    </tr>
                    <tbody >
                        <tr>
                        </tr>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
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

    handlePageClick(data) {
        let page = data.selected + 1
        this.setState({
            page: page,

        })

        setTimeout(() => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()

        }, 50);
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.setState({
                [key]: ''
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()
            this._getCountsNew()
        }, 50);
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
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {

                    this.setState({
                        tradingpartne837: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _renderStats() {
        let _summary = [
            // { header: 'Total Accepted Files', value: this.state.acceptedFiles, style: "green summary-title" },

            // { header: 'Total Files', value: this.state.totalCount },
            { header: 'Accepted Files', value: this.state.accepted_Files },
            { header: 'Accepted with Errors', value: this.state.acceptedwithErrors },
            { header: 'Rejected Files', value: this.state.rejected_Files },
            { header: 'Claims In HiPaaS', value: this.state.HiPaaSCount },
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            { header: '999', value: this.state.Total999, style: "green summary-title" },
            { header: 'Load in MCG', value: this.state.loaded, style: "green summary-title" },
            { header: '277 CA', value: this.state.Total277CA, style: "orange summary-title" }
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
            <div className="row padding-left" >
                {row}
            </div>

        )
    }
    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()
            this._getCountsNew()

        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()
            this._getCountsNew()

        }, 50);
    }

    onHandleChange = (e) => {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            getProviders("Inbound", providerName)
                .then(list => {
                    this.setState({
                        providers: list
                    })
                }).catch(error => {
                    process.env.NODE_ENV == 'development' && console.log(error)
                })
        }, 300);
    }

    onSelected = (value) => {
        this.setState({
            providerName: value
        }, () => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()
            this._getCountsNew()

        })
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text,
            showDetails: false
        }, () => {
            this.getData()
            this.getClaimCounts()
            this._getCounts()
            this._getCountsNew()

        })
    }

    renderTopBar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>
                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
                        />

                    </div> */}
                    <div className="form-group col-2">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}
                        >

                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleStartChange}
                            maxDate={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleEndChange}
                            minDate={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
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
                                    gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
                                }, () => {
                                    this._getCounts()
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
    getoptions() {
        let row = []
        this.state.tradingpartne837.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    _renderTransactions() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
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
                        enableCellTextSelection={true}    
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">835 Audit Summary</h5>
                {this.renderTopBar()}
                {/* {this._renderStats()} */}
                {this._renderSummaryDetails()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && !this.state.gridType ? this.renderTransactions() : null}
                </div>
            </div>
        );
    }
}