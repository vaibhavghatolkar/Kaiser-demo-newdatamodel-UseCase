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
export class Enrollment_Outbound extends React.Component {

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

    ageCellRendererFunc(params) {

        //return '<button ng-click="ageClicked(data.age)" ng-bind="data.age"></button>';
        return '<button ng-click="ageClicked(data.age)">Age</button>';
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
        this.getCommonData()

        this.getListData()
        this._getCounts()
        this._getPieChartData()
        this._getClaimCounts()
    }
    getCommonData() {
        let query = `{
            Trading_PartnerList(RecType :"Outbound", Transaction:"Claim837RT") {
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
        let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.ServiceEndDate ? moment(this.state.ServiceEndDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            Dashboard834FileDetailsOutbound(State:"${this.state.State}",StartDt :"${startDate}", EndDt : "${endDate}", RecType: "Outbound" ,Status:"",FileID:"",MaintenanceCode:"",ErollmentErrStatus:"") {
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
                console.log("al;fjsdjfjsh", res.data.Dashboard834FileDetailsOutbound)
                this.setState({
                    rowData: res.data.Dashboard834FileDetailsOutbound,

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
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={true}
                removeGrid={true}
                removeSubmitter={true}
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






    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            
            Dashboard834Count(State:"${this.state.State}", StartDt :"${startDate}", EndDt : "${endDate}", RecType: "Outbound"){
                TotalFiles
                TotalError
                Resubmit
                }
                FileLevelCount834 {
                    TotalCount
                    Validated
                    Error
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
                let data = res.data.Dashboard834Count[0]
                let FileCount = res.data.FileLevelCount834[0]


                summary = [
                    { name: 'Total Files', value: FileCount.TotalCount },
                    { name: 'Validated', value: FileCount.Validated },
                    { name: 'File In Error', value: FileCount.Error },
                    { name: 'Resubmit', value: data.Resubmit },
                    { name: 'Total Sent', value: FileCount.Validated },

                ]
                process.env.NODE_ENV == 'development' && console.log(summary)
                this.setState({
                    summaryCount: summary,

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
            let EnrollmentStatus = ''
            let url = ''
            let data = []


            if (item.name == 'Total Files') {
                addon = '/accept'
                claimStatus = ''
                EnrollmentStatus = ''
                subtitle = ""
            } else if (item.name == 'File In Error') {
                claimStatus = 'Error'
                subtitle = "Total Errors"
                EnrollmentStatus = ''
            } else if (item.name == 'Resubmit') {
                claimStatus = ''
                subtitle = "Resubmit"
                EnrollmentStatus = "Ready to Resubmit"
            }
            else if (item.name == 'Total Sent') {
                // claimStatus = 'Total Sent'
                // subtitle = "Sent"
            }
            else if (item.name == 'Validated') {
                claimStatus = 'Validated'
                subtitle = "Validated"
                EnrollmentStatus = ''
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
                    EnrollmentStatus: EnrollmentStatus,
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
                    isClickable={
                        item.name != 'Total Sent'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    isenrollment={true}
                    second_val={item.second_val}

                    url={url ? url : Strings.Enrollment_Details_Outbound}
                />

            )
        });

        return (
            <div className="row padding-left col-12">
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
            let EnrollmentStatus = ''
            let unclick = ''
            if (item.name == 'Add') {
                claimStatus = '021'
                subtitle = "Add"
                Status = ''
                EnrollmentStatus = ''
                color = "var(--orange)"
            } else if (item.name == 'Term') {
                claimStatus = '024'
                subtitle = "Term"
                Status = ''
                EnrollmentStatus = ''
                color = "var(--green)"
            } else if (item.name == 'Change') {
                claimStatus = '001'
                subtitle = "Change"
                EnrollmentStatus = ''
                color = "var(--orange)"
                Status = ''
            }
            else if (item.name == 'HiPaaS Count') {
                claimStatus = ''
                Status = ''
                EnrollmentStatus = ''
                subtitle = "HiPaaS Count"
                color = "var(--green)"
            }
            else if (item.name == 'Enrollment Errors') {
                Status = ''
                claimStatus = ''
                EnrollmentStatus = 'Error'
                subtitle = " Enrollment Errors"
                color = "var(--red)"

            }
            else if (item.name == 'Resubmit Count') {
                Status = ''
                claimStatus = ''
                EnrollmentStatus = 'Ready to Resubmit'
                subtitle = "Resubmit Count"
                color = "var(--green)"
            } else if (item.name == 'Total Sent') {
                Status = ''
                claimStatus = ''
                EnrollmentStatus = ''
                subtitle = ""
                unclick = "var(--main-bg-color)"
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
                    EnrollmentStatus: EnrollmentStatus,
                },
            ]

            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Enrollment_Details_Outbound}
                    data={sendData}
                    color={color}
                    unclick={unclick}
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
            EnrollmentDashboardTable834(State:"${this.state.State}", StartDt :"${startDate}", EndDt : "${endDate}", RecType: "Outbound") {
                Addition
                Termination
                Changes
                X12_Count
                Hipaas_Count
                ErrorCount
                ResubmitCount
                SentCount
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

                        Addition: res.data.EnrollmentDashboardTable834[0].Addition,
                        Changes: res.data.EnrollmentDashboardTable834[0].Changes,
                        Termination: res.data.EnrollmentDashboardTable834[0].Termination,
                        X12_Count: res.data.EnrollmentDashboardTable834[0].X12_Count,
                        Hipaas_Count: res.data.EnrollmentDashboardTable834[0].Hipaas_Count,
                        ErrorCount: res.data.EnrollmentDashboardTable834[0].ErrorCount,
                        ResubmitCount: res.data.EnrollmentDashboardTable834[0].ResubmitCount,
                        SentCount: res.data.EnrollmentDashboardTable834[0].SentCount,

                    }, () => {
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
            { 'header': 'HiPaaS Received Status' },
            { 'name': ' Received From QNXT', 'value': this.state.X12_Count },
            { 'name': ' HiPaaS Received', 'value': this.state.Hipaas_Count, 'isClick': true },

            // { 'name': 'X12 Count', 'value': this.state.X12_Count },
            // { 'name': 'HiPaaS Count', 'value': this.state.Hipaas_Count, 'isClick': true },
        ]
        let stage_2 = [
            { 'header': 'HiPaaS Validation Status' },
            { 'name': 'Enrollment Errors', 'value': this.state.ErrorCount, 'isClick': true },
            { 'name': 'Resubmit Count', 'value': this.state.ResubmitCount, 'isClick': true },
        ]

        let stage_3 = [
            { 'header': '' },
            { 'name': 'Add', 'value': this.state.Addition, 'isClick': true },
            { 'name': 'Term', 'value': this.state.Termination, 'isClick': true },
            { 'name': 'Change', 'value': this.state.Changes, 'isClick': true },

        ]
        let stage_4 = [
            { 'header': '' },
            { 'name': 'Total Sent', 'value': this.state.SentCount },


        ]



        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
                {this._renderClaimTables(stage_4)}
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
                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Provider</div>
                        <input className="form-control" type="text"
                            onChange={(e) => this.onHandleChange(e)}
                        />
                    </div> */}
                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Submitter</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div> */}
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
                    {/* <div className="form-group col-2">
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
                    </div> */}
                </div>
            </div>
        )
    }

    getPieChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        console.log("askjsakscak", pieChart)
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
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            file_piechart:Dashboard834ErrorPieChart(State:"${this.state.State}",  StartDt :"${startDate}", EndDt : "${endDate}", RecType: "Outbound") {
                X_axis
                Y_axis
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
                console.log(res)
                let array = []
                // let ClaimBarChart = res.data.barchart
                let claimLabels = []
                let second_data = res.data.file_piechart && res.data.file_piechart.length > 0 ? this.getPieChartData(res.data.file_piechart) : ''
                let pie_data = res.data.piechart && res.data.piechart.length > 0 ? this.getPieChartData(res.data.piechart) : ''
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
                    // ClaimBarChart: array,
                    // claimLabels: claimLabels,
                    second_data: second_data,
                    // pie_data: pie_data,
                    // complience: complience,
                    // complaince_data: complaince_data
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
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderPieChart('Top 10 File Level Errors', this.state.second_data)}
                    </div>
                    {/* {this.renderCompliance()} */}
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
                {this.renderPieChart('', this.state.complaince_data)}
            </div>
        )
    }


    _renderList = () => {

        let columnDefs = [
            { headerName: "Sent File Name", field: "FileName", width: 350, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Sent Date", field: "Date", width: 180, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Submitter", field: "Subscriber",width:120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }  },
            { headerName: "Total Enrollments", field: "Enrollment", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Errors", field: "Error", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "File Status", field: "FileStatus", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "", field: "CompareFile", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer', fontWeight: 'bold' } },




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
                            if (event.colDef.headerName == 'Sent File Name') {
                                this.setState({
                                    incoming_fileId: event.data.FileID
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            }
                            if (event.colDef.headerName == '') {
                                this.setState({
                                    incoming_fileId: event.data.FileName == "834_UT_Audit.da" || event.data.FileName == "834_UT_Daily.da" ? event.data.FileName : ""
                                }, () => {
                                    this.gotocomparefile()
                                })
                            }
                        }}


                    >

                    </AgGridReact>
                </div>
            </div>
        )
    }
    gotocomparefile = (data) => {

        let sendData = []
        if (data && data.length > 0) {
            sendData = data
        } else {


            sendData = [
                {
                    incoming_fileId: this.state.incoming_fileId,
                },
            ]
        }

        this.props.history.push('/' + Strings.Enrollment_FullFileCompare, {
            data: sendData
        })

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

        this.props.history.push('/' + Strings.Enrollment_Details_Outbound, {
            data: sendData
        })
    }



    render() {

        return (
            <div>
                <h5 className="headerText">Enrollment Dashboard </h5>

                <div className="row">
                    <div className="col-12">
                        {this._renderTopbar()}

                        <div className="general-header" style={{ marginBottom: "10px", marginTop: '12px' }}>File Level</div>
                        {this._renderSummaryDetails()}
                        <div className="general-header">Enrollment Level</div>
                        {this.renderClaimDetails()}
                        {this.renderAllPieCharts()}
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
