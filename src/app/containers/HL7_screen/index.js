import React from 'react';
import './styles.css';
import '../Files/files-styles.css';
import { Pie, Bar } from 'react-chartjs-2';
import '../color.css'
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../helpers/Urls';
import { Link } from 'react-router-dom'
import Strings from '../../../helpers/Strings';
import { CommonTable } from '../../components/CommonTable';


let val = ''
const second_data = {
    labels: [

    ],
    datasets: [{
        data: [100, 100, 70, 20, 50, 20],
        backgroundColor: [
            '#139DC9',
            '#83D2B4',
            '#9DC913',
            '#EC6236',
            '#C9139D',
            'blue',
        ],
        hoverBackgroundColor: [
            '#139DC9',
            '#83D2B4',
            '#9DC913',
            '#EC6236',
            '#C9139D',
            'blue',
        ]
    }],
    flag: ''
};



export class HL7_screen extends React.Component {

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
            flag1: false

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
        return (
            <tr className="table-head">
                <td className="table-head-text list-item-style">File Name<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">File Date<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">File Status<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Submitter<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
                <td className="table-head-text list-item-style">Claim Count<img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop: '3px', float: 'right' }}></img></td>
            </tr>
        )
    }

    getBarData(labelArray, dataArray, color) {

        labelArray = ['A01', 'A02', 'A03', 'A04', 'A05', 'A08']
        dataArray = ['100000', '2000000', '1400000', '1200000', '1200000']
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




    onClick = (e) => {
        this.setState({
            showDetails: true
        })
    }



    onClick1 = (e) => {



        this.setState({
            showDetails1: true


        })



    }


    renderDetails(flag) {

        let message = "ISA*00* *00* *ZZ*SUBMITTERID *ZZ*CMS *160127*0734*^*00501*000005014*1*P*|~GS*HS*SUBMITTERID*CMS*20160127*073411*5014*X*005010X279A1~ST*277*3708*005010X212~BHT*0010*08*ABC276XYZ*20120128*1426*DG~HL*1**20*1~NM1*PR*2*BCBS DISNEY*****PI*8584537845~HL*2*1*21*1~NM1*41*2*UCLA MEDICAL CENTER*****46*1982~HL*3*2*19*1~NM1*1P*2*UCLA MEDICAL CENTER*****XX*1215193883~HL*4*3*22*0~DMG*D8*19281118*M~NM1*QC*1*MOUSE*MICKEY****MI*60345914A~TRN*1*ABC9001~STC*P3:60*20120128**225*0~REF*BLT*221~REF*EJ*ABC9001~DTP*472*D8*20120124~HL*5*3*22*0~DMG*D8*19340619*M~NM1*QC*1*DUCK*DONALD****MI*60345914B~TRN*1*ABC9002~REF*BLT*221~REF*EJ*ABC9002~DTP*472*D8*20120124~SVC*HC:98765*150**0450***1~STC*F1:65*20120128~SE*26*3708~GE*1*5014~IEA*1*000005014~"
        return (
            <div>
                <div>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Transaction Request'}</a></div>
                    <div className="border-view" id={'hello' + flag}>{flag ? message : message}</div>
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
            <div className="row">
                <div className="chart">
                    <h6 align="center" style={{ paddingBottom: "20px", paddingRight: "60px" }}> <b>Type of Message </b></h6>
                    {this.renderTabs()}
                    {/* <label className="chart-header">{this.state.type == 'Providerwise' ? 'Provider (Top 5)' : 'Submitter volume (Top 5)'}</label> */}
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

                <div className="chart">
                    <h6 align="center" style={{ paddingBottom: "20px", paddingRight: "60px" }}> <b>Real time Volume </b></h6>
                    <Bar
                        data={this.getBarData(this.state.claimLabels, this.state.ClaimBarChart, "#83D2B4")}
                        width={400}
                        height={250}
                        options={{
                            legend: {
                                position: 'bottom'
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        fontSize: 10,
                                    }
                                }]
                            }
                        }} />
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

    renderTransactionsNew(flag) {


        let data = this.state.files_list ? this.state.files_list : []
        let headerArray = []
        let rowArray = []
        headerArray.push(
            { value: 'Message ID', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionID" : "order by Trans_ID", this.state.transactionRotation, 'transactionRotation'), key: this.state.transactionRotation, upScale: 1 },
            { value: 'Date', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.EventCreationDateTime" : "order by Date", this.state.dateRotation, 'dateRotation'), key: this.state.dateRotation },
            { value: 'Type', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.TransactionStatus" : "order by Trans_type", this.state.statusRotation, 'statusRotation'), key: this.state.statusRotation },
            { value: 'Submitter', method: () => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "order by Request.Sender" : "order by Submiter", this.state.submitterRotation, 'submitterRotation'), key: this.state.submitterRotation },
            { value: 'Destination' }

        )



        rowArray.push(
            { value: 'API_ID', upScale: 1 },
            { value: 'Date', isDate: 1, isNottime: 1 },
            { value: 'API_URL' },
            { value: 'Requester' },

            { value: 'Destination' },
        )

        data = [
            {
                API_ID: 12345,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'Availity'


            },

            {
                API_ID: 12346,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'Availity'


            },

            {
                API_ID: 12347,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'GH Generations'


            },

            {
                API_ID: 12348,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'Availity'


            },

            {
                API_ID: 12349,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'Availity'
            },

            {
                API_ID: 12341,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'GH Generations'
            },


            {
                API_ID: 12342,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'Availity'

            },


            {
                API_ID: 12343,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'GH Generations'

            },

            {
                API_ID: 12344,
                Date: 1582810469000,
                API_URL: 'Pass',
                Requester: 'Availity'

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

    renderList() {
        let row = []
        const data = this.state.claimsList;
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let sendData = [
            { flag: '', State: State, selectedTradingPartner: selectedTradingPartner, startDate: startDate, endDate: endDate, status: "", type: type },
        ]
        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ color: "var(--light-blue)" }}><Link to={{ pathname: '/ClaimDetails837', state: { data: sendData } }}>{d.FileName}</Link></td>
                    <td className="list-item-style">{moment(d.date).format('MM/DD/YYYY, ')}{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className={"list-item-style " + (d.FileStatus == 'Accepted' ? 'green ' : (d.FileStatus == 'FullFileReject' ? 'red ' : (d.FileStatus == 'In Progress' ? 'grey ' : ' ')))}>{d.FileStatus}</td>
                    <td className="list-item-style">{d.Sender}</td>
                    <td className="list-item-style">{d.Claimcount}</td>
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list">
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
                    pageCount={Math.floor(this.state.claimsList[0].RecCount / 10) + (this.state.claimsList[0].RecCount % 10 > 0 ? 1 : 0)}
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
                        1.3M
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">Queue</div>
                    <div className='orange summary-title' >
                        6
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">   Total Inbound</div>
                    <div className='green summary-title' >
                        1.9M
            </div>
                </div>
                <div className="col-2 summary-container">
                    <div className="summary-header">  Queue Depth</div>
                    <div className='blue summary-title' >
                        3
            </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">  Errors</div>
                    <div className='red summary-title' >
                        10
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
                            <option selected value="1">ADT01</option>
                            <option value="2">Michigan</option>
                            <option value="3">Florida</option>
                            <option value="4">New York</option>
                            <option value="5">Idaho</option>
                            <option value="6">Ohio</option>
                            <option value="7">Illinois</option>
                            <option value="8">Texas</option>
                            <option value="9">Mississippi</option>
                            <option value="10">South Carolina</option>
                            <option value="11">New Mexico</option>
                            <option value="12">Puerto Rico</option>
                            <option value="13">Washington</option>
                            <option value="14">Utah</option>
                            <option value="15">Wisconsin</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Destination</div>
                        {/* <input className="form-control" type="text"
                            onChange={(e) => this.onHandleChange(e)}
                        /> */}
                        <select class="form-control list-dashboard"><option value=""></option><option selected value="1">Provider Name 1</option><option value="2">Provider Name 2</option></select>
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

    renderChart() {
        return (
            <Pie data={second_data}
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
                width={100}
                height={80} />
        )
    }



    render() {
        return (
            <div className="container">
                <h5 className="headerText">ADT</h5>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                {this.renderCharts()}
                <div className="row">
                    <div className="col-7">
                        <h6> Inbound Table</h6>
                        {this.renderTransactionsNew()}
                    </div>
                    {this.state.showDetails ?
                        <div className="col-5">
                            {this.renderDetails()}
                        </div> : null}
                </div>
                <br></br><br></br>
                <div className="row">
                    <div className="col-7">
                        <h6> Outbound Table</h6>
                        {this.renderTransactionsNew(1)}
                    </div>
                    {this.state.showDetails1 ?
                        <div className="col-5">
                            {this.renderDetails(1)}
                        </div> : null}
                </div>
            </div>
        );
    }
}