import React from 'react';
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
import { TableTiles } from '../../../components/TableTiles';
let val = ''

export class Sepsis_Dashboard extends React.Component {

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
            sepsisTable:false,
            showA04: false,
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
       
    }

    updateSearch = search => {
        this.setState({ search });
    };

    renderTableHeader() {
    }

    getBarData(labelArray, dataArray, color) {

        labelArray = ['A01', 'A02', 'A03', 'A04', 'A05', 'A08']
        dataArray = ['100000', '2000000', '1400000', '1200000', '1200000', '2200200']
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

        let message = `MSH|^~\&|EPIC|COH||COH|20261116032527|202592|ADT^A08|11766077|P|2.5.1
        EVN|A08|20261116032527||ONBASE_ADT|202592^POQUETTE^RITA^M^^^^^COHSA^^^^^DUR
        PID|1||100005^^^EPI^MR||LESKI^RUSTY^^^^^D|^^|19591231|M|LEWIS^LESKI^^~LESKI^LEWIS^^~LESKI^LEWIS^E^|W|4058 ROGOSA DR^^DATIL^NM^91750^USA^L^^LOS ANGELES|LOS ANGELES|(408)-543-1432^P^H^^^909^2609824||ENG|S|||692-83-6839|||NOT HISPANIC||N||||||N
        PD1|||COMMUNITY SITES^^10100|1306836770^KADHIUM^SABAH^^^^^^NPI^^^^NPI~600729^KADHIUM^SABAH^^^^^^PROVID^^^^PROVID
        ROL|1|UP|CoH|1124331723^ZHUMKHAWALA^ALI-ASGHAR^^^^^^NPI^^^^NPI~29173^ZHUMKHAWALA^ALI-ASGHAR^^^^^^PROVID^^^^PROVID|20180628||||CoH|INTERNAL|1500 E. DUARTE RD.^^DUARTE^CA^91010^US^^^LOS ANGELES|(626)914-3921^^W^^^626^9143921
        ROL|2|UP|GENERAL|1306836770^KADHIUM^SABAH^^^^^^NPI^^^^NPI~600729^KADHIUM^SABAH^^^^^^PROVID^^^^PROVID|20180628||||GENERAL|EXTERNAL|1334 W. COVINA BLVD.^STE 204^SAN DIMAS^CA^91773-3211^US|(909)599-6300^^W^^^909^5996300~(909)305-2500^^FAX^^^909^3052500
        CON|1|NPP Acknowle|||||||||SIGNED||20180720141300
        CON|2|General T OP|||||||||SIGNED||20180720141300||20190719235959
        CON|3|Identificati|CDL- EXP 02/17/2021|ONB15602153|||||||Scanned||20180720141300
        CON|4|QUESTIONNAIR|||||||||SIGNED||20180720141300
        CON|5|Insur Card||ONB15602171|||||||Scanned||20180720141300
        CON|6|Outside Prog|OUTSIDE PROGRESS NOTES|ONB15568438|||||||Received||20180718134715
        CON|7|Outside Prog|OUTSIDE PROGRESS NOTES|ONB15568442|||||||Received||20180718134715
        CON|8|Outside Prog|OUTSIDE PROGRESS NOTES|ONB15568444|||||||Received||20180718134715
        CON|9|Outside Labo|OUTSIDE LABORATORY|ONB15568458|||||||Received||20180718134716
        CON|10|Outside Prog|OUTSIDE PROGRESS NOTES|ONB15568531|||||||Received||20180718134721
        CON|11|NPP Acknowle|NPP ACKNOWLEDGEMENT FORM|ONB15609004|||||||Received||20180720185413
        CON|12|General T OP|GENERAL CONSENT FOR TREATMENT OP|ONB15609603|||||||Received||20180720192103||20190719235959
        CON|13|HIM ROI AUTH|USE \T\ DISCLOSE PHI AUTH|ONB15614657|||||||Received||20180723014018
        CON|14|General T OP|GENERAL CONSENT FOR TREATMENT OP|ONB15614673|||||||Received||20180723014022||20190722235959
        CON|15|Miscellaneou|MISCELLANEOUS|ONB16657259|||||||Received||20181010125705
        CON|16|Miscellaneou|MISCELLANEOUS|ONB16682338|||||||Received||20181011122215
        CON|17|Miscellaneou|MISC ADMIN|ONB16765782|||||||Received||20181016213133
        CON|18|Outside Op P|OUTSIDE OP PROCEDURE RPT|ONB16805766|||||||Received||20181018143823
        CON|19|HIM ROI AUTH|ROI REQUEST|ONB19043834|||||||Received||20190320092923
        CON|20|Insur Card||ONB20630668|||||||Scanned||20190708104014
        CON|21|Outside Labo|OUTSIDE LABORATORY|ONB20862944|||||||Received||20190722215718
        CON|22|Outside Labo|OUTSIDE LABORATORY|ONB20863178|||||||Received||20190722215738
        CON|23|Outside Radl|OUTSIDE RADIOLOGY|ONB22899353|||||||Received||20191003170542
        NK1|1|DYESS^VANCE^^|Daughter|7367 BUCHANAN ST^^FORT WINGATE^NM^91750^USA^^|(408)-663-8863^^H^^^310^7099249||Emergency Contact 1
        PV1|1|OUTPATIENT|BRMNUROSUR^^^DC^^^^^UROLOGY^^DEPID||||1194937920^POQUETTE^RITA^MARIE^^^^^NPI^^^^NPI~85555^POQUETTE^RITA^MARIE^^^^^PROVID^^^^PROVID||||||||||||307091344|MEDICARE MC||||||||||||||||||||||||
        PV2||||||||20191118||||Orders Only||||||||||N
        OBX|1|TX|APPT STAFF^APPT STAFF|1|85555^POQUETTE, RITA MARIE^PROVID|||||||||20191118
        AL1|1|DRUG INGREDI|^CODEINE^||Nausea|20180720
        AL1|2|Drug Class|^SULFA ANTIBIOTICS^|Low|Rash|20190523
        GT1|1|445660|GABBETT^GRADY^AUGUST^||9661 MONITOR ROAD^^WEST HILLS^WA^91750^USA^^^LOS ANGELES|(408)-644-7540^^^^^909^2609824||19591231|M|P/F|SLF|193-27-9031|||||^^^^^US|||Retired
        IN1|1|30831212885^*EASY CHOICE MCR HCP IPA|308212128|*EASY CHOICE MANAGED CARE|PO BOX 260519^^PLANO^TX^75026-0519^|||422-63-4775|HCP NON CAP|||20190401|||HMO|HARTY^LEWIS^STEFAN^|Self|19591231|509 FRANKLIN RD 89^^ANCHORAGE^AK^91750^USA^^^LOS ANGELES|||1|||||||||||||218471|22656055||||||Retired|M|^^^^^US|||BOTH
        IN2||692-83-6839|||Payor Plan||||||||||||||||||||||||||||||||||||||||||||||||||||||||22656055||(408)-543-1432^^^^^909^2609824
        IN1|2|308002279135^*SECURE HORIZONS MCR HCP IPA|308002279|*UNITED HEALTHCARE MANAGED CARE NETWORK|PO BOX 30970^^SALT LAKE CITY^UT^84130-0970^||(408)-794-5664^^^^^866^3169776|378-19-6902||||20170101|20190331||HMO|LECRONE^VINCENT^GASTON^|Self|19591231|9017 ADAMS STREET^^N LAS VEGAS^NV^91750^USA^^^LOS ANGELES|||2|||YES|20190509111553|||||||||218304|5625570|||||||M||||BOTH
        IN2||692-83-6839|||Payor Plan||||||||||||||||||||||||||||||||||||||||||||||||||||||||5625570||(408)-543-1432^^^^^909^2609824`
        return (
            <div>
                <div>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Message'}</a></div>
                    <div className="border-view" style={{ height:  "300px", overflow: "auto" }} id={'hello' + flag}>{flag ? message : message}</div>
                </div>
            </div>
        )
    }

    renderDetails1(flag) {

        let message = `MSH|^~\&|ADT1|MCM|LABADT|MCM|198808181126|SECURITY|ADT^A04|MSG00001|P|2.4
        EVN|A01-|198808181123
        PID|||7155312^5^M11||Stanon^John^A^III||19990504|M-||2106-3|1200 N ELM STREET^^^FL^27401-1020|US||||S||7155312^2^M10|123456789|9-87654^FL
        PV1|1|I|2000^2012^01||||004777^LEBAUER^^J.|||SUR||-||1|A0-
        IN1|001|A357|1234|BCMD|||||132987
        IN2|ID1551001|SSN12345678`
        return (
            <div>
                <div>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Message'}</a></div>
                    <div className="border-view" style={{ height:  "160px", overflow: "auto" }} id={'hello' + flag}>{flag ? message : message}</div>
                </div>
            </div>
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
                    <div className="col-12" style={{ padding: '6px' }}>
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
                    <div className="summary-header">Total Inbound Transaction</div>
                    <div className='green summary-title' >
                        1.1M
                </div>
                </div>

                <div className="col-2 summary-container">
                    <div className="summary-header">Total Inbound Errors</div>
                    <div className='red summary-title' >
                        7
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
                            <option value="1">A01</option>
                            <option value="2">A02</option>
                            <option value="3">A03</option>
                            <option value="4">A04</option>
                            <option value="5">A05</option>
                            <option value="6">A06</option>
                            <option value="7">A07</option>
                            <option value="8">A08</option>
                            
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
                    data: [10200,23000, 12000, 15000, 17000, 14000, 12000, 18000,14500, 13700,14550, 15430]
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
                                height={100}
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

        let columnDefs = [
            { headerName: "Message ID", field: "MessageID", width: 120, cellStyle: { color:'#139DC9', cursor:'pointer' } },
            { headerName: "Date", field: "Date", width: 140,  },
            { headerName: "Topic", field: "Topic", flex:1, },
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
                        rowData={this.state.summaryList}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {

                            if(event.data.Type == 'A04' && event.data.MessageID == '12350'){
                                this.setState({
                                    showA04: true,
                                    showDetails: false
                                })   
                            }
                            else {
                                this.setState({
                                    showDetails: true,
                                    showA04: false,
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
            {
                API_ID: 12345,
                Date: '06/16/2020 06:00:00',
                API_URL: 'A08',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12346,
                Date: '06/16/2020 06:00:00',
                API_URL: 'A01',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12347,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A04',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12348,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A05',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12349,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A03',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12341,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A02',
                Requester: 'EPIC',
                Destination:'COH'
            },


            {
                API_ID: 12342,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A06',
                Requester: 'EPIC',
                Destination:'COH'

            },


            {
                API_ID: 12343,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A03',
                Requester: 'EPIC',
                Destination:'COH'

            },

            {
                API_ID: 12344,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A07',
                Requester: 'EPIC',
                Destination:'COH'
            }

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
            let flag=''
            let color = "var(--red)"

            if (item.name == 'ADT_HL7') {
                generalStatus = 'HL7'
                subtitle = 'ADT_HL7'
                color = "var(--blue)"
                flag = 1
            } else if (item.name == 'ADT_JSON') {
                generalStatus = 'JSON'
                subtitle = "ADT_JSON"
                color = "var(--green)"
                flag = 1
            } else if (item.name == 'ADT_JSON_ENRICHED') {
                generalStatus = 'ENRICHED'
                subtitle = 'ADT_JSON_ENRICHED'
                color = "var(--blue)"
                flag = 1
            } else if (item.name == 'VITALS_HL7') {
                generalStatus = 'HL7'
                subtitle = 'VITALS_HL7'
                color = "var(--blue)"
                flag = 2
            } else if (item.name == 'VITALS_JSON') {
                generalStatus = 'JSON'
                subtitle = "VITALS_JSON"
                color = "var(--green)"
                flag = 2
            }else if (item.name == 'LABORDERS_HL7') {
                generalStatus = 'HL7'
                subtitle = 'VITALS_LABORDERS_HL7HL7'
                color = "var(--blue)"
                flag = 3
            } else if (item.name == 'LABORDERS_JSON') {
                generalStatus = 'JSON'
                subtitle = "LABORDERS_JSON"
                color = "var(--green)"
                flag = 3
            }else if (item.name == 'MEDICATIONS_HL7') {
                generalStatus = 'HL7'
                subtitle = 'MEDICATIONS_HL7'
                color = "var(--blue)"
                flag = 4
            } else if (item.name == 'MEDICATIONS_JSON') {
                generalStatus = 'JSON'
                subtitle = "MEDICATIONS_JSON"
                color = "var(--green)"
                flag = 4
            }else if (item.name == 'MEDICATIONS_JSON_UNENRICHED') {
                generalStatus = 'ENRICHED'
                subtitle = 'MEDICATIONS_JSON_UNENRICHED'
                color = "var(--blue)"
                flag = 4
            }

            let sendData = [
              {  
                  generalStatus:generalStatus,
                  flag: flag
              }
            ]
           
            row.push(
                <TableTiles
                    item={item}
                    data={sendData}
                    diffClick={true}
                    Click= {this.Click}
                    unclick={color}
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
            { 'name': 'ADT_HL7', 'value': 22, 'isClick': 1 },
            { 'name': 'ADT_JSON', 'value': 23,'isClick': 1 },
            { 'name': 'ADT_JSON_ENRICHED', 'value': 22, 'isClick': 1 },
        ]
        let stage_2 = [
            { 'name': 'VITALS_HL7', 'value': 11, 'isClick': 1 },
            { 'name': 'VITALS_JSON', 'value': 12, 'isClick': 1 },
        ]
        let stage_3 = [
            { 'name': 'LABORDERS_HL7', 'value': 12, 'isClick': 1 },
            { 'name': 'LABORDERS_JSON', 'value': 12, 'isClick': 1 },
        ]

        let stage_4 = [
            { 'name': 'MEDICATIONS_HL7', 'value': 32, 'isClick': 1, },
            { 'name': 'MEDICATIONS_JSON', 'value': 22, 'isClick': 1,  },
            { 'name': 'MEDICATIONS_JSON_UNENRICHED', 'value': 11, 'isClick': 1 },
        ]

        return (
            <div className="row" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
                {this._renderClaimTables(stage_4)}
            </div>
        )
    }

    Click=(data)=>{
        let query 
        let flag = data[0].flag
        let topic = data[0].generalStatus
        if(flag == 1){
            query = `{
                ADTJSONDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        else if(flag == 2){
            query = `{
                VitalsDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        else if(flag == 3){
            query = `{
                LaborderDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        else if(flag == 4){
            query = `{
                MedicationDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        
    console.log(query)
    fetch(Urls.sql_base_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })
        .then(res => res.json())
        .then(res => {
            let data = ''
            if(flag == 1){
                data = res.data.ADTJSONDetails
            }else if(flag == 2){
                data = res.data.VitalsDetails
            }else if(flag == 3){
                data = res.data.LaborderDetails
            }else if(flag == 4){
                data = res.data.MedicationDetails
            }
             
    
            this.setState({
                summaryList: data,
                sepsisTable: true
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div className="container">
                <h5 className="headerText">HiPaaS Dashboard</h5>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                <div className="general-header">Topics</div>
                {this.renderClaimDetails()}
                {this._renderAllCharts()}
                <div className="row">
                    <div className="col-6">
                        {/* <h6> Inbound Table</h6> */}
                        {this.state.sepsisTable ? this._renderInboundTable() : null}
                    </div>
                    {this.state.showDetails ?
                        <div className="col-6" style={{marginTop: '10px'}}>
                            {this.renderDetails()}
                        </div> : null}
                        {this.state.showA04 ?
                        <div className="col-6" style={{marginTop: '10px'}}>
                            {this.renderDetails1()}
                        </div> : null}
                </div>
                <br></br><br></br>
            </div>
        );
    }
}