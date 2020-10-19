import React from 'react'
import '../../containers/Claims/Dashboard/styles.css'
import '../../containers/Claim_276_RealTime/Real_Time_276/style.css'
import '../../containers/color.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
import { TableTiles } from '../TableTiles';
import { Tiles } from '../Tiles';

export class Common_270 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [
                { name: 'TOTAL TRANSACTION', value: 0 },
                { name: 'INVALID TRANSACTIONS', value: 0 },
                { name: 'ERROR PERCENTAGE', value: 0 },
                { name: 'AVG RESPONSE TIME (sec)', value: 0 },
            ],
            showDetails: false,
            files_list: [],
            tradingpartner: [],
            summaryCount: [],
            pieArray: [],
            pieLabels: [],
            tradingChartLabel: [],
            tradingChartData: [],
            providerChartLabel: ['Provider Name 1', 'Provider Name 2', 'Provider Name 3', 'Provider Name 4', 'Provider Name 5'],
            providerChartData: [4, 5, 1, 2, 3],
            dateChartLabel: [],
            dateChartData: [],
            errorPieArray: [],
            errorLabelArray: [],
            errorArray: [],
            inComplaince: '',
            outComplaince: '',
            thisMonth: '',
            lastMonth: '',
            State: '',
            realTimePercent: '',
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            transactionId: '',
            selected_val: '',
            averageResponseTime: '',
            selectedTradingPartner: '',
            progress_valid: 0,
            progress_invalid: 0,
            progress_noResponse: 0,
            incoming_fileId: '',
            noResponsePercent: '',
            second_data: [],
            chartType: 'Monthwise',
            colorArray: [
                'var(--main-bg-color)',
                'var(--cyan-color)'
            ],
            errorColorArray: [
                'var(--main-bg-color)',
                'var(--cyan-color)',
                'var(--hex-color)',
                'var(--pacific-blue-color)',
            ],
            apiflag: Number(this.props.apiflag == 1 ? this.props.apiflag : 0),
        }

        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.State != nextProps.State ||
            this.props.selectedTradingPartner != nextProps.selectedTradingPartner ||
            this.props.startDate != nextProps.startDate ||
            this.props.endDate != nextProps.endDate ||
            this.props.type != nextProps.type ||
            this.props.apiflag != nextProps.apiflag
        ) {
            this.setState({
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                selectedTradingPartner: nextProps.selectedTradingPartner,
                type: nextProps.type,
                State: nextProps.State,
                apiflag: nextProps.apiflag,
            }, () => {
                this._refreshScreen()
            })
            return true
        } else {
            return false
        }
    }


    componentDidMount() {
        this._refreshScreen()
    }


    _refreshScreen = () => {
        this.getData()
        this.gettableTilesData()
    }

    getData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let url = Urls.transaction270
        let query = `{   ProgressBar276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                Valid_Per
                InValid_Per
                NoResponse_Per
                TotalNumOfReq
                Success
                Error
                Total_NoResponse
            }
            AverageResponseTime276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                AvgResTime
            }
        }`

        if (this.state.apiflag == 1) {
            query = `{   ProgressBar270(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                    Valid_Per
                    InValid_Per
                    NoResponse_Per
                    TotalNumOfReq
                    Success
                    Error
                    Total_NoResponse
                }
                AverageResponseTime270(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                    AvgResTime
                }
                  
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = ""
                let progress_data = ""
                let  AvgResTime = 0

                if (this.state.apiflag == 1) {
                    data = res.data.AverageResponseTime270
                    progress_data = res.data.ProgressBar270 && res.data.ProgressBar270.length > 0 ? res.data.ProgressBar270 : []
                    AvgResTime = 2.13
                } else {
                    data = res.data.AverageResponseTime276
                    progress_data = res.data.ProgressBar276
                    AvgResTime = 0
                }

                let progress_condition = progress_data && progress_data.length > 0
                let Valid_Per = progress_condition ? Number(progress_data[0].Valid_Per).toFixed(2) : 0
                let InValid_Per = progress_condition ? Number(progress_data[0].InValid_Per).toFixed(2) : 0
                let NoResponse_Per = progress_condition ? Number(progress_data[0].NoResponse_Per).toFixed(2) : 0

                let summary = [
                    { name: 'Total Transaction', value: progress_data && progress_data.length > 0 ? progress_data[0].TotalNumOfReq : 0 },
                    { name: 'Valid Transaction', value: progress_data && progress_data.length > 0 ? progress_data[0].Success : 0 },
                    { name: 'Invalid Transaction', value: progress_data && progress_data.length > 0 ? progress_data[0].Error : 0 },
                    { name: 'No Response', value: progress_data && progress_data.length > 0 ? progress_data[0].Total_NoResponse : 0 },
                    { name: 'Avg Response Time (sec)', value: data && data.length > 0 ? AvgResTime : 0 },
                ]


                this.setState({
                    summaryCount: summary,
                    progress_valid: Valid_Per,
                    progress_invalid: InValid_Per,
                    progress_noResponse: NoResponse_Per,
                    noResponsePercent: NoResponse_Per,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    gettableTilesData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let url = Urls.transaction270
        let query = `{
            DashboardComplianceRatio276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                In_Compliance_Per
                out_of_Compliance_per
            }
            DashboardMonthCount276(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                ThisMonth_Volume
                LastMonth_Volume
              }
        }`

        if (this.state.apiflag == 1) {
            query = `{
                DashboardComplianceRatio270(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                    In_Compliance_Per
                    out_of_Compliance_per
                }
                DashboardMonthCount270(State:"${this.state.State}",Sender:"${this.state.selectedTradingPartner}",StartDt:"${startDate}",EndDt:"${endDate}") {
                    ThisMonth_Volume
                    LastMonth_Volume
                  }
                  
            }`
        }

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let complianceRatioData = []
                let DashboardMonthCount = []
                let In_Compliance_Per = 0
                let out_of_Compliance_per = 0
                let lastMonth = 0
                let thisMonth = 0

                if (this.state.apiflag == 1) {
                    complianceRatioData = res.data.DashboardComplianceRatio270
                    DashboardMonthCount = res.data.DashboardMonthCount270
                } else {
                    complianceRatioData = res.data.DashboardComplianceRatio276
                    DashboardMonthCount = res.data.DashboardMonthCount276
                }

                if (complianceRatioData && complianceRatioData.length > 0) {
                    In_Compliance_Per = complianceRatioData[0].In_Compliance_Per
                    out_of_Compliance_per = complianceRatioData[0].out_of_Compliance_per
                }
                if (DashboardMonthCount && DashboardMonthCount.length > 0) {
                    thisMonth = DashboardMonthCount[0].ThisMonth_Volume
                    lastMonth = DashboardMonthCount[0].LastMonth_Volume
                }

                this.setState({
                    inComplaince: In_Compliance_Per,
                    outComplaince: out_of_Compliance_per,
                    thisMonth: thisMonth,
                    lastMonth: lastMonth,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });

    }

    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryCount
        let _apiflag = this.state.apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''
        let mainUrl = _apiflag == 1 ? Strings.ElilgibilityDetails270 : Strings.ElilgibilityDetails276

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let subtitle = ''
            let availitySent = ''
            let EFTCHK = ''
            let apiflag = ''
            let data = []
            if (item.name == 'Total Transaction') {
                apiflag = this.state.apiflag
            } else if (item.name == 'Valid Transaction') {
                claimStatus = 'Pass'
                subtitle = "Valid Transaction"
                apiflag = this.state.apiflag
            } else if (item.name == 'Invalid Transaction') {
                claimStatus = 'Fail'
                subtitle = "Invalid Transaction"
                apiflag = this.state.apiflag
            } else if (item.name == 'No Response') {
                claimStatus = 'No'
                subtitle = "No Response"
                apiflag = this.state.apiflag
            } else {
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
                    transactionStatus: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                    EFTCHK: EFTCHK,
                    apiflag: apiflag
                },
            ]

            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Avg Response Time (sec)'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    url={mainUrl}
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

        let _apiflag = this.state.apiflag
        let url = _apiflag == 1 ? Strings.ElilgibilityDetails270 : Strings.ElilgibilityDetails276

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let subtitle = ''
            let availitySent = ''
            let color = "var(--grayBlack)"
            let Status = ''
            let complianceStatus = ''
            let EFTCHK = ''
            if (item.name == 'In Compliance') {
                complianceStatus = 'Compliance'
                subtitle = "In Compliance"
                _apiflag = this.state.apiflag
                color = "var(--main-bg-color)"
            } else if (item.name == 'Out of Compliance') {
                complianceStatus = 'OutCompliance'
                subtitle = "Out of Compliance"
                _apiflag = this.state.apiflag
                color = "var(--orange)"
            } else if (item.name == 'No Response') {
                claimStatus = 'No'
                subtitle = "No Response"
                _apiflag = this.state.apiflag
                color = "var(--red)"
            } else if (item.name == 'This Month') {
                // availitySent = 'Y'
                // subtitle = "Sent to Availity"
                // color = "var(--main-bg-color)"
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
                    transactionStatus: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                    apiflag: _apiflag,
                    EFTCHK: EFTCHK,
                    complianceStatus: complianceStatus
                },
            ]

            row.push(
                <TableTiles
                    item={item}
                    url={url}
                    data={sendData}
                    color={color}
                />
            )
        })
        return (
            <div className="col-3 chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }


    _renderTableTiles = () => {

        let stage_1 = [
            { 'header': 'Real - Time Volume' },
            { 'name': 'Last Month', 'value': this.state.lastMonth },
            { 'name': 'This Month', 'value': this.state.thisMonth },
        ]
        let stage_2 = [
            { 'header': 'Compliance Ratio' },
            { 'name': 'In Compliance', 'value': this.state.inComplaince + ' %', isClick: true },
            { 'name': 'Out of Compliance', 'value': this.state.outComplaince + ' %', isClick: true },
            { 'name': 'No Response', 'value': this.state.noResponsePercent + ' %', isClick: true },

        ]


        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this._renderSummaryDetails()}
                {this._renderTableTiles()}
            </div>
        );
    }
}