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

import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    AreaSeries,
    PieSeries,
    Title,
    Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { ArgumentScale, Animation } from '@devexpress/dx-react-chart';
import {
    curveCatmullRom,
    area,
} from 'd3-shape';
import { scalePoint } from 'd3-scale';

const data = [
    { month: 'Jan', appStore: 101, googlePlay: 13 },
    { month: 'Feb', appStore: 89, googlePlay: 15 },
    { month: 'Mar', appStore: 107, googlePlay: 20 },
    { month: 'Apr', appStore: 113, googlePlay: 17 },

];

const demoStyles = () => ({
    chart: {
        paddingRight: '20px',
        backgroundColor: ['grey', 'black'],
        fill: 'black'
    },
});

const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
        backgroundColor: ['grey', 'green'],
        fill: 'black'
    },
});
const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
);
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const legendLabelStyles = () => ({
    label: {
        whiteSpace: 'nowrap',
        backgroundColor: ['grey', 'blue'],
        fill: 'black'
    },
});
const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);


const Area = props => (
    <AreaSeries.Path
        {...props}
        path={area()
            .x(({ arg }) => arg)
            .y1(({ val }) => val)
            .y0(({ startVal }) => startVal)
            .curve(curveCatmullRom)}
    />
);


let val = ''
export class ClaimPaymentDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            summaryCount: [],
            totalFiles: [],
            second_data: {},
            pie_data: {},
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
            State: '',
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            ClaimBarChart: [],
            claimLabels: [],
            complience: [],
            data,
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
            TotalCountQnxt:0,
            progress_Validated: 0,
            progress_Error: 0, 
            gridType: 1,
            paginationPageSize: 10,
            domLayout: 'autoHeight',

            columnDefs: [
                { headerName: "QNXT File Name", field: "FileName", width: 100, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
                { headerName: "File Date", field: "FileDate", width: 100 },
                { headerName: "State", field: "State", width: 75 },
                { headerName: "Process Id", field: "ProcessID", width: 100 },
                { headerName: "Total", field: "TotalClaim", width: 75 },
                { headerName: "Rejected", field: "Rejected", width: 90 },
                { headerName: "Remittance sent", field: "RemittanceFileName", width: 100 },
                { headerName: "Remittance sent date", field: "RemittanceSentDate", width: 100 },
                // { headerName: "Compliance vs Submission date", field: "" },
                { headerName: "# of errors", field: "", width: 130 },

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
            },
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData: [],
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
        }


        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.showFile = this.showFile.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    componentDidMount() {
        this.getCommonData()
        this.getData()
        this.getListData()
        this._getCounts()
        this._getPieChartData()
        this._getClaimCounts()
    }

    getCommonData() {
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

    getData() {
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }

        let query = `{
            Claim835Dashboard {
              Claims837
              Claims835
              PendingClaims835
            }
            chart1:Claim835Status(ChartType: "PaymenttypeWise") {
                X_axis
                Y_axis
            }
            chart2:Claim835Status(ChartType: "StatusWise") {
                X_axis
                Y_axis
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
                let summary = []
                let data = res.data
                let claimLabels = []
                let pielabels = []
                let pievalues = []

                if (data.Claim835Dashboard && data.Claim835Dashboard.length > 0) {
                    summary = [
                        { name: '837 Claims', value: data.Claim835Dashboard[0].Claims837 ? data.Claim835Dashboard[0].Claims837 : '' },
                        { name: '835 Claims', value: data.Claim835Dashboard[0].Claims835 ? data.Claim835Dashboard[0].Claims835 : '' },
                        { name: 'Pending Claims', value: data.Claim835Dashboard[0].PendingClaims835 ? data.Claim835Dashboard[0].PendingClaims835 : '' },
                    ]
                }

                if (data.Claim835Status && data.Claim835Status.length > 0) {
                    data.Claim835Status.forEach(element => {
                        pielabels.push(element.X_axis)
                        pievalues.push(element.Y_axis)
                    });
                }

                this.setState({
                    summaryList: summary,
                    claimLabels: claimLabels,
                    pielabels: pielabels,
                    pievalues: pievalues,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
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
                <td className="table-head-text list-item-style">QNXT File Name</td>
                <td className="table-head-text list-item-style">File Date</td>
                <td className="table-head-text list-item-style">State</td>
                <td className="table-head-text list-item-style">Process Id</td>
                <td className="table-head-text list-item-style">Remittance sent</td>
                <td className="table-head-text list-item-style">Remittance sent date</td>
                {/* <td className="table-head-text list-item-style">Compliance vs Submission date</td> */}
                <td className="table-head-text list-item-style"># of errors</td>
                {/* <td className="table-head-text list-item-style">Receiver</td> */}
            </tr>
        )
    }

    getBarData(labelArray, dataArray, color) {
        let bardata = {
            labels: labelArray,
            showFile: false,
            datasets: [
                {
                    label: 'Total Claims',
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                    hoverBackgroundColor: color,
                    hoverBorderColor: color,
                    data: dataArray
                }
            ],
            legend: {
                display: false
            }
        }

        return bardata
    }



    renderMonthlyTrendsChart() {

        return (
            <div className="chart-div chart-container1 chart">
                <div className="row">

                    <div className="col-7">

                        <h6 > Volume - This Month trends</h6>
                    </div>


                </div>


                <Chart1
                    width={'700px'}
                    height={'300px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['x', 'EFT'],
                        [0, 0],
                        [1, 10],
                        [2, 23],
                        [3, 17],
                        [4, 18],
                        [5, 9],
                        [6, 11],
                        [7, 27],
                        [8, 33],
                        [9, 40],
                        [10, 32],
                        [11, 35],
                    ]}
                    options={{
                        series: {
                            0: { curveType: 'function' },
                        },
                        chartArea: { width: '100%' },

                        colors: ['#139DC9'],

                        fill: true
                    }}

                />

            </div>
        );
    }

    handleSort(e) {
        this.setState({
            type: e
        })
        setTimeout(() => {
            this.getData()
        }, 50);
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
            
                Dashboard835FileDetails(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",EndDt: "${endDate}",page:${this.state.page},OrderBy:"${this.state.orderby}" ,Status:"" , FileID:"" ,RecType:"Outbound") {
                    RecCount
                    Sender
                    Organization
                    FileID
                    FileName
                    CheckEFTNo
                    FileDate
                    PayerName
                    PayerID
                    AccountNo
                    CHECKEFTFlag
                    CheckEFTDt
                    Receiver
                    ProcessID
                    State
                    RemittanceFileName
                    RemittanceSentDate
                    TotalClaim
                    Rejected
                    Status
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.real_time_claim_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.Dashboard835FileDetails) {

                    if (res.data.Dashboard835FileDetails.length > 0) {

                        count = Math.floor(res.data.Dashboard835FileDetails[0].RecCount / 10)
                        if (res.data.Dashboard835FileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        
                    }

                    this.setState({
                        claimsList: res.data.Dashboard835FileDetails,
                        rowData: this.state.gridType == 1 ? res.data.Dashboard835FileDetails : [],
                        count: count
                    })
                }
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
            this.getData()
            this._getClaimCounts()
            this.getListData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {
            this.getData()
            this._getClaimCounts()
            this.getListData()
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

    MonthsEvent(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {
            this.getData()
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
                this.getData()
            })
        }, 300);
    }

    renderSummaryDetails() {
        let row = []
        let array = this.state.summaryList
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270 + '/' + apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''




        return (


            <div className="row padding-left">


                {/* <div className="col-2 summary-container">
            <div className="summary-header"> # of claims</div>
            <div  className= 'blue summary-title' >
            449k
            </div>
        </div> */}

                <div className="col summary-container">
                    <div className="summary-header">   Total # of 835</div>
                    <div className='green summary-title' >
                        426k
        </div>
                </div>

                <div className="col summary-container">
                    <div className="summary-header">  Partial</div>
                    <div className='blue summary-title' >
                        33k
        </div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">  Denied</div>
                    <div className='red summary-title' >
                        2k
        </div>
                </div>
                <div className="col summary-container">
                    <div className="summary-header">  Pending</div>
                    <div className='orange summary-title' >
                        1k
        </div>
                </div>
            </div>



        )
    }

    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }

    renderTransactionsNew(flag) {


        let data = this.state.files_list ? this.state.files_list : []
        let headerArray = []
        let rowArray = []
        headerArray.push(
            { value: 'File Generated/Created', upScale: 1 },
            { value: 'File Created Date' },
            { value: 'Remittance sent' },
            { value: 'Remittance sent date' },
            { value: 'Compliance vs Submission date' },
            { value: '# of errors' },
            { value: 'Receiver' }
        )



        rowArray.push(
            { value: 'File_Generated', upScale: 1 },
            { value: 'File_Created_Date', isDate: 1, isNottime: 1 },
            { value: 'Remittance_sent' },
            { value: 'Remittance_sent_date' },
            { value: 'Compliance_vs_Submission_date' },
            { value: 'no_of_errors' },
            { value: 'Receiver' }

        )

        data = [
            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'


            },

            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'


            },

            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'


            },

            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'


            },

            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'
            },

            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'
            },


            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'

            },


            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'

            },

            {
                File_Generated: '99090023232.txt',
                File_Created_Date: 1582810469000,
                Remittance_sent: '99090023232.txt',
                Remittance_sent_date: 1582810469000,
                Compliance_vs_Submission_date: 1582810469000,

                no_of_errors: 2,
                Receiver: 'TRICARE FOR LIFE'

            }





        ]

        if (flag) {

            return (
                <CommonTable
                    headerArray={headerArray}
                    rowArray={rowArray}
                    data={data}
                    count={this.state.count}
                    handlePageClick={this.handlePageClick}
                    onClickKey={'HiPaaSUniqueID'}
                    onClick={this.onClick1}
                />
            )
        }
        else {

            return (
                <CommonTable
                    headerArray={headerArray}
                    rowArray={rowArray}
                    data={data}
                    count={this.state.count}
                    handlePageClick={this.handlePageClick}
                    onClickKey={'HiPaaSUniqueID'}
                    onClick={this.onClick}
                />
            )

        }
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
                    <td style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>{d.FileName}</td>
                    <td className="list-item-style">{moment(d.FileDate).format('MM/DD/YYYY ')}<br />{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style">{d.ProcessID}</td>
                    <td className="list-item-style">{d.RemittanceFileName}</td>
                    <td className="list-item-style">{d.RemittanceSentDate}</td>
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
    renderGraphs() {

        const data = [
            ["Year", "Avg days for submission", { role: "style" }],
            ["2010", 10, "color: grey"],
            ["2020", 14, "color: grey"],
            ["2030", 16, "color: grey"],
            ["2040", 22, "color: grey"],
            [
                "2050",
                28,
                "stroke-color: grey; stroke-opacity: 0.6; stroke-width: 2; fill-color: grey; fill-opacity: 0.2"
            ]
        ];

        const options = {
            title: 'Average days for submission',
            chartArea: { width: '20%' },
            colors: ['lightgrey'],
            hAxis: {
                title: 'Total Population',
                minValue: 0,
            },
            vAxis: {
                title: '',
            },
        };

        return (

            <div className="chart-container2 chart chart-div">

                <div style={{ color: "grey" }} className="row">

                    {/* <div className="col-4" style={{ padding: '0' }}>
                        <h6>Top 5 Providers</h6> */}
                    {/* <Chart1 chartType="Bar" width="100%" height="200px" data={data} options ={options} /> */}

                    {/* <Bar
                            data={this.getBarData(this.state.providerChartLabel, this.state.providerChartData, '#139DC9')}
                            width={100}
                            height={60}
                            options={{
                                legend: {
                                    display: false,
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            userCallback: function (label, index, labels) {
                                                // when the floored value is the same as the value we have a whole number
                                                if (Math.floor(label) === label) {
                                                    return label;
                                                }

                                            },
                                        }
                                    }],
                                },
                            }} />
                        <br /><br />

                        <p style={{ color: "grey" }} > Provider </p>

                        <div className="row">
                            <div className="col-9"> Kaiser </div>
                            <div className="col-3"> 128</div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />

                        <div className="row">
                            <div className="col-9"> Aetna </div>
                            <div className="col-3"> 96</div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />


                        <div className="row">
                            <div className="col-9"> Cigna </div>
                            <div className="col-3"> 64</div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} /> */}


                    {/* <div className ="row">
<div className="col-9"> BCBS </div>
<div className="col-3"> 16</div>
</div> */}
                    {/* <hr style ={{ borderColor : 'lightgrey'}}  /> */}
                    {/* </div> */}

                    <div className="col-5" style={{ padding: '0' }}>
                        <h6> EFT vs CHK </h6>
                        {/* <Chart1 chartType="Bar" width="100%" height="200px" data={data} options ={options} /> */}
                        <Bar
                            data={this.getBarData(this.state.ErrorChartLabel, this.state.ErrorChartData, '#139DC9')}
                            width={100}
                            height={60}
                            options={{
                                legend: {
                                    display: false,
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            userCallback: function (label, index, labels) {
                                                // when the floored value is the same as the value we have a whole number
                                                if (Math.floor(label) === label) {
                                                    return label;
                                                }

                                            },
                                        }
                                    }],
                                },
                            }} />
                        <br /><br />
                        <p style={{ color: "grey" }} > Provider </p>

                        <div className="row">
                            <div className="col-9"> Example 1 </div>
                            <div className="col-3"> 100% </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />

                        <div className="row">
                            <div className="col-9">  Example 2 </div>
                            <div className="col-3"> 86% </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />


                        <div className="row">
                            <div className="col-9"> Example 3 </div>
                            <div className="col-3"> 64% </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />


                        <div className="row">
                            <div className="col-9"> Example 4 </div>
                            <div className="col-3"> 16% </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />
                    </div>
                    <div className="col-1"></div>
                    <div className="col-5" style={{ padding: '0' }}>
                        <h6> Average # of Errors </h6>
                        {/* <Chart1 chartType="Bar" width="100%" height="200px" data={data} options ={options} /> */}
                        <Bar
                            data={this.getBarData(this.state.ErrorChartLabel, this.state.ErrorChartData, '#139DC9')}
                            width={100}
                            height={60}
                            options={{
                                legend: {
                                    display: false,
                                },
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            userCallback: function (label, index, labels) {
                                                // when the floored value is the same as the value we have a whole number
                                                if (Math.floor(label) === label) {
                                                    return label;
                                                }

                                            },
                                        }
                                    }],
                                },
                            }} />
                        <br /><br />
                        <p style={{ color: "grey" }} > Error Reason </p>

                        <div className="row">
                            <div className="col-9">   Negative numbers </div>
                            <div className="col-3"> 82 </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />


                        <div className="row">
                            <div className="col-9">  Charge exceeds fee </div>
                            <div className="col-3"> 18 </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />


                        <div className="row">
                            <div className="col-9"> Example  </div>
                            <div className="col-3"> 12 </div>
                        </div>
                        <hr style={{ borderColor: 'lightgrey' }} />
                    </div>
                </div>
            </div>
        )
    }

    renderCharts() {
        let Data = this.state.complience
        let pieLabel = []
        let pieData = []
        Data.forEach((d) => {
            pieLabel.push(d.Type)
            pieData.push(d.TotalCount)
        })
        const data = {
            labels: pieLabel,
            datasets: [{
                data: pieData,
                backgroundColor: [
                    '#139DC9',
                    '#daea00',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#daea00',
                ]
            }],
            flag: ''
        };

        return (
            <div className="row chart-div">
                <div className="chart-container chart col-12">
                    <div className="chart-header">Compliance</div>
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
                        width={130}
                        height={90} />

                </div>
            </div>
        )
    }


    // renderErrorChart() {
    //     return (
    //         <Pie data={second_data}
    //             options={{
    //                 elements: {
    //                     arc: {
    //                         borderWidth: 0
    //                     }
    //                 },
    //                 legend: {
    //                     display: false,
    //                 }
    //             }}
    //             width={100}
    //             height={60} />
    //     )
    // }

    // renderValues() {
    //     let row = []
    //     let data = second_data.labels
    //     let colors = second_data.datasets[0].backgroundColor
    //     let count = 0
    //     data.forEach(item => {
    //         row.push(
    //             <div className="row" style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', marginLeft: '60px', color: 'slategrey', alignItems: 'center' }}>
    //                 <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '12px' }}></div><div>{item}</div>
    //             </div>
    //         )
    //         count++
    //     })
    //     return (
    //         <div style={{ marginTop: '20px' }} className="row">
    //             {row}
    //         </div>
    //     )
    // }

    RenderMainErrorChart() {
        return (
            <div className="row chart-div">
                <div className="chart-container chart col-12">
                    <div style={{ fontWeight: '500' }}>Top Denial Reason codes</div><br />
                    {/* {this.renderErrorChart()} */}
                    {/* {this.renderValues()} */}
                </div>
            </div>
        )
    }

    renderMaterialChart() {


        const { data: chartData } = this.state;

        return (
            <Paper className={demoStyles.chart}>
                <Chart
                    className={demoStyles.chart}
                    data={chartData}

                >
                    <ArgumentScale factory={scalePoint} />
                    <ArgumentAxis />
                    <ValueAxis className={demoStyles.chart} />

                    <AreaSeries
                        className={demoStyles.chart}
                        name="Old claims"
                        valueField="appStore"
                        argumentField="month"
                        seriesComponent={Area}
                    />
                    <AreaSeries
                        className={demoStyles.chart}
                        name="Current Claims"
                        valueField="googlePlay"
                        argumentField="month"
                        seriesComponent={Area}
                    />
                    <Animation />
                    <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                    <Title text="Volume- This month's trends" />
                </Chart>
            </Paper>
        );

    }


    renderMaterialPieChart() {

        const pieData = [
            { country: 'Russia', area: 12, color: 'blue' },
            { country: 'Canada', area: 7, color: 'black' },
            { country: 'USA', area: 7 },

        ];

        return (

            <div>
                <Paper className={demoStyles.chart}>
                    <Chart
                        data={pieData}
                        options={{
                            colors: ['lightgrey', 'green', 'black']
                        }

                        }
                    >
                        <PieSeries
                            className={demoStyles.chart}
                            valueField="area"
                            argumentField="country"
                            options={{
                                colors: ['lightgrey', 'green', 'black']
                            }
                            }


                        />
                        <Title
                            text="Claim adjustment reason code"
                        />
                        <Animation />
                    </Chart>
                </Paper>
            </div>
        );

    }

    _getCounts = async () => {
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
                ERA835DashboardProgressBar(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                    Rejected
                    Accepted
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
                let summary = []
                let data = res.data.ERA835DashboardCountNew[0]
                let Validated = Number(res.data.ERA835DashboardProgressBar[0].Accepted).toFixed(2)
                let Error = Number(res.data.ERA835DashboardProgressBar[0].Rejected).toFixed(2)
                
                summary = [
                    { name: 'Received From QNXT', value: data.TotalCount },
                    { name: 'Vaildated', value: data.Accepted },
                    { name: 'Files in Error', value: data.Rejected },
                    { name: 'Error Resolved', value: 0 },
                    { name: 'Total Sent To Availity', value: data.Accepted },
                    { name: '999 Received', value: res.data.Total999Response835[0].Total999 },
                ]
                process.env.NODE_ENV == 'development' && console.log(summary)
                this.setState({
                    summaryCount: summary,
                    progress_Validated: Validated,
                    progress_Error: Error
                    // totalFiles: totalCount
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


    renderGooglePieChart(tittle, data, labels, colors) {


        return (

            <div className="row chart-div">
                <div className="chart-container1 chart">
                    <Chart1
                        width={'250px'}
                        height={'250px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Task', 'Hours per Day'],
                            ['Work', 11],
                            ['Eat', 2],
                            ['Commute', 2],
                            ['Watch TV', 2],
                            ['Sleep', 7],
                        ]}
                        options={{
                            title: tittle,
                            chartArea: { width: '100%' },
                            is3D: true,
                            series: { 5: { type: 'line' } },
                            legend: { position: 'top', textStyle: { color: 'blue', fontSize: 16 }, type: 'rectangle' },
                            legend: 'none'


                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </div>
            </div>

        );

    }


    _renderSummaryDetails() {
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
            let subtitle=''
            let loadStatus = ''
            let data = []
            if (item.name == 'Vaildated') {
                addon = '/accept'
                claimStatus = 'Validated'
                subtitle="Validated Files"
            } else if (item.name == 'Files in Error') {
                claimStatus = 'Error'
                subtitle="Files in Error"
            }  else {
                addon = '/other'
            }
            data = [
                { flag: addon, State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, transactionId: 'n', status: claimStatus,type:type , subtitle:subtitle},
            ]
            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Received From QNXT' &&
                         item.name != 'Error Resolved' &&
                         item.name != 'Total Sent To Availity' &&
                         item.name != '999 Received'
                      }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                url={Strings.claimPayment_835_details}
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
            let loadStatus = ''
            let generalStatus = ''
            let mcgStatus = ''
            let notSent = ''
            let subtitle = ''
            let status277CA = ''
            let color = "var(--red)"

            if (item.name == 'Accepted') {
                generalStatus = 'Accepted'
                subtitle = 'Accepted Claims'
                color = "var(--green)"
            } else if (item.name == 'Rejected') {
                generalStatus = 'Rejected'
                subtitle = "Rejected Claims"
            } else if (item.name == 'File Rejected') {
                generalStatus = 'File Rejected'
                subtitle = item.name
            } else if (item.name == 'Reconciled Error') {
                subtitle = item.name
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
                subtitle = item.name
                color = "var(--main-bg-color)"
            } else if (item.name == 'Load Error') {
                subtitle = item.name
                mcgStatus = 'Exception'
            } else if (item.name == '999 Not Sent') {
                notSent = 'Y'
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
                    notSent: notSent,
                    subtitle: subtitle,
                    status277CA: status277CA
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Claim_Details_837_Grid}
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
                TotalCount
              }

              ERA835DashboardCountPaymentStatus(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                X12Count
                HiPaaSCount
                MCGLoadCount
              }

                ERA835DashboardTable(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                  Accepted
                  Rejected
                  FileReject
                  Processing
                  ReconciledError
                  Loading
                  LoadedError
                  Accepted_277CA
                  Rejected_277CA
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
                    let _data = res.data.ERA835DashboardCountPaymentStatus[0]
                    let data2 = res.data.ERA835DashboardTable[0]
                    // let _data = res.data.Claim837RTDashboardTable[0]

                    this.setState({
                        CheckData: data ? data.Check : 0,
                        EFTData: data ? data.EFT : 0,
                        Rejected999: data2 ? data2.Rejected : 0,
                        Accepted999: data2 ? data2.Accepted : 0,
                        QNXT_Generated: _data ? _data.X12Count : 0,
                        Hipaas_Received: _data ? _data.HiPaaSCount : 0,
                        // TotalCountQnxt: data ? data.TotalCount: 0
                    },() =>{
                       this._getCounts() 
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
            { 'name': 'Total Number of Errors', 'value': 0 },
        ]
        let stage_2 = [
            { 'name': 'Sent to Availity', 'value': 6 },
            { 'name': 'Number of Acknowledged 835', 'value': 7 },
            { 'name': 'Number of Accepted 999’s', 'value': this.state.Accepted999 },
            { 'name': 'Number of Rejected 999’s', 'value': this.state.Rejected999 },

        ]
        let stage_3 = [
            { 'name': 'EFT', 'value': this.state.EFTData, },
            { 'name': 'CHK', 'value': this.state.CheckData, },
            { 'name': '% ERA out of total', 'value': '100%' },
            { 'name': '# Availity rejected', 'value': 0 },
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

    renderTopbar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">

                    <div className="form-group col">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            method={this._handleStateChange}
                        />
                    </div>
                    {/* <div className="form-group col">
                        <div className="list-dashboard">Provider</div>
                        <input className="form-control" type="text"
                            onChange={(e) => this.onHandleChange(e)}
                        />
                    </div> */}
                    {/* <div className="form-group col">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div> */}
                    <div className="form-group col">
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
                                    this.getData()
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
                    <div className="form-group col">
                        <div className="list-dashboard">Start Date</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleStartChange}
                            maxDate={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">End Date</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={this.state.endDate ? new Date(moment(this.state.endDate).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handleEndChange}
                            minDate={this.state.startDate ? new Date(moment(this.state.startDate).format('YYYY-MM-DD hh:mm')) : ''}
                        />
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Grid Type</div>
                        <select className="form-control list-dashboard" id="Grid"
                            onChange={(event) => {
                                this.setState({
                                    page: 1,
                                    rowData: [],
                                    gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
                                }, () => {
                                    this.getListData()
                                })
                            }}>
                            <option value="select">Default</option>
                            <option selected value="select">Classic</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    getPieChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.X_axis)
            pieData.push(d.Y_axis)
        })

        let second_data = {
            labels: pieLabel,
            datasets: [{
                data: pieData,
                backgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DC913',
                    '#EC6236',
                    '#C9139D',
                    'blue',
                    '#5369e7',
                    '#b7bf11',
                    '#448dce',
                    '#cb662c',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DC913',
                    '#EC6236',
                    '#C9139D',
                    'blue',
                    '#5369e7',
                    '#b7bf11',
                    '#448dce',
                    '#cb662c',
                ]
            }]
        }



        return second_data
    }

    _getPieChartData = async () => {
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            barchart : Claim837RTClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
            }
            file_piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "FileErrorwise", Type : "` + this.state.type + `", RecType: "Inbound") {
                X_axis
                Y_axis
            }
            piechart:Claim837RTClaimBarchart(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "Errorwise", Type : "` + this.state.type + `", RecType: "Inbound") {
                X_axis
                Y_axis
            }
            CompliancePieChart835 {
                Type
                TotalCount
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
                console.log(res)
                let array = []
                let ClaimBarChart = res.data.barchart
                let claimLabels = []
                let second_data = this.getPieChartData(res.data.file_piechart)
                let pie_data = this.getPieChartData(res.data.piechart)
                let complience = res.data.CompliancePieChart835

                let count = 0
                ClaimBarChart.forEach((d) => {
                    count++;
                    array.push(
                        d.Y_axis ? parseFloat(d.Y_axis) : 0
                    )
                    if (chartType == 'Weekwise') {
                        claimLabels.push('week' + count)
                    } else {
                        claimLabels.push(d.X_axis)
                    }
                })

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data,
                    pie_data: pie_data,
                    complience: complience
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    renderChart(piechart_data) {
        return (
            <Pie data={piechart_data}
                options={{
                    elements: {
                        arc: {
                            borderWidth: 0
                        }
                    },
                    legend: {
                        display: false,
                    }
                }}
                width={20}
                height={19} />
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

        if (header == 'Top 10 File Level Errors') {
            addon = '/accept'
            claimStatus = 'Rejected'
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
                status: claimStatus,
                type: type,
                gridflag: loadStatus,
                generalStatus: generalStatus
            },
        ]

        return (
            <PieChart
                header={header}
                piechart_data={piechart_data}
                data={sendData}
                onClick={this.gotoClaimDetails}
            />
        )
    }




    renderAllPieCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderPieChart('Top 10 File Level Errors', this.state.second_data)}
                    </div>
                    <div className="col-6" style={{ padding: '8px' }}>
                        {this.renderPieChart('Top 10 Payment Level Errors', this.state.pie_data)}
                    </div>
                </div>
            </div>
        )
    }

    _renderList() {
        return (
            <div>
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
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'QNXT File Name') {
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

        this.props.history.push('/' + Strings.claimPayment_835_details, {
            data: sendData
        })
    }
    progressBar() {
         
        let Validated = this.state.progress_Validated + "%"
        let Error = this.state.progress_Error + "%"
        return (
            <div class="progress">
                {/* <div class="progress-bar" role="progressbar" style={{ width: k }}>Total Sent To Availity ({k})</div> */}
                <div class="progress-bar bg-success" role="progressbar" style={{ width: Validated }}>Vaildated ({Validated})</div>
                <div class="progress-bar bg-danger" role="progressbar" style={{ width: Error }}>Files in Error ({Error})</div>
            </div>
        )
    }


    render() {

        let lables1 = ['Not Compliant', 'Compliant'];
        let lables2 = ['Member not eligible', 'Dependent not covered', 'Provider not authorized'];
        let lables3 = ['Negative number', 'Not valid CARC', 'Missing'];

        let data1 = [20, 60];
        let data2 = [20, 60, 30];
        let data3 = [20, 60, 30];

        return (
            <div><br />
                <h5 style={{ color: 'var(--main-bg-color)', fontsize: "20px" }}> 835 Dashboard</h5><br></br>

                <div className="row">
                    <div className="col-12">
                        {this.renderTopbar()}
                        {this.progressBar()}
                        {/* {this.renderSummaryDetails()} */}
                        <div className="general-header" style={{ marginBottom: "10px", marginTop: '12px' }}>Remittance File Level</div>
                        {this._renderSummaryDetails()}
                        <div className="general-header">Payment Level</div>
                        {this.renderClaimDetails()}
                        {this.renderAllPieCharts()}

                        {/* {this.renderMonthlyTrendsChart()} */}
                        {/* <div className="row">
                           <div className="col-4">
                           {this.renderCharts()}
                           </div>
                           <div className="col-1"></div>
                           <div className="col-4">
                        {this.RenderMainErrorChart()}
                           </div>
                       </div> */}
                    </div>


                </div>
                <div className="row">
                    <div className="col-8">

                        {this.state.claimsList && this.state.claimsList.length > 0 && this.state.gridType ? this._renderList() : null}
                        {this.state.claimsList && this.state.claimsList.length > 0 && !this.state.gridType ? this.renderList() : null}
                        {/* {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderList() : null}     */}
                    </div>
                    <div className="col-3 nopadding" style={{ marginLeft: '60px' }}>
                        {this.renderCharts()}

                        {/* {this.renderGooglePieChart('Compliance',lables1,data1,data1)} */}
                        {/* {this.renderGooglePieChart('Top Denial Reason codes',lables2,data2)} */}

                    </div>
                </div>


                {/* <div className="row">
                <div className="col-9">
                {this.renderGraphs()}
                </div>
                <div className="col-3 nopadding">
            
                {this.renderGooglePieChart('Top Denial Reason codes',lables2,data2)}
              
                </div>
                </div> */}

            </div>
        );
    }
}
