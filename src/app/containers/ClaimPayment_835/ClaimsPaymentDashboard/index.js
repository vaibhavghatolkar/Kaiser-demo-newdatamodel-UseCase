import React from 'react';
import '../../RealTime_837_Claim/RealTimeDashboard/styles.css';
import '../../color.css'
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import Chart1 from "react-google-charts";
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import { Tiles } from '../../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { PieChart } from '../../../components/PieChart';
import { TableTiles } from '../../../components/TableTiles';

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
import { Filters } from '../../../components/Filters';

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
            Filter_ClaimId:'',
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
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
        }
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
        this.getListData()
        this._getCounts()
        this._getPieChartData()
        this._getClaimCounts()
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

        }, 50);
    }

    getListData = () => {

        let count = 1
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
                Dashboard835FileDetails(State:"${this.state.State ? this.state.State : ''}",StartDt: "${startDate}",EndDt: "${endDate}",page:${this.state.page},OrderBy:"${this.state.orderby}" ,Status:"" , FileID:"" ,RecType:"Outbound", AvailitySent:"${this.state.availitySent}", EFTCHK:"",ClaimID:"") {
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
        fetch(Urls.transaction835, {
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

    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
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
        const data = this.state.claimsList && this.state.claimsList.length > 0 ? this.state.claimsList : [];

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
    renderGraphs() {
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
                  AvailitySent
                  Exception
                  EFT
                  CHK
                }
                Total999Response835(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                    Total999
                }
                ERA835DashboardProgressBar(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Outbound") {
                    Rejected
                    Accepted
                    Exception
                  }       
              
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction835, {
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
                let progress_data = res.data.ERA835DashboardProgressBar
                let progress_condition = progress_data && progress_data.length > 0
                let Validated = progress_condition ? Number(progress_data[0].Accepted).toFixed(2) : 0
                let Error = progress_condition ? Number(res.data.ERA835DashboardProgressBar[0].Rejected).toFixed(2) : 0
                let exception = progress_condition ? Number(res.data.ERA835DashboardProgressBar[0].Exception).toFixed(2) : 0

                summary = [
                    { name: 'Received From QNXT', value: data ? data.TotalCount : 0 },
                    { name: 'Vaildated', value: data ? data.Accepted : 0 },
                    { name: 'Files in Error', value: data ? data.Rejected : 0 },
                    { name: 'EFT', value: data ? data.EFT : 0 },
                    { name: 'Check', value: data ? data.CHK : 0 },
                    { name: 'Total Sent To Availity', value: data ? data.AvailitySent : 0 },
                    { name: '999 Received', value: res.data.Total999Response835[0].Total999 },
                ]

                process.env.NODE_ENV == 'development' && console.log(summary)
                this.setState({
                    summaryCount: summary,
                    progress_Validated: Validated,
                    progress_Error: Error,
                    progress_exception: exception
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
            let EFTCHK = ''
            let url = ''
            let data = []
            if (item.name == 'Vaildated') {
                addon = '/accept'
                claimStatus = 'Validated'
                subtitle = "Validated Files"
            } else if (item.name == 'Files in Error') {
                claimStatus = 'Error'
                subtitle = "Files in Error"
            } else if (item.name == 'EFT') {
                EFTCHK = 'ACH'
                subtitle = "EFT"
            } else if (item.name == 'Check') {
                EFTCHK = 'CHK'
                subtitle = "Check"
            } else if (item.name == 'Total Sent To Availity') {
                availitySent = 'Y'
                subtitle = "Sent to Availity"
            }
            else if (item.name == 'Received From QNXT') {
                subtitle = "Received From QNXT"
           } 
            else {
                addon = '/other'
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
                    availitySent: availitySent,
                    EFTCHK: EFTCHK
                },
            ]

            if (item.name == '999 Received') {
                data = [{ flag999: '0' }]
                url = Strings.Inbound_response_999
            }
            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Error Resolved'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    url={url ? url : Strings.claimPayment_835_details}
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
            let EFTCHK = ''

            if (item.name == 'Total Number of Errors') {
                claimStatus = 'Error'
                subtitle = "Files in Error"
            } else if (item.name == 'Sent to Availity') {
                availitySent = 'Y'
                subtitle = "Sent to Availity"
                color = "var(--green)"
            } else if (item.name == 'EFT') {
                EFTCHK = 'ACH'
                subtitle = "EFT"
                color = "var(--main-bg-color)"
                
            } else if (item.name == 'CHK') {
                EFTCHK = 'CHK'
                subtitle = "CHK"
                color = "var(--main-bg-color)"
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
                    subtitle: subtitle,
                    availitySent: availitySent,
                    EFTCHK: EFTCHK
                },
            ]

            row.push(
                <TableTiles
                    item={item}
                    url={Strings.claimPayment_835_details}
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
                  EFT
                  Check
                  AvailitySent
                  TotalError
                  TotalException
              }
              
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction835, {
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
                    let _data = res.data.ERA835DashboardCountPaymentStatus[0]
                    let data2 = res.data.ERA835DashboardTable[0]
                    // let _data = res.data.Claim837RTDashboardTable[0]

                    this.setState({
                        CheckData: data2 ? data2.Check : 0,
                        EFTData: data2 ? data2.EFT : 0,
                        Rejected999: data2 ? data2.Rejected : 0,
                        Accepted999: data2 ? data2.Accepted : 0,
                        QNXT_Generated: _data ? _data.X12Count : 0,
                        Hipaas_Received: _data ? _data.HiPaaSCount : 0,
                        AvailitySent: data2 ? data2.AvailitySent : 0,
                        TotalError: data2 ? data2.TotalError : 0,
                        TotalException: data2 ? data2.TotalException : 0,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderClaimDetails = () => {

        let stage_1 = [
            { 'header': 'HiPaaS Received Status' },
            { 'name': 'QNXT Generated', 'value': this.state.QNXT_Generated },
            { 'name': 'HiPaaS Received ', 'value': this.state.Hipaas_Received },
            { 'name': 'EFT', 'value': this.state.EFTData, 'isClick': true },
            { 'name': 'CHK', 'value': this.state.CheckData, 'isClick': true },

        ]
        let stage_2 = [
            { 'header': 'HiPaaS Validation Status' },
            { 'name': 'Total Number of Errors', 'value': this.state.TotalError, 'isClick': true },
            // { 'name': 'Number of Acknowledged 835', 'value': 7 },
        ]
        let stage_3 = [
            { 'header': 'Availity Status' },
            { 'name': 'Sent to Availity', 'value': this.state.AvailitySent, 'isClick': true },
            { 'name': 'Availity Accepted', 'value': this.state.Accepted999 },
            { 'name': 'Availity Rejected', 'value': this.state.Rejected999 },
            // { 'name': '% ERA Out of Total', 'value': '100%' },
            // { 'name': 'Rejected %', 'value': '15%' }
        ]


        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
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
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            file_piechart:Dashboard835PieChart(State:"${this.state.State}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", ChartType: "FileErrorwise", RecType: "Outbound") {
                X_axis
                Y_axis
            }
            CompliancePieChart835(State:"${this.state.State}",StartDt:"${startDate}",EndDt:"${endDate}",RecType:"Outbound") {
                Type
                TotalCount
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction835, {
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
                // let ClaimBarChart = res.data.barchart
                let claimLabels = []
                let second_data = res.data.file_piechart && res.data.file_piechart.length > 0 ? this.getPieChartData(res.data.file_piechart) : ''
                // let second_data = ""
                // let pie_data = ""
                let complience = res.data.CompliancePieChart835 ? res.data.CompliancePieChart835 : []
                let complaince_data = res.data.CompliancePieChart835 ? this.getComplianceChartData(res.data.CompliancePieChart835) : {}
                let count = 0
                // ClaimBarChart.forEach((d) => {
                //     count++;
                //     array.push(
                //         d.Y_axis ? parseFloat(d.Y_axis) : 0
                //     )
                //     if (chartType == 'Weekwise') {
                //         claimLabels.push('week' + count)
                //     } else {
                //         claimLabels.push(d.X_axis)
                //     }
                // })

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data,
                    complience: complience,
                    complaince_data: complaince_data
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    getComplianceChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.Type)
            pieData.push(d.TotalCount)
        })
        let data = {
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
        }

        return data
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
        let subtitle = ''
        if (header == 'Top 10 File Level Errors') {
            claimStatus = 'Error'
            subtitle = "Files in Error"
        } else if (header == 'Top 10 Claim Level Errors') {
            addon = '/reject'
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
                onClick={header == 'Top 10 File Level Errors' ? this.gotoClaimDetails : ''}
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
                    {this.renderCompliance()}
                    {/* <div className="col-6" style={{ padding: '8px' }}>
                        {this.renderPieChart('Top 10 Payment Level Errors', this.state.pie_data)}
                    </div> */}
                </div>
            </div>
        )
    }

    renderCompliance = () => {
        return (
            <div className="col-6" style={{ padding: '6px' }}>
                {this.renderPieChart('Compliance Ratio', this.state.complaince_data)}
            </div>
        )
    }

    _renderList = () => {
        let columnDefs = [
            { headerName: "Process Id", field: "ProcessID", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Received Date", field: "FileDate", width: 100 },
            { headerName: "State", field: "State", width: 70 },
            { headerName: "File Status", field: "Status", width: 100 },
            { headerName: "Remittance File Name", field: "RemittanceFileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Remittance Sent Date", field: "RemittanceSentDate", width: 100 },
            { headerName: "Organization", field: "Organization", width: 150 },
            { headerName: "Payment Method", field: "CHECKEFTFlag", width: 70 },
            { headerName: "Check/EFT No.", field: "CheckEFTNo", width: 100 },
            { headerName: "Check/EFT Date", field: "CheckEFTDt", width: 100 },
            { headerName: "Total", field: "TotalClaim", width: 100 },
            { headerName: "Rejected", field: "Rejected", width: 100 },
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
                        rowData={this.state.rowData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'Process Id') {
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
        let exception = this.state.progress_exception + "%"
        return (
            <div className="progress">
                {/* <div className="progress-bar" role="progressbar" style={{ width: k }}>Total Sent To Availity ({k})</div> */}
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style={{ width: Validated, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Vaildated (" + Validated + ")"}
                >Vaildated ({Validated})</div>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style={{ width: Error, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Files in Error (" + Error + ")"}
                >Files in Error ({Error})</div>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style={{ width: exception, cursor: 'pointer' }}
                    data-placement="top" data-toggle="tooltip" title={"Exception (" + exception + ")"}
                >Exception ({exception})</div>
            </div>
        )
    }

    _refreshScreen = () => {
        this.getListData()
        this._getCounts()
        this._getPieChartData()
        this._getClaimCounts()
    }

    setData = (startDate, endDate, selected_val, chartType) => {
        this.setState({
            startDate,
            endDate,
            selected_val,
            chartType
        }, () => {
            this._refreshScreen()
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
                isTimeRange={true}
                removeSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                changeDefault={true}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
               
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText"> Payment Dashboard</h5>

                <div className="row">
                    <div className="col-12">
                        {this._renderTopbar()}
                        {this.state.progress_Validated || this.state.progress_Error || this.state.progress_exception ? this.progressBar() : null}
                        <div className="general-header" style={{ marginBottom: "10px", marginTop: '12px' }}>Remittance File Level</div>
                        {this._renderSummaryDetails()}
                        <div className="general-header">Payment Level</div>
                        {this.renderClaimDetails()}
                        {this.renderAllPieCharts()}
                    </div>


                </div>
                <div className="row">
                    <div className="col-12">
                        {this.state.claimsList && this.state.claimsList.length > 0 && this.state.gridType ? this._renderList() : null}
                        {this.state.claimsList && this.state.claimsList.length > 0 && !this.state.gridType ? this.renderList() : null}
                    </div>
                </div>
            </div>
        );
    }
}
