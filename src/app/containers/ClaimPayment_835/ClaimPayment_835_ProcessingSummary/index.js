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
            EFTData: 0,
            CheckData: 0,
            Rejected: 0,
            Accepted: 0,
            QNXT_Generated: 0,
            Hipaas_Received: 0,
            domLayout: 'autoHeight',
            
            columnDefs: [
      
                { headerName: "Remittance File Name",   suppressMovable: true, field: "FileName", cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "Process Id", field: "" ,   suppressMovable: true, },
                { headerName: "State", field: "" , suppressMovable: true,},
                { headerName: "Remittance File Date", field: "FileDate" , suppressMovable: true, },
                { headerName: " Remittance File Status", field: "" , suppressMovable: true,},
                { headerName: "999", field: "" , suppressMovable: true,},
                { headerName: "In HiPaaS", field: "" , suppressMovable: true, },
                // { headerName: "Claim Id", field: "ClaimID" },
                // { headerName: "Days", field: "Days" },
                // { headerName: "Claim Received Date", field: "ClaimReceivedDate" },
                // { headerName: "Check EFT No", field: "CheckEFTNo" },
                // { headerName: "Check EFT Date", field: "CheckEFTDt" },
                // { headerName: "Payment Method                ", field: "CHECKEFTFlag" },
                // { headerName: "Total Charge Amount    ", field: "TotalChargeAmt" },
                // { headerName: "Total Paid Amount", field: "TotalClaimPaymentAmt" },
                // { headerName: "Total Bill Amount    ", field: "TotalBillAmount" },
                // { headerName: "Total Adjustment Amount", field: "TotalAdjustmentAmount" },
            
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
                resizable: false,
                filter: true,
                flex: 1,
                lockPosition: true,
                
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
        this.getData()
        this._getClaimCounts()
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
    handlePageClick(data, fileId) {
        let page = data.selected + 1
        this.setState({
            pageCount: page
        })

        setTimeout(() => {
                this.getData()
        }, 50);
    }
    renderTransactionsNew() {
        const data = this.state.Claim837RTProcessingSummary ? this.state.Claim837RTProcessingSummary : []
        let headerArray = []
        let rowArray = []

        headerArray.push(
            { value: ' Remittance  File Name' },
            { value: 'Remittance  File Date'},
            { value: 'Remittance  File Status' },
            { value: '999' },
            { value: 'In HiPaaS' },
            // { value: 'Claim Id' },
            // { value: 'Day' },
            // // { value: 'Claim Received Date'},
            // { value: 'Check EFT No'},
            // // { value: 'Check EFT Date'},
            // { value: 'Payment Method' },
            // { value: 'Total Charge Amount' },
            // { value: 'Total Paid Amount' },
            // { value: 'Total Bill Amount' },
            // { value: 'Total Adjustment Amount' },
            
        
        )
       
        rowArray.push(
            { value: 'FileName', method: this.gotoDetails, isClick: 1, key_argument: 'FileID' },
            { value: 'FileDate', isDate: 1 },
            { value: '' },
            { value: ''  },
            { value: ''  },
            // { value: 'ClaimID' },
            // { value: 'Days'},
            // // { value: 'ClaimReceivedDate', isDate: 1 },
            // { value: 'CheckEFTNo' },
            // // { value: 'CheckEFTDt' },
            // { value: 'CheckEFTNo' },
            // { value: 'TotalChargeAmt' },
            // { value: 'TotalClaimPaymentAmt'  },
            // { value: 'TotalBillAmount' },
            // { value: 'TotalAdjustmentAmount'  },
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
        
            this.getData()
            this._getClaimCounts()
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
                            }}>
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
            this._getClaimCounts()
            
        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
            this._getClaimCounts()
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

    _getClaimCounts = async () => {

        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        
        let query = `{
            Dashboard835Count(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}") {
                Check
                EFT
                Rejected
                Accepted
                QNXT_Generated
                Hipaas_Received
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
                    let data = res.data.Dashboard835Count[0]
                    // let _data = res.data.Claim837RTDashboardTable[0]

                    this.setState({
                        CheckData: data ? data.Check : 0,
                        EFTData: data ? data.EFT : 0,
                        Rejected999: data ? data.Rejected : 0,
                        Accepted999: data ? data.Accepted : 0,
                        QNXT_Generated: data ? data.QNXT_Generated : 0,
                        Hipaas_Received: data ? data.Hipaas_Received : 0,
                       
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    renderClaimDetails = () => {

        let stage_1 = [
            { 'name': 'QNXT Generated', 'value': this.state.QNXT_Generated },
            { 'name': 'HiPaaS Received ', 'value': this.state.Hipaas_Received },
            { 'name': 'Total Number of Errors', 'value': 900 },
        ]
        let stage_2 = [
            { 'name': 'Sent to Availity', 'value': 6 },
            { 'name': 'Number of Acknowledged 835', 'value': 7 },
            { 'name': 'Number of Accepted 999’s', 'value': this.state.Accepted999 },
            { 'name': 'Number of Rejected 999’s', 'value': this.state.Rejected999 },

        ]
        let stage_3 = [
            { 'name': 'EFT', 'value': this.state.EFTData, },
            { 'name': 'CHK', 'value': this.state.CheckData,},
            { 'name': '% ERA out of total', 'value': 30 },
            { 'name': '# Availity rejected', 'value': 85 },
            // { 'name': 'Rejected %', 'value': '15%' }
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
                    enableCellTextSelection={true}    
                    
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