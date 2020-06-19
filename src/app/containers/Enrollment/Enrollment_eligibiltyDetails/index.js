import React from 'react';
import '../../RealTime_837_Claim/RealTimeDashboard/styles.css';
import '../../color.css'
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import Strings from '../../../../helpers/Strings';
import { CommonTable } from '../../../components/CommonTable';
import Chart1 from "react-google-charts";
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import { StateDropdown } from '../../../components/StateDropdown';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { PieChart } from '../../../components/PieChart';
import { TableTiles } from '../../../components/TableTiles';
import { MDBProgress } from 'mdbreact';
import { Filters } from '../../../components/Filters';

let val = ''
export class Enrollment_eligibiltyDetails extends React.Component {

    constructor(props) {
        super(props);
console.log("afkjsakffsjklsfjsalkfjslf" ,props.location.state.data[0].incoming_fileId)
        this.state = {
            claimsList: [],
            summaryList: [],
            summaryCount: [],
            totalFiles: [],
            second_data: {},
            pie_data: {},
            complaince_data: {},
            availitySent: '',
            progress_exception: 0,
            TotalException: 0,
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            pielabels: [],
            pievalues: [],
            startDate: moment().subtract(180, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            incoming_fileId: '',
            State: 'UT',
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            ClaimBarChart: [],
            claimLabels: [],
            complience: [],

            //////////----------table----
            Organization: '',
            Service_startDate: '',
            Service_endDate: '',
            Sender: '',
            page: 1,
            count: 1,
            orderby: '',
            providerChartLabel: ['Provider Name 1', 'Provider Name 2', 'Provider Name 3', 'Provider Name 4', 'Provider Name 5'],
            providerChartData: [4, 5, 1, 2, 3],
            ErrorChartLabel: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            ErrorChartData: [9, 5, 1, 3, 4, 8, 7, 11, 2, 6, 10, 12],
            EFTData: 0,
            CheckData: 0,
            Rejected: 0,
            Accepted: 0,
            QNXT_Generated: 0,
            Hipaas_Received: 0,
            TotalCountQnxt: 0,
            progress_Validated: 0,
            progress_Error: 0,
            AvailitySent: 0,
            TotalError: 0,
            gridType: 1,
            paginationPageSize: 10,
            Addition: 0,
            Termination: 0,
            Changes: 0,
            X12_Count: 0,
            Hipaas_Count: 0,
            domLayout: 'autoHeight',
            FileName: [],
            QNXTStatus2: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].status != 'n'  ? props.location.state.data[0].status : '',
            QNXTStatus1: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].claimStatus != 'n'   ? props.location.state.data[0].claimStatus : '',
            inDHS: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].inDHS != 'n'  ? props.location.state.data[0].inDHS : '',
            Audit: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].Audit != 'n'   ? props.location.state.data[0].Audit : '',
            Add: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].Add != 'n'   ? props.location.state.data[0].Add : '',
            flag: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].flag != 'n'  ? props.location.state.data[0].flag : '',
            inQnxt: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].inQnxt != 'n'   ? props.location.state.data[0].inQnxt : '',
            MonthlyStatus: props.location.state == undefined ? '' : props.location.state.data[0] && props.location.state.data[0].MonthlyStatus != 'n'  ? props.location.state.data[0].MonthlyStatus : '',
            selected_FileID:props.location.state==undefined ? '' : props.location.state.data[0] && props.location.state.data[0].incoming_fileId  ? props.location.state.data[0].incoming_fileId : '',
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


        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.showFile = this.showFile.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
        setTimeout(() => {

        }, 50);
    }

    componentDidMount() {
        this._refreshScreen()
    }
    _refreshScreen = () => {
        // this.getCommonData()
        // this.getListData()
        // this._getCounts()
        // this._getOtherCounts('MOLINA')
        // this._getOtherCounts('MOL IMED')
        // this._getOtherCounts('MOLCHIP')
        // this.getFilename()
        // this.gettiles()
        this.getSecond_tiles()
        // this.state.flag == "Y" ? this.getSecond_tiles_1() : this.getSecond_tiles()



    }
    getCommonData() {
        let query = `{
            Trading_PartnerList(RecType :"Inbound", Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._common_data, {
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

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTableHeader() {

        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style">Process Id</td>
                <td className="table-head-text list-item-style">Received Date</td>
                <td className="table-head-text list-item-style">State</td>
                <td className="table-head-text list-item-style">Total</td>
                <td className="table-head-text list-item-style">Rejected</td>
                <td className="table-head-text list-item-style">Remittance File Name</td>
                <td className="table-head-text list-item-style">Remittance Sent Date</td>
                {/* <td className="table-head-text list-item-style">Compliance vs Submission date</td> */}
                <td className="table-head-text list-item-style"># of Errors</td>
                {/* <td className="table-head-text list-item-style">Receiver</td> */}
            </tr>
        )
    }



    getListData = () => {

        let count = 1
        let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.ServiceEndDate ? moment(this.state.ServiceEndDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            Dashboard834FileDetails(State:"${this.state.State}", StartDt :"${startDate}", EndDt : "${endDate}", RecType: "Inbound" ,Status:"",FileID:"",MaintenanceCode:"") {
                FileName
                Date
                Subscriber
                Enrollment
                Error
                FileStatus
                FileID
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                console.log("al;fjsdjfjsh", res.data.Dashboard834FileDetails)
                this.setState({
                    // rowData: res.data.Dashboard834FileDetails,
                    rowData: []

                })

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderList() {
        let row = []
        const data = this.state.claimsList;
        process.env.NODE_ENV == 'development' && console.log("", data)
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.name}</td>
                    <td className="list-item-style">{moment(d.date).format('DD/MM/YYYY')}<br />{moment(d.date).format('h:m a')}</td>
                    <td className={"list-item-style " + (d.status == 'SentToQnxt' || d.status == 'Accepted' ? 'green ' : (d.status == 'Rejected' ? 'red ' : ''))}>{d.status}</td>
                    <td className="list-item-style">{d.submitter}</td>
                    <td className="list-item-style">{d.dCount}</td>
                </tr>
            )
        });

        return (
            <table className="table table-bordered claim-list">
                {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderTableHeader() : null}
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }

    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
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

    handleStartChange(date) {
        this.setState({
            startDate: date
        });
        setTimeout(() => {

            this._getClaimCounts()
            this.getListData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {

            this._getClaimCounts()
            this.getListData()
        }, 50);
    }

    onSelect(event, key) {
        console.log(event.target.options[event.target.selectedIndex].value)
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
        setTimeout(() => {
            this._refreshScreen()
        }, 50);
    }

    MonthsEvent(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {

        }, 50);
    }
    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this._getClaimCounts()
            this.getListData()
        })
    }



    onHandleChange(e) {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            }, () => {

            })
        }, 300);
    }
    update = (key, value) => {

        this.setState({
            [key]: value,
            selected_FileID: 0
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (


            <Filters
                isSubmitter={false}
                isTimeRange={true}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }
    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }


    handlePageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getListData()
        })
    }


    renderList() {
        let row = []
        const data = this.state.claimsList;

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>
                        <a style={{ color: "#6AA2B8", cursor: "pointer" }}
                            onClick={() => {
                                this.setState({
                                    incoming_fileId: d.FileID
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            }}>
                            {d.FileID}
                        </a>
                    </td>
                    <td className="list-item-style">{moment(d.FileDate).format('MM/DD/YYYY ')}<br />{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style">{d.TotalClaim}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                    <td className="list-item-style">{d.RemittanceFileName}</td>
                    <td className="list-item-style">{moment(d.RemittanceSentDate).format('MM/DD/YYYY ')}<br />{moment(d.RemittanceSentDate).format('hh:mm a')}</td>
                    {/* <td className="list-item-style"></td> */}
                    <td className="list-item-style"></td>
                    {/* <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.Receiver}</td> */}
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderTableHeader() : null}
                    <tbody>
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
        );
    }

    _getOtherCounts = async (policy) => {
        let query = `{
            CompareAuditFileDashboardTablePolicywise (PolicyType:"${policy}",FileName:"") {
                ActiveDeltaAdd
                TermbyAbsence
                MissingPCP
                TermedPCP
                Duplicate
                SameGenderTwin
                RateCodeMismatch
                dobMisMatch
                addressMismatch
                genderMismatch
                ethinicityMismatch
                telephoneMismatch
          }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (policy == 'MOLINA') {
                    this.setState({
                        molina_ActiveDeltaAdd: res.data.CompareAuditFileDashboardTablePolicywise[0].ActiveDeltaAdd,
                        molina_TermbyAbsence: res.data.CompareAuditFileDashboardTablePolicywise[0].TermbyAbsence,
                        molina_MissingPCP: res.data.CompareAuditFileDashboardTablePolicywise[0].MissingPCP,
                        molina_TermedPCP: res.data.CompareAuditFileDashboardTablePolicywise[0].TermedPCP,
                        molina_Duplicate: res.data.CompareAuditFileDashboardTablePolicywise[0].Duplicate,
                        molina_SameGenderTwin: res.data.CompareAuditFileDashboardTablePolicywise[0].SameGenderTwin,
                        molina_RateCodeMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].RateCodeMismatch,
                        molina_dobMisMatch: res.data.CompareAuditFileDashboardTablePolicywise[0].dobMisMatch,
                        molina_addressMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].addressMismatch,
                        molina_genderMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].genderMismatch,
                        molina_ethinicityMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].ethinicityMismatch,
                        molina_telephoneMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].telephoneMismatch,
                    })
                } else if (policy == 'MOL IMED') {
                    this.setState({
                        mol_imed_ActiveDeltaAdd: res.data.CompareAuditFileDashboardTablePolicywise[0].ActiveDeltaAdd,
                        mol_imed_TermbyAbsence: res.data.CompareAuditFileDashboardTablePolicywise[0].TermbyAbsence,
                        mol_imed_MissingPCP: res.data.CompareAuditFileDashboardTablePolicywise[0].MissingPCP,
                        mol_imed_TermedPCP: res.data.CompareAuditFileDashboardTablePolicywise[0].TermedPCP,
                        mol_imed_Duplicate: res.data.CompareAuditFileDashboardTablePolicywise[0].Duplicate,
                        mol_imed_SameGenderTwin: res.data.CompareAuditFileDashboardTablePolicywise[0].SameGenderTwin,
                        mol_imed_RateCodeMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].RateCodeMismatch,
                        mol_imed_dobMisMatch: res.data.CompareAuditFileDashboardTablePolicywise[0].dobMisMatch,
                        mol_imed_addressMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].addressMismatch,
                        mol_imed_genderMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].genderMismatch,
                        mol_imed_ethinicityMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].ethinicityMismatch,
                        mol_imed_telephoneMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].telephoneMismatch,
                    })
                } else if (policy == 'MOLCHIP') {
                    this.setState({
                        molchip_ActiveDeltaAdd: res.data.CompareAuditFileDashboardTablePolicywise[0].ActiveDeltaAdd,
                        molchip_TermbyAbsence: res.data.CompareAuditFileDashboardTablePolicywise[0].TermbyAbsence,
                        molchip_MissingPCP: res.data.CompareAuditFileDashboardTablePolicywise[0].MissingPCP,
                        molchip_TermedPCP: res.data.CompareAuditFileDashboardTablePolicywise[0].TermedPCP,
                        molchip_Duplicate: res.data.CompareAuditFileDashboardTablePolicywise[0].Duplicate,
                        molchip_SameGenderTwin: res.data.CompareAuditFileDashboardTablePolicywise[0].SameGenderTwin,
                        molchip_RateCodeMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].RateCodeMismatch,
                        molchip_dobMisMatch: res.data.CompareAuditFileDashboardTablePolicywise[0].dobMisMatch,
                        molchip_addressMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].addressMismatch,
                        molchip_genderMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].genderMismatch,
                        molchip_ethinicityMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].ethinicityMismatch,
                        molchip_telephoneMismatch: res.data.CompareAuditFileDashboardTablePolicywise[0].telephoneMismatch,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }


    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
                  CompareAuditFileDashboardTable (FileName:"${this.state.selected_FileID}" ,PolicyType:"") {
                    ActiveDeltaAdd
                    TermbyAbsence
                    MissingPCP
                    TermedPCP
                    Duplicate
                    SameGenderTwin
                    RateCodeMismatch
                    dobMisMatch
                    addressMismatch
                    genderMismatch
                    ethinicityMismatch
                    telephoneMismatch
                  }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
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
                    RowData_Enrollment: res.data.Compare834AuditFileDetails,
                    ActiveDeltaAdd: res.data.CompareAuditFileDashboardTable[0].ActiveDeltaAdd,
                    TermbyAbsence: res.data.CompareAuditFileDashboardTable[0].TermbyAbsence,
                    MissingPCP: res.data.CompareAuditFileDashboardTable[0].MissingPCP,
                    TermedPCP: res.data.CompareAuditFileDashboardTable[0].TermedPCP,
                    Duplicate: res.data.CompareAuditFileDashboardTable[0].Duplicate,
                    SameGenderTwin: res.data.CompareAuditFileDashboardTable[0].SameGenderTwin,
                    RateCodeMismatch: res.data.CompareAuditFileDashboardTable[0].RateCodeMismatch,
                    dobMisMatch: res.data.CompareAuditFileDashboardTable[0].dobMisMatch,
                    addressMismatch: res.data.CompareAuditFileDashboardTable[0].addressMismatch,
                    genderMismatch: res.data.CompareAuditFileDashboardTable[0].genderMismatch,
                    ethinicityMismatch: res.data.CompareAuditFileDashboardTable[0].ethinicityMismatch,
                    telephoneMismatch: res.data.CompareAuditFileDashboardTable[0].telephoneMismatch,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    gettiles = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            
            Compare834AuditFileDahsboardCount (FileName:"${this.state.selected_FileID}"){
                TotalX12
                Active
                TotalQnxt
                FoundInQNXT
                Audit
                Add
                Change
                Term
                Reinstate
                ActiveDeltaAdd
                TermbyAbsence
                ChangeDeltaAdd
                TermDelta
                RenDeltaAdd
                }
               
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let summary = []
                let data = res.data.Compare834AuditFileDahsboardCount[0]


                summary = [

                    { name: 'Total', value: data.TotalX12 },
                    { name: 'Audit', value: data.Audit },
                    { name: 'Add', value: data.Add },
                    { name: 'Change', value: data.Change },
                    { name: 'Term', value: data.Term },
                    { name: 'Reinstate', value: data.Reinstate },
                    { name: 'In QNXT', value: data.TotalQnxt },
                    { name: 'Add Delta', value: data.ActiveDeltaAdd },
                    { name: 'Change Delta', value: data.ChangeDeltaAdd },
                    { name: 'Term Delta', value: data.TermDelta },
                    { name: 'Reinstate Delta', value: data.RenDeltaAdd },
                    { name: 'Term by Absence', value: data.TermbyAbsence },
                    // { name: 'Active', value: data.Active },
                    // { name: 'Total Qnxt', value: data.TotalQnxt },
                    // { name: 'Found In QNXT', value: data.FoundInQNXT },
                    // { name: 'Active Delta Add', value: data.ActiveDeltaAdd },
                    // { name: 'Term by Absence', value: data.TermbyAbsence },
                ]
                process.env.NODE_ENV == 'development' && console.log(summary)
                this.setState({
                    summaryCount: summary,


                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    // getSecond_tiles = async () => {
    //     let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
    //     let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
    //     let query = `{
            
    //         Compare834AuditFileDetails(FileName:"${this.state.selected_FileID}" ,QNXTStatus1:"${this.state.QNXTStatus1}" ,QNXTStatus2:"${this.state.QNXTStatus2}") {
    //             memid
    // enrollid
    // SubscriberNo
    // FirstName
    // LastName
    // MiddleIntial
    // dob
    // Gender
    // StreetAddress
    // zip
    // City
    // State
    // Telephone
    // ethnicid
    // ratecode
    // primarylanguage
    // planname
    // Qeffdate
    // QnxtStatus1
    // QnxtStatus2
    // Qendate
    // deathdate
    // x12StreetAddress
    // enrolltype
    // ssn
    // telephoneMismatch
    // x12Sex
    // fileenddate
    // segtype
    // dhsloadmonth
    // filestartdate
    // x12Ethnicid
    // planid
    // MonthlyFileStatus
    // x12City
    // x12Dob
    // x12Zip
    // Qnxtloadmonth
    // SeqID
    // programid
    // LoadMonth
    // FullFile
    // SFHPID
    // LoadDateTime
    // OtherID
    // ReconcileRuntime
    // x12Telephone
    // inDHS
    // inQnxt
    // qcsiid
    // x12State
    //           }
               
    //     }`
    //     if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
    //     fetch(Urls._transaction834, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json',
    //         },
    //         body: JSON.stringify({ query: query })
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             this.setState({

    //                 RowData_Enrollment: res.data.Compare834AuditFileDetails,


    //             })
    //         })
    //         .catch(err => {
    //             process.env.NODE_ENV == 'development' && console.log(err)
    //         })
    // }
    getSecond_tiles = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            Compare834FileDetailsTotal(FileName:"${this.state.selected_FileID}",inDHS:"${this.state.inDHS}",inQnxt:"${this.state.inQnxt}",Add:"${this.state.Add}",Audit:"${this.state.Audit}",MonthlyStatus:"${this.state.MonthlyStatus}" ,QNXTStatus1:"${this.state.QNXTStatus1}", QNXTStatus2:"${this.state.QNXTStatus2}") {
                memid
                enrollid
                SubscriberNo
                FirstName
                LastName
                MiddleIntial
                dob
                Gender
                StreetAddress
                zip
                City
                State
                Telephone
                ethnicid
                ratecode
                primarylanguage
                planname
                Qeffdate
                QnxtStatus1
                QnxtStatus2
                Qendate
                deathdate
                x12StreetAddress
                enrolltype
                ssn
                telephoneMismatch
                x12Sex
                fileenddate
                segtype
                dhsloadmonth
                filestartdate
                x12Ethnicid
                planid
                MonthlyFileStatus
                x12City
                x12Dob
                x12Zip
                Qnxtloadmonth
                SeqID
                programid
                LoadMonth
                FullFile
                SFHPID
                LoadDateTime
                OtherID
                ReconcileRuntime
                x12Telephone
                inDHS
                inQnxt
                qcsiid
                x12State
              }
               
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
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

                    RowData_Enrollment: res.data.Compare834FileDetailsTotal,


                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    renderGoogleStackedBarChart() {

        return (

            <div className="row">
                <div className="chart-container1 chart">

                    <Chart1
                        width={'200px'}
                        height={'400px'}
                        chartType="BarChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['City', 'Country', 'Month', { role: 'annotation' }],
                            ['USA', 81750, 80080, 'USA'],
                            ['India', 37920, 36940, 'India'],
                            ['China', 26950, 28960, 'China'],
                            ['Ukraine', 20990, 19530, 'Ukraine'],
                            ['Philadelphia', 15260, 15170, 'Philadelphia'],
                        ]}
                        options={{
                            title: '835 Data Quality',
                            chartArea: { width: '100%' },
                            colors: ['#139DC9', '#42b0d3'],
                            hAxis: {
                                minValue: 0,
                            },
                            vAxis: {
                            },
                            isStacked: true
                        }}
                        // For tests
                        rootProps={{ 'data-testid': '4' }}
                    />
                </div>
            </div>
        );
    }


    renderChartJSPieChart() {
        const data = {
            labels: this.state.labelArray,
            datasets: [{
                data: this.state.pieArray,
                backgroundColor: [
                    '#139DC9', '#42b0d3'
                ],
                hoverBackgroundColor: [
                    'var(--main-bg-color)',
                    'var(--cyan-color)',
                    'var(--hex-color)',
                    'var(--pacific-blue-color)',
                ]
            }],
            flag: ''
        };
        return (
            <div>
                <Pie data={data}
                    options={{
                        elements: {
                            arc: {
                                borderWidth: 0
                            }
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }}
                    width={200}
                    height={150} />
            </div>
        )
    }

    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryCount
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
            let subtitle = ''
            let availitySent = ''
            let loadStatus = ''
            let url = ''
            let data = []


            if (item.name == 'Add') {
                addon = '/accept'
                claimStatus = ''

                subtitle = ""
            } else if (item.name == 'Term') {
                claimStatus = 'Error'
                subtitle = "Total Errors"
            } else if (item.name == 'Changes') {
                claimStatus = 'Ready to Resubmit'
                subtitle = "Resubmit"
            }
            data = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    transactionId: 'n',
                    status: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent
                },
            ]

            // if (item.name == '999 Received') {
            //     data = [{ flag999: '0' }]
            //     url = Strings.Inbound_response_999
            // }
            row.push(
                <Tiles
                    // isClickable={
                    //     item.name != 'Error Resolved'
                    // }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    isenrollment={true}
                    second_val={item.second_val}

                    url={url ? url : Strings.claimsDashboard_834_details}
                />

            )
        });

        return (
            <div className="row padding-left">
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
            let subtitle = ''
            let availitySent = ''
            let color = "var(--red)"
            let Status = ''

            if (item.name == 'Add Delta') {
                claimStatus = '021'
                subtitle = "Add"
                Status = ''
                color = "var(--blue)"
            } else if (item.name == 'Change Delta') {
                claimStatus = '024'
                subtitle = "Term"
                Status = ''
                color = "var(--green)"
            } else if (item.name == 'Term Delta') {
                claimStatus = '001'
                subtitle = "Change"
                color = "var(--orange)"
                Status = ''
            }
            else if (item.name == 'Reinstate Delta') {
                claimStatus = ''
                Status = ''
                subtitle = "HiPaaS Count"
                color = "var(--green)"
            }
            else if (item.name == 'Term by Absence') {
                Status = 'Error'
                claimStatus = ''
                subtitle = " Enrollment Errors"
                color = "var(--red)"

            }
            else if (item.name == 'Resubmit Count') {
                Status = 'Ready to Resubmit'
                claimStatus = ''
                subtitle = "Resubmit Count"
                color = "var(--green)"

            }


            let sendData = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    transactionId: 'n',
                    status: Status,
                    MaintenanceCode: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                },
            ]

            row.push(
                <TableTiles
                    item={item}
                    // url={Strings.claimsDashboard_834_details}
                    data={sendData}
                // color={color}
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
            { header: 'Demographics Mismatch', },
            { 'name': 'Address Mismatch', 'value': this.state.addressMismatch, 'isClick': true },
            { 'name': 'Dob MisMatch', 'value': this.state.dobMisMatch, 'isClick': true },
            { 'name': 'Ethinicity Mismatch', 'value': this.state.ethinicityMismatch, 'isClick': true },
            // { 'name': 'Termed PCP', 'value': this.state.TermedPCP },
            // { 'name': 'Duplicate', 'value': this.state.Duplicate, 'isClick': true },
            // { 'name': 'Same Gender Twin', 'value': this.state.SameGenderTwin, 'isClick': true },
            // { 'name': 'RateCode Mismatch', 'value': this.state.RateCodeMismatch, 'isClick': true },

            // { 'name': 'Duplicate', 'value': this.state.Duplicate, 'isClick': true },
            // { 'name': 'Address Mismatch', 'value': this.state.addressMismatch, 'isClick': true },
            // { 'name': 'Gender Mismatch', 'value': this.state.genderMismatch, 'isClick': true },

            // { 'name': 'Telephone Mismatch', 'value': this.state.telephoneMismatch, 'isClick': true },

        ]
        let stage_2 = [
            { 'header': 'PCP' },
            { 'name': 'Term PCP', 'value': this.state.TermedPCP, 'isClick': true },
            { 'name': 'Missing PCP', 'value': this.state.MissingPCP, 'isClick': true },

            // { 'name': 'Termed PCP', 'value': this.state.molina_TermedPCP },
            // { 'name': 'Duplicate', 'value': this.state.molina_Duplicate, 'isClick': true },
            // { 'name': 'Same Gender Twin', 'value': this.state.molina_SameGenderTwin, 'isClick': true },
            // { 'name': 'RateCode Mismatch', 'value': this.state.molina_RateCodeMismatch, 'isClick': true },
            // { 'name': 'Dob MisMatch', 'value': this.state.molina_dobMisMatch, 'isClick': true },
            // { 'name': 'Duplicate', 'value': this.state.molina_Duplicate, 'isClick': true },
            // { 'name': 'Address Mismatch', 'value': this.state.molina_addressMismatch, 'isClick': true },
            // { 'name': 'Gender Mismatch', 'value': this.state.molina_genderMismatch, 'isClick': true },
            // { 'name': 'Ethinicity Mismatch', 'value': this.state.molina_ethinicityMismatch, 'isClick': true },
            // { 'name': 'Telephone Mismatch', 'value': this.state.molina_telephoneMismatch, 'isClick': true },
        ]

        let stage_3 = [
            { 'header': 'Duplicate Or Hold' },
            { 'name': 'Duplicate', 'value': this.state.Duplicate, 'isClick': true },
            { 'name': 'Same Gender Twin', 'value': this.state.SameGenderTwin, 'isClick': true },
            // { 'name': 'Missing PCP', 'value': this.state.mol_imed_MissingPCP, 'isClick': true },
            // { 'name': 'Termed PCP', 'value': this.state.mol_imed_TermedPCP },
            // { 'name': 'Duplicate', 'value': this.state.mol_imed_Duplicate, 'isClick': true },
            // { 'name': 'Same Gender Twin', 'value': this.state.mol_imed_SameGenderTwin, 'isClick': true },
            // { 'name': 'RateCode Mismatch', 'value': this.state.mol_imed_RateCodeMismatch, 'isClick': true },
            // { 'name': 'Dob MisMatch', 'value': this.state.mol_imed_dobMisMatch, 'isClick': true },
            // { 'name': 'Duplicate', 'value': this.state.mol_imed_Duplicate, 'isClick': true },
            // { 'name': 'Address Mismatch', 'value': this.state.mol_imed_addressMismatch, 'isClick': true },
            // { 'name': 'Gender Mismatch', 'value': this.state.mol_imed_genderMismatch, 'isClick': true },
            // { 'name': 'Ethinicity Mismatch', 'value': this.state.mol_imed_ethinicityMismatch, 'isClick': true },
            // { 'name': 'Telephone Mismatch', 'value': this.state.mol_imed_telephoneMismatch, 'isClick': true },

        ]
        let stage_4 = [
            { 'header': 'Rate Code Delta' },
            { 'name': 'Rate Code Mismatch', 'value': this.state.RateCodeMismatch, 'isClick': true },
            // { 'name': 'Molina', 'value': this.state.molchip_TermbyAbsence, 'isClick': true },
            // { 'name': 'Molina IMED', 'value': this.state.molchip_MissingPCP, 'isClick': true },
            //  { 'name': 'Termed PCP', 'value': this.state.molchip_TermedPCP },
            // { 'name': 'Duplicate', 'value': this.state.molchip_Duplicate, 'isClick': true },
            // { 'name': 'Same Gender Twin', 'value': this.state.molchip_SameGenderTwin, 'isClick': true },
            // { 'name': 'RateCode Mismatch', 'value': this.state.molchip_RateCodeMismatch, 'isClick': true },
            // { 'name': 'Dob MisMatch', 'value': this.state.molchip_dobMisMatch, 'isClick': true },
            // { 'name': 'Duplicate', 'value': this.state.molchip_Duplicate, 'isClick': true },
            // { 'name': 'Address Mismatch', 'value': this.state.molchip_addressMismatch, 'isClick': true },
            // { 'name': 'Gender Mismatch', 'value': this.state.molchip_genderMismatch, 'isClick': true },
            // { 'name': 'Ethinicity Mismatch', 'value': this.state.molchip_ethinicityMismatch, 'isClick': true },
            // { 'name': 'Telephone Mismatch', 'value': this.state.molchip_telephoneMismatch, 'isClick': true },

        ]
        let stage_5 = [
            { 'header': 'Dual Plan Delta' },
            // { 'name': 'EXT', 'value': this.state.RateCodeMismatch },
            { 'name': 'Rate Code Delta', 'value': this.state.RateCodeMismatch },
            // { 'name': 'Molina', 'value': this.state.molchip_TermbyAbsence, 'isClick': true },
            // { 'name': 'Molina IMED', 'value': this.state.molchip_MissingPCP, 'isClick': true },
            //  { 'name': 'Termed PCP', 'value': this.state.molchip_TermedPCP },
            // { 'name': 'Duplicate', 'value': this.state.molchip_Duplicate, 'isClick': true },
            // { 'name': 'Same Gender Twin', 'value': this.state.molchip_SameGenderTwin, 'isClick': true },
            // { 'name': 'RateCode Mismatch', 'value': this.state.molchip_RateCodeMismatch, 'isClick': true },
            // { 'name': 'Dob MisMatch', 'value': this.state.molchip_dobMisMatch, 'isClick': true },
            // { 'name': 'Duplicate', 'value': this.state.molchip_Duplicate, 'isClick': true },
            // { 'name': 'Address Mismatch', 'value': this.state.molchip_addressMismatch, 'isClick': true },
            // { 'name': 'Gender Mismatch', 'value': this.state.molchip_genderMismatch, 'isClick': true },
            // { 'name': 'Ethinicity Mismatch', 'value': this.state.molchip_ethinicityMismatch, 'isClick': true },
            // { 'name': 'Telephone Mismatch', 'value': this.state.molchip_telephoneMismatch, 'isClick': true },

        ]



        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
                {this._renderClaimTables(stage_4)}
                {this._renderClaimTables(stage_5)}
            </div>
        )
    }

    renderTopbar() {
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
                        <div className="list-dashboard">Time Range</div>
                        <select
                            className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                let day = 0
                                let chartType = ''
                                let selected_val = event.target.options[event.target.selectedIndex].text

                                if (selected_val == 'Last week') {
                                    day = 7
                                    chartType = 'Datewise'
                                } else if (selected_val == 'Last 30 days') {
                                    day = 30
                                    chartType = 'Weekwise'
                                } else if (selected_val == 'Last 90 days') {
                                    day = 90
                                } else if (selected_val == 'Last 180 days') {
                                    day = 180
                                } else if (selected_val == 'Last year') {
                                    day = 365
                                }

                                let startDate = moment().subtract(day, 'd').format('YYYY-MM-DD')
                                let endDate = moment().format('YYYY-MM-DD')

                                if (!selected_val) {
                                    startDate = ''
                                    endDate = ''
                                }

                                this.setState({
                                    startDate: startDate,
                                    endDate: endDate,
                                    selected_val: selected_val,
                                    chartType: chartType
                                })

                                setTimeout(() => {

                                    this._getClaimCounts()
                                    this.getListData()
                                }, 50);
                            }}
                        >
                            <option value="1">Last week</option>
                            <option value="2">Last 30 days</option>
                            <option value="2">Last 90 days</option>
                            <option value="2" selected="selected">Last 180 days</option>
                            <option value="2">Last year</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleStartChange}
                            maxDate={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleEndChange}
                            minDate={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderValues(piechart_data) {
        let row = []
        let data = piechart_data.labels
        let colors = piechart_data.datasets[0].backgroundColor
        let count = 0
        data.forEach(item => {
            row.push(
                <div className="row" style={{ paddingLeft: '12px', fontSize: '11px', marginTop: '4px', color: '#8598aa', alignItems: 'center' }}>
                    <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '6px' }}></div><div>{item.length > 40 ? (item.substr(0, 40) + '...') : item}</div>
                </div>
            )
            count++
        })
        return (
            <div style={{ marginTop: '16px' }}>
                {row}
            </div>
        )
    }

    renderPieChart = (header, piechart_data) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let addon = ''
        let claimStatus = ''
        let loadStatus = ''
        let generalStatus = ''
        let subtitle = ''
        if (header == 'Top 10 File Level Errors') {
            claimStatus = 'Error'
            subtitle = "Files in Error"
        } else if (header == 'Top 10 Claim Level Errors') {
            addon = '/reject'
            generalStatus = 'Rejected'
        }

        let sendData = [
            {
                flag: addon,
                State: State,
                selectedTradingPartner: selectedTradingPartner,
                startDate: startDate,
                endDate: endDate,
                transactionId: 'n',
                status: claimStatus,
                type: type,
                subtitle: subtitle
            },
        ]

        return (
            <PieChart

                header={header}
                piechart_data={piechart_data}
                data={sendData}
                height={12}
                onClick={header == 'Top 10 File Level Errors' ? this.gotoClaimDetails : ''}
            />
        )
    }

    renderAllPieCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-8" style={{ padding: '6px' }}>
                        {this.renderPieChart('Top 10 File Level Errors', this.state.second_data)}
                    </div>
                </div>
            </div>
        )
    }

    renderCompliance = () => {
        return (
            <div className="col-6" style={{ padding: '6px' }}>
                {this.renderPieChart('', this.state.complaince_data)}
            </div>
        )
    }

    _renderList = () => {

        let columnDefs = [
            // { headerName: "Member Id", field: "memid", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "Enrollment Id", field: "enrollid", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Subscriber No", field: "SubscriberNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            { headerName: "First Name", field: "FirstName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            { headerName: "Last Name", field: "LastName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            
            { headerName: "Qnxt Status1", field: "QnxtStatus1", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Qnxt Status2", field: "QnxtStatus2", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Eff Date", field: "Qeffdate", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT End Date", field: "Qendate", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            
            { headerName: "QNXT Dob", field: "dob", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Dob", field: "x12Dob", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Gender", field: "Gender", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Gender", field: "x12Sex", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "QNXT Street Address", field: "StreetAddress", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Street Address", field: "x12StreetAddress", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Zip", field: "zip", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Zip", field: "x12Zip", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT City", field: "City", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 City", field: "x12City", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT State", field: "State", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 State", field: "x12State", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Telephone", field: "Telephone", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Telephone", field: "x12Telephone", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

            { headerName: "Ethnic Id", field: "ethnicid", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Ethnic Id", field: "x12Ethnicid", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Rate Code", field: "ratecode", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Primary Language", field: "primarylanguage", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Plan Name", field: "planname", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
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
                        rowData={this.state.RowData_Enrollment}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'File Name') {
                                this.setState({
                                    incoming_fileId: event.data.FileID
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    gotoClaimDetails = (data) => {

        let sendData = []
        if (data && data.length > 0) {
            sendData = data
        } else {
            let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
            let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
            let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
            let State = this.state.State ? this.state.State : 'n'
            let type = this.state.type ? this.state.type : ''

            sendData = [
                {
                    flag: '',
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: "",
                    type: type,
                    incoming_fileId: this.state.incoming_fileId,
                },
            ]
        }

        this.props.history.push('/' + Strings.claimsDashboard_834_details, {
            data: sendData
        })
    }
    getFilename() {
        let query = `{
            GetFileName834(State:"${this.state.State}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `") {
                FileID
                FileName
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction834, {
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
                        FileName: res.data.GetFileName834 ? res.data.GetFileName834 : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    FileName() {
        let row = []

        this.state.FileName.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value={element.FileID} selected={this.state.selected_FileID == element.FileName ? element.FileName : ''}>{element.FileName}</option>)
            // row.push(<option selected={this.state.selected_FileID == element.FileID ? element.FileID : ''}>{element.FileName}</option>)
        })
        return row
    }

    render() {

        return (
            <div>
                <h5 className="headerText">Enrollment Details</h5>

                <div className="row">
                    <div className="col-12">

                        {/* {this._renderTopbar()} */}

                        <div className="col-4" style={{ padding: "0px" }}>
                            <div className="list-dashboard">File Name</div>
                            <select className="form-control list-dashboard" id="FileName"
                                onChange={(event) => {
                                    this.onSelect(event, 'selected_FileID')
                                }}>
                                <option value="select"></option>
                                <option selected={this.state.selected_FileID == '834_UT_Audit.da' ? "selected" : ''} value="834_UT_Audit.da">834_UT_Audit.da</option>
                                <option selected={this.state.selected_FileID == '834_UT_Daily.da' ? "selected" : ''} value="834_UT_Daily.da">834_UT_Daily.da</option>
                                {/* {this.FileName()} */}
                            </select>
                            {/* <input type="text" name="name" value={this.state.selected_FileID} className="form-control list-dashboard"  /> */}
                        </div>


                    </div>


                </div>
                <div className="row">
                    <div className="col-12">
                        {this._renderList()}
                        {/* {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderList() : null}     */}
                    </div>
                </div>
            </div>
        );
    }
}
