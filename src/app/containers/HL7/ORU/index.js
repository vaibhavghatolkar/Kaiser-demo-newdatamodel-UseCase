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

export class ORU extends React.Component {

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
            showVitals: false,
            showDetails1: false,
            showVitals1: false,
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

        let message = `MSH|^~\&|EPIC|COH|||20261109030312|LABBACKGROUND|ORU^R01^ORU_R01|3381016|P|2.5.1|||||||||PHLabReport-Ack^^2.16.840.1.114222.4.10.3^ISO||SFT|Epic Systems Corporation^L^^^^ANSI&1.2.840&ISO^XX^^^1.2.840.114350|May 2019|Bridges|8.8.0.0||20191107104559PID|1||100001^^^EPI^MR||CLOWER^MILLY^MARIVEL^^Ms.^^D|^^|19890910|F||W|2174 OTIUM WAY^^SPOKANE^WA^91730^USA^L^||(408)-620-0581^P^H^^^909^9898965|||||783-36-9971||||Not Hispanic||||||||N|||20180207174258|1|NTE|1|O|plz call Deann pt dtr 1st at  562) 304-0290|PD1|||DUARTE^^10150|1225241276^ROTH^ARNOLD^^I^^^^NPI^^^^NPI~600033^ROTH^ARNOLD^^I^^^^PROVID^^^^PROVID||||||||||||||NK1|1|KATHEDER^KENNY^^|Daughter|^^^^^^^|(408)-590-6682^^H^^^562^7999418|||||||||||||||||||||||||||NK1|2|LIBERTO^DYLAN^^|Daughter|^^^^^^^|(408)-225-6333^^M^^^909^2680194^^|||||||||||||||||||||||||||ORC|RE|34669377^|19312C-MI0181^Beaker|19312C-MI0181^Beaker||||||||38890^DE ANDRADE^JAMES^^^^^^PROVID^^^^PROVID~1780979468^DE ANDRADE^JAMES^^^^^^NPI^^^^NPI||(626)256-4673^^^^^626^2564673|20191108224011|||||||||1500 E. DUARTE ROAD^DIV OF SURGICAL ONCOLOGY^DUARTE^CA^91010^US^C|||||||OBR|1|34669377^|19312C-MI0181^Beaker|LAB462^CULTURE, BLOOD^^^^^^^CULTURE, BLOOD|||20261107020001||||Lab Collect|||||38890^DE ANDRADE^JAMES^^^^^^PROVID^^^^PROVID~1780979468^DE ANDRADE^JAMES^^^^^^NPI^^^^NPI|(626)256-4673^^^^^626^2564673|||||20191111000100||Microbiology|P||^^^^|||||&Lab&Background&User&||||||||||||||||||TQ1|1||||||20191108223900|20191108235959|STATOBX|1|ST|^^^^^^^^BLOOD CULTURE||No growth at 48 hours||||||P|||20261107020001|||||20191111000107||||COH MICROBIOLOGY^D^^^^CLIA^XX^^^COHMICRO|CLIA #05D0665695^1500 E DUARTE RD^DUARTE^CA^91010^^B|1861437683^APPLE^SOPHIA^K^^^^^NPI^^^^NPI~30999^APPLE^SOPHIA^K^^^^^PROVID^^^^PROVID|||||SPM|1|||Blood^Blood^^^^^^^Blood|||||||||||||20261107020001|20191108231834||||||`
        return (
            <div>
                <div>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Message'}</a></div>
                    <div className="border-view" style={{ height:  "300px", overflow: "auto" }} id={'hello' + flag}>{flag ? message : message}</div>
                </div>
            </div>
        )
    }

    renderVitals(flag) {

        let message = `MSH|^~\&|||||20261115030200|202974|ORU^R01|710193|T|2.5.1PID|1||100001^^^EPI^MR||DISTLER^CHANTE^^^^^D|^^|19411212|F||W|4907 FOOTHILLS 90^^LONG BEACH^CA^92648^USA^L^||(408)-578-4471^P^H^^^714^9431265||ENG|LEGALLY SEPA|ARM ORTHO|968-17-7584|968-17-7584|||NOT HISPANIC||||||||NPV1|1|Inpatient|6W^6W-6101^6101-01^DC^^^^^^^DEPID||||1841359429^SPIELBERGER^RICARDO^T^^^^^NPI^^^^NPI~16022^SPIELBERGER^RICARDO^T^^^^^PROVID^^^^PROVID|||||||Home|||1841359429^SPIELBERGER^RICARDO^T^^^^^NPI^^^^NPI~16022^SPIELBERGER^RICARDO^T^^^^^PROVID^^^^PROVID||968-17-7584|COMM||||||||||||||||||||||||20261104131245|||207629.88|||968-17-7584OBR|1||220588420261115030001||||20261115030001||||||||||||||||||||^^^^|||||||||OBX|1|ST|BP^BP^FDCID||94/55||||||F|||20261115030001||202974^SEHERIAN^DAMIAN^^NTE|1||RN is notified.OBX|2|NM|Temp^Temp^FDCID||37.2|C|||||F|||20261115030001||202974^SEHERIAN^DAMIAN^^OBX|3|NM|HR^Pulse^FDCID||97||||||F|||20261115030001||202974^SEHERIAN^DAMIAN^^OBX|4|NM|RR^Resp^FDCID||18||||||F|||20261115030001||202974^SEHERIAN^DAMIAN^^OBX|5|NM|SpO2^SpO2^FDCID||98|%|||||F|||20261115030001||202974^SEHERIAN^DAMIAN^^OBX|6|ST|O2delivery^O2 Delivery Method^FDCID||Nasal cannula with humidification||||||F|||20261115030001||202974^SEHERIAN^DAMIAN^^`
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
                    {/* <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderCharts()}
                    </div> */}
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
                        1.4M
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">Queue</div>
                    <div className='orange summary-title' >
                        8
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">   Total Inbound</div>
                    <div className='green summary-title' >
                        2.1M
            </div>
                </div>
                <div className="col-2 summary-container">
                    <div className="summary-header">  Queue Depth</div>
                    <div className='blue summary-title' >
                        5
            </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">  Errors</div>
                    <div className='red summary-title' >
                        8
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
                            <option value="1">LabOrders</option>
                            <option value="2">Vitals</option>
                            
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

        let data = [{API_ID: 12345,Date: '06/16/2020 06:00:00',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12346,Date: '06/16/2020 06:00:00',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12347,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12348,Date: '06/15/2020 08:20:10',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12349,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12341,Date: '06/15/2020 08:20:10',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12342,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12343,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
                    {API_ID: 12344,Date: '06/15/2020 08:20:10',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'}

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
                            if(event.data.API_URL == 'Vitals'){
                                this.setState({
                                    showVitals: true,
                                    showDetails: false
                                })   
                            }
                            else if(event.data.API_URL == 'LabOrders'){
                                this.setState({
                                    showDetails: true,
                                    showVitals: false,
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
        {API_ID: 12345,Date: '06/16/2020 06:00:00',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12346,Date: '06/16/2020 06:00:00',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12347,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12348,Date: '06/15/2020 08:20:10',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12349,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12341,Date: '06/15/2020 08:20:10',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12342,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12343,Date: '06/15/2020 08:20:10',API_URL: 'Vitals',Requester: 'EPIC',Destination:'COH'},
        {API_ID: 12344,Date: '06/15/2020 08:20:10',API_URL: 'LabOrders',Requester: 'EPIC',Destination:'COH'}

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
                            if(event.data.API_URL == 'Vitals'){
                                this.setState({
                                    showVitals1: true,
                                    showDetails1: false
                                })   
                            }
                            else if(event.data.API_URL == 'LabOrders'){
                                this.setState({
                                    showDetails1: true,
                                    showVitals1: false,
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
                <h5 className="headerText">ORU</h5>
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
                    {this.state.showVitals ?
                        <div className="col-5" style={{marginTop: '10px'}}>
                            {this.renderVitals()}
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
                    {this.state.showVitals1 ?
                        <div className="col-5" style={{marginTop: '10px'}}>
                            {this.renderVitals(1)}
                        </div> : null}
                </div>
            </div>
        );
    }
}