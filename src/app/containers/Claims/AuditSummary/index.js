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
export class AuditSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartne837: [],
            providers: [],
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            acceptedFiles: 0,
            gridType: 1,
            selectedTradingPartner: '',
            type: '',
            providerName: '',
            orderby: "",
            State: "",
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0,
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
            totalCount:'',
            accepted_Files:'',
            acceptedwithErrors:'',
            rejected_Files:'',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            columnDefs: [
                { headerName: "File Name", field: "filename" },
                { headerName: "File Status", field: "FileStatus" },
                { headerName: "Submitted", field: "Submitted" },
                { headerName: "In HiPaaS", field: "InHiPaaS" },
                { headerName: "Accepted PreProcess", field: "Accepted" },
                { headerName: "Rejected PreProcess", field: "Rejected" },
                { headerName: "Error in PreProcess", field: "Rejected" },
                { headerName: "In MCG	", field: "SentToQNXT" },
                { headerName: "999", field: "F999" },
                { headerName: "277 CA", field: "goto277" },
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
        this._getCounts()
        this._getCountsNew()
        this.getCommonData()
    }

    _get999Count = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}") {
              Total999
            }
            Claim837RTRejectedFile (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"",EndDt:"",Type:"${this.state.type}", RecType: "Inbound") {
                TotalAcceptedFiles
            }
         }`
        console.log(query)
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
                    acceptedFiles: res.data.Claim837RTRejectedFile[0].TotalAcceptedFiles,
                })
            })
            .catch(err => {
                console.log(err)
            });
    }

    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            ClaimsDailyAudit(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", page: ${this.state.page}, Provider:"${this.state.providerName}" OrderBy:"${this.state.orderby}", State:"${this.state.State}", GridType:${this.state.gridType}){
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
              InHiPaaS
            }
        }`
        console.log(query)
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

                    let count = 1
                    if (data && data.ClaimsDailyAudit.length > 0) {

                        count = Math.floor(data.ClaimsDailyAudit[0].RecCount / 10)
                        if (data.ClaimsDailyAudit[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                    }

                    this.setState({
                        claimsAudit: res.data.ClaimsDailyAudit,
                        rowData: this.state.gridType == 1 ? res.data.ClaimsDailyAudit : [],
                        count: count
                    })
                }
            })
            .catch(err => {
                console.log(err)
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
        console.log(query)
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
                        Accepted: res.data.FileInCount[0].Accepted,
                        Rejected: res.data.FileInCount[0].Rejected,
                        InProgress: res.data.FileInCount[0].InProgress,
                        Total277CA: res.data.FileInCount[0].Total277CA,
                        TotalSentToQNXT: res.data.FileInCount[0].TotalSentToQNXT,
                        Paid: res.data.FileInCount[0].Paid,
                        denied: res.data.FileInCount[0].denied,
                        WIP: res.data.FileInCount[0].WIP,
                        Pending: res.data.FileInCount[0].Pending,
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    _getCountsNew = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Claim837RTDashboardCountNew(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                TotalCount
                Accepted
                Rejected
                AcceptedwithErrors
                Processing
            }
            Claim837RTDashboardCountFileStatuswise(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                Reconciled
                ReconciledError
                Loaded
                LoadedError
            }
        }`
        console.log(query)
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
                let data = res.data.Claim837RTDashboardCountNew
               
            
                this.setState({
                    totalCount: data[0].TotalCount,
                    accepted_Files: data[0].Accepted,
                    acceptedwithErrors: data[0].AcceptedwithErrors,
                    rejected_Files: data[0].Rejected
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    goto277 = () => {
        sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_277CAResponse)
        setTimeout(() => {
            window.location.reload()
        }, 50);
    }

    goto999 = (fileId) => {
        sessionStorage.setItem('isOutbound', true)
        this.props.history.push('/' + Strings.Outbound_response_999, {
            fileId: fileId
        })
        setTimeout(() => {
            window.location.reload()
        }, 50);
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
                    <td className="list-item-style"><a onClick={() => { this.props.history.push('/' + Strings.ClaimProcessingSummary) }} style={{ color: "#6AA2B8", cursor: "pointer", wordBreak: 'break-all' }}>{d.filename}</a></td>
                    <td className="list-item-style">{d.FileStatus}</td>
                    <td className="list-item-style">{d.Submitted ? d.Submitted : 0}</td>
                    <td className="list-item-style">{d.InHiPaaS ? d.InHiPaaS : 0}</td>
                    <td className="list-item-style">{d.Accepted}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                    <td className="list-item-style">{count}</td>
                    <td className="list-item-style">{d.SentToQNXT}</td>
                    <td className="list-item-style">
                        <a style={{ color: "#6AA2B8", cursor: "pointer",  wordBreak: 'break-all' }}
                        onClick={() => {
                            this.goto999(d.FileID)
                        }}>{d.F999}</a></td>
                    <td className="list-item-style"><a style={{ color: "#6AA2B8", cursor: "pointer" }}
                        onClick={() => {
                            this.goto277()
                        }}>{d.F277}</a></td>
                </tr>
            )
        });
        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    <tr className="table-head">
                        <td style={{ width: '19%' }} className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "ClaimsDailyAudit.filename", this.state.nameRotation, 'nameRotation')}>File Name</a></td>
                        <td style={{ width: '13%' }} className="table-head-text list-item-style"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "ClaimsDailyAudit.FileStatus", this.state.statusRotation, 'statusRotation')}>File Status</a></td>
                        <td className="table-head-text list-item-style">Submitted </td>
                        <td className="table-head-text list-item-style">In HiPaaS </td>
                        <td className="table-head-text list-item-style">Accepted PreProcess </td>
                        <td className="table-head-text list-item-style">Rejected PreProcess </td>
                        <td className="table-head-text list-item-style">Error in PreProcess </td>
                        {/* <td className="table-head-text list-item-style">Accepted in Preprocess</td> */}
                        <td className="table-head-text list-item-style">In MCG </td>
                        <td className="table-head-text list-item-style">999</td>
                        <td className="table-head-text list-item-style">277 CA</td>
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
            this._getCounts()
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
                console.log(err)
            });
    }

    _renderStats() {
        let _summary = [
            // { header: 'Total Accepted Files', value: this.state.acceptedFiles, style: "green summary-title" },
            
            // { header: 'Total Files', value: this.state.totalCount },
            { header: 'Accepted Files', value: this.state.accepted_Files },
            { header: 'Accepted with Errors', value: this.state.acceptedwithErrors },
            { header: 'Rejected Files', value: this.state.rejected_Files },
            { header: 'In HiPaaS', value: this.state.TotalClaims },
            { header: 'Accepted Claims', value: this.state.Accepted },
            { header: 'Rejected Claims', value: this.state.Rejected },
            { header: '999', value: this.state.Total999, style: "green summary-title" },
            { header: 'Send To MCG', value: this.state.TotalSentToQNXT, style: "green summary-title" },
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
            this._getCounts()

        }, 50);
    }

    handleEndChange(date) {
        this.setState({
            endDate: date,
            showDetails: false
        });

        setTimeout(() => {
            this.getData()
            this._getCounts()

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
                    console.log(error)
                })
        }, 300);
    }

    onSelected = (value) => {
        this.setState({
            providerName: value
        }, () => {
            this.getData()
            this._getCounts()

        })
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text,
            showDetails: false
        }, () => {
            this.getData()
            this._getCounts()

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
                    <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <AutoComplete
                            list={this.state.providers}
                            onHandleChange={this.onHandleChange}
                            onSelected={this.onSelected}
                        />

                    </div>
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
                            selected={this.state.startDate ? new Date(this.state.startDate) : ''}
                            onChange={this.handleStartChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker
                            className="form-control list-header-dashboard"
                            selected={this.state.endDate ? new Date(this.state.endDate) : ''}
                            onChange={this.handleEndChange}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Grid Type</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.setState({
                                    page: 1,
                                    rowData : [],
                                    claimsAudit: [],
                                    gridType : event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
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
                <div className="ag-theme-balham" style={{ maxHeight: '100%',padding: '0', marginTop: '24px' }}>
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
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Audit Summary</h5>
                {this.renderTopBar()}
                {this._renderStats()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && this.state.gridType ? this._renderTransactions() : null}
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 && !this.state.gridType ? this.renderTransactions() : null}
                </div>
            </div>
        );
    }
}