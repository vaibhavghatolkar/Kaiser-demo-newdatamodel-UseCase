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

let val = ''
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
            FileReject_Claims:0,
            Processing_Claims: 0,
            ReconciledError_Claims:0,
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
      
                { headerName: "QNXT File Name", field: "FileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Process Id", field: "" },
                { headerName: "State", field: "" },
                { headerName: "QNXT File Date", field: "FileDate" },
                { headerName: "File Status", field: "" },
                { headerName: "999", field: "", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Claim Id", field: "ClaimID" },
                { headerName: "Days", field: "Days" },
                { headerName: "Claim Received Date", field: "ClaimReceivedDate" },
                { headerName: "Check EFT No", field: "CheckEFTNo" },
                { headerName: "Check EFT Date", field: "CheckEFTDt" },
                { headerName: "Payment Method                ", field: "CHECKEFTFlag" },
                { headerName: "Total Charge Amount    ", field: "TotalChargeAmt" },
                { headerName: "Total Paid Amount", field: "TotalClaimPaymentAmt" },
                { headerName: "Total Bill Amount    ", field: "TotalBillAmount" },
                { headerName: "Total Adjustment Amount", field: "TotalAdjustmentAmount" },
            
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
        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
    }

    componentDidMount() {
        this.getCommonData()
        this.getCountData()
        this.getClaimCounts()
        this.getData()
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
                    Total999: res.data.Total999Response[0].Total999,
                    Total277CA: res.data.Total277CAResponse[0].Total277CA,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getCommonData = async () => {
        let query = `{
            Trading_PartnerList(RecType :"Inbound", Transaction:"Claim837RT") {
                Trading_Partner_Name 
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
                    this.setState({
                        tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimCounts = async () => {
        let query = `{
            Claim837RTDashboardCountClaimStatus(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Inbound") {
                X12Count
                HiPaaSCount
                MCGLoadCount
            }
            Claim837RTDashboardTable(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Inbound") {
                Accepted_Claims
                Rejected_Claims
                FileReject_Claims
                Processing_Claims
                ReconciledError_Claims
                LoadingClaims
                LoadedErrorClaims
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
                        LoadingClaims: _data ? data.MCGLoadCount : 0,
                        LoadedErrorClaims: _data ? _data.LoadedErrorClaims : 0
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
            PaymentProcessingSummary   {
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
            }
        }`
       console.log("sakhjsaf" , query)
        fetch(Urls.claim_processing, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.PaymentProcessingSummary 
                let count = 0
                // if (data && data.length > 0) {
                //     let recCount = data[0].RecCount
                //     try {
                //         count = recCount / 10
                //         count = count.floor(count)
                //         if (recCount % 10 > 0) {
                //             count = count + 1
                //         }
                //     } catch (error) {

                //     }

                // }
console.log("asjfhsaf" , data)
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
            fileId: fileId
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
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type, incoming_fileId : fileId ? fileId : this.state.incoming_fileId },
        ]

        this.props.history.push('/' + Strings.Claim_Details_837_Grid, {
            data: sendData
        })
    }

    renderTransactionsNew() {
        const data = this.state.Claim837RTProcessingSummary ? this.state.Claim837RTProcessingSummary : []
        let headerArray = []
        let rowArray = []

        headerArray.push(
            { value: ' QNXT File Name' },
            { value: 'QNXT File Date'},
            { value: 'File Status' },
            { value: '999' },
            { value: 'Claim Id' },
            { value: 'Day' },
            { value: 'Claim Received Date'},
            { value: 'Check EFT No'},
            { value: 'Check EFT Date'},
            { value: 'Payment Method' },
            { value: 'Total Charge Amount' },
            { value: 'Total Paid Amount' },
            { value: 'Total Bill Amount' },
            { value: 'Total Adjustment Amount' },
            
        
        )
       
        rowArray.push(
            { value: 'FileName', method: this.gotoDetails, isClick: 1, key_argument: 'FileID' },
            { value: 'FileDate', isDate: 1 },
            { value: '' },
            { value: ''  },
            { value: 'ClaimID' },
            { value: 'Days'},
            { value: 'ClaimReceivedDate', isDate: 1 },
            { value: 'CheckEFTNo' },
            { value: 'CheckEFTDt' },
            { value: 'CheckEFTNo' },
            { value: 'TotalChargeAmt' },
            { value: 'TotalClaimPaymentAmt'  },
            { value: 'TotalBillAmount' },
            { value: 'TotalAdjustmentAmount'  },
            // { value: 'TotalLine', secondVal: 'TotalLinewise835', isBar: 1 },
        
        )

        return (
            <CommonTable
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
            this.getCountData()
            this.getClaimCounts()
            this.getData()
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
            this.getCountData()
            this.getClaimCounts()
            this.getData()
        })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this.getCountData()
            this.getClaimCounts()
            this.getData()
        })
    }

    renderTopBar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
                        />

                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                            onChange={this.handleEndChange}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Grid Type</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.setState({
                                    page: 1,
                                    rowData: [],
                                    Claim837RTProcessingSummary: [],
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
                    {/* <div className="col summary-container" style={{ marginTop: '-10px', paddingLeft: '16px' }}>
                        <div className="summary-header">WIP > 90 Days</div>
                        <div className="blue summary-title">{this.state.wip90}</div>
                    </div> */}
                </div>
            </div>
        )
    }

    handleStartChange(date) {
        this.setState({
            startDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getCountData()
            this.getClaimCounts()
            this.getData()
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

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
            let color = "var(--red)"

            if (item.name == 'Accepted') {
                generalStatus = 'Accepted'
                color = "var(--green)"
            } else if (item.name == 'Accepted with Errors') {
                generalStatus = 'Rejected'
            } else if (item.name == 'File Rejected') {
                generalStatus = 'File Rejected'
            } else if (item.name == 'Reconciled Error') {
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
                color = "var(--main-bg-color)"
            } else if (item.name == 'Load Error') {
                mcgStatus = 'Exception'
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
                },
            ]
            row.push(
                <div className="row" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
                    <div style={{ alignSelf: 'center', fontSize: '12px', color: "var(--grayBlack)" }} className="col-9" style={{ alignSelf: 'center' }}> {item.name} </div>
                    {
                        item.isClick ?
                            <Link to={{ pathname: Strings.Claim_Details_837_Grid, state: { data: sendData } }} style={{ alignSelf: 'center', fontSize: '16px', color: color }}>{item.value}</Link>
                            :
                            <div style={{ alignSelf: 'center', fontSize: '16px', color: "var(--grayBlack)" }}>{item.value}</div>
                    }
                </div>
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
            { 'name': 'Received From QNXT', 'value': '12K' },
            { 'name': 'In HiPaaS', 'value': '11K' },
            { 'name': 'Error', 'value': 900 },
        ]
        let stage_2 = [
            { 'name': 'WIP', 'value': 90 },
            { 'name': 'Pending', 'value': 100 },
            { 'name': 'Paid', 'value': 120 },
            { 'name': 'Denied', 'value': 10 },
        ]
        let stage_3 = [ 
            { 'name': 'Sent to Availity', 'value': 80 },
            { 'name': '999 Not Sent', 'value': 30 },
        ]

        let stage_4 = [
       
        ]

        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
                {/* {this._renderClaimTables(stage_4)} */}
            </div>
        )
    }


   

    _renderTransactions() {
        return (
            <div className="ag-theme-balham" style={{ height: '400px', padding: '0px' }}>
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
                    // onCellClicked={(event) => {
                    //     if (event.colDef.headerName == '999') {
                    //         this.goto999(event.data.FileID)
                    //     }
                    //     if (event.colDef.headerName == '277CA') {
                    //         this.goto277(event.data.FileID)
                    //     }
                    //     if (event.colDef.headerName == 'File Name') {
                    //         this.setState({
                    //             incoming_fileId: event.data.FileID
                    //         }, () => {
                    //             this.gotoDetails()
                    //         })
                    //     }
                    // }}
                >
                </AgGridReact>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">835 Payment Processing Summary</h5>
                {this.renderTopBar()}
                {/* {this._renderStats()} */}
                {this.renderClaimDetails()}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                {this.state.Claim837RTProcessingSummary && this.state.Claim837RTProcessingSummary.length > 0 && !this.state.gridType ? this.renderTransactionsNew() : null}
            </div>
        );
    }
}