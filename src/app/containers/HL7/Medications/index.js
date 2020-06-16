import React from 'react';
import '../HL7_screen/styles.css';
import '../../Files/files-styles.css';
import { Bar, Line } from 'react-chartjs-2';
import '../../color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
let val = ''

export class RDE extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
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
            page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            search: '',
            showDetails: false,
            showDetails1: false,
            flag1: false,
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
    }

    componentDidMount() {
        this.getCommonData()
        this.getData()
        this.getListData()
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`

        console.log('query ', query)
        fetch(Urls.sql_common_data, {
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
                console.log(err)
            });
    }

    getData() {
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }

        let query = `{
            Claim837RTDashboardCount (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", Type : "` + this.state.type + `") {
                TotalFiles
                TotalClaims
                Accepted
                Rejected
                Accepted_Per
                Rejected_Per
                Total999
                Total277CA
                TotalSentToQNXT
                InProgress
            }
            Claim837RTClaimBarchart (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "` + chartType + `", Type : "` + this.state.type + `") {
                From
                MonthNo
                Year
                To
                Amount
                TotalClaims
                X_axis
                Y_axis
            }
        }`
        console.log(query)
        fetch(Urls.sql_real_time_claim, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let array = []
                let summary = []
                let data = res.data
                let Accepted_per1 = 0
                let rejected_per1 = 0
                let accepted = 0
                let rejected = 0
                let inProgress = 0
                let ClaimBarChart = res.data.Claim837RTClaimBarchart
                let claimLabels = []

                if (data.Claim837RTDashboardCount && data.Claim837RTDashboardCount.length > 0) {
                    summary = [
                        { name: 'Total Files', value: data.Claim837RTDashboardCount[0].TotalFiles ? data.Claim837RTDashboardCount[0].TotalFiles : '' },
                        { name: 'Total Claims', value: data.Claim837RTDashboardCount[0].TotalClaims ? data.Claim837RTDashboardCount[0].TotalClaims : '' },
                        { name: 'Failed File Load', value: 0 },
                        { name: 'Accepted Claims', value: data.Claim837RTDashboardCount[0].Accepted ? data.Claim837RTDashboardCount[0].Accepted : '' },
                        { name: 'Rejected Claims', value: data.Claim837RTDashboardCount[0].Rejected ? data.Claim837RTDashboardCount[0].Rejected : '' },
                        { name: 'Accepted Percent', value: data.Claim837RTDashboardCount[0].Accepted_Per ? Math.round(data.Claim837RTDashboardCount[0].Accepted_Per * 100) / 100 : '' },
                        { name: 'Rejected Percent', value: data.Claim837RTDashboardCount[0].Rejected_Per ? Math.round(data.Claim837RTDashboardCount[0].Rejected_Per * 100) / 100 : '' },
                    ]
                    Accepted_per1 = data.Claim837RTDashboardCount[0].Accepted_Per
                    rejected_per1 = data.Claim837RTDashboardCount[0].Rejected_Per
                    accepted = data.Claim837RTDashboardCount[0].Accepted
                    rejected = data.Claim837RTDashboardCount[0].Rejected
                    inProgress = data.Claim837RTDashboardCount[0].InProgress
                }

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
                    summaryList: summary,
                    Accepted_per: Accepted_per1,
                    rejected_per: rejected_per1,
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    accepted: accepted,
                    rejected: rejected,
                    inProgress: inProgress
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    updateSearch = search => {
        this.setState({ search });
    };

    renderTableHeader() {
        // return (
        //     <tr className="table-head">
        //         <td className="table-head-text list-item-style">File Name<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
        //         <td className="table-head-text list-item-style">File Date<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
        //         <td className="table-head-text list-item-style">File Status<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
        //         <td className="table-head-text list-item-style">Submitter<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
        //         <td className="table-head-text list-item-style">Claim Count<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
        //     </tr>
        // )
    }

    getBarData(labelArray, dataArray, color) {

        labelArray = ['RO01', 'RO11', 'RO25']
        dataArray = ['1730000', '1960000', '1400000']
        let bardata = {
            labels: labelArray,
            showFile: false,
            datasets: [
                {
                 
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


    renderDetails(flag) {

        let message = `MSH|^~\&|Epic|COH|Pyxis|COH|20261016030351|207764|RDE^O11|3217143|P|2.3PID|||100001^^^EPI^MR||PATANELLA^GLENNA^LAVONA^^^^D|^^|19140126|F|LAVONA^GLENNA^^|W|6134 60TH AVENUE^#1101^AURORA^CO^91701^USA^L^^SAN BERNARDINO|SAN BERNARDINO|(408)-774-0574^P^H^^^626^9056045|(408)-679-0243^P^W^^^909^3301010|SPA|D|Catholic|811-23-9221|811-23-9221|||HISPANIC|||||||PV1||INPATIENT|3E^3203^3203-01^DC^^^^^^^DEPID||||1023147014^KIM^JAE^YUL^^^^^NPI^^^^NPI~28167^KIM^JAE^YUL^^^^^PROVID^^^^PROVID||1275604456^TIEP^BRIAN^LESLIE^^^^^NPI^^^^NPI~174^TIEP^BRIAN^LESLIE^^^^^PROVID^^^^PROVID||||||||1023147014^KIM^JAE^YUL^^^^^NPI^^^^NPI~28167^KIM^JAE^YUL^^^^^PROVID^^^^PROVID||811-23-9221|||||||||||||||||||||||||20261012101732ORC|XO|33048497^EPC|||||^Every 6 hours&0430,1030,1630,2230^^20191014224500^^R^^||20261013011044|200896^DICKERSON^DIANA^^|1174983^CHANG^SARA^^^^^^PROVID^^^^PROVID|1780816025^TITTELFITZ^TAMI^D^^^^^NPI^^^^NPI~89664^TITTELFITZ^TAMI^D^^^^^PROVID^^^^PROVID|||||||||Duarte|1500 DUARTE RD^^DUARTE^CA^91010-3012^|(626)256-4673^^^^^626^2564673|1500 E. DUARTE ROAD^DIV OF THORACIC SURGERY^DUARTE^CA^91010^US|||||IRXE|^Every 6 hours&0430,1030,1630,2230^^20191014224500^^R^^|58205907^5 ML: METOPROLOL TARTRATE 5 MG/5ML IV SOLN^^^^^^^metoprolol (LOPRESSOR) injection 5 mg|5||3^mg|47|Withhold Dose if heart rate LESS than 60 or SPB LESS than 100.|||1|VL||MD0832154^TITTELFITZ^TAMI^D^||||||||||||1|3^mg||||ADS|||1|1^mL||||||3ENMED^3EAST NORTH PYXISTQ1|1||Every 6 hours|0430,1030,1630,2230|||20191014224500||RRXR|IV^IntravenousRXC||58205907^5 ML: METOPROLOL TARTRATE 5 MG/5ML IV SOLN|5|mg|5|mg`
        return (
            <div>
                <div>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Message'}</a></div>
                    <div className="border-view" style={{ height:  "300px", overflow: "auto" }} id={'hello' + flag}>{flag ? message : message}</div>
                </div>
            </div>
        )
    }


    renderTabs(flag) {
        return (
            <nav>
                {
                    flag ?
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Real time volume</a>
                        </div>
                        :
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('Submitter')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Submitter</a>
                        </div>
                }
            </nav>
        )
    }

    renderCharts() {

        return (

<div className="row chart-div col-12">
               
               <div className="chart-container chart col-12">
                   <div className="chart-header">Type of Message</div>
                   <Bar
                        data={this.getBarData(this.state.type == 'Provider' ? this.state.providerChartLabel : this.state.tradingChartLabel, this.state.type == 'Provider' ? this.state.providerChartData : this.state.tradingChartData, '#139DC9')}
                        width={400}
                        height={200}
                        options={{
                            legend: {
                                display: false,
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,

                                    }
                                }],
                            },
                        }} />
               </div>
               
      
   </div>

        )
    }

    _renderAllCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderCharts()}
                    </div>
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderCharts1()}
                    </div>
                </div>
            </div>
        )
    }

    handleSort(e) {
        this.setState({
            type: e
        })
        setTimeout(() => {
            this.getData()
            this.getListData()
        }, 50);
    }

    tab() {
        return (
            <div>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Total Claims</a>
                        <a class="nav-item nav-link" id="nav-profile-tab" onClick={() => this.handleSort('I')} data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Institutional</a>
                        <a class="nav-item nav-link" id="nav-contact-tab" onClick={() => this.handleSort('P')} data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Professional</a>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"></div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"></div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"></div>
                </div>
            </div>
        )
    }

    handlePageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getListData()
        })
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
            Claim837RTFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.page + ` , OrderBy:""  ) {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                Claimcount
                FileStatus
            }
        }`
        console.log(query)
        fetch(Urls.sql_real_time_claim_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.Claim837RTFileDetails) {

                    if (res.data.Claim837RTFileDetails.length > 0) {

                        count = Math.floor(res.data.Claim837RTFileDetails[0].RecCount / 10)
                        if (res.data.Claim837RTFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;
                    }

                    this.setState({
                        claimsList: res.data.Claim837RTFileDetails,
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
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
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
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
            this.getListData()
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
                <div className="col-2 summary-container">
                    <div className="summary-header">Total Outbound</div>
                    <div className='green summary-title' >
                        1.7M
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">Queue</div>
                    <div className='orange summary-title' >
                        9
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">   Total Inbound</div>
                    <div className='green summary-title' >
                        2.6M
            </div>
                </div>
                <div className="col-2 summary-container">
                    <div className="summary-header">  Queue Depth</div>
                    <div className='blue summary-title' >
                        2
            </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">  Errors</div>
                    <div className='red summary-title' >
                        13
        </div>
                </div>
            </div>



        )
    }

    onHandleChange(e) {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            }, () => {
                this.getData()
                this.getListData()
            })
        }, 300);
    }

    renderTopbar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
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
                                    this.getData()
                                    this.getListData()
                                }, 50);
                            }}
                        >
                            <option value="1">Last week</option>
                            <option value="2">Last 30 days</option>
                            <option value="2">Last 90 days</option>
                            <option value="2">Last 180 days</option>
                            <option selected="selected" value="2">Last year</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Type</div>
                        <select className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                this.setState({
                                    State: event.target.options[event.target.selectedIndex].text
                                }, () => {
                                    this.getData()
                                    this.getListData()
                                })
                            }}
                        >
                            <option value=""></option>
                            <option value="1">RO01</option>
                            <option value="2">RO11</option>
                            <option value="3">RO25</option>
                            
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Destination</div>
                        {/* <input className="form-control" type="text"
                            onChange={(e) => this.onHandleChange(e)}
                        /> */}
                        <select class="form-control list-dashboard">
                            <option selected value=""></option>
                            <option  value="1">COH</option>
                            </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Directory</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
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


    getLineChart(labelArray, dataArray, color) {
        let _data = {
            labels: ['Jun-2019','Aug-2019','Sept-2019','Oct-2019','Nov-2019','Dec-2019','Jan-2020','Feb-2020','Mar-2020','Apr-2020','May-2020'],
            datasets: [
                {
                    label: '',
                    fill: true,
                    cubicInterpolationMode: 'default',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: color,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'round',
                    pointBorderColor: color,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 1,
                    data: [10200,12300, 15000, 18000, 13300, 12700, 15500, 19300,17600, 19500,14150, 16630]
                }
            ]
        }
        return _data
    }

    renderCharts1() {
        return (
            <div className="row chart-div col-12">
               
                        <div className="chart-container chart col-12">
                            <div className="chart-header">Volume Analysis</div>
                            <Line
                                data={this.getLineChart(this.state.dateChartLabel, this.state.dateChartData, '#139DC9')}
                                width={400}
                                height={200}
                                options={{
                                    legend: {
                                        display: false,
                                    },
                                }}
                            />
                        </div>
                        
               
            </div>


        )
    }

    _renderInboundTable() {

        let data = [{API_ID: 12345,Date: '06/16/2020 06:00:00',API_URL: 'RO01',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12346,Date: '06/16/2020 06:00:00',API_URL: 'RO11',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12347,Date: '06/15/2020 08:20:10',API_URL: 'RO01',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12348,Date: '06/15/2020 08:20:10',API_URL: 'RO25',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12349,Date: '06/15/2020 08:20:10',API_URL: 'RO01',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12341,Date: '06/15/2020 08:20:10',API_URL: 'RO11',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12342,Date: '06/15/2020 08:20:10',API_URL: 'RO11',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12343,Date: '06/15/2020 08:20:10',API_URL: 'RO25',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12344,Date: '06/15/2020 08:20:10',API_URL: 'RO25',Requester: 'EPIC',Destination:'COH'}

        ]


        let columnDefs = [
            { headerName: "Message ID", field: "API_ID", width: 120, cellStyle: { color:'#139DC9', cursor:'pointer' } },
            { headerName: "Date", field: "Date", width: 140,  },
            { headerName: "Type", field: "API_URL", width: 120, },
            { headerName: "Submitter", field: "Requester", width: 140, },
            { headerName: "Destination", field: "Destination", flex: 1,  },   
        ]

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '10px' }}>
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
                        rowData={data}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if(event.colDef.headerName == 'Message ID'){
                                this.setState({
                                    showDetails: true
                                })   
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    _renderOutboundTable() {

        let data = [
        {API_ID: 12345,Date: '06/16/2020 06:00:00',API_URL: 'RO01',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12346,Date: '06/16/2020 06:00:00',API_URL: 'RO11',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12347,Date: '06/15/2020 08:20:10',API_URL: 'RO01',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12348,Date: '06/15/2020 08:20:10',API_URL: 'RO25',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12349,Date: '06/15/2020 08:20:10',API_URL: 'RO01',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12341,Date: '06/15/2020 08:20:10',API_URL: 'RO11',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12342,Date: '06/15/2020 08:20:10',API_URL: 'RO11',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12343,Date: '06/15/2020 08:20:10',API_URL: 'RO25',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12344,Date: '06/15/2020 08:20:10',API_URL: 'RO25',Requester: 'EPIC',Destination:'COH'}

        ]

        let columnDefs = [
            { headerName: "Message ID", field: "API_ID", width: 120, cellStyle: { color:'#139DC9', cursor:'pointer' } },
            { headerName: "Date", field: "Date", width: 140, },
            { headerName: "Type", field: "API_URL", width: 120, },
            { headerName: "Submitter", field: "Requester", width: 140, },
            { headerName: "Destination", field: "Destination", flex: 1, },   
        ]

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '10px' }}>
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
                        rowData={data}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if(event.colDef.headerName == 'Message ID'){
                                this.setState({
                                    showDetails1: true
                                })   
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <h5 className="headerText">RDE</h5>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                {this._renderAllCharts()}
                <div className="row">
                    <div className="col-7">
                        <h6> Inbound Table</h6>
                        {this._renderInboundTable()}
                    </div>
                    {this.state.showDetails ?
                        <div className="col-5" style={{marginTop: '10px'}}>
                            {this.renderDetails()}
                        </div> : null}
                </div>
                <br></br><br></br>
                <div className="row">
                    <div className="col-7">
                        <h6> Outbound Table</h6>
                        {this._renderOutboundTable(1)}
                    </div>
                    {this.state.showDetails1 ?
                        <div className="col-5" style={{marginTop: '10px'}}>
                            {this.renderDetails(1)}
                        </div> : null}
                </div>
            </div>
        );
    }
}