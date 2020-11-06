import React from 'react';
import '../../containers/RealTime_837_Claim/RealTimeDashboard/styles.css';
import '../../containers/color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Strings from '../../../helpers/Strings';
import Urls from '../../../helpers/Urls';
import { Tiles } from '../Tiles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { TableTiles } from '../TableTiles';
let isOutbound;
export class Common_Split_835 extends React.Component {

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
            availitySent: 0,
            progress_exception: 0,
            TotalException: 0,
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            pielabels: [],
            pievalues: [],
            startDate: (this.props.removeFiles || this.props.removeClaims) ? '' : moment().subtract(180, 'd').format('YYYY-MM-DD'),
            endDate: (this.props.removeFiles || this.props.removeClaims) ? '' : moment().format('YYYY-MM-DD'),
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
            Filter_ClaimId: '',
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
            Rejected_CLP:0
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.State != nextProps.State ||
            this.props.selectedTradingPartner != nextProps.selectedTradingPartner ||
            this.props.startDate != nextProps.startDate ||
            this.props.endDate != nextProps.endDate ||
            this.props.type != nextProps.type
        ) {
            this.setState({
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                selectedTradingPartner: nextProps.selectedTradingPartner,
                type: nextProps.type,
                State: nextProps.State,
            }, () => {
                this._refreshScreen()
            })
            return true
        } else {
            return false
        }
    }

    componentDidMount() {
        isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
        this._refreshScreen()
    }

    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = ''
        if (isOutbound) {
            query = `{
            
        ERA835DashboardCountNew(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
          TotalCount
          Rejected
          Accepted
          AvailitySent
          Exception
          EFT
          CHK
        }
        Total999Response835(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
            Total999
        }
}`
        } else {
            query = `{
            
        ERA835DashboardCountNew(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
          TotalCount
          Rejected
          Accepted
          AvailitySent
          Exception
          EFT
          CHK
        }
}`
        }

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(isOutbound ? Urls.transaction835 : Urls._transaction835, {
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
                let summary = []
                let data = res.data.ERA835DashboardCountNew[0]
                isOutbound ?
                summary = [
                    { name: 'Received From QNXT', value: data ? data.TotalCount : 0 },
                    { name: 'Vaildated', value: data ? data.Accepted : 0 },
                    { name: 'Files in Error', value: data ? data.Rejected : 0 },
                    { name: 'EFT', value: data ? data.EFT : 0 },
                    { name: 'Check', value: data ? data.CHK : 0 },
                    { name: 'Total Sent To Availity', value: data ? data.AvailitySent : 0 },
                    { name: '999 Received', value: res.data.Total999Response835[0].Total999 },
                ] :
                summary = [
                    { name: 'Total Files', value: data ? data.TotalCount : 0 },
                    { name: 'Vaildated', value: data ? data.Accepted : 0 },
                    { name: 'Files in Error', value: data ? data.Rejected : 0 },

                    // { name: 'Accepted', value: data ? data.Accepted : 0 },
                    // { name: 'Rejected', value: data ? data.Rejected : 0 },
                    // { name: 'EFT', value: data ? data.EFT : 0 },
                    // { name: 'Check', value: data ? data.CHK : 0 },
                    { name: 'Total Sent To KPHC', value: data ? data.AvailitySent : 0 },
                    { name: '999', value: res.data.Total999Response835 && res.data.Total999Response835.length > 0 ? res.data.Total999Response835[0].Total999 : 0 },
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

    _renderSummaryDetails_inbound = () => {
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
            } else if (item.name == 'Total Sent To KPHC') {
                availitySent = 'Y'
                subtitle = "Sent To KPHC"
            }
            else if (item.name == 'Total Files') {
                subtitle = "Total Files"
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

            if (item.name == '999 Generated') {
                data = [{
                    flag999: '0',
                    type: type,
                    State: State,
                    startDate: startDate,
                    endDate: endDate,
                }]
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

    renderClaimDetails_inbound = () => {

        let stage_1 = [
            { 'header': 'HiPaaS Load Status' },
            { 'name': 'X12 CLP Count', 'value': this.state.QNXT_Generated },
            { 'name': 'HiPaaS CLP Count', 'value': this.state.Hipaas_Received },
            // { 'name': 'EFT', 'value': this.state.EFTData, 'isClick': true },
            // { 'name': 'CHK', 'value': this.state.CheckData, 'isClick': true },

        ]
        let stage_2 = [
            { 'header': 'HiPaaS Validation Status' },
            // { 'name': 'Vaildated CLP', 'value': this.state.Accepted_CLP, 'isClick': true },
            { 'name': 'Total Error ', 'value': this.state.Rejected_CLP, 'isClick': true },
        ]
        let stage_3 = [
            { 'header': 'HiPaaS Accepted Status' },
            { 'name': 'Total Number of Errors', 'value': this.state.TotalError, 'isClick': true },
        ]
    
        let stage_4 = [
            { 'header': 'KPHC Status' },
            { 'name': 'Sent to KPHC', 'value': this.state.AvailitySent, 'isClick': true },
            // { 'name': 'Availity Accepted', 'value': this.state.Accepted999 },
            // { 'name': 'Availity Rejected', 'value': this.state.Rejected999 },
        ]


        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {/* {this._renderClaimTables(stage_3)} */}
                {this._renderClaimTables(stage_4)}
            </div>
        )
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
        ]
        let stage_3 = [
            { 'header': 'Availity Status' },
            { 'name': 'Sent to Availity', 'value': this.state.AvailitySent, 'isClick': true },
            { 'name': 'Availity Accepted', 'value': this.state.Accepted999 },
            { 'name': 'Availity Rejected', 'value': this.state.Rejected999 },
        ]


        return (
            <div className="row" style={{ marginBottom: '12px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
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
                data = [{
                    flag999: '0',
                    type: type,
                    State: State,
                    startDate: startDate,
                    endDate: endDate,
                }]
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
        let recType = isOutbound ? 'Outbound' : 'Inbound'

        let query = `{
              ERA835DashboardCountPaymentStatus(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
                X12Count
                HiPaaSCount
                MCGLoadCount
              }

                ERA835DashboardTable(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
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
        fetch(isOutbound ? Urls.transaction835 : Urls._transaction835, {
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
                if (res.data) {
                    let _data = res.data.ERA835DashboardCountPaymentStatus[0]
                    let data2 = res.data.ERA835DashboardTable[0]

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



    _refreshScreen = () => {
        if (!this.props.removeClaims) {
            {isOutbound ? this._getClaimCounts() :this._getClaimCounts_new_version()}
        }
        if (!this.props.removeFiles) {
            this._getCounts()
        }
    }

    _getClaimCounts_new_version = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let query = `{
              ERA835DashboardCountPaymentStatus(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
                X12Count
                HiPaaSCount
                MCGLoadCount
              }
                ERA835DashboardTable(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
                    Accepted
                    Rejected
                    FileReject
                    AvailitySent
                    TotalError
                    TotalException
              }
              ERA835DashboardTableCHK(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
                Check
          }
          ERA835DashboardTableEFT(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Split") {
            EFT
      }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(isOutbound ? Urls.transaction835 : Urls._transaction835, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                    'user-id' : sessionStorage.getItem('user-id'),
'Cache-Control': 'no-cache, no-store',
'Expires': 0,
'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    let _data = res.data.ERA835DashboardCountPaymentStatus[0]
                    let data2 = res.data.ERA835DashboardTable
                    let data3 = res.data.ERA835DashboardTableCHK[0]
                    let data4 = res.data.ERA835DashboardTableEFT[0]
                    console.log("test ", data2)
                    this.setState({
                        CheckData: data3 ? data3.Check : 0,
                        EFTData: data4 ? data4.EFT : 0,
                        QNXT_Generated: _data ? _data.X12Count : 0,
                        Hipaas_Received: _data ? _data.HiPaaSCount : 0,
                        AvailitySent: data2 && data2.length>0 ? data2[0].AvailitySent==null ? 0 : data2[0].AvailitySent : 0,
                        TotalError: data2 && data2.length>0 ? data2[0].TotalError==null ? 0 : data2[0].TotalError : 0,
                        TotalException: data2 && data2.length>0 ? data2[0].TotalException==null ? 0 : data2[0].TotalException : 0,
                        Accepted_CLP: data2 && data2.length>0 ? data2[0].Accepted==null ? 0 : data2[0].Accepted : 0,
                        Rejected_CLP: data2 && data2.length>0 ? data2[0].Rejected==null ? 0 : data2[0].Rejected : 0,
                     
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    render() {
        return (
            <React.Fragment>
                {!this.props.removeFiles && this.props.fileHeader ? <div className="general-header" style={{ marginBottom: "10px", marginTop: '12px' }}>{isOutbound ? "Remittance File Level" : "File Level" } </div> : null}
                {/* {!this.props.removeFiles ? this._renderSummaryDetails() : null} */}
                {!this.props.removeClaims ? isOutbound ? this._renderSummaryDetails() :this._renderSummaryDetails_inbound() : null}
                {!this.props.removeClaims && this.props.claimHeader ? <div className="general-header">Payment Level</div> : null}
                {/* {!this.props.removeClaims ? this.renderClaimDetails() : null} */}
                {!this.props.removeClaims ? isOutbound ? this.renderClaimDetails() :this.renderClaimDetails_inbound() : null}
            </React.Fragment>
        );
    }
}
